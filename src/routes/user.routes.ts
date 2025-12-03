import { Router } from 'express';
import { updateUser, me } from '@controllers';
import { accessTokenValidator, updateUserBodyValidator } from '@middlewares';
import { WrapAsync } from '@utils';

const router = Router();

router.use(accessTokenValidator);

router.put('/:id', updateUserBodyValidator, WrapAsync(updateUser));
router.get('/me', WrapAsync(me));

export default router;
