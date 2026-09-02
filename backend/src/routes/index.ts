import { Router } from 'express';
import authRoutes from './auth.routes';
import packageRoutes from './package.routes';
import tripRequestRoutes from './tripRequest.routes';
import bookingRoutes from './booking.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', packageRoutes);
router.use('/', tripRequestRoutes);
router.use('/', bookingRoutes);
router.use('/', adminRoutes);

export default router;
