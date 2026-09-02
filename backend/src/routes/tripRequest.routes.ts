import { Router } from 'express';
import { TripRequestController } from '../controllers/tripRequest.controller';

const router = Router();

router.post('/ai/extract-intent', TripRequestController.extractAIIntent);
router.post('/trip-requests', TripRequestController.createTripRequest);
router.get('/trip-requests/:id/quotes', TripRequestController.getQuotesForRequest);
router.post('/agency/quotes', TripRequestController.submitAgencyQuote);

export default router;
