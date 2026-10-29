import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { AuthenticatedUser } from '../middleware/authGuard';
import { NotificationService } from './notification.service';

export class BookingService {
  static async createBooking(
    travellerId: string,
    data: { quoteId?: string; packageId?: string; startDate?: string; endDate?: string; pax?: number }
  ) {
    let grossAmount = 0;
    let agencyId = '';
    let tripRequestId: string | null = null;
    let quoteTitle = 'Custom Himalayan Tour';

    if (data.quoteId) {
      const quote = await prisma.agencyQuote.findUnique({
        where: { id: data.quoteId },
        include: { tripRequest: true, agency: true },
      });
      if (!quote) {
        throw { statusCode: 404, message: 'Agency quote not found', errorCode: 'QUOTE_NOT_FOUND' };
      }
      grossAmount = quote.totalPrice;
      agencyId = quote.agencyId;
      tripRequestId = quote.tripRequestId;
      quoteTitle = `Quote by ${quote.agency.companyName}`;

      if (tripRequestId) {
        const existingBooking = await prisma.booking.findFirst({
          where: { tripRequestId },
        });
        if (existingBooking) {
          tripRequestId = null;
        }
      }
    } else if (data.packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: data.packageId },
        include: { agency: true },
      });
      if (!pkg) {
        throw { statusCode: 404, message: 'Travel package not found', errorCode: 'PACKAGE_NOT_FOUND' };
      }
      const pax = Math.max(1, data.pax || 1);
      grossAmount = pkg.pricePerPerson * pax;
      agencyId = pkg.agencyId;
      quoteTitle = pkg.title;
    } else {
      throw {
        statusCode: 400,
        message: 'Must provide either a quoteId or packageId to create a booking',
        errorCode: 'INVALID_BOOKING_SOURCE',
      };
    }

    const commissionAmount = grossAmount * 0.10; // 10% platform fee
    const netAgencyAmount = grossAmount - commissionAmount;
    const bookingCode = `TRV-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Wrap booking + payment + wallet escrow hold in a Prisma transaction
    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          bookingCode,
          travellerId,
          agencyId,
          quoteId: data.quoteId || null,
          packageId: data.packageId || null,
          tripRequestId,
          status: 'CONFIRMED',
          grossAmount,
          commissionAmount,
          netAgencyAmount,
          startDate: data.startDate || '2026-10-15',
          endDate: data.endDate || '2026-10-20',
          payment: {
            create: {
              status: 'SUCCESS',
              amount: grossAmount,
              razorpayOrderId: `order_${Math.floor(10000000 + Math.random() * 90000000)}`,
              razorpayPaymentId: `pay_${Math.floor(10000000 + Math.random() * 90000000)}`,
              paymentMethod: 'RAZORPAY_UPI',
            },
          },
        },
        include: {
          agency: {
            include: {
              owner: true,
            },
          },
          payment: true,
          quote: true,
          package: true,
          traveller: {
            include: { profile: true },
          },
        },
      });

      // Update Agency Wallet Escrow Hold
      await tx.wallet.upsert({
        where: { agencyId },
        update: {
          escrowHold: { increment: grossAmount },
          totalEarned: { increment: netAgencyAmount },
        },
        create: {
          agencyId,
          balance: 0,
          escrowHold: grossAmount,
          totalEarned: netAgencyAmount,
        },
      });

      return created;
    });

    // Notifications: traveller and agency owner
    try {
      await NotificationService.sendNotification(
        travellerId,
        'Booking Confirmed!',
        `Your booking ${booking.bookingCode} for ₹${grossAmount.toLocaleString('en-IN')} with ${booking.agency?.companyName || 'local agency'} has been confirmed and escrow protected.`
      );

      const agencyOwnerId = booking.agency?.ownerId;
      if (agencyOwnerId) {
        await NotificationService.sendNotification(
          agencyOwnerId,
          'New Booking Received!',
          `You received a new confirmed booking ${booking.bookingCode} worth ₹${grossAmount.toLocaleString('en-IN')} (Net: ₹${netAgencyAmount.toLocaleString('en-IN')}) for ${quoteTitle}.`
        );
      }
    } catch (notifError) {
      console.warn('Failed to send booking notification:', notifError);
    }

    return booking;
  }

  static async verifyRazorpayPayment(data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature?: string }) {
    if (config.razorpay.keySecret && !config.razorpay.keySecret.includes('placeholder') && data.razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', config.razorpay.keySecret)
        .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== data.razorpaySignature) {
        throw { statusCode: 400, message: 'Invalid Razorpay payment signature', errorCode: 'INVALID_PAYMENT_SIGNATURE' };
      }
    }

    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: data.razorpayOrderId },
      include: { booking: true },
    });

    if (!payment) {
      throw { statusCode: 404, message: 'Payment record not found', errorCode: 'PAYMENT_NOT_FOUND' };
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCESS' },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' },
    });

    return { bookingCode: payment.booking.bookingCode, status: 'CONFIRMED' };
  }

  static async getTravellerBookings(travellerId: string) {
    return prisma.booking.findMany({
      where: { travellerId },
      include: {
        agency: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            operatingRegion: true,
            ratingAverage: true,
          },
        },
        payment: true,
        quote: true,
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAgencyBookings(agencyId: string) {
    return prisma.booking.findMany({
      where: { agencyId },
      include: {
        traveller: {
          include: { profile: true },
        },
        payment: true,
        quote: true,
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getBookingById(bookingId: string, user: AuthenticatedUser) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        agency: { include: { owner: true } },
        traveller: { include: { profile: true } },
        payment: true,
        quote: true,
        package: true,
      },
    });

    if (!booking) {
      throw { statusCode: 404, message: 'Booking not found', errorCode: 'BOOKING_NOT_FOUND' };
    }

    const isAdmin = user.role.toUpperCase() === 'ADMIN';
    const isTraveller = user.id === booking.travellerId;
    const isAgency = (user.agencyId && user.agencyId === booking.agencyId) || user.id === booking.agency?.ownerId;

    if (!isAdmin && !isTraveller && !isAgency) {
      throw { statusCode: 403, message: 'Forbidden: You do not have access to this booking', errorCode: 'FORBIDDEN' };
    }

    return booking;
  }
}
