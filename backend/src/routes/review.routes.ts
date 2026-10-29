import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { requireAuth, requireRole } from '../middleware/authGuard';

const router = Router();

router.post('/reviews', requireAuth, requireRole('TRAVELLER'), ReviewController.createReview);
router.get('/reviews/agency/:agencyId', ReviewController.getAgencyReviews);

export default router;
