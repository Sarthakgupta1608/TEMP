import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';

const router = Router();

router.post('/reviews', ReviewController.createReview);
router.get('/reviews/agency/:agencyId', ReviewController.getAgencyReviews);

export default router;
