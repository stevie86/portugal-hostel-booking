import { BasePaymentProvider } from './base';
import {
  PaymentRequest,
  PaymentResult,
  RefundRequest,
  RefundResult,
  ValidationResult,
  PaymentMethodDetails,
  PaymentStatus,
  MBWayPaymentDetails,
  ProviderConfig,
  PaymentError
} from '../types';
import { PaymentType } from '../types';

/**
 * MB WAY Payment Provider
 * Handles mobile payment processing through MB WAY
 */
export class MBWayProvider extends BasePaymentProvider {
  readonly name = 'MB WAY';
  readonly supportedTypes = [PaymentType.MB_WAY];

  constructor(config: ProviderConfig) {
    super(config);
  }

  /**
   * Process MB WAY payment
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const transactionId = this.generateTransactionId();

    try {
      this.logTransaction({
        transactionId,
        provider: this.name,
        action: 'INITIATE',
        status: PaymentStatus.PENDING,
        amount: request.amount,
        currency: request.currency,
        requestData: request,
      });

      // Validate payment method
      const validation = await this.validatePaymentMethod(request.paymentMethod);
      if (!validation.isValid) {
        throw new PaymentError(
          `Invalid payment method: ${validation.errors?.join(', ')}`,
          'VALIDATION_ERROR',
          this.name
        );
      }

      // Simulate MB WAY payment processing
      const result = await this.simulateMBWayPayment(request, transactionId);

      this.logTransaction({
        transactionId,
        provider: this.name,
        action: 'PROCESS',
        status: result.status,
        amount: request.amount,
        currency: request.currency,
        responseData: result,
      });

      return result;
    } catch (error) {
      this.logTransaction({
        transactionId,
        provider: this.name,
        action: 'FAIL',
        status: PaymentStatus.FAILED,
        amount: request.amount,
        currency: request.currency,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw this.handleProviderError(error, 'processPayment');
    }
  }

  /**
   * Process MB WAY refund
   */
  async refundPayment(request: RefundRequest): Promise<RefundResult> {
    try {
      this.logTransaction({
        transactionId: request.transactionId,
        provider: this.name,
        action: 'REFUND',
        status: PaymentStatus.PROCESSING,
        amount: request.amount,
        currency: 'EUR', // MB WAY is EUR only
      });

      // Simulate refund processing
      const result = await this.simulateMBWayRefund(request);

      this.logTransaction({
        transactionId: request.transactionId,
        provider: this.name,
        action: 'COMPLETE',
        status: PaymentStatus.REFUNDED,
        amount: request.amount,
        currency: 'EUR',
        responseData: result,
      });

      return result;
    } catch (error) {
      throw this.handleProviderError(error, 'refundPayment');
    }
  }

  /**
   * Validate MB WAY payment method
   */
  async validatePaymentMethod(details: PaymentMethodDetails): Promise<ValidationResult> {
    if (details.type !== PaymentType.MB_WAY) {
      return {
        isValid: false,
        errors: ['Invalid payment type for MB WAY provider'],
      };
    }

    if (!details.phoneNumber) {
      return {
        isValid: false,
        errors: ['Phone number is required for MB WAY payments'],
      };
    }

    // Use base validation for common fields
    const baseValidation = this.validateCommonFields(details);

    // Additional MB WAY specific validation
    const errors: string[] = baseValidation.errors || [];
    const warnings: string[] = baseValidation.warnings || [];

    // Validate Portuguese phone number format
    if (!this.isValidPortugueseMobile(details.phoneNumber)) {
      errors.push('Invalid Portuguese mobile number format for MB WAY');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    // In a real implementation, this would query the MB WAY API
    // For MVP, simulate status based on transaction ID
    const isCompleted = transactionId.includes('completed');
    const isFailed = transactionId.includes('failed');

    if (isCompleted) return PaymentStatus.COMPLETED;
    if (isFailed) return PaymentStatus.FAILED;

    return PaymentStatus.PENDING;
  }

  /**
   * Simulate MB WAY payment processing
   * In production, this would integrate with the actual MB WAY API
   */
  private async simulateMBWayPayment(
    request: PaymentRequest,
    transactionId: string
  ): Promise<PaymentResult> {
    // Simulate API call delay
    await this.sleep(1000 + Math.random() * 2000);

    // Simulate different outcomes based on amount for testing
    const amount = request.amount;

    if (amount <= 0) {
      throw new PaymentError('Invalid payment amount', 'INVALID_AMOUNT', this.name);
    }

    // Simulate occasional failures
    if (Math.random() < 0.1) { // 10% failure rate
      throw new PaymentError('MB WAY payment declined', 'PAYMENT_DECLINED', this.name);
    }

    // Simulate timeout occasionally
    if (Math.random() < 0.05) { // 5% timeout rate
      await this.sleep(10000); // Long delay to simulate timeout
    }

    const success = Math.random() > 0.15; // 85% success rate

    if (success) {
      return {
        success: true,
        transactionId,
        status: PaymentStatus.COMPLETED,
        amount: request.amount,
        currency: request.currency,
        processedAt: new Date(),
        providerResponse: {
          mbway_reference: `MBW${Date.now()}`,
          phone_number: request.paymentMethod.phoneNumber,
          status: 'completed',
        },
      };
    } else {
      return {
        success: false,
        status: PaymentStatus.FAILED,
        amount: request.amount,
        currency: request.currency,
        processedAt: new Date(),
        error: new PaymentError('MB WAY payment failed', 'PAYMENT_FAILED', this.name),
        providerResponse: {
          error_code: 'PAYMENT_FAILED',
          error_message: 'Payment was declined by MB WAY',
        },
      };
    }
  }

  /**
   * Simulate MB WAY refund processing
   */
  private async simulateMBWayRefund(request: RefundRequest): Promise<RefundResult> {
    await this.sleep(500 + Math.random() * 1000);

    // Simulate refund processing
    const success = Math.random() > 0.05; // 95% success rate for refunds

    if (success) {
      return {
        success: true,
        refundId: `REF${Date.now()}`,
        amount: request.amount,
        status: 'COMPLETED',
        processedAt: new Date(),
      };
    } else {
      throw new PaymentError('MB WAY refund failed', 'REFUND_FAILED', this.name);
    }
  }

  /**
   * Validate Portuguese mobile number for MB WAY
   */
  private isValidPortugueseMobile(phoneNumber: string): boolean {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // MB WAY supports Portuguese mobile numbers starting with 9
    const mobileRegex = /^(\+?351)?9[0-9]{8}$/;

    return mobileRegex.test(cleaned);
  }
}