import { Router } from 'express';
import { AgencyController } from '../controllers/agency.controller';
import { requireAuth, requireRole } from '../middleware/authGuard';

const router = Router();

router.use('/agency', requireAuth, requireRole('AGENCY'));

router.get('/agency/leads', AgencyController.getLeads);
router.get('/agency/bookings', AgencyController.getBookings);
router.get('/agency/wallet', AgencyController.getWallet);
router.post('/agency/payouts', AgencyController.requestPayout);
router.post('/agency/kyc', AgencyController.uploadKyc);
router.post('/agency/packages', AgencyController.createPackage);

export default router;
