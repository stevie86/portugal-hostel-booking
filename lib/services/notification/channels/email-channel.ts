import { NotificationChannel, NotificationData, NotificationResult, EmailNotificationData } from '../notification-channel';
import { EmailService, EmailConfig } from '../email-service';

/**
 * Email notification channel implementation
 */
export class EmailChannel implements NotificationChannel {
  name = 'email';
  private emailService: EmailService;

  constructor(emailConfig: EmailConfig) {
    this.emailService = new EmailService(emailConfig);
  }

  async send(notification: NotificationData): Promise<NotificationResult> {
    try {
      // For now, we need the recipient email from metadata or user lookup
      // In a real implementation, you'd look up the user's email from the database
      const emailData = notification as EmailNotificationData;

      if (!emailData.recipient) {
        return {
          success: false,
          error: 'Recipient email not provided',
        };
      }

      // Map notification types to email templates
      const templateMap: Record<string, string> = {
        BOOKING_CONFIRMED: 'booking-confirmation-guest',
        PAYMENT_SUCCESS: 'payment-success',
        PAYMENT_FAILED: 'payment-failed',
      };

      const template = templateMap[notification.type] || 'general-notification';

      const success = await this.emailService.sendEmail({
        to: emailData.recipient,
        subject: notification.title,
        template,
        data: {
          ...notification.metadata,
          message: notification.message,
        },
        bookingId: notification.bookingId,
        tenantId: notification.metadata?.tenantId || 'default-tenant',
      });

      return {
        success,
        messageId: success ? 'email-sent' : undefined,
        error: success ? undefined : 'Failed to send email',
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  isAvailable(): boolean {
    // Check if email service is configured
    return !!process.env.SMTP_HOST && !!process.env.SMTP_USER;
  }
}