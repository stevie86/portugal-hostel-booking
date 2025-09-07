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
 * Credit Card Payment Provider
 * Handles credit and debit card payments
 */
export class CreditCardProvider extends BasePaymentProvider {
  readonly name = 'Credit Card';
  readonly supportedTypes = [PaymentType.CREDIT_CARD, PaymentType.DEBIT_CARD];

  constructor(config: ProviderConfig) {
    super(config);
  }

  /**
   * Process credit card payment
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

      // Simulate credit card payment processing
      const result = await this.simulateCreditCardPayment(request, transactionId);

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
   * Process credit card refund
   */
  async refundPayment(request: RefundRequest): Promise<RefundResult> {
    try {
      this.logTransaction({
        transactionId: request.transactionId,
        provider: this.name,
        action: 'REFUND',
        status: PaymentStatus.PROCESSING,
        amount: request.amount,
        currency: 'EUR', // Assuming EUR for Portugal
      });

      // Simulate refund processing
      const result = await this.simulateCreditCardRefund(request);

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
   * Validate credit card payment method
   */
  async validatePaymentMethod(details: PaymentMethodDetails): Promise<ValidationResult> {
    if (!this.supportedTypes.includes(details.type)) {
      return {
        isValid: false,
        errors: ['Invalid payment type for credit card provider'],
      };
    }

    if (!details.cardNumber) {
      return {
        isValid: false,
        errors: ['Card number is required'],
      };
    }

    if (!details.expiryMonth || !details.expiryYear) {
      return {
        isValid: false,
        errors: ['Card expiry date is required'],
      };
    }

    if (!details.cvv) {
      return {
        isValid: false,
        errors: ['CVV is required'],
      };
    }

    if (!details.cardholderName) {
      return {
        isValid: false,
        errors: ['Cardholder name is required'],
      };
    }

    // Use base validation for common fields
    const baseValidation = this.validateCommonFields(details);

    // Additional credit card specific validation
    const errors: string[] = baseValidation.errors || [];
    const warnings: string[] = baseValidation.warnings || [];

    // Validate card type
    const cardType = this.getCardType(details.cardNumber);
    if (!cardType) {
      errors.push('Unsupported card type');
    }

    // Check for common test cards
    if (this.isTestCard(details.cardNumber)) {
      warnings.push('Test card detected - this will only work in sandbox mode');
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
    // In a real implementation, this would query the payment processor API
    // For MVP, simulate status based on transaction ID
    const isCompleted = transactionId.includes('completed');
    const isFailed = transactionId.includes('failed');

    if (isCompleted) return PaymentStatus.COMPLETED;
    if (isFailed) return PaymentStatus.FAILED;

    return PaymentStatus.PENDING;
  }

  /**
   * Simulate credit card payment processing
   * In production, this would integrate with Stripe, Adyen, or similar
   */
  private async simulateCreditCardPayment(
    request: PaymentRequest,
    transactionId: string
  ): Promise<PaymentResult> {
    // Simulate API call delay
    await this.sleep(1000 + Math.random() * 2000);

    const amount = request.amount;

    if (amount <= 0) {
      throw new PaymentError('Invalid payment amount', 'INVALID_AMOUNT', this.name);
    }

    // Simulate different failure scenarios
    if (Math.random() < 0.05) { // 5% insufficient funds
      throw new PaymentError('Insufficient funds', 'INSUFFICIENT_FUNDS', this.name);
    }

    if (Math.random() < 0.03) { // 3% card declined
      throw new PaymentError('Card was declined', 'CARD_DECLINED', this.name);
    }

    if (Math.random() < 0.02) { // 2% timeout
      await this.sleep(30000); // Long delay to simulate timeout
      throw new PaymentError('Payment processing timed out', 'TIMEOUT', this.name, true);
    }

    // Simulate fraud detection
    if (amount > 5000 && Math.random() < 0.1) { // 10% for high amounts
      throw new PaymentError('Transaction flagged for fraud review', 'FRAUD_DETECTED', this.name);
    }

    const success = Math.random() > 0.12; // 88% success rate

    if (success) {
      return {
        success: true,
        transactionId,
        status: PaymentStatus.COMPLETED,
        amount: request.amount,
        currency: request.currency,
        processedAt: new Date(),
        providerResponse: {
          charge_id: `ch_${Date.now()}`,
          card_last4: request.paymentMethod.cardNumber?.slice(-4),
          card_brand: this.getCardType(request.paymentMethod.cardNumber!),
          status: 'succeeded',
        },
      };
    } else {
      return {
        success: false,
        status: PaymentStatus.FAILED,
        amount: request.amount,
        currency: request.currency,
        processedAt: new Date(),
        error: new PaymentError('Credit card payment failed', 'PAYMENT_FAILED', this.name),
        providerResponse: {
          error_code: 'card_declined',
          error_message: 'Your card was declined. Please try a different card.',
        },
      };
    }
  }

  /**
   * Simulate credit card refund processing
   */
  private async simulateCreditCardRefund(request: RefundRequest): Promise<RefundResult> {
    await this.sleep(800 + Math.random() * 1200);

    // Simulate refund processing
    const success = Math.random() > 0.02; // 98% success rate for refunds

    if (success) {
      return {
        success: true,
        refundId: `ref_${Date.now()}`,
        amount: request.amount,
        status: 'COMPLETED',
        processedAt: new Date(),
      };
    } else {
      throw new PaymentError('Credit card refund failed', 'REFUND_FAILED', this.name);
    }
  }

  /**
   * Get card type from card number
   */
  private getCardType(cardNumber: string): string | null {
    const cleaned = cardNumber.replace(/\s+/g, '');

    // Visa
    if (/^4/.test(cleaned)) {
      return 'visa';
    }

    // Mastercard
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
      return 'mastercard';
    }

    // American Express
    if (/^3[47]/.test(cleaned)) {
      return 'amex';
    }

    // Discover
    if (/^6(?:011|5)/.test(cleaned)) {
      return 'discover';
    }

    return null;
  }

  /**
   * Check if card is a common test card
   */
  private isTestCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s+/g, '');

    // Common test card numbers
    const testCards = [
      '4242424242424242', // Visa test card
      '4000000000000002', // Visa declined
      '5555555555554444', // Mastercard test card
      '378282246310005',  // Amex test card
    ];

    return testCards.includes(cleaned);
  }
}