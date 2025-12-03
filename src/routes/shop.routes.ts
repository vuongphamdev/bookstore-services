import { Router } from 'express';
import { getShop, getMyShop, createShop, updateShop, deleteShop } from '@controllers';
import { accessTokenValidator, createShopBodyValidator, updateShopBodyValidator } from '@middlewares';
import { WrapAsync } from '@utils';

const router = Router();

router.get('/:id', WrapAsync(getShop));

router.use(accessTokenValidator);

router.get('/my', WrapAsync(getMyShop));
router.post('/', createShopBodyValidator, WrapAsync(createShop));
router.put('/:id', updateShopBodyValidator, WrapAsync(updateShop));
router.delete('/:id', WrapAsync(deleteShop));

export default router;
