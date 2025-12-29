import { Controller, Post, Body, Route, Tags, SuccessResponse, Request, Middlewares, Security, Response } from 'tsoa';
import { loginValidator, registerValidator } from '../middlewares';
import { AuthService, userService } from '../services';
import { Responses } from '../models/responses.model';
import { TLoginRequestBody, TRegisterRequestBody } from '../models/requests.model';
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  InternalServerError,
  ErrorWithStatus,
} from '../models/errors.model';
import { hashPassword } from '../utils/crypto';
import { setCookieRefreshToken } from '../utils/cookie';
import { ERole, EUserStatus } from '../constants';
import { TUserResponse } from '../models/schemas';
import { HTTP_STATUS } from '@constants/http';
import { Request as ExpressRequest } from 'express';

export interface TRegisterResponseData {
  user: TUserResponse;
  accessToken: string;
}

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
  /**
   * User login
   */
  @Post('login')
  @Middlewares(loginValidator)
  @SuccessResponse(HTTP_STATUS.OK, 'Login successful')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'User not found')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials')
  public async login(@Body() requestBody: TLoginRequestBody, @Request() request: ExpressRequest) {
    const { email, password } = requestBody;

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

    const res = (request as any).res;
    if (res) {
      setCookieRefreshToken(res, refreshToken);
    }

    return Responses.success('Login successful', {
      accessToken,
    });
  }

  /**
   * Refresh JWT token using HTTP-only cookie
   */
  @Post('refresh-token')
  @Security('refreshToken')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated')
  public async refreshToken(@Request() request: ExpressRequest) {
    const user = request.user;
    if (!user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const newAccessToken = await AuthService.signAccessToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    });

    return Responses.success('Token refreshed successfully', {
      accessToken: newAccessToken,
    });
  }

  /**
   * Logout and clear refresh token cookie
   */
  @Post('logout')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  public async logout(@Request() request: ExpressRequest) {
    const res = request.res;
    if (res) {
      res.clearCookie('refreshToken');
    }
    return Responses.success('Logged out successfully');
  }

  /**
   * User registration
   */
  @Post('register')
  @Middlewares(registerValidator)
  @SuccessResponse('201', 'Created')
  @Response<ErrorWithStatus>(HTTP_STATUS.CONFLICT, 'Conflict')
  public async register(@Body() requestBody: TRegisterRequestBody, @Request() request: ExpressRequest) {
    const existingUser = await userService.getUserByEmail(requestBody.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const addedUserId = await userService.createUser({
      ...requestBody,
      password: hashPassword(requestBody.password),
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

    const res = (request as any).res;
    if (res) {
      setCookieRefreshToken(res, refreshToken);
    }

    this.setStatus(201);
    return Responses.success('User registered successfully', {
      user: newUser,
      accessToken,
    });
  }
}
