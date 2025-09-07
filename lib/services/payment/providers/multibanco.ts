import { BasePaymentProvider } from './base';
import {
  PaymentRequest,
  PaymentResult,
  RefundRequest,
  RefundResult,
  ValidationResult,
  PaymentMethodDetails,
  PaymentStatus,
  ProviderConfig,
  PaymentError
} from '../types';
import { PaymentType } from '../types';

/**
 * Multibanco Payment Provider
 * Handles banking network payments through Multibanco
 */
export class MultibancoProvider extends BasePaymentProvider {
  readonly name = 'Multibanco';
  readonly supportedTypes = [PaymentType.MULTIBANCO];

  constructor(config: ProviderConfig) {
    super(config);
  }

  /**
   * Process Multibanco payment
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

      // Simulate Multibanco payment processing
      const result = await this.simulateMultibancoPayment(request, transactionId);

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
   * Process Multibanco refund
   */
  async refundPayment(request: RefundRequest): Promise<RefundResult> {
    try {
      this.logTransaction({
        transactionId: request.transactionId,
        provider: this.name,
        action: 'REFUND',
        status: PaymentStatus.PROCESSING,
        amount: request.amount,
        currency: 'EUR', // Multibanco is EUR only
      });

      // Simulate refund processing
      const result = await this.simulateMultibancoRefund(request);

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
   * Validate Multibanco payment method
   */
  async validatePaymentMethod(details: PaymentMethodDetails): Promise<ValidationResult> {
    if (details.type !== PaymentType.MULTIBANCO) {
      return {
        isValid: false,
        errors: ['Invalid payment type for Multibanco provider'],
      };
    }

    // Multibanco doesn't require specific user details upfront
    // The payment reference is generated during processing

    // Use base validation for common fields
    const baseValidation = this.validateCommonFields(details);

    return {
      isValid: baseValidation.isValid || true, // Multibanco has minimal validation requirements
      errors: baseValidation.errors,
      warnings: baseValidation.warnings,
    };
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    // In a real implementation, this would query the Multibanco API
    // For MVP, simulate status based on transaction ID
    const isCompleted = transactionId.includes('completed');
    const isFailed = transactionId.includes('failed');

    if (isCompleted) return PaymentStatus.COMPLETED;
    if (isFailed) return PaymentStatus.FAILED;

    return PaymentStatus.PENDING;
  }

  /**
   * Simulate Multibanco payment processing
   * In production, this would integrate with the actual Multibanco API
   */
  private async simulateMultibancoPayment(
    request: PaymentRequest,
    transactionId: string
  ): Promise<PaymentResult> {
    // Simulate API call delay (Multibanco can be slower)
    await this.sleep(2000 + Math.random() * 3000);

    // Generate Multibanco reference details
    const entity = this.generateMultibancoEntity();
    const reference = this.generateMultibancoReference();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3); // 3 days expiry

    // Simulate different outcomes
    const amount = request.amount;

    if (amount <= 0) {
      throw new PaymentError('Invalid payment amount', 'INVALID_AMOUNT', this.name);
    }

    // Simulate occasional failures
    if (Math.random() < 0.08) { // 8% failure rate
      throw new PaymentError('Multibanco payment setup failed', 'PAYMENT_FAILED', this.name);
    }

    // Multibanco payments are typically pending until paid at ATM/bank
    const success = Math.random() > 0.25; // 75% success rate for immediate processing

    if (success) {
      return {
        success: true,
        transactionId,
        status: PaymentStatus.COMPLETED,
        amount: request.amount,
        currency: request.currency,
        processedAt: new Date(),
        providerResponse: {
          entity,
          reference,
          expiry_date: expiryDate.toISOString(),
          status: 'completed',
        },
      };
    } else {
      // Return pending status with payment details for user to complete
      return {
        success: true, // Payment initiated successfully
        transactionId,
        status: PaymentStatus.PENDING,
        amount: request.amount,
        currency: request.currency,
        processedAt: new Date(),
        providerResponse: {
          entity,
          reference,
          expiry_date: expiryDate.toISOString(),
          status: 'pending_payment',
          instructions: 'Please complete payment at ATM or online banking within 3 days',
        },
      };
    }
  }

  /**
   * Simulate Multibanco refund processing
   */
  private async simulateMultibancoRefund(request: RefundRequest): Promise<RefundResult> {
    await this.sleep(1500 + Math.random() * 2000);

    // Simulate refund processing
    const success = Math.random() > 0.03; // 97% success rate for refunds

    if (success) {
      return {
        success: true,
        refundId: `REF${Date.now()}`,
        amount: request.amount,
        status: 'COMPLETED',
        processedAt: new Date(),
      };
    } else {
      throw new PaymentError('Multibanco refund failed', 'REFUND_FAILED', this.name);
    }
  }

  /**
   * Generate a valid Multibanco entity number
   * Real entities are assigned by banks, but for simulation we use test ranges
   */
  private generateMultibancoEntity(): string {
    // Use test entity ranges (real entities are 5-9 digits)
    const entities = ['12345', '67890', '11111', '22222'];
    return entities[Math.floor(Math.random() * entities.length)];
  }

  /**
   * Generate a valid Multibanco reference number
   * References are typically 9 digits with check digit
   */
  private generateMultibancoReference(): string {
    // Generate 8 random digits, then calculate check digit
    const randomDigits = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    const checkDigit = this.calculateMultibancoCheckDigit(randomDigits);
    return randomDigits + checkDigit;
  }

  /**
   * Calculate Multibanco reference check digit
   * Uses a weighted sum algorithm
   */
  private calculateMultibancoCheckDigit(reference: string): number {
    const weights = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < reference.length; i++) {
      sum += parseInt(reference[i]) * weights[i];
    }

    const remainder = sum % 11;
    if (remainder === 0 || remainder === 1) {
      return 0;
    }

    return 11 - remainder;
  }
}