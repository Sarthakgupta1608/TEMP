import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';

export class NotificationController {
  static async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'rohan-verma-seed-id';
      const list = await NotificationService.getUserNotifications(userId);
      return sendSuccess(res, list, 'Notifications fetched');
    } catch (error) {
      next(error);
    }
  }

  static async markRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notif = await NotificationService.markAsRead(req.params.id);
      return sendSuccess(res, notif, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }
}
