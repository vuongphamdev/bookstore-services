import { AUTH_MESSAGES } from '@constants';
import { HTTP_STATUS } from '@constants/http';
import { ErrorWithStatus } from '@models';
import { AuthService } from '@services';
import { ParamSchema } from 'express-validator';
import { Request } from 'express-validator/lib/base';
import { JsonWebTokenError } from 'jsonwebtoken';

type TVerifyParams = { value: string; req?: Request };

const verifyAuthorization = async ({ value, req }: TVerifyParams) => {
  try {
    if (!value) {
      throw new ErrorWithStatus({
        message: AUTH_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    const token = value.split(' ')[1];
    if (!token) {
      throw new ErrorWithStatus({
        message: AUTH_MESSAGES.ACCESS_TOKEN_IS_INVALID,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    const result = await AuthService.verifyAuthorizationToken(token);
    if (req) {
      req.user = result;
    }
    return true;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: AUTH_MESSAGES.ACCESS_TOKEN_IS_INVALID,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    throw error;
  }
};

const verifyRefreshTokenFromCookie = async ({ value, req }: TVerifyParams) => {
  try {
    if (!value) {
      throw new ErrorWithStatus({
        message: AUTH_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    const result = await AuthService.verifyRefreshToken(value);
    if (req) {
      req.user = result;
    }
    return true;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: AUTH_MESSAGES.REFRESH_TOKEN_IS_INVALID,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    throw error;
  }
};

export const AuthorizationSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => verifyAuthorization({ value, req }),
  },
};

export const refreshTokenCookieSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => verifyRefreshTokenFromCookie({ value, req }),
  },
};
