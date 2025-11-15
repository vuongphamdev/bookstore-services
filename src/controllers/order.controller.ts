import { Request, Response } from 'express';
import { productService, orderService } from '@services';
import { CreateOrderData, CreateOrderItemData, UpdateOrderData } from '@models/schemas';
import { Responses, InternalServerError, NotFoundError, EntityError } from '@models';
import { GENERAL_MESSAGE } from '@constants';
import { EOrderStatus } from '@constants/enums';

export const getOrders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id } = req.user;
    const orders = await orderService.getOrders(user_id);
    return Responses.success(res, 'Orders retrieved successfully', orders);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch orders');
  }
};

export const getOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const order = await orderService.getOrders(Number(id));

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return Responses.success(res, 'Order retrieved successfully', order);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch order');
  }
};

export const createOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      user_id,
      buyer_id,

      shop_id,
      items,
      status = EOrderStatus.PENDING,
      notes,
    } = req.body;

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
    const orderData: CreateOrderData = {
      buyer_id: buyer_id || user_id,
      shop_id: shop_id || null,
      status,
      notes: notes || null,
    };

    const [orderId] = await orderService.createOrder(orderData);

    // Add order items and update product stock
    for (const item of validatedItems) {
      const orderItemData: CreateOrderItemData = {
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      };

      await orderService.addOrderItem(orderItemData);
      await productService.decrementProductStock(item.product_id, item.quantity);
    }

    // Get the created order with items
    const newOrder = await orderService.getOrders(orderId);

    return Responses.created(res, 'Order created successfully', newOrder);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to create order');
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData: UpdateOrderData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedRows = await orderService.updateOrder(Number(id), updateData);

    if (updatedRows === 0) {
      throw new NotFoundError('Order not found');
    }

    const updatedOrder = await orderService.getOrders(Number(id));

    return Responses.success(res, 'Order updated successfully', updatedOrder);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to update order');
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // Get order items before deleting to restore stock
    const orderItems = await orderService.getOrderItems(Number(id));

    // Restore product stock
    for (const item of orderItems) {
      await productService.updateProductStock(item.product_id, item.quantity);
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

export const getOrderItems = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { orderId } = req.params;

    const items = await orderService.getOrderItems(Number(orderId));

    return Responses.success(res, 'Order items retrieved successfully', items);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch order items');
  }
};

export const addOrderItem = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { orderId } = req.params;
    const { product_id, quantity } = req.body;

    // Get product details to calculate price
    const product = await productService.getProductById(product_id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const price = product.price * quantity;

    const orderItemData: CreateOrderItemData = {
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

export const removeOrderItem = async (req: Request, res: Response): Promise<Response> => {
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
