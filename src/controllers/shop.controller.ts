import { Request, Response } from 'express';
import { shopService } from '@services';
import {
  Responses,
  InternalServerError,
  NotFoundError,
  ForbiddenError,
  TGetShopRequestParams,
  TCreateShopRequestBody,
  TUpdateShopRequestParams,
  TUpdateShopRequestBody,
  TDeleteShopRequestParams,
} from '@models';
import { TCreateShopData, TUpdateShopData } from '@models/schemas';
import { EShopStatus } from '@constants';

export const getShop = async (req: Request<TGetShopRequestParams>, res: Response): Promise<Response> => {
  const shop_id = Number(req.params.id);
  const shop = await shopService.getShop(shop_id);
  if (!shop) {
    throw new NotFoundError('Shop not found');
  }
  return Responses.success(res, 'Shop retrieved successfully', shop);
};

export const getMyShop = async (req: Request, res: Response): Promise<Response> => {
  const user_id = req.user?.user_id;
  const shops = await shopService.getShopsByUserId(user_id);
  return Responses.success(res, 'Your shops retrieved successfully', shops);
};

export const createShop = async (req: Request<any, any, TCreateShopRequestBody>, res: Response): Promise<Response> => {
  const { name, description } = req.body;
  const user_id = req.user.user_id;

  const shopData: TCreateShopData = {
    name,
    user_id,
    description: description || null,
    status: EShopStatus.INACTIVE,
  };

  const shopId = await shopService.createShop(shopData);
  const newShop = await shopService.getShop(shopId);

  return Responses.created(res, 'Shop created successfully', newShop);
};

export const updateShop = async (
  req: Request<TUpdateShopRequestParams, any, TUpdateShopRequestBody>,
  res: Response
): Promise<Response> => {
  const user_id = req.user.user_id;
  const shop_id = Number(req.params.id);
  const updateData = req.body;

  // Verify ownership
  const shop = await shopService.getShopsByUserId(Number(user_id));
  if (!shop) {
    throw new NotFoundError('Shop not found');
  }
  if (shop.user_id !== user_id) {
    throw new ForbiddenError('You do not have permission to update this shop');
  }

  const updatedRows = await shopService.updateShop(shop_id, updateData);
  if (updatedRows === 0) {
    throw new NotFoundError('Shop not found');
  }

  const updatedShop = await shopService.getShop(shop_id);
  return Responses.success(res, 'Shop updated successfully', updatedShop);
};

export const deleteShop = async (req: Request<TDeleteShopRequestParams>, res: Response): Promise<Response> => {
  const user_id = req.user.user_id;
  const shop_id = Number(req.params.id);

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

  return Responses.success(res, 'Shop deleted successfully');
};
