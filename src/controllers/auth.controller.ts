import { Request, Response } from 'express';
import { AuthService, userService } from '@services';
import { ConflictError, InternalServerError, Responses, UnauthorizedError } from '@models';
import { hashPassword } from '@utils/crypto';
import { setCookieRefreshToken } from '@utils/cookie';
import { User } from '@models/schemas';

/**
 * User login
 */
export const login = async (
  req: Request<object, object, { email: string; password: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new InternalServerError('User not found');
    }

    const isPasswordValid = hashPassword(password) === user.password;
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const [accessToken, refreshToken] = await AuthService.signAccessAndRefreshToken({
      user_id: user.id,
      email: user.email,
    });
    setCookieRefreshToken(res, refreshToken);

    return Responses.success(res, 'Login successful', {
      accessToken,
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Login failed');
  }
};

/**
 * Refresh JWT token using HTTP-only cookie
 */
export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const newAccessToken = await AuthService.signAccessToken({
      user_id: user.user_id,
      email: user.email,
    });

    return Responses.success(res, 'Token refreshed successfully', {
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Token refresh failed');
  }
};

/**
 * Logout and clear refresh token cookie
 */
export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken');

    return Responses.success(res, 'Logged out successfully', null);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Logout failed');
  }
};

/**
 * User registration
 */
export const register = async (
  req: Request<object, object, { name: string; email: string; password: string }>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const hashedPassword = hashPassword(password);

    const userIds = await userService.createUser(new User({ name, email, password: hashedPassword }));

    const newUser = await userService.getUserById(userIds[0]);
    if (!newUser) {
      throw new InternalServerError('Failed to retrieve newly created user');
    }

    const [accessToken, refreshToken] = await AuthService.signAccessAndRefreshToken({
      user_id: newUser.id,

      email: newUser.email,
    });

    setCookieRefreshToken(res, refreshToken);

    return Responses.created(res, 'User registered successfully', {
      user: newUser,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Registration failed');
  }
};
