import { Response, NextFunction } from 'express';
import { AgencyService } from '../services/agency.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';

export class AgencyController {
  static async getLeads(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agencyId = req.user?.agencyId || 'agency-seed-id-101';
      const leads = await AgencyService.getLeadsForAgency(agencyId);
      return sendSuccess(res, leads, 'Agency leads fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getWallet(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agencyId = req.user?.agencyId || 'agency-seed-id-101';
      const wallet = await AgencyService.getAgencyWallet(agencyId);
      return sendSuccess(res, wallet, 'Agency wallet details fetched');
    } catch (error) {
      next(error);
    }
  }

  static async requestPayout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agencyId = req.user?.agencyId || 'agency-seed-id-101';
      const updatedWallet = await AgencyService.requestPayout(agencyId, Number(req.body.amount || 10000));
      return sendSuccess(res, updatedWallet, 'Payout request processed');
    } catch (error) {
      next(error);
    }
  }

  static async uploadKyc(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agencyId = req.user?.agencyId || 'agency-seed-id-101';
      const doc = await AgencyService.uploadKycDocument(agencyId, req.body);
      return sendSuccess(res, doc, 'KYC Document uploaded');
    } catch (error) {
      next(error);
    }
  }

  static async createPackage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agencyId = req.user?.agencyId || 'agency-seed-id-101';
      const pkg = await AgencyService.createPackage(agencyId, req.body);
      return sendSuccess(res, pkg, 'New package published', 201);
    } catch (error) {
      next(error);
    }
  }
}
