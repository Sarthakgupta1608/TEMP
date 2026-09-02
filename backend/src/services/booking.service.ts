import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { config } from '../config';

export class BookingService {
  static async createBooking(travellerId: string, data: { quoteId?: string; packageId?: string }) {
    let grossAmount = 42000;
    let agencyId = '';
    let tripRequestId = null;

    if (data.quoteId) {
      const quote = await prisma.agencyQuote.findUnique({
        where: { id: data.quoteId },
        include: { tripRequest: true },
      });
      if (quote) {
        grossAmount = quote.totalPrice;
        agencyId = quote.agencyId;
        tripRequestId = quote.tripRequestId;
      }
    }

    if (!agencyId) {
      const firstAgency = await prisma.agency.findFirst();
      agencyId = firstAgency?.id || '';
    }

    const commissionAmount = grossAmount * 0.10; // 10% platform fee
    const netAgencyAmount = grossAmount - commissionAmount;
    const bookingCode = `TRV-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = await prisma.booking.create({
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
        payment: {
          create: {
            status: 'SUCCESS',
            amount: grossAmount,
            razorpayOrderId: `order_${Math.floor(Math.random() * 100000000)}`,
            razorpayPaymentId: `pay_${Math.floor(Math.random() * 100000000)}`,
            paymentMethod: 'RAZORPAY_UPI',
          },
        },
      },
      include: {
        agency: true,
        payment: true,
      },
    });

    // Update Agency Wallet Escrow Hold
    if (agencyId) {
      await prisma.wallet.updateMany({
        where: { agencyId },
        data: {
          escrowHold: { increment: grossAmount },
        },
      });
    }

    return booking;
  }

  static async verifyRazorpayPayment(data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature?: string }) {
    // If Razorpay secret is active, verify HMAC SHA256 signature
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
        agency: true,
        payment: true,
        quote: true,
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
