import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Tags,
  Body,
  Path,
  SuccessResponse,
  Security,
  Request,
  Middlewares,
  Response,
} from 'tsoa';
import { createShopBodyValidator, updateShopBodyValidator } from '../middlewares';
import { shopService } from '../services';
import { Responses } from '../models/responses.model';
import { TCreateShopRequestBody, TUpdateShopRequestBody } from '../models/requests.model';
import { NotFoundError, ForbiddenError, InternalServerError, ErrorWithStatus } from '../models/errors.model';
import { HTTP_STATUS } from '@constants/http';
import { TCreateShopData } from '../models/schemas';
import { EShopStatus } from '../constants';

@Route('shops')
@Tags('Shops')
export class ShopController extends Controller {
  /**
   * Get a single shop by ID
   */
  @Get('{id}')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Shop not found')
  public async getShop(@Path() id: number) {
    const shop = await shopService.getShop(id);
    if (!shop) {
      throw new NotFoundError('Shop not found');
    }
    return Responses.success('Shop retrieved successfully', shop);
  }

  /**
   * Get shops belonging to the authenticated user
   */
  @Get('my-shops')
  @Security('jwt')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  public async getMyShop(@Request() request: any) {
    const user_id = request.user?.user_id;
    const shops = await shopService.getShopsByUserId(user_id);
    return Responses.success('Your shops retrieved successfully', shops);
  }

  /**
   * Create a new shop for the authenticated user
   */
  @Post('/')
  @Security('jwt')
  @Middlewares(createShopBodyValidator)
  @SuccessResponse(HTTP_STATUS.CREATED, 'Created')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  public async createShop(@Body() requestBody: TCreateShopRequestBody, @Request() request: any) {
    const { name, description } = requestBody;
    const user_id = request.user.user_id;

    const shopData: TCreateShopData = {
      name,
      user_id,
      description: description || null,
      status: EShopStatus.INACTIVE,
    };

    const shopId = await shopService.createShop(shopData);
    const newShop = await shopService.getShop(shopId);

    this.setStatus(201);
    return Responses.success('Shop created successfully', newShop);
  }

  /**
   * Update an existing shop's details
   */
  @Put('{id}')
  @Security('jwt')
  @Middlewares(updateShopBodyValidator)
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  @Response<ErrorWithStatus>(HTTP_STATUS.FORBIDDEN, 'Forbidden')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Shop not found')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  public async updateShop(@Path() id: number, @Body() requestBody: TUpdateShopRequestBody, @Request() request: any) {
    const user_id = request.user.user_id;
    const shop_id = id;

    // Verify ownership
    const shop = await shopService.getShop(shop_id);
    if (!shop) {
      throw new NotFoundError('Shop not found');
    }
    if (shop.user_id !== user_id) {
      throw new ForbiddenError('You do not have permission to update this shop');
    }

    const updatedRows = await shopService.updateShop(shop_id, requestBody);
    if (updatedRows === 0) {
      throw new NotFoundError('Shop not found');
    }

    const updatedShop = await shopService.getShop(shop_id);
    return Responses.success('Shop updated successfully', updatedShop);
  }

  /**
   * Delete a shop
   */
  @Delete('{id}')
  @Security('jwt')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
  @Response<ErrorWithStatus>(HTTP_STATUS.FORBIDDEN, 'Forbidden')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Shop not found')
  public async deleteShop(@Path() id: number, @Request() request: any) {
    const user_id = request.user.user_id;
    const shop_id = id;

    // Verify ownership
    const shop = await shopService.getShop(shop_id);
    if (!shop) {
      throw new NotFoundError('Shop not found');
    }

    if (shop.user_id !== user_id) {
      throw new ForbiddenError('You do not have permission to delete this shop');
    }

    const deletedRows = await shopService.deleteShop(shop_id);
    if (deletedRows === 0) {
      throw new InternalServerError('Failed to delete shop');
    }

    return Responses.success('Shop deleted successfully');
  }
}
