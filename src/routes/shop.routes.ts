import { Router } from 'express';
import { getShops, getShop, getMyShops, createShop, updateShop, deleteShop } from '@controllers';
import { accessTokenValidator } from '@middleware';

const router = Router();

// Public routes
router.get('/', getShops);
router.get('/:id', getShop);

// Protected routes (require authentication)
router.use(accessTokenValidator);

router.get('/my/shops', getMyShops); // Get current seller's shops
router.post('/', createShop); // Create shop
router.put('/:id', updateShop); // Update shop
router.delete('/:id', deleteShop); // Delete shop

export default router;
