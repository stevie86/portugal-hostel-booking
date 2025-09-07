import { NotificationChannel, NotificationData, NotificationResult, SMSNotificationData } from '../notification-channel';

/**
 * SMS notification channel implementation (placeholder for future SMS integration)
 */
export class SMSChannel implements NotificationChannel {
  name = 'sms';

  async send(notification: NotificationData): Promise<NotificationResult> {
    try {
      const smsData = notification as SMSNotificationData;

      if (!smsData.phoneNumber) {
        return {
          success: false,
          error: 'Phone number not provided',
        };
      }

      // Placeholder for SMS service integration (e.g., Twilio)
      console.log(`[SMSChannel] Would send SMS to ${smsData.phoneNumber}: ${notification.message}`);

      // For now, just simulate success
      return {
        success: true,
        messageId: `sms_${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  isAvailable(): boolean {
    // Check if SMS service is configured (e.g., Twilio credentials)
    return !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN;
  }
}