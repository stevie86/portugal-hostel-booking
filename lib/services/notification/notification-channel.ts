export interface NotificationData {
  userId: string;
  bookingId?: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Base interface for notification channels
 */
export interface NotificationChannel {
  name: string;

  /**
   * Send notification through this channel
   */
  send(notification: NotificationData): Promise<NotificationResult>;

  /**
   * Check if this channel is available/configured
   */
  isAvailable(): boolean;
}

/**
 * Email notification channel
 */
export interface EmailNotificationData extends NotificationData {
  recipient: string;
  subject: string;
  template?: string;
  templateData?: Record<string, any>;
}

/**
 * SMS notification channel
 */
export interface SMSNotificationData extends NotificationData {
  phoneNumber: string;
  message: string;
}