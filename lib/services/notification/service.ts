import { prisma } from '../../prisma';
import { NotificationChannel, NotificationData as BaseNotificationData, EmailNotificationData } from './notification-channel';
import { EmailChannel } from './channels/email-channel';
import { SMSChannel } from './channels/sms-channel';

export enum NotificationType {
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED'
}

export interface NotificationData extends BaseNotificationData {
  userId: string;
  bookingId?: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Notification Service
 * Handles sending notifications for various events
 */
export class NotificationService {
  private defaultTenantId: string;
  private channels: Map<string, NotificationChannel> = new Map();

  constructor(defaultTenantId: string = 'default-tenant') {
    this.defaultTenantId = defaultTenantId;
    this.initializeChannels();
  }

  /**
   * Initialize notification channels
   */
  private initializeChannels(): void {
    // Email channel
    if (process.env.SMTP_HOST) {
      const emailConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
        from: process.env.SMTP_FROM || 'noreply@lisbonhostelbooking.com',
      };
      this.channels.set('email', new EmailChannel(emailConfig));
    }

    // SMS channel (placeholder)
    this.channels.set('sms', new SMSChannel());
  }

  /**
   * Send notification through specified channel
   */
  async sendThroughChannel(channelName: string, notification: NotificationData): Promise<boolean> {
    const channel = this.channels.get(channelName);
    if (!channel || !channel.isAvailable()) {
      console.warn(`[NotificationService] Channel '${channelName}' not available`);
      return false;
    }

    const result = await channel.send(notification);
    if (!result.success) {
      console.error(`[NotificationService] Failed to send through ${channelName}:`, result.error);
    }
    return result.success;
  }

  /**
   * Send payment success notification
   */
  async sendPaymentSuccessNotification(
    userId: string,
    bookingId: string,
    amount: number,
    currency: string,
    paymentMethod: string
  ): Promise<void> {
    const notification: NotificationData = {
      userId,
      bookingId,
      type: NotificationType.PAYMENT_SUCCESS,
      title: 'Payment Successful',
      message: `Your payment of ${amount} ${currency} using ${paymentMethod} has been processed successfully.`,
      metadata: {
        amount,
        currency,
        paymentMethod,
      },
    };

    await this.createNotification(notification);
  }

  /**
   * Send payment failed notification
   */
  async sendPaymentFailedNotification(
    userId: string,
    bookingId: string,
    amount: number,
    currency: string,
    reason?: string
  ): Promise<void> {
    const notification: NotificationData = {
      userId,
      bookingId,
      type: NotificationType.PAYMENT_FAILED,
      title: 'Payment Failed',
      message: `Your payment of ${amount} ${currency} could not be processed. ${reason || 'Please try again or contact support.'}`,
      metadata: {
        amount,
        currency,
        reason,
      },
    };

    await this.createNotification(notification);
  }

  /**
   * Send payment pending notification
   */
  async sendPaymentPendingNotification(
    userId: string,
    bookingId: string,
    amount: number,
    currency: string,
    paymentMethod: string,
    instructions?: string
  ): Promise<void> {
    const notification: NotificationData = {
      userId,
      bookingId,
      type: NotificationType.PAYMENT_PENDING,
      title: 'Payment Pending',
      message: `Your payment of ${amount} ${currency} using ${paymentMethod} is pending. ${instructions || 'Please complete the payment to confirm your booking.'}`,
      metadata: {
        amount,
        currency,
        paymentMethod,
        instructions,
      },
    };

    await this.createNotification(notification);
  }

  /**
    * Send booking confirmed notification
    */
   async sendBookingConfirmedNotification(
     userId: string,
     bookingId: string,
     checkIn: Date,
     checkOut: Date
   ): Promise<void> {
     const notification: NotificationData = {
       userId,
       bookingId,
       type: NotificationType.BOOKING_CONFIRMED,
       title: 'Booking Confirmed',
       message: `Your booking has been confirmed! Check-in: ${checkIn.toDateString()}, Check-out: ${checkOut.toDateString()}.`,
       metadata: {
         checkIn: checkIn.toISOString(),
         checkOut: checkOut.toISOString(),
       },
     };

     await this.createNotification(notification);

     // Also send email notification
     await this.sendBookingConfirmationEmail(userId, bookingId);
   }

