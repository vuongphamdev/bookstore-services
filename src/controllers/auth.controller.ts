import { Request, Response } from 'express';
import { AuthService, userService } from '@services';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  Responses,
  TLoginRequestBody,
  TRegisterRequestBody,
  UnauthorizedError,
} from '@models';
import { hashPassword } from '@utils/crypto';
import { setCookieRefreshToken } from '@utils/cookie';
import { ERole, EUserStatus } from '@constants';

/**
 * User login
 */
export const login = async (req: Request<any, any, TLoginRequestBody>, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isPasswordValid = hashPassword(password) === user.password;
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const [accessToken, refreshToken] = await AuthService.signAccessAndRefreshToken({
    user_id: user.id!,
    email: user.email,
    role: user.role,
  });

  setCookieRefreshToken(res, refreshToken);
  return Responses.success(res, 'Login successful', {
    accessToken,
  });
};

/**
 * Refresh JWT token using HTTP-only cookie
 */
export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError('User not authenticated');
  }
  const newAccessToken = await AuthService.signAccessToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
  });

  return Responses.success(res, 'Token refreshed successfully', {
    accessToken: newAccessToken,
  });
};

/**
 * Logout and clear refresh token cookie
 */
export const logout = async (req: Request, res: Response): Promise<Response> => {
  res.clearCookie('refreshToken');
  return Responses.success(res, 'Logged out successfully', null);
};

/**
 * User registration
 */
export const register = async (req: Request<any, any, TRegisterRequestBody>, res: Response) => {
  const registerData = req.body;
  const existingUser = await userService.getUserByEmail(registerData.email);
  if (existingUser) {
    throw new ConflictError('Email already in use');
  }
  const addedUserId = await userService.createUser({
    ...registerData,
    password: hashPassword(registerData.password),
    role: ERole.USER,
    status: EUserStatus.UNVERIFIED,
  });
  const newUser = await userService.getUserById(addedUserId);
  if (!newUser) {
    throw new InternalServerError('Failed to retrieve newly created user');
  }
  const [accessToken, refreshToken] = await AuthService.signAccessAndRefreshToken({
    user_id: addedUserId,
    email: newUser.email,
    role: newUser.role,
  });

  setCookieRefreshToken(res, refreshToken);
  return Responses.created(res, 'User registered successfully', {
    user: newUser,
    accessToken,
  });
};
