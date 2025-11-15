import { Request, Response } from 'express';
import { userService } from '@services';
import { InternalServerError, UnauthorizedError, NotFoundError, Responses } from '@models';
import { User } from '@models/schemas';
import { hashPassword } from '@utils';

/**
 * Get current user
 */
export const me = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    // Get fresh user data from database
    const currentUser = await userService.getUserById(user.id);
    if (!currentUser) {
      throw new NotFoundError('User not found');
    }

    return Responses.success(res, 'User data retrieved successfully', {
      user: currentUser,
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to get user data');
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateData: User = new User({});
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = hashPassword(password);

    const updatedRows = await userService.updateUser(Number(id), updateData);

    if (updatedRows === 0) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userService.getUserById(Number(id));

    return Responses.success(res, 'User updated successfully', updatedUser);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to update user');
  }
};
