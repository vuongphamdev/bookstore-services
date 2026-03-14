import * as express from 'express';
import { HTTP_STATUS } from '@constants/http';
import { ErrorWithStatus } from '@models';
import { AuthService } from '@services';
import { Request } from 'express-validator/lib/base';
import { JsonWebTokenError } from 'jsonwebtoken';

type TVerifyParams = { token: string | undefined; req?: Request };

export const verifyAuthorization = async ({ token, req }: TVerifyParams) => {
  try {
    if (!token) {
      throw new ErrorWithStatus({
        message: 'Access token is required',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    const result = await AuthService.verifyAuthorizationToken(token);
    return result;
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

export const verifyRefreshTokenFromCookie = async ({ token: value, req }: TVerifyParams) => {
  try {
    if (!value) {
      throw new ErrorWithStatus({
        message: 'Refresh token is required',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    const result = await AuthService.verifyRefreshToken(value);
    return result;
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
    return verifyAuthorization({ token: token, req: request });
  }
  if (securityName === 'refreshToken') {
    const token = request.cookies['refreshToken'];
    return verifyRefreshTokenFromCookie({ token: token, req: request });
  }
}
