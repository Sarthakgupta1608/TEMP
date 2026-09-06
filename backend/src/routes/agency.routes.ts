import { Router } from 'express';
import { AgencyController } from '../controllers/agency.controller';

const router = Router();

router.get('/agency/leads', AgencyController.getLeads);
router.get('/agency/wallet', AgencyController.getWallet);
router.post('/agency/payouts', AgencyController.requestPayout);
router.post('/agency/kyc', AgencyController.uploadKyc);
router.post('/agency/packages', AgencyController.createPackage);

export default router;
