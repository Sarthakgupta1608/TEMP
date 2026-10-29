import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { requireAuth, requireRole } from '../middleware/authGuard';

const router = Router();

router.post('/bookings', requireAuth, requireRole('TRAVELLER'), BookingController.createBooking);
router.get('/bookings/my', requireAuth, requireRole('TRAVELLER'), BookingController.getMyBookings);
router.get('/bookings/my-bookings', requireAuth, requireRole('TRAVELLER'), BookingController.getMyBookings);
router.get('/bookings/:id', requireAuth, BookingController.getBookingById);
router.post('/payments/verify', requireAuth, BookingController.verifyPayment);

export default router;
