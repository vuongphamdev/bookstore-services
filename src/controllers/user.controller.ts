import { Request, Response } from 'express';
import { userService } from '@services';
import {
  InternalServerError,
  NotFoundError,
  Responses,
  TUpdateUserRequestBody,
  TUpdateUserRequestParams,
} from '@models';

/**
 * Get current user
 */
export const me = async (req: Request, res: Response): Promise<Response> => {
  const user = await userService.getUserById(req.user.user_id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return Responses.success(res, 'User data retrieved successfully', {
    user: user,
  });
};

/**
 * Update user information
 */
export const updateUser = async (
  req: Request<TUpdateUserRequestParams, any, TUpdateUserRequestBody>,
  res: Response
): Promise<Response> => {
  const userId = Number(req.params.id);
  const { address, dob, name, phone_number } = req.body;
  const updatedRows = await userService.updateUser(userId, { address, dob, name, phone_number });
  if (updatedRows === 0) {
    throw new NotFoundError('User not found');
  }

  const updatedUser = await userService.getUserById(userId);
  return Responses.success(res, 'User updated successfully', updatedUser);
};
