import { NotificationService, NotificationType } from '../../lib/services/notification/service';
import { EmailService } from '../../lib/services/notification/email-service';

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    notificationType: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    booking: {
      findUnique: jest.fn(),
    },
    emailLog: {
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

// Mock EmailService
jest.mock('../../lib/services/notification/email-service', () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn(),
    sendBookingConfirmationToGuest: jest.fn(),
    sendBookingConfirmationToOwner: jest.fn(),
  })),
}));

describe('NotificationService', () => {
  let notificationService;
  let mockPrisma;
  let mockEmailService;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPrisma = require('../../lib/prisma').prisma;
    mockEmailService = new EmailService();

    // Mock notification type lookup
    mockPrisma.notificationType.findUnique.mockResolvedValue({
      id: 'type-id',
      name: NotificationType.BOOKING_CONFIRMED,
    });

    notificationService = new NotificationService();
  });

  describe('sendBookingConfirmedNotification', () => {
    it('should create notification and send email', async () => {
      const userId = 'user-123';
      const bookingId = 'booking-123';
      const checkIn = new Date('2025-09-15');
      const checkOut = new Date('2025-09-17');

      mockPrisma.notification.create.mockResolvedValue({
        id: 'notification-id',
        userId,
        bookingId,
        typeId: 'type-id',
        title: 'Booking Confirmed',
        message: 'Your booking has been confirmed!',
      });

      // Mock booking lookup for email
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: bookingId,
        checkIn,
        checkOut,
        guests: 2,
        totalAmount: 100,
        specialRequests: null,
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        room: {
          property: {
            name: 'Test Hostel',
            description: 'A great place to stay',
            location: {
              address: '123 Main St',
              city: { name: 'Lisbon' },
            },
            host: {
              firstName: 'Jane',
              lastName: 'Host',
              email: 'jane@hostel.com',
            },
          },
        },
      });

      mockEmailService.sendEmail.mockResolvedValue(true);

      await notificationService.sendBookingConfirmedNotification(userId, bookingId, checkIn, checkOut);

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          tenantId: 'default-tenant',
          userId,
          bookingId,
          typeId: 'type-id',
          title: 'Booking Confirmed',
          message: `Your booking has been confirmed! Check-in: ${checkIn.toDateString()}, Check-out: ${checkOut.toDateString()}.`,
          metadata: {
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
          },
        },
      });

      // Verify email sending was attempted
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2); // Guest and host emails
    });

    it('should handle email sending failure gracefully', async () => {
      const userId = 'user-123';
      const bookingId = 'booking-123';
      const checkIn = new Date('2025-09-15');
      const checkOut = new Date('2025-09-17');

      mockPrisma.notification.create.mockResolvedValue({
        id: 'notification-id',
        userId,
        bookingId,
        typeId: 'type-id',
        title: 'Booking Confirmed',
        message: 'Your booking has been confirmed!',
      });

      mockPrisma.booking.findUnique.mockResolvedValue(null); // Booking not found
      mockEmailService.sendEmail.mockRejectedValue(new Error('Email failed'));

      // Should not throw error even if email fails
      await expect(
        notificationService.sendBookingConfirmedNotification(userId, bookingId, checkIn, checkOut)
      ).resolves.not.toThrow();

      expect(mockPrisma.notification.create).toHaveBeenCalled();
    });
  });

  describe('getUserNotifications', () => {
    it('should return formatted notifications', async () => {
      const userId = 'user-123';
      const mockNotifications = [
        {
          id: 'notif-1',
          type: { name: NotificationType.BOOKING_CONFIRMED },
          title: 'Booking Confirmed',
          message: 'Your booking is confirmed',
          isRead: false,
          createdAt: new Date(),
          metadata: { test: 'data' },
        },
      ];

      mockPrisma.notification.findMany.mockResolvedValue(mockNotifications);

      const result = await notificationService.getUserNotifications(userId);

      expect(result).toEqual([
        {
          id: 'notif-1',
          type: NotificationType.BOOKING_CONFIRMED,
          title: 'Booking Confirmed',
          message: 'Your booking is confirmed',
          isRead: false,
          createdAt: expect.any(Date),
          metadata: { test: 'data' },
        },
      ]);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = 'notif-123';
      const userId = 'user-123';

      mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 });

      await notificationService.markAsRead(notificationId, userId);

      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: notificationId,
          userId,
          tenantId: 'default-tenant',
        },
        data: { isRead: true },
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread notification count', async () => {
      const userId = 'user-123';
      mockPrisma.notification.count.mockResolvedValue(5);

      const result = await notificationService.getUnreadCount(userId);

      expect(result).toBe(5);
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: {
          userId,
          tenantId: 'default-tenant',
          isRead: false,
        },
      });
    });
  });
});