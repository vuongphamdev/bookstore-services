import { Router } from 'express';
import { login, logout, refreshToken, register } from '@controllers';
import { WrapAsync } from '@utils';
import { accessTokenValidator, loginValidator, refreshTokenCookieValidator, registerValidator } from '@middlewares';

const router = Router();

router.post('/login', loginValidator, WrapAsync(login));
router.post('/refresh-token', refreshTokenCookieValidator, WrapAsync(refreshToken));
router.post('/logout', accessTokenValidator, WrapAsync(logout));
router.post('/register', registerValidator, WrapAsync(register));

export default router;
