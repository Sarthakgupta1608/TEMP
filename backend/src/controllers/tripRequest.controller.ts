import { Response, NextFunction } from 'express';
import { TripRequestService } from '../services/tripRequest.service';
import { AIService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';

export class TripRequestController {
  static async extractAIIntent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { rawPrompt } = req.body;
      const spec = await AIService.extractTripIntent(rawPrompt || 'Trip request');
      return sendSuccess(res, { structuredSpec: spec }, 'AI Trip intent extracted');
    } catch (error) {
      next(error);
    }
  }

  static async createTripRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'rohan-verma-seed-id';
      const tripRequest = await TripRequestService.createTripRequest(userId, req.body);
      return sendSuccess(res, tripRequest, 'Trip request published to local agencies', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getQuotesForRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quotes = await TripRequestService.getQuotesForRequest(req.params.id);
      return sendSuccess(res, quotes, 'Quotes fetched with AI comparison matrix');
    } catch (error) {
      next(error);
    }
  }

  static async submitAgencyQuote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agencyId = req.user?.agencyId || 'agency-seed-id-101';
      const quote = await TripRequestService.submitAgencyQuote(agencyId, req.body);
      return sendSuccess(res, quote, 'Custom quotation submitted to traveller', 201);
    } catch (error) {
      next(error);
    }
  }
}
