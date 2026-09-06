import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';

const router = Router();

router.get('/messages/conversation/:bookingId', MessageController.getConversation);
router.post('/messages', MessageController.sendMessage);

export default router;
