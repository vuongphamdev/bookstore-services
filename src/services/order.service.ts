import { db } from '@config';
import { EOrderStatus } from '@constants';
import {
  TCreateOrderData,
  TCreateOrderItemData,
  TUpdateOrderData,
  TOrderWithDetails,
  TOrderItemWithProduct,
  TUpdateOrderItemData,
  TOrder,
  TOrderItem,
} from '@models/schemas';

class OrderService {
  // =========== Orders ===========
  async getOrdersItems(orderIds: number[]): Promise<TOrderItemWithProduct[]> {
    try {
      const items = await db<TOrderItemWithProduct>('order_items as oi')
        .select('oi.*', 'p.name as product_name', 'p.sku as product_sku')
        .join('products as p', 'oi.product_id', 'p.id')
        .whereIn('oi.order_id', orderIds);

      return items;
    } catch (error) {
      console.error('Error when querying or parsing orders items items from database:', error);
      throw error;
    }
  }

  async getOrderById(orderId: number): Promise<TOrderWithDetails | null> {
    const order = await db('orders as o')
      .select('o.*', 's.name as shop_name')
      .join('shops as s', 'o.shop_id', 's.id')
      .where('o.id', orderId)
      .first<Omit<TOrderWithDetails, 'order_items'>>();

    if (!order) {
      return null;
    }

    const orderItems = await this.getOrdersItems([order.id!]);

    return {
      ...order,
      order_items: orderItems,
    };
  }

  async searchOrders(userId: number, status: EOrderStatus[] = []): Promise<TOrderWithDetails[]> {
    const orders = (await db<Omit<TOrderWithDetails, 'order_items'>>('orders as o')
      .select('o.*', 's.name as shop_name')
      .where({ user_id: userId })
      .modify((queryBuilder) => {
        if (status.length > 0) {
          queryBuilder.whereIn('status', status);
        }
      })
      .leftJoin('shops as s', 'o.shop_id', 's.id')) as Omit<TOrderWithDetails, 'order_items'>[];

    const orderIds = orders.map((order) => order.id!);
    const ordersItems = await this.getOrdersItems(orderIds);

    const orderMap: { [key: number]: TOrderItemWithProduct[] } = {};
    ordersItems.forEach((item) => {
      if (!orderMap[item.order_id]) {
        orderMap[item.order_id] = [];
      }
      orderMap[item.order_id].push(item);
    });

    return orders.map((order) => {
      return {
        ...order,
        order_items: orderMap[order.id!] || [],
      };
    });
  }

  async createOrder(createData: TCreateOrderData): Promise<number> {
    const [id] = await db<TOrder>('orders').insert(createData);
    return id;
  }

  async updateOrder(id: number, updateData: TUpdateOrderData): Promise<number> {
    return await db<TOrder>('orders')
      .where({ id })
      .update({ ...updateData, updated_at: db.fn.now() });
  }

  async deleteOrder(id: number): Promise<number> {
    return await db<TOrder>('orders').where({ id }).update({ status: EOrderStatus.CANCELLED, updated_at: db.fn.now() });
  }

  // =========== Order Items ===========

  async addOrderItem(createData: TCreateOrderItemData): Promise<number> {
    const [id] = await db<TOrderItem>('order_items').insert(createData);
    return id;
  }

  async updateOrderItem(id: number, updateData: TUpdateOrderItemData): Promise<number> {
    return await db<TOrderItem>('order_items')
      .where({ id })
      .update({ ...updateData, updated_at: db.fn.now() });
  }

  async deleteOrderItem(itemId: number): Promise<number> {
    return await db<TOrderItem>('order_items').where({ id: itemId }).del();
  }

  async calculateOrderTotal(orderId: number): Promise<number> {
    const row = await db('order_items').where('order_id', orderId).sum('price as total').first();
    return Number(row?.total ?? 0);
  }
}

export const orderService = new OrderService();
