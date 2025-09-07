import { prisma } from '../../prisma';
import {
  PaymentProvider,
  PaymentRequest,
  PaymentResult,
  RefundRequest,
  RefundResult,
  ValidationResult,
  PaymentMethodDetails,
  PaymentStatus,
  PaymentServiceConfig,
  PaymentProcessingOptions,
  PaymentError,
  TransactionLog,
  PaymentNotification
} from './types';
import { PaymentType, PaymentStatus as PrismaPaymentStatus } from './types';
import { MBWayProvider } from './providers/mbway';
import { MultibancoProvider } from './providers/multibanco';
import { CreditCardProvider } from './providers/creditcard';
import { NotificationService } from '../notification/service';

/**
 * Unified Payment Service
 * Orchestrates payment processing across multiple providers
 */
export class PaymentService {
  private providers: Map<PaymentType, PaymentProvider> = new Map();
  private config: PaymentServiceConfig;
  private transactionLogs: TransactionLog[] = [];
  private notificationService: NotificationService;

  constructor(config: PaymentServiceConfig, notificationService?: NotificationService) {
    this.config = config;
    this.notificationService = notificationService || new NotificationService(config.defaultTenantId);
    this.initializeProviders();
  }

  /**
   * Initialize payment providers
   */
  private initializeProviders(): void {
    // MB WAY Provider
    const mbwayConfig = {
      apiKey: process.env.MB_WAY_API_KEY,
      baseUrl: process.env.MB_WAY_BASE_URL || 'https://api.mbway.pt',
      environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
      timeout: 30000,
      retryAttempts: 3,
    };
    this.providers.set(PaymentType.MB_WAY, new MBWayProvider(mbwayConfig));

    // Multibanco Provider
    const multibancoConfig = {
      apiKey: process.env.MULTIBANCO_API_KEY,
      baseUrl: process.env.MULTIBANCO_BASE_URL || 'https://api.multibanco.pt',
      environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
      timeout: 45000, // Multibanco can be slower
      retryAttempts: 2,
    };
    this.providers.set(PaymentType.MULTIBANCO, new MultibancoProvider(multibancoConfig));

    // Credit Card Provider (Stripe simulation)
    const creditCardConfig = {
      apiKey: process.env.STRIPE_SECRET_KEY,
      baseUrl: process.env.STRIPE_BASE_URL || 'https://api.stripe.com',
      environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
      timeout: 30000,
      retryAttempts: 3,
    };
    this.providers.set(PaymentType.CREDIT_CARD, new CreditCardProvider(creditCardConfig));
    this.providers.set(PaymentType.DEBIT_CARD, new CreditCardProvider(creditCardConfig));
  }

  /**
   * Process a payment using the appropriate provider
   */
  async processPayment(
    request: PaymentRequest,
    options: PaymentProcessingOptions = {}
  ): Promise<PaymentResult> {
    const { retryOnFailure = true, maxRetries = this.config.maxRetryAttempts } = options;

    try {
      // Get the appropriate provider
      const provider = this.getProviderForPaymentType(request.paymentMethod.type);
      if (!provider) {
        throw new PaymentError(
          `No provider available for payment type: ${request.paymentMethod.type}`,
          'PROVIDER_NOT_FOUND'
        );
      }

      // Process the payment with retry logic
      const result = await this.processPaymentWithRetry(provider, request, maxRetries, retryOnFailure);

      // Store payment record in database
      await this.storePaymentRecord(request, result);

      // Log the transaction
      this.logTransaction({
        transactionId: result.transactionId || `txn_${Date.now()}`,
        provider: provider.name,
        action: 'COMPLETE',
        status: this.mapToPrismaStatus(result.status),
        amount: result.amount,
        currency: result.currency,
      });

      // Send notification
      await this.sendPaymentNotification(request, result);

      return result;
    } catch (error) {
      console.error('[PaymentService] Payment processing failed:', error);

      // Store failed payment record
      await this.storeFailedPaymentRecord(request, error as Error);

      throw error;
    }
  }

  /**
   * Process a refund
   */
  async processRefund(
    request: RefundRequest,
    options: PaymentProcessingOptions = {}
  ): Promise<RefundResult> {
    const { maxRetries = this.config.maxRetryAttempts } = options;

    try {
      // Find the original payment
      const originalPayment = await prisma.payment.findUnique({
        where: { transactionId: request.transactionId },
        include: { paymentMethod: true },
      });

      if (!originalPayment) {
        throw new PaymentError('Original payment not found', 'PAYMENT_NOT_FOUND');
      }

      // Get the appropriate provider
      const provider = this.getProviderForPaymentType(originalPayment.paymentMethod.type as PaymentType);
      if (!provider) {
        throw new PaymentError('Refund provider not available', 'PROVIDER_NOT_FOUND');
      }

      // Process the refund with retry logic
      const result = await this.processRefundWithRetry(provider, request, maxRetries);

      // Update payment status in database
      await prisma.payment.update({
        where: { transactionId: request.transactionId },
        data: { status: PrismaPaymentStatus.REFUNDED },
      });

      // Log the refund
      this.logTransaction({
        transactionId: request.transactionId,
        provider: provider.name,
        action: 'REFUND',
        status: PrismaPaymentStatus.REFUNDED,
        amount: request.amount,
        currency: 'EUR', // Assuming EUR
      });

      return result;
    } catch (error) {
      console.error('[PaymentService] Refund processing failed:', error);
      throw error;
    }
  }

