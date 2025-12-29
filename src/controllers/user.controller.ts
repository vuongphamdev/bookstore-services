import {
  Controller,
  Get,
  Put,
  Route,
  Tags,
  Body,
  Path,
  Security,
  Request,
  Middlewares,
  Response,
  SuccessResponse,
} from 'tsoa';
import { updateUserBodyValidator } from '../middlewares';
import { userService } from '../services';
import { Responses } from '../models/responses.model';
import { TUpdateUserRequestBody } from '../models/requests.model';
import { NotFoundError, ErrorWithStatus } from '../models/errors.model';
import { HTTP_STATUS } from '@constants/http';

@Route('users')
@Tags('Users')
@Security('jwt')
@Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
export class UserController extends Controller {
  /**
   * Get current authenticated user's information
   */
  @Get('me')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'User not found')
  public async me(@Request() request: any) {
    const user = await userService.getUserById(request.user.user_id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return Responses.success('User data retrieved successfully', {
      user,
    });
  }

  /**
   * Update user information for a specific user ID
   */
  @Put('{id}')
  @Middlewares(updateUserBodyValidator)
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'User not found')
  public async updateUser(@Path() id: number, @Body() requestBody: TUpdateUserRequestBody) {
    const { address, dob, name, phone_number } = requestBody;
    const updatedRows = await userService.updateUser(id, {
      address,
      dob,
      name,
      phone_number,
    });
    if (updatedRows === 0) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userService.getUserById(id);
    return Responses.success('User updated successfully', updatedUser);
  }
}
