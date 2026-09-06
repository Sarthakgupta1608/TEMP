import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

router.get('/notifications', NotificationController.getNotifications);
router.patch('/notifications/:id/read', NotificationController.markRead);

export default router;
