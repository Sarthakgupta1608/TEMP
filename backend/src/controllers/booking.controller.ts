import { Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';
import { getParam } from '../utils/params';

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const travellerId = req.user!.id;
      const booking = await BookingService.createBooking(travellerId, req.body);
      return sendSuccess(res, booking, 'Booking created and Razorpay Escrow order generated', 201);
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await BookingService.verifyRazorpayPayment(req.body);
      return sendSuccess(res, result, 'Razorpay Payment Signature Verified & Booking Confirmed');
    } catch (error) {
      next(error);
    }
  }

  static async getMyBookings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const travellerId = req.user!.id;
      const bookings = await BookingService.getTravellerBookings(travellerId);
      return sendSuccess(res, bookings, 'Traveller bookings fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getBookingById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const booking = await BookingService.getBookingById(id, req.user!);
      return sendSuccess(res, booking, 'Booking details fetched');
    } catch (error) {
      next(error);
    }
  }
}
