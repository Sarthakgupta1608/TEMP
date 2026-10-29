import { Response, NextFunction } from 'express';
import { AgencyService } from '../services/agency.service';
import { BookingService } from '../services/booking.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';

export class AgencyController {
  static async getLeads(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agency = await AgencyService.resolveAgency(req.user!.id, req.user!.agencyId);
      const leads = await AgencyService.getLeadsForAgency(agency.id);
      return sendSuccess(res, leads, 'Agency leads fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getBookings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agency = await AgencyService.resolveAgency(req.user!.id, req.user!.agencyId);
      const bookings = await BookingService.getAgencyBookings(agency.id);
      return sendSuccess(res, bookings, 'Agency bookings fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getWallet(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agency = await AgencyService.resolveAgency(req.user!.id, req.user!.agencyId);
      const wallet = await AgencyService.getAgencyWallet(agency.id);
      return sendSuccess(res, wallet, 'Agency wallet details fetched');
    } catch (error) {
      next(error);
    }
  }

  static async requestPayout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agency = await AgencyService.resolveAgency(req.user!.id, req.user!.agencyId);
      const updatedWallet = await AgencyService.requestPayout(agency.id, Number(req.body.amount || 10000));
      return sendSuccess(res, updatedWallet, 'Payout request processed');
    } catch (error) {
      next(error);
    }
  }

  static async uploadKyc(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agency = await AgencyService.resolveAgency(req.user!.id, req.user!.agencyId);
      const doc = await AgencyService.uploadKycDocument(agency.id, req.body);
      return sendSuccess(res, doc, 'KYC Document uploaded');
    } catch (error) {
      next(error);
    }
  }

  static async createPackage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agency = await AgencyService.resolveAgency(req.user!.id, req.user!.agencyId);
      const pkg = await AgencyService.createPackage(agency.id, req.body);
      return sendSuccess(res, pkg, 'New package published', 201);
    } catch (error) {
      next(error);
    }
  }
}
