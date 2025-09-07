import { prisma } from '../../prisma';
import { PaymentService } from '../payment/service';
import { PaymentRequest, PaymentMethodDetails, PaymentType, BookingStatus } from '../payment/types';
import { NotificationService } from '../notification/service';

export interface CreateBookingRequest {
  userId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  specialRequests?: string;
  tenantId?: string;
}

export interface BookingWithPayment extends CreateBookingRequest {
  id: string;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessPaymentRequest {
  bookingId: string;
  paymentMethod: PaymentMethodDetails;
}

/**
 * Booking Service
 * Handles booking operations and payment integration
 */
export class BookingService {
  private paymentService: PaymentService;
  private notificationService: NotificationService;
  private defaultTenantId: string;

  constructor(
    paymentService: PaymentService,
    notificationService?: NotificationService,
    defaultTenantId: string = 'default-tenant'
  ) {
    this.paymentService = paymentService;
    this.notificationService = notificationService || new NotificationService(defaultTenantId);
    this.defaultTenantId = defaultTenantId;
  }

  /**
   * Create a new booking
   */
  async createBooking(request: CreateBookingRequest): Promise<BookingWithPayment> {
    const { userId, roomId, checkIn, checkOut, guests, specialRequests, tenantId = this.defaultTenantId } = request;

    // Validate booking dates
    if (checkIn >= checkOut) {
      throw new Error('Check-out date must be after check-in date');
    }

    if (checkIn < new Date()) {
      throw new Error('Check-in date cannot be in the past');
    }

    // Check room availability
    const isAvailable = await this.checkRoomAvailability(roomId, checkIn, checkOut);
    if (!isAvailable) {
      throw new Error('Room is not available for the selected dates');
    }

    // Calculate total amount (simplified - in real app would use pricing service)
    const totalAmount = await this.calculateBookingAmount(roomId, checkIn, checkOut, guests);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        tenantId,
        userId,
        roomId,
        checkIn,
        checkOut,
        guests,
        totalAmount,
        currency: 'EUR',
        status: BookingStatus.PENDING,
        specialRequests,
      },
    });

    return {
      ...request,
      id: booking.id,
      totalAmount,
      currency: 'EUR',
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  /**
   * Process payment for a booking
   */
  async processPayment(request: ProcessPaymentRequest): Promise<any> {
    const { bookingId, paymentMethod } = request;

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, room: true },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new Error('Booking is not in a payable state');
    }

    // Create payment request
    const paymentRequest: PaymentRequest = {
      bookingId,
      userId: booking.userId,
      amount: booking.totalAmount,
      currency: booking.currency,
      paymentMethod,
      description: `Booking payment for room ${booking.room.name}`,
    };

    try {
      // Process payment
      const paymentResult = await this.paymentService.processPayment(paymentRequest);

      // Update booking status based on payment result
      if (paymentResult.success && paymentResult.status === 'COMPLETED') {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.CONFIRMED },
        });

        // Send booking confirmed notification
        await this.notificationService.sendBookingConfirmedNotification(
          booking.userId,
          bookingId,
          booking.checkIn,
          booking.checkOut
        );
      } else if (paymentResult.status === 'PENDING') {
        // For methods like Multibanco, booking stays pending until payment is completed
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.PENDING },
        });
      } else {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.CANCELLED },
        });
      }

      return {
        bookingId,
        paymentResult,
        bookingStatus: paymentResult.success ? BookingStatus.CONFIRMED : BookingStatus.CANCELLED,
      };
    } catch (error) {
      // Payment failed, cancel booking
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      throw error;
    }
  }

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: string, userId?: string): Promise<BookingWithPayment | null> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        room: {
          include: {
            property: true,
            roomType: true,
          },
        },
        payments: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });

    if (!booking) {
      return null;
    }

    // Check if user has access to this booking
    if (userId && booking.userId !== userId) {
      throw new Error('Access denied');
    }

    return {
      id: booking.id,
      userId: booking.userId,
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      specialRequests: booking.specialRequests,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId: string): Promise<BookingWithPayment[]> {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            property: true,
            roomType: true,
          },
        },
        payments: {
          include: {
            paymentMethod: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map(booking => ({
      id: booking.id,
      userId: booking.userId,
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      specialRequests: booking.specialRequests,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string, userId: string): Promise<void> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Access denied');
    }

    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.CONFIRMED) {
      throw new Error('Booking cannot be cancelled');
    }

    // Check cancellation policy (simplified)
    const daysUntilCheckIn = Math.ceil((booking.checkIn.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysUntilCheckIn < 1) {
      throw new Error('Cannot cancel booking less than 24 hours before check-in');
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  /**
   * Check room availability
   */
  private async checkRoomAvailability(roomId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkIn } },
              { checkOut: { gt: checkIn } },
            ],
          },
          {
            AND: [
              { checkIn: { lt: checkOut } },
              { checkOut: { gte: checkOut } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: checkIn } },
              { checkOut: { lte: checkOut } },
            ],
          },
        ],
      },
    });

    return conflictingBookings.length === 0;
  }

  /**
   * Calculate booking amount (simplified)
   */
  private async calculateBookingAmount(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number
  ): Promise<number> {
    // Get room pricing (simplified - would use pricing service)
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        pricePlans: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!room || !room.pricePlans.length) {
      throw new Error('Room pricing not available');
    }

    const pricePlan = room.pricePlans[0];
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Basic calculation: base price * nights
    let totalAmount = pricePlan.basePrice * nights;

    // Add guest surcharge if applicable
    const roomType = await prisma.roomType.findUnique({
      where: { id: room.roomTypeId },
    });

    if (roomType && guests > roomType.capacity) {
      throw new Error(`Room capacity exceeded. Maximum ${roomType.capacity} guests.`);
    }

    // Apply any discounts or seasonal rates (simplified)
    // In a real implementation, this would be more complex

    return Math.round(totalAmount * 100) / 100; // Round to 2 decimal places
  }
}