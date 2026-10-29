import { Request, Response, NextFunction } from 'express';
import { TripRequestService } from '../services/tripRequest.service';
import { AIService } from '../services/ai.service';
import { AgencyService } from '../services/agency.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';
import { getParam } from '../utils/params';

export class TripRequestController {
  static async extractAIIntent(req: Request, res: Response, next: NextFunction) {
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
      const userId = req.user!.id;
      const tripRequest = await TripRequestService.createTripRequest(userId, req.body);
      return sendSuccess(res, tripRequest, 'Trip request published to local agencies', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getQuotesForRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const quotes = await TripRequestService.getQuotesForRequest(id);
      return sendSuccess(res, quotes, 'Quotes fetched with AI comparison matrix');
    } catch (error) {
      next(error);
    }
  }

  static async submitAgencyQuote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agency = await AgencyService.resolveAgency(req.user!.id, req.user!.agencyId);
      const quote = await TripRequestService.submitAgencyQuote(agency.id, req.body);
      return sendSuccess(res, quote, 'Custom quotation submitted to traveller', 201);
    } catch (error) {
      next(error);
    }
  }
}