  /**
   * Validate payment method
   */
  async validatePaymentMethod(details: PaymentMethodDetails): Promise<ValidationResult> {
    const provider = this.getProviderForPaymentType(details.type);
    if (!provider) {
      return {
        isValid: false,
        errors: [`No provider available for payment type: ${details.type}`],
      };
    }

    return await provider.validatePaymentMethod(details);
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: { paymentMethod: true },
    });

    if (!payment) {
      throw new PaymentError('Payment not found', 'PAYMENT_NOT_FOUND');
    }

    const provider = this.getProviderForPaymentType(payment.paymentMethod.type as PaymentType);
    if (!provider) {
      return payment.status as PaymentStatus;
    }

    return await provider.getPaymentStatus(transactionId);
  }

  /**
   * Get available payment methods for a tenant
   */
  async getAvailablePaymentMethods(tenantId: string): Promise<PaymentType[]> {
    // In a real implementation, this could be filtered by tenant configuration
    // For MVP, return all supported types
    return [
      PaymentType.CREDIT_CARD,
      PaymentType.DEBIT_CARD,
      PaymentType.MB_WAY,
      PaymentType.MULTIBANCO,
    ];
  }

  /**
   * Get transaction logs
   */
  getTransactionLogs(transactionId: string): TransactionLog[] {
    return this.transactionLogs.filter(log => log.transactionId === transactionId);
  }

  /**
   * Get payment metrics
   */
  async getPaymentMetrics(tenantId: string, dateRange?: { start: Date; end: Date }) {
    const whereClause: any = { tenantId };
    if (dateRange) {
      whereClause.createdAt = {
        gte: dateRange.start,
        lte: dateRange.end,
      };
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      select: {
        status: true,
        amount: true,
        paymentMethod: {
          select: { type: true },
        },
      },
    });

    const metrics = {
      totalProcessed: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      successRate: 0,
      averageProcessingTime: 0, // Would need processing time tracking
      failureReasons: {} as Record<string, number>,
      providerUsage: {} as Record<string, number>,
    };

    const successfulPayments = payments.filter(p => p.status === PrismaPaymentStatus.COMPLETED);
    metrics.successRate = payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0;

    // Count provider usage
    payments.forEach(payment => {
      const provider = payment.paymentMethod.type;
      metrics.providerUsage[provider] = (metrics.providerUsage[provider] || 0) + 1;
    });

    return metrics;
  }

  /**
   * Get provider for payment type
   */
  private getProviderForPaymentType(type: PaymentType): PaymentProvider | undefined {
    return this.providers.get(type);
  }

  /**
   * Process payment with retry logic
   */
  private async processPaymentWithRetry(
    provider: PaymentProvider,
    request: PaymentRequest,
    maxRetries: number,
    retryOnFailure: boolean
  ): Promise<PaymentResult> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await provider.processPayment(request);

        // If payment is successful or not retryable failure, return immediately
        if (result.success || !retryOnFailure) {
          return result;
        }

        // If payment failed but is retryable, continue to next attempt
        if (result.error && !result.error.retryable) {
          return result;
        }

        lastError = result.error || new Error('Payment failed');
      } catch (error) {
        lastError = error as Error;

        // If error is not retryable, fail immediately
        if (error instanceof PaymentError && !error.retryable) {
          throw error;
        }

        if (attempt === maxRetries) {
          break;
        }

        // Wait before retry with exponential backoff
        const delay = this.config.retryDelayMs * Math.pow(2, attempt - 1);
        console.log(`[PaymentService] Retry attempt ${attempt} after ${delay}ms`);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Process refund with retry logic
   */
  private async processRefundWithRetry(
    provider: PaymentProvider,
    request: RefundRequest,
    maxRetries: number
  ): Promise<RefundResult> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await provider.refundPayment(request);
      } catch (error) {
        lastError = error as Error;

        if (error instanceof PaymentError && !error.retryable) {
          throw error;
        }

        if (attempt === maxRetries) {
          break;
        }

        const delay = this.config.retryDelayMs * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Store payment record in database
   */
  private async storePaymentRecord(request: PaymentRequest, result: PaymentResult): Promise<void> {
    try {
      // Ensure payment method exists
      let paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          type: request.paymentMethod.type,
          name: this.getPaymentMethodName(request.paymentMethod.type),
        },
      });

      if (!paymentMethod) {
        paymentMethod = await prisma.payment.create({
          data: {
            type: request.paymentMethod.type,
            name: this.getPaymentMethodName(request.paymentMethod.type),
          },
        }) as any; // Type assertion needed due to Prisma type limitations
      }

      // Create payment record
      await prisma.payment.create({
        data: {
          tenantId: this.config.defaultTenantId,
          bookingId: request.bookingId,
          userId: request.userId,
          amount: result.amount,
          currency: result.currency,
          paymentMethodId: paymentMethod.id,
          status: this.mapToPrismaStatus(result.status),
          transactionId: result.transactionId,
          metadata: {
            provider: result.providerResponse,
            request: request,
          },
        },
      });
    } catch (error) {
      console.error('[PaymentService] Failed to store payment record:', error);
      // Don't throw here as the payment was successful
    }
  }

  /**
   * Store failed payment record
   */
  private async storeFailedPaymentRecord(request: PaymentRequest, error: Error): Promise<void> {
    try {
      // Ensure payment method exists
      let paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          type: request.paymentMethod.type,
          name: this.getPaymentMethodName(request.paymentMethod.type),
        },
      });

      if (!paymentMethod) {
        paymentMethod = await prisma.payment.create({
          data: {
            type: request.paymentMethod.type,
            name: this.getPaymentMethodName(request.paymentMethod.type),
          },
        }) as any;
      }

      // Create failed payment record
      await prisma.payment.create({
        data: {
          tenantId: this.config.defaultTenantId,
          bookingId: request.bookingId,
          userId: request.userId,
          amount: request.amount,
          currency: request.currency,
          paymentMethodId: paymentMethod.id,
          status: PrismaPaymentStatus.FAILED,
          metadata: {
            error: error.message,
            request: request,
          },
        },
      });
    } catch (dbError) {
      console.error('[PaymentService] Failed to store failed payment record:', dbError);
    }
  }

  /**
   * Send payment notification
   */
  private async sendPaymentNotification(request: PaymentRequest, result: PaymentResult): Promise<void> {
    try {
      const paymentMethodName = this.getPaymentMethodName(request.paymentMethod.type);

      if (result.success && result.status === PaymentStatus.COMPLETED) {
        await this.notificationService.sendPaymentSuccessNotification(
          request.userId,
          request.bookingId,
          result.amount,
          result.currency,
          paymentMethodName
        );
      } else if (result.status === PaymentStatus.PENDING) {
        const instructions = this.getPaymentInstructions(request.paymentMethod.type, result);
        await this.notificationService.sendPaymentPendingNotification(
          request.userId,
          request.bookingId,
          result.amount,
          result.currency,
          paymentMethodName,
          instructions
        );
      } else if (!result.success || result.status === PaymentStatus.FAILED) {
        const reason = result.error?.message || 'Unknown payment error';
        await this.notificationService.sendPaymentFailedNotification(
          request.userId,
          request.bookingId,
          result.amount,
          result.currency,
          reason
        );
      }
    } catch (error) {
      console.error('[PaymentService] Failed to send payment notification:', error);
      // Don't throw - notifications are not critical to payment processing
    }
  }

  /**
   * Get payment instructions for pending payments
   */
  private getPaymentInstructions(paymentType: PaymentType, result: PaymentResult): string | undefined {
    if (paymentType === PaymentType.MULTIBANCO && result.providerResponse) {
      const response = result.providerResponse as any;
      if (response.entity && response.reference) {
        return `Please pay at your bank or ATM using: Entity: ${response.entity}, Reference: ${response.reference}. Valid until: ${response.expiry_date ? new Date(response.expiry_date).toLocaleDateString() : '3 days'}.`;
      }
    }

    if (paymentType === PaymentType.MB_WAY && result.providerResponse) {
      return 'Please complete the payment using your MB WAY app.';
    }

    return undefined;
  }

  /**
   * Log transaction
   */
  private logTransaction(log: Omit<TransactionLog, 'id' | 'timestamp'>): void {
    const transactionLog: TransactionLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.transactionLogs.push(transactionLog);

    if (this.config.enableLogging) {
      console.log(`[PaymentService] Transaction logged:`, transactionLog);
    }
  }

  /**
   * Map PaymentStatus to Prisma PaymentStatus
   */
  private mapToPrismaStatus(status: PaymentStatus): PrismaPaymentStatus {
    switch (status) {
      case PaymentStatus.PENDING:
        return PrismaPaymentStatus.PENDING;
      case PaymentStatus.PROCESSING:
        return PrismaPaymentStatus.PROCESSING;
      case PaymentStatus.COMPLETED:
        return PrismaPaymentStatus.COMPLETED;
      case PaymentStatus.FAILED:
        return PrismaPaymentStatus.FAILED;
      case PaymentStatus.REFUNDED:
        return PrismaPaymentStatus.REFUNDED;
      default:
        return PrismaPaymentStatus.PENDING;
    }
  }

  /**
   * Get payment method name
   */
  private getPaymentMethodName(type: PaymentType): string {
    switch (type) {
      case PaymentType.CREDIT_CARD:
        return 'Credit Card';
      case PaymentType.DEBIT_CARD:
        return 'Debit Card';
      case PaymentType.MB_WAY:
        return 'MB WAY';
      case PaymentType.MULTIBANCO:
        return 'Multibanco';
      case PaymentType.PAYPAL:
        return 'PayPal';
      case PaymentType.BANK_TRANSFER:
        return 'Bank Transfer';
      default:
        return 'Unknown';
    }
  }

  /**
   * Sleep utility
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}