import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';
import { getParam } from '../utils/params';

export class ReviewController {
  static async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const travellerId = req.user!.id;
      const review = await ReviewService.createReview(travellerId, req.body);
      return sendSuccess(res, review, 'Review submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getAgencyReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const agencyId = getParam(req, 'agencyId');
      const reviews = await ReviewService.getAgencyReviews(agencyId);
      return sendSuccess(res, reviews, 'Agency reviews fetched');
    } catch (error) {
      next(error);
    }
  }
}
