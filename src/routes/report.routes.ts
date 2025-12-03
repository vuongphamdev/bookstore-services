import { Router } from 'express';
import { getTopSellingProducts } from '@controllers';
import { WrapAsync } from '@utils';
import { accessTokenValidator } from '@middlewares';

const router = Router();

router.use(accessTokenValidator);
router.get('/top-selling-products', WrapAsync(getTopSellingProducts));

export default router;
