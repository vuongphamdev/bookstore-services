import { ENV } from '@config';
import { Response } from 'express';

export const setCookieRefreshToken = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production', // Only use HTTPS in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/auth/refresh-token', // Only send cookie to refresh endpoint
  });
};
