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
  Query,
  Security,
  Request,
  Middlewares,
  SuccessResponse,
  Response,
} from 'tsoa';
import { createOrderBodyValidator, updateOrderBodyValidator, addOrderItemBodyValidator } from '../middlewares';
import { productService, orderService } from '../services';
import { Responses } from '../models/responses.model';
import { TCreateOrderRequestBody, TUpdateOrderRequestBody, TAddOrderItemRequestBody } from '../models/requests.model';
import { NotFoundError, EntityError, ErrorWithStatus } from '../models/errors.model';
import { TCreateOrderData, TCreateOrderItemData, TUpdateOrderData } from '../models/schemas';
import { GENERAL_MESSAGE, EOrderStatus } from '../constants';
import { HTTP_STATUS } from '@constants/http';

@Route('orders')
@Tags('Orders')
@Security('jwt')
@Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
export class OrderController extends Controller {
  /**
   * Search for orders with optional status filter
   */
  @Get('/')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  public async searchOrders(@Request() request: any, @Query() status?: string) {
    const { user_id } = request.user;
    const statuses = (status ?? '').split(',').filter(Boolean) as EOrderStatus[];
    const orders = await orderService.searchOrders(user_id, statuses);
    return Responses.success('Orders retrieved successfully', orders);
  }

  /**
   * Get a single order by ID
   */
  @Get('{id}')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Not found')
  public async getOrder(@Path() id: number) {
    const order = await orderService.getOrderById(id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return Responses.success('Order retrieved successfully', order);
  }

  /**
   * Create a new order with items
   */
  @Post('/')
  @Middlewares(createOrderBodyValidator)
  @SuccessResponse('201', 'Created')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Not found')
  public async createOrder(@Body() requestBody: TCreateOrderRequestBody, @Request() request: any) {
    const user_id = request.user.user_id;
    const { shop_id, items, notes } = requestBody;

    const validatedItems = [];
    const insufficientStockErrors: string[] = [];

    for (const item of items) {
      const { product_id, quantity } = item;
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

    const orderData: TCreateOrderData = {
      user_id: user_id,
      shop_id: shop_id!,
      status: EOrderStatus.PENDING,
      notes: notes || null,
    };

    const orderId = await orderService.createOrder(orderData);

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

    const newOrder = await orderService.getOrderById(orderId);

    this.setStatus(201);
    return Responses.success('Order created successfully', newOrder);
  }

  /**
   * Update an order's information
   */
  @Put('{id}')
  @Middlewares(updateOrderBodyValidator)
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Not found')
  public async updateOrder(@Path() id: number, @Body() requestBody: TUpdateOrderRequestBody) {
    const { notes } = requestBody;

    const updateData: TUpdateOrderData = {};
    if (notes !== undefined) updateData.notes = notes;

    const updatedRows = await orderService.updateOrder(id, updateData);

    if (updatedRows === 0) {
      throw new NotFoundError('Order not found');
    }

    const updatedOrder = await orderService.getOrderById(id);

    return Responses.success('Order updated successfully', updatedOrder);
  }

  /**
   * Delete an order and restore product stock
   */
  @Delete('{id}')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Not found')
  public async deleteOrder(@Path() id: number) {
    const orderItems = await orderService.getOrdersItems([id]);

    for (const item of orderItems) {
      await productService.incrementProductStock(item.product_id, item.quantity);
    }
    const deletedRows = await orderService.deleteOrder(id);

    if (deletedRows === 0) {
      throw new NotFoundError('Order not found');
    }

    return Responses.success('Order deleted successfully');
  }

  /**
   * Get items for a specific order
   */
  @Get('{orderId}/items')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  public async getOrderItems(@Path() orderId: number) {
    const orderItems = await orderService.getOrdersItems([orderId]);

    return Responses.success('Order items retrieved successfully', orderItems);
  }

  /**
   * Add a new item to an existing order
   */
  @Post('{orderId}/items')
  @Middlewares(addOrderItemBodyValidator)
  @SuccessResponse('201', 'Created')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Not found')
  public async addOrderItem(@Path() orderId: number, @Body() requestBody: TAddOrderItemRequestBody) {
    const { product_id, quantity } = requestBody;

    const product = await productService.getProductById(product_id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const price = product.price * quantity;

    const orderItemData: TCreateOrderItemData = {
      order_id: orderId,
      product_id,
      quantity,
      price,
    };

    await orderService.addOrderItem(orderItemData);
    this.setStatus(201);
    return Responses.success('Order item added successfully');
  }

  /**
   * Remove an item from an order
   */
  @Delete('items/{itemId}')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Order item not found')
  public async removeOrderItem(@Path() itemId: number) {
    const deletedRows = await orderService.deleteOrderItem(itemId);

    if (deletedRows === 0) {
      throw new NotFoundError('Order item not found');
    }

    return Responses.success('Order item removed successfully');
  }
}
