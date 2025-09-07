// Define enums locally to avoid Prisma import issues
export enum PaymentType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MB_WAY = 'MB_WAY',
  MULTIBANCO = 'MULTIBANCO'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// Core payment interfaces
export interface PaymentMethodDetails {
  type: PaymentType;
  cardNumber?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: string;
  cardholderName?: string;
  phoneNumber?: string; // For MB WAY
  email?: string;
  bankReference?: string; // For Multibanco
}

export interface PaymentRequest {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodDetails;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  processedAt: Date;
  error?: PaymentError;
  providerResponse?: any;
}

export interface RefundRequest {
  transactionId: string;
  amount: number;
  reason?: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  amount: number;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  processedAt: Date;
  error?: PaymentError;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

// Provider-specific interfaces
export interface MBWayPaymentDetails {
  phoneNumber: string;
  amount: number;
  description?: string;
}

export interface MultibancoPaymentDetails {
  amount: number;
  description?: string;
  expiryDays?: number; // Default 3 days
}

export interface CreditCardPaymentDetails {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardholderName: string;
  amount: number;
  currency: string;
  description?: string;
}

// Error handling
export class PaymentError extends Error {
  public readonly code: string;
  public readonly provider?: string;
  public readonly retryable: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    code: string,
    provider?: string,
    retryable: boolean = false,
    details?: any
  ) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.provider = provider;
    this.retryable = retryable;
    this.details = details;
  }
}

export class ValidationError extends PaymentError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', undefined, false, details);
    this.name = 'ValidationError';
  }
}

export class ProviderError extends PaymentError {
  constructor(message: string, provider: string, retryable: boolean = true, details?: any) {
    super(message, 'PROVIDER_ERROR', provider, retryable, details);
    this.name = 'ProviderError';
  }
}

export class InsufficientFundsError extends PaymentError {
  constructor(message: string, provider?: string) {
    super(message, 'INSUFFICIENT_FUNDS', provider, false);
    this.name = 'InsufficientFundsError';
  }
}

export class TimeoutError extends PaymentError {
  constructor(message: string, provider?: string) {
    super(message, 'TIMEOUT', provider, true);
    this.name = 'TimeoutError';
  }
}

// Transaction tracking
export interface TransactionLog {
  id: string;
  transactionId: string;
  provider: string;
  action: 'INITIATE' | 'PROCESS' | 'COMPLETE' | 'FAIL' | 'REFUND';
  status: PaymentStatus | 'REFUNDED';
  amount: number;
  currency: string;
  requestData?: any;
  responseData?: any;
  error?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Provider configuration
export interface ProviderConfig {
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  environment: 'sandbox' | 'production';
}

// Payment provider interface
export interface PaymentProvider {
  readonly name: string;
  readonly supportedTypes: PaymentType[];

  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  refundPayment(request: RefundRequest): Promise<RefundResult>;
  validatePaymentMethod(details: PaymentMethodDetails): Promise<ValidationResult>;
  getPaymentStatus(transactionId: string): Promise<PaymentStatus>;
  getConfig(): ProviderConfig;
}

// Service interfaces
export interface PaymentServiceConfig {
  defaultTenantId: string;
  providers: Map<PaymentType, PaymentProvider>;
  maxRetryAttempts: number;
  retryDelayMs: number;
  enableLogging: boolean;
}

export interface PaymentProcessingOptions {
  retryOnFailure?: boolean;
  maxRetries?: number;
  timeoutMs?: number;
  idempotencyKey?: string;
}

// Notification interfaces
export interface PaymentNotification {
  paymentId: string;
  bookingId: string;
  userId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Analytics interfaces
export interface PaymentMetrics {
  totalProcessed: number;
  totalAmount: number;
  successRate: number;
  averageProcessingTime: number;
  failureReasons: Record<string, number>;
  providerUsage: Record<string, number>;
}