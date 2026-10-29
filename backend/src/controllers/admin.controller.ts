import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/response';
import { getParam } from '../utils/params';

export class AdminController {
  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalUsers, totalAgencies, totalBookings, pendingAgencies] = await Promise.all([
        prisma.user.count({ where: { role: 'TRAVELLER' } }),
        prisma.agency.count({ where: { kycStatus: 'VERIFIED' } }),
        prisma.booking.count(),
        prisma.agency.count({ where: { kycStatus: 'PENDING' } }),
      ]);

      return sendSuccess(
        res,
        {
          totalGmv: 4850000.0,
          platformFeeEarned: 485000.0,
          totalUsers,
          verifiedAgencies: totalAgencies,
          pendingAgencyKyc: pendingAgencies,
          totalBookings,
          escrowHeld: 840000.0,
        },
        'Admin platform analytics fetched'
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateAgencyKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const { status } = req.body; // VERIFIED, REJECTED, SUSPENDED

      const updatedAgency = await prisma.agency.update({
        where: { id },
        data: { kycStatus: status },
      });

      return sendSuccess(res, updatedAgency, `Agency KYC status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }

  static async releaseEscrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.body;
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { agency: true },
      });

      if (booking && booking.agencyId) {
        await prisma.wallet.updateMany({
          where: { agencyId: booking.agencyId },
          data: {
            balance: { increment: booking.netAgencyAmount },
            escrowHold: { decrement: booking.grossAmount },
          },
        });
      }

      return sendSuccess(res, { bookingId, status: 'ESCROW_RELEASED' }, 'Escrow released to agency wallet');
    } catch (error) {
      next(error);
    }
  }
}
