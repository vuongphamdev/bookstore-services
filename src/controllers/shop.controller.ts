import { Request, Response } from 'express';
import { shopService } from '@services';
import { Responses, InternalServerError, NotFoundError, ForbiddenError } from '@models';
import { CreateShopData, UpdateShopData } from '@models/schemas';
import { EShopStatus } from '@constants';

/**
 * Get all shops
 */
export const getShops = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shops = await shopService.getShops();
    return Responses.success(res, 'Shops retrieved successfully', shops);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch shops');
  }
};

/**
 * Get shops by seller (requires authentication)
 */
export const getMyShops = async (req: Request, res: Response): Promise<Response> => {
  try {
    const seller_id = req.user?.id;

    if (!seller_id) {
      throw new ForbiddenError('User not authenticated');
    }

    const shops = await shopService.getShopsBySeller(seller_id);
    return Responses.success(res, 'Your shops retrieved successfully', shops);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch your shops');
  }
};

/**
 * Get single shop by ID
 */
export const getShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const shop = await shopService.getShop(Number(id));

    if (!shop) {
      throw new NotFoundError('Shop not found');
    }

    return Responses.success(res, 'Shop retrieved successfully', shop);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch shop');
  }
};

/**
 * Create a new shop (seller only)
 */
export const createShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, description } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      throw new ForbiddenError('User not authenticated');
    }

    const shopData: CreateShopData = {
      name,
      user_id,
      description: description || null,
      status: EShopStatus.INACTIVE,
    };

    const shopId = await shopService.createShop(shopData);

    // Get the created shop
    const newShop = await shopService.getShop(shopId);

    return Responses.created(res, 'Shop created successfully', newShop);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to create shop');
  }
};

/**
 * Update shop (owner only)
 */
export const updateShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const seller_id = req.user?.id;

    // Verify ownership
    const shop = await shopService.getShop(Number(id));
    if (!shop) {
      throw new NotFoundError('Shop not found');
    }

    if (shop.user_id !== seller_id) {
      throw new ForbiddenError('You do not have permission to update this shop');
    }

    const updateData: UpdateShopData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const updatedRows = await shopService.updateShop(Number(id), updateData);

    if (updatedRows === 0) {
      throw new NotFoundError('Shop not found');
    }

    const updatedShop = await shopService.getShop(Number(id));

    return Responses.success(res, 'Shop updated successfully', updatedShop);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to update shop');
  }
};

/**
 * Delete shop (owner only)
 */
export const deleteShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const seller_id = req.user?.id;

    // Verify ownership
    const shop = await shopService.getShop(Number(id));
    if (!shop) {
      throw new NotFoundError('Shop not found');
    }

    if (shop.user_id !== seller_id) {
      throw new ForbiddenError('You do not have permission to delete this shop');
    }

    const deletedRows = await shopService.deleteShop(Number(id));

    if (deletedRows === 0) {
      throw new NotFoundError('Shop not found');
    }

    return Responses.success(res, 'Shop deleted successfully');
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to delete shop');
  }
};
