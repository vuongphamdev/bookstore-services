import * as express from 'express';
import { HTTP_STATUS } from '@constants/http';
import { ErrorWithStatus } from '@models';
import { AuthService } from '@services';
import { Request } from 'express-validator/lib/base';
import { JsonWebTokenError } from 'jsonwebtoken';

type TVerifyParams = { value: string | undefined; req?: Request };

export const verifyAuthorization = async ({ value, req }: TVerifyParams) => {
  try {
    if (!value) {
      throw new ErrorWithStatus({
        message: 'Access token is required',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    const token = value.split(' ')[1];
    if (!token) {
      throw new ErrorWithStatus({
        message: 'Access token is invalid',
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
        message: 'Access token is invalid',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    throw error;
  }
};

export const verifyRefreshTokenFromCookie = async ({ value, req }: TVerifyParams) => {
  try {
    if (!value) {
      throw new ErrorWithStatus({
        message: 'Refresh token is required',
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
        message: 'Refresh token is invalid',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    throw error;
  }
};

export async function expressAuthentication(request: express.Request, securityName: string, _scopes?: string[]) {
  if (securityName === 'jwt') {
    const token = request.headers['authorization']?.split(' ')[1];
    return verifyAuthorization({ value: token, req: request });
  }
  if (securityName === 'refreshToken') {
    const token = request.cookies['refreshToken'];
    return verifyRefreshTokenFromCookie({ value: token, req: request });
  }
}
