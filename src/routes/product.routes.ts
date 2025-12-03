import { Router } from 'express';
import {
  searchProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from '@controllers';
import {
  accessTokenValidator,
  createProductBodyValidator,
  searchProductsQueryValidator,
  updateProductBodyValidator,
  updateProductStockBodyValidator,
} from '@middlewares';
import { WrapAsync } from '@utils';

const router = Router();
router.get('/', searchProductsQueryValidator, WrapAsync(searchProducts));
router.get('/:id', WrapAsync(getProduct));

router.use(accessTokenValidator);

router.post('/', createProductBodyValidator, WrapAsync(createProduct));
router.put('/:id', updateProductBodyValidator, WrapAsync(updateProduct));
router.delete('/:id', WrapAsync(deleteProduct));
router.patch('/:id/stock', updateProductStockBodyValidator, WrapAsync(updateProductStock));

export default router;
