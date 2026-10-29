import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middleware/authGuard';

const router = Router();

router.use('/admin', requireAuth, requireRole('ADMIN'));

router.get('/admin/analytics', AdminController.getAnalytics);
router.patch('/admin/agencies/:id/kyc', AdminController.updateAgencyKyc);
router.post('/admin/escrow/release', AdminController.releaseEscrow);

export default router;
