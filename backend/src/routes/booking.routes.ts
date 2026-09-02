import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';

const router = Router();

router.post('/bookings', BookingController.createBooking);
router.post('/payments/verify', BookingController.verifyPayment);
router.get('/bookings/my-bookings', BookingController.getMyBookings);

export default router;
