import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/authGuard';

const router = Router();

router.use('/notifications', requireAuth);

router.get('/notifications', NotificationController.getNotifications);
router.patch('/notifications/:id/read', NotificationController.markRead);

export default router;
