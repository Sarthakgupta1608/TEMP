import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import packageRoutes from './package.routes';
import tripRequestRoutes from './tripRequest.routes';
import agencyRoutes from './agency.routes';
import bookingRoutes from './booking.routes';
import wishlistRoutes from './wishlist.routes';
import reviewRoutes from './review.routes';
import notificationRoutes from './notification.routes';
import messageRoutes from './message.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', userRoutes);
router.use('/', packageRoutes);
router.use('/', tripRequestRoutes);
router.use('/', agencyRoutes);
router.use('/', bookingRoutes);
router.use('/', wishlistRoutes);
router.use('/', reviewRoutes);
router.use('/', notificationRoutes);
router.use('/', messageRoutes);
router.use('/', adminRoutes);

export default router;
