import { Request, Response } from 'express';
import { productService, orderService } from '@services';
import { TCreateOrderData, TCreateOrderItemData, TUpdateOrderData } from '@models/schemas';
import {
  Responses,
  InternalServerError,
  NotFoundError,
  EntityError,
  TGetOrderRequestParams,
  TCreateOrderRequestBody,
  TUpdateOrderRequestParams,
  TUpdateOrderRequestBody,
  TDeleteOrderRequestParams,
  TGetOrderItemsRequestParams,
  TAddOrderItemRequestParams,
  TAddOrderItemRequestBody,
  TRemoveOrderItemRequestParams,
} from '@models';
import { GENERAL_MESSAGE } from '@constants';
import { EOrderStatus } from '@constants/enums';

export const searchOrders = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.user;
    const orders = await orderService.searchOrders(user_id);
    return Responses.success(res, 'Orders retrieved successfully', orders);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch orders');
  }
};

export const getOrder = async (req: Request<TGetOrderRequestParams>, res: Response) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(Number(id));

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return Responses.success(res, 'Order retrieved successfully', order);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch order');
  }
};

export const createOrder = async (
  req: Request<any, any, TCreateOrderRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { user_id, buyer_id, shop_id, items, status = EOrderStatus.PENDING, notes } = req.body;

    // Validate all items for stock before proceeding
    const validatedItems = [];
    const insufficientStockErrors: string[] = [];

    for (const item of items) {
      const { product_id, quantity } = item;

      // Check if product exists and has enough stock
      const product = await productService.getProductById(product_id);
      if (!product) {
        throw new NotFoundError(`Product with ID ${product_id} not found`);
      }

      if (product.stock < quantity) {
        insufficientStockErrors.push(
          `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${quantity}`
        );
      } else {
        const itemTotal = product.price * quantity;

        validatedItems.push({
          product_id,
          quantity,
          price: itemTotal,
          product,
        });
      }
    }

    if (insufficientStockErrors.length > 0) {
      throw new EntityError({
        message: GENERAL_MESSAGE.INSUSFFICIENT_STOCK,
        errors: {
          stock: {
            msg: insufficientStockErrors.join('; '),
          },
        },
      });
    }

    // Create order
    const orderData: TCreateOrderData = {
      buyer_id: (buyer_id || user_id)!,
      shop_id: shop_id!,
      status,
      notes: notes || null,
    };

    const orderId = await orderService.createOrder(orderData);

    // Add order items and update product stock
    for (const item of validatedItems) {
      const orderItemData: TCreateOrderItemData = {
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      };

      await orderService.addOrderItem(orderItemData);
      await productService.decrementProductStock(item.product_id, item.quantity);
    }

    // Get the created order with items
    const newOrder = await orderService.searchOrders(orderId);

    return Responses.created(res, 'Order created successfully', newOrder);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to create order');
  }
};

export const updateOrder = async (
  req: Request<TUpdateOrderRequestParams, any, TUpdateOrderRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData: TUpdateOrderData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedRows = await orderService.updateOrder(Number(id), updateData);

    if (updatedRows === 0) {
      throw new NotFoundError('Order not found');
    }

    const updatedOrder = await orderService.searchOrders(Number(id));

    return Responses.success(res, 'Order updated successfully', updatedOrder);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to update order');
  }
};

export const deleteOrder = async (req: Request<TDeleteOrderRequestParams>, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const orderItems = await orderService.getOrdersItems([Number(id)]);

    for (const item of orderItems) {
      await productService.incrementProductStock(item.product_id, item.quantity);
    }
    const deletedRows = await orderService.deleteOrder(Number(id));

    if (deletedRows === 0) {
      throw new NotFoundError('Order not found');
    }

    return Responses.success(res, 'Order deleted successfully');
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to delete order');
  }
};

export const getOrderItems = async (req: Request<TGetOrderItemsRequestParams>, res: Response): Promise<Response> => {
  try {
    const { orderId } = req.params;
    const orderItems = await orderService.getOrdersItems([Number(orderId)]);

    return Responses.success(res, 'Order items retrieved successfully', orderItems);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch order items');
  }
};

export const addOrderItem = async (
  req: Request<TAddOrderItemRequestParams, any, TAddOrderItemRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { orderId } = req.params;
    const { product_id, quantity } = req.body;

    // Get product details to calculate price
    const product = await productService.getProductById(product_id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const price = product.price * quantity;

    const orderItemData: TCreateOrderItemData = {
      order_id: Number(orderId),
      product_id,
      quantity,
      price,
    };

    await orderService.addOrderItem(orderItemData);
    return Responses.created(res, 'Order item added successfully');
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to add order item');
  }
};

export const removeOrderItem = async (
  req: Request<TRemoveOrderItemRequestParams>,
  res: Response
): Promise<Response> => {
  try {
    const { itemId } = req.params;

    const deletedRows = await orderService.deleteOrderItem(Number(itemId));

    if (deletedRows === 0) {
      throw new NotFoundError('Order item not found');
    }

    return Responses.success(res, 'Order item removed successfully');
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to remove order item');
  }
};
