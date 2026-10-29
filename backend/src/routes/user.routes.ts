import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/authGuard';

const router = Router();

router.use('/user', requireAuth);

router.patch('/user/profile', UserController.updateProfile);
router.post('/user/change-password', UserController.changePassword);

export default router;