   /**
    * Send booking confirmation email
    */
   private async sendBookingConfirmationEmail(userId: string, bookingId: string): Promise<void> {
     try {
       // Get booking details with related data
       const booking = await prisma.booking.findUnique({
         where: { id: bookingId },
         include: {
           user: true,
           room: {
             include: {
               property: {
                 include: {
                   host: true,
                   location: true,
                 },
               },
             },
           },
         },
       });

       if (!booking) {
         console.error('[NotificationService] Booking not found for email:', bookingId);
         return;
       }

       const bookingData = {
         checkIn: booking.checkIn,
         checkOut: booking.checkOut,
         guests: booking.guests,
         totalAmount: booking.totalAmount,
         propertyName: booking.room.property.name,
         propertyAddress: `${booking.room.property.location.address}, ${booking.room.property.location.city.name}, Portugal`,
         propertyDescription: booking.room.property.description,
         specialRequests: booking.specialRequests,
         guestName: `${booking.user.firstName} ${booking.user.lastName}`,
         guestEmail: booking.user.email,
         guestPhone: booking.user.metadata?.phone,
         hostName: `${booking.room.property.host.firstName} ${booking.room.property.host.lastName}`,
         hostEmail: booking.room.property.host.email,
         hostPhone: booking.room.property.host.metadata?.phone,
       };

       // Send email to guest
       const guestEmailData: EmailNotificationData = {
         userId,
         bookingId,
         type: NotificationType.BOOKING_CONFIRMED,
         title: 'Booking Confirmed',
         message: `Your booking has been confirmed!`,
         recipient: booking.user.email,
         subject: `Booking Confirmed - ${booking.room.property.name}`,
         template: 'booking-confirmation-guest',
         metadata: {
           templateData: bookingData,
           tenantId: this.defaultTenantId,
         },
       };

       await this.sendThroughChannel('email', guestEmailData as any);

       // Send email to host
       const hostEmailData: EmailNotificationData = {
         userId: booking.room.property.hostId,
         bookingId,
         type: NotificationType.BOOKING_CONFIRMED,
         title: 'New Booking Confirmed',
         message: `You have a new confirmed booking!`,
         recipient: booking.room.property.host.email,
         subject: `New Booking Confirmed - ${booking.room.property.name}`,
         template: 'booking-confirmation-owner',
         metadata: {
           templateData: bookingData,
           tenantId: this.defaultTenantId,
         },
       };

       await this.sendThroughChannel('email', hostEmailData as any);

     } catch (error) {
       console.error('[NotificationService] Failed to send booking confirmation email:', error);
     }
   }

  /**
   * Send booking cancelled notification
   */
  async sendBookingCancelledNotification(
    userId: string,
    bookingId: string,
    reason?: string
  ): Promise<void> {
    const notification: NotificationData = {
      userId,
      bookingId,
      type: NotificationType.BOOKING_CANCELLED,
      title: 'Booking Cancelled',
      message: `Your booking has been cancelled. ${reason || 'Please contact support for more information.'}`,
      metadata: {
        reason,
      },
    };

    await this.createNotification(notification);
  }

  /**
   * Send payment refunded notification
   */
  async sendPaymentRefundedNotification(
    userId: string,
    bookingId: string,
    amount: number,
    currency: string,
    reason?: string
  ): Promise<void> {
    const notification: NotificationData = {
      userId,
      bookingId,
      type: NotificationType.PAYMENT_REFUNDED,
      title: 'Payment Refunded',
      message: `Your payment of ${amount} ${currency} has been refunded. ${reason || ''}`,
      metadata: {
        amount,
        currency,
        reason,
      },
    };

    await this.createNotification(notification);
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 50): Promise<any[]> {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        tenantId: this.defaultTenantId,
      },
      include: {
        type: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return notifications.map(notification => ({
      id: notification.id,
      type: notification.type.name,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      metadata: notification.metadata,
    }));
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
        tenantId: this.defaultTenantId,
      },
      data: { isRead: true },
    });
  }

  /**
   * Mark all user notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        tenantId: this.defaultTenantId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        tenantId: this.defaultTenantId,
        isRead: false,
      },
    });
  }

  /**
   * Create notification in database
   */
  private async createNotification(notification: NotificationData): Promise<void> {
    try {
      // Ensure notification type exists
      let notificationType = await prisma.notificationType.findUnique({
        where: { name: notification.type },
      });

      if (!notificationType) {
        notificationType = await prisma.notificationType.create({
          data: { name: notification.type },
        });
      }

      // Create notification
      await prisma.notification.create({
        data: {
          tenantId: this.defaultTenantId,
          userId: notification.userId,
          bookingId: notification.bookingId,
          typeId: notificationType.id,
          title: notification.title,
          message: notification.message,
          metadata: notification.metadata,
        },
      });

      // In a real implementation, this would also send email/SMS/push notifications
      console.log(`[NotificationService] Sent ${notification.type} notification to user ${notification.userId}`);
    } catch (error) {
      console.error('[NotificationService] Failed to create notification:', error);
      // Don't throw - notifications are not critical
    }
  }
}