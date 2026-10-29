import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';
import { requireAuth } from '../middleware/authGuard';

const router = Router();

router.use('/wishlist', requireAuth);

router.get('/wishlist', WishlistController.getWishlist);
router.post('/wishlist', WishlistController.addToWishlist);
router.delete('/wishlist/:packageId', WishlistController.removeFromWishlist);

export default router;
