import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';

const router = Router();

router.get('/wishlist', WishlistController.getWishlist);
router.post('/wishlist', WishlistController.addToWishlist);
router.delete('/wishlist/:packageId', WishlistController.removeFromWishlist);

export default router;
