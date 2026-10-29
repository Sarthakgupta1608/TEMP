import { Router } from 'express';
import { TripRequestController } from '../controllers/tripRequest.controller';
import { requireAuth, requireRole } from '../middleware/authGuard';

const router = Router();

router.post('/ai/extract-intent', TripRequestController.extractAIIntent);
router.post('/trip-requests', requireAuth, requireRole('TRAVELLER'), TripRequestController.createTripRequest);
router.get('/trip-requests/:id/quotes', requireAuth, TripRequestController.getQuotesForRequest);
router.post('/agency/quotes', requireAuth, requireRole('AGENCY'), TripRequestController.submitAgencyQuote);

export default router;
