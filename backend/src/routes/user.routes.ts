import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.patch('/user/profile', UserController.updateProfile);
router.post('/user/change-password', UserController.changePassword);

export default router;
