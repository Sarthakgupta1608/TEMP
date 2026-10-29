import { Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';
import { getParam } from '../utils/params';

export class MessageController {
  static async getConversation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const bookingId = getParam(req, 'bookingId');
      const conv = await MessageService.getOrCreateConversation(bookingId);
      return sendSuccess(res, conv, 'Conversation fetched');
    } catch (error) {
      next(error);
    }
  }

  static async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.id;
      const msg = await MessageService.sendMessage(senderId, req.body);
      return sendSuccess(res, msg, 'Message sent', 201);
    } catch (error) {
      next(error);
    }
  }
}
