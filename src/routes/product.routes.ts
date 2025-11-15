import { Router } from 'express';
import {
  searchProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from '@controllers';
import { accessTokenValidator } from '@middleware';

const router = Router();
router.get('/', searchProducts);
router.get('/:id', getProduct);

// Protect all routes below
router.use(accessTokenValidator);

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/stock', updateProductStock);

export default router;
