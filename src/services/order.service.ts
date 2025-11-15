import { db } from '@config';
import { EOrderStatus, TABLE_NAMES } from '@constants';
import {
  Order,
  OrderItem,
  CreateOrderData,
  CreateOrderItemData,
  UpdateOrderData,
  OrderItemWithProduct,
} from '@models/schemas';

class OrderService {
  async getOrdersItems(orderIds: number[]) {
    const items = await db<OrderItem>('order_items as oi')
      .select('oi.*', 'p.name as product_name', 'p.sku as product_sku')
      .join('products as p', 'oi.product_id', 'p.id')
      .whereIn('oi.order_id', orderIds);

    return items.map((row: any) => OrderItemWithProduct.fromRow(row));
  }

  async getOrders(userId: number, status: EOrderStatus[] = []) {
    const orders = (await db<Order>('orders as o')
      .select('o.*', 's.name as shop_name')
      .where({ buyer_id: userId })
      .modify((queryBuilder) => {
        if (status.length > 0) {
          queryBuilder.whereIn('status', status);
        }
      })
      .leftJoin('shops as s', 'orders.shop_id', 's.id')) as (Order & { shop_name: string })[];

    if (orders.length === 0) {
      return [];
    }
    const orderIds = orders.map((order) => order.id);

    const items = await this.getOrdersItems(orderIds);

    // Map items to their respective orders
    const orderMap: { [key: number]: OrderItemWithProduct[] } = {};
    items.forEach((item) => {
      if (!orderMap[item.order_id]) {
        orderMap[item.order_id] = [];
      }
      orderMap[item.order_id].push(item);
    });

    return orders.map((order) => {
      return {
        ...order,
        orderItems: orderMap[order.id] || [],
      };
    });
  }

  async createOrder(orderData: CreateOrderData): Promise<number[]> {
    return await db<Order>(TABLE_NAMES.ORDERS)
      .insert({ ...orderData })
      .returning('id');
  }

  async updateOrder(id: number, orderData: UpdateOrderData): Promise<number> {
    return await db<Order>(TABLE_NAMES.ORDERS).where({ id }).update(orderData);
  }

  async deleteOrder(id: number): Promise<number> {
    return await db<Order>(TABLE_NAMES.ORDERS).where({ id }).del();
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const rows = await db('order_items')
      .join('books', 'order_items.book_id', 'books.id')
      .select('order_items.*', 'books.title as book_title', 'books.author as book_author')
      .where('order_items.order_id', orderId);

    return rows.map((row) => OrderItem.fromRow(row));
  }

  async addOrderItem(orderItemData: CreateOrderItemData): Promise<number[]> {
    return await db('order_items').insert(orderItemData);
  }

  async updateOrderItem(id: number, itemData: Partial<CreateOrderItemData>): Promise<number> {
    return await db('order_items').where({ id }).update(itemData);
  }

  async deleteOrderItem(itemId: number): Promise<number> {
    return await db('order_items').where({ id: itemId }).del();
  }

  async calculateOrderTotal(orderId: number): Promise<number> {
    const result = await db('order_items').sum('price as total').where('order_id', orderId).first();

    return result?.total || 0;
  }
}

export const orderService = new OrderService();
