import { Response, NextFunction } from 'express';
import { WishlistService } from '../services/wishlist.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';
import { getParam } from '../utils/params';

export class WishlistController {
  static async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const items = await WishlistService.getUserWishlist(userId);
      return sendSuccess(res, items, 'Wishlist fetched');
    } catch (error) {
      next(error);
    }
  }

  static async addToWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const item = await WishlistService.addToWishlist(userId, req.body.packageId);
      return sendSuccess(res, item, 'Added to wishlist');
    } catch (error) {
      next(error);
    }
  }

  static async removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const packageId = getParam(req, 'packageId');
      await WishlistService.removeFromWishlist(userId, packageId);
      return sendSuccess(res, null, 'Removed from wishlist');
    } catch (error) {
      next(error);
    }
  }
}
