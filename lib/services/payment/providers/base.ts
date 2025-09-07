import {
  PaymentProvider,
  PaymentRequest,
  PaymentResult,
  RefundRequest,
  RefundResult,
  ValidationResult,
  PaymentMethodDetails,
  PaymentStatus,
  ProviderConfig,
  PaymentError,
  TransactionLog
} from '../types';
import { PaymentType } from '@prisma/client';

/**
 * Abstract base class for payment providers
 * Provides common functionality and defines the interface that all providers must implement
 */
export abstract class BasePaymentProvider implements PaymentProvider {
  protected config: ProviderConfig;
  protected transactionLogs: TransactionLog[] = [];

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  abstract readonly name: string;
  abstract readonly supportedTypes: PaymentType[];

  /**
   * Process a payment through the payment provider
   */
  abstract processPayment(request: PaymentRequest): Promise<PaymentResult>;

  /**
   * Process a refund through the payment provider
   */
  abstract refundPayment(request: RefundRequest): Promise<RefundResult>;

  /**
   * Validate payment method details
   */
  abstract validatePaymentMethod(details: PaymentMethodDetails): Promise<ValidationResult>;

  /**
   * Get payment status from the provider
   */
  abstract getPaymentStatus(transactionId: string): Promise<PaymentStatus>;

  /**
   * Get provider configuration
   */
  getConfig(): ProviderConfig {
    return { ...this.config };
  }

  /**
   * Generate a unique transaction ID
   */
  protected generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log a transaction event
   */
  protected logTransaction(log: Omit<TransactionLog, 'id' | 'timestamp'>): void {
    const transactionLog: TransactionLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.transactionLogs.push(transactionLog);

    // In a real implementation, this would be persisted to a database
    console.log(`[PaymentProvider:${this.name}] Transaction logged:`, transactionLog);
  }

  /**
   * Get transaction logs for a specific transaction
   */
  getTransactionLogs(transactionId: string): TransactionLog[] {
    return this.transactionLogs.filter(log => log.transactionId === transactionId);
  }

  /**
   * Handle provider-specific errors
   */
  protected handleProviderError(error: any, operation: string): PaymentError {
    console.error(`[PaymentProvider:${this.name}] ${operation} error:`, error);

    if (error instanceof PaymentError) {
      return error;
    }

    // Map common provider errors to our error types
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return new PaymentError(
        'Insufficient funds for payment',
        'INSUFFICIENT_FUNDS',
        this.name,
        false,
        error
      );
    }

    if (error.code === 'CARD_DECLINED') {
      return new PaymentError(
        'Payment method was declined',
        'CARD_DECLINED',
        this.name,
        false,
        error
      );
    }

    if (error.code === 'TIMEOUT') {
      return new PaymentError(
        'Payment processing timed out',
        'TIMEOUT',
        this.name,
        true,
        error
      );
    }

    // Generic provider error
    return new PaymentError(
      `Payment provider error: ${error.message || 'Unknown error'}`,
      'PROVIDER_ERROR',
      this.name,
      true,
      error
    );
  }

  /**
   * Validate common payment method fields
   */
  protected validateCommonFields(details: PaymentMethodDetails): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate amount if present
    if (details.cardNumber && !this.isValidCardNumber(details.cardNumber)) {
      errors.push('Invalid card number format');
    }

    if (details.expiryMonth && (details.expiryMonth < 1 || details.expiryMonth > 12)) {
      errors.push('Invalid expiry month');
    }

    if (details.expiryYear) {
      const currentYear = new Date().getFullYear();
      if (details.expiryYear < currentYear) {
        errors.push('Card has expired');
      } else if (details.expiryYear > currentYear + 20) {
        warnings.push('Card expiry year seems unusually far in the future');
      }
    }

    if (details.cvv && !/^\d{3,4}$/.test(details.cvv)) {
      errors.push('Invalid CVV format');
    }

    if (details.phoneNumber && !this.isValidPhoneNumber(details.phoneNumber)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Validate card number using Luhn algorithm
   */
  private isValidCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate phone number (basic validation for Portuguese numbers)
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Remove spaces, dashes, and parentheses
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

    // Portuguese mobile numbers typically start with 9 and have 9 digits
    // Landline numbers have various formats
    const portugueseMobileRegex = /^(\+351|351)?9\d{8}$/;
    const portugueseLandlineRegex = /^(\+351|351)?[12345678]\d{8}$/;

    return portugueseMobileRegex.test(cleaned) || portugueseLandlineRegex.test(cleaned);
  }

  /**
   * Sleep utility for retry mechanisms
   */
  protected async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry a function with exponential backoff
   */
  protected async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxAttempts) {
          throw lastError;
        }

        // Only retry on retryable errors
        if (error instanceof PaymentError && !error.retryable) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`[PaymentProvider:${this.name}] Retry attempt ${attempt} after ${delay}ms`);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }
}