import { Router } from 'express';
import { getShop, getMyShop, createShop, updateShop, deleteShop } from '@controllers';
import { accessTokenValidator } from '@middleware';

const router = Router();

// Public routes
router.get('/:id', getShop);

// Protected routes (require authentication)
router.use(accessTokenValidator);

router.get('/my', getMyShop);
router.post('/', createShop);
router.put('/:id', updateShop);
router.delete('/:id', deleteShop);

export default router;
