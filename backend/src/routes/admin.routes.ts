import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();

router.get('/admin/analytics', AdminController.getAnalytics);
router.patch('/admin/agencies/:id/kyc', AdminController.updateAgencyKyc);
router.post('/admin/escrow/release', AdminController.releaseEscrow);

export default router;
