import { Router } from 'express';
import { getTopSellingProducts } from '@controllers';
import { WrapAsync } from '@utils';
import { accessTokenValidator } from '@middleware';

const router = Router();

// Protect all routes below
router.use(accessTokenValidator);

router.get('/top-selling-products', WrapAsync(getTopSellingProducts));

export default router;
