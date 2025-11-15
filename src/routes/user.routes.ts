import { Router } from 'express';
import { updateUser, me } from '@controllers';
import { accessTokenValidator } from '@middleware';
import { WrapAsync } from '@utils';

const router = Router();

// Protect all routes below
router.use(accessTokenValidator);

// User CRUD operations
router.put('/:id', WrapAsync(updateUser));
router.get('/me', accessTokenValidator, WrapAsync(me));

export default router;
