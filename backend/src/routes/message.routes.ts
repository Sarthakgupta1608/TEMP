import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { requireAuth } from '../middleware/authGuard';

const router = Router();

router.use('/messages', requireAuth);

router.get('/messages/conversation/:bookingId', MessageController.getConversation);
router.post('/messages', MessageController.sendMessage);

export default router;
