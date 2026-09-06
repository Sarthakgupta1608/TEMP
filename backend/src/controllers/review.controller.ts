import { Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';

export class ReviewController {
  static async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const travellerId = req.user?.id || 'rohan-verma-seed-id';
      const review = await ReviewService.createReview(travellerId, req.body);
      return sendSuccess(res, review, 'Review submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getAgencyReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewService.getAgencyReviews(req.params.agencyId);
      return sendSuccess(res, reviews, 'Agency reviews fetched');
    } catch (error) {
      next(error);
    }
  }
}
