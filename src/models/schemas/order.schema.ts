import { EOrderStatus } from '@constants';
import { Product } from './product.schema';
import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class Order extends BaseModel {
  id: number;
  shop_id: number;
  buyer_id: number;
  status: EOrderStatus;
  notes: string | null;

  constructor(data: Partial<Order> = {}) {
    super(data);
    this.id = data.id || 0;
    this.shop_id = data.shop_id!;
    this.buyer_id = data.buyer_id || 0;
    this.status = data.status || EOrderStatus.PENDING;
    this.notes = data.notes || null;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): Order {
    return new Order({
      id: row.id,
      buyer_id: parseInt(row.buyer_id || 0),
      shop_id: parseInt(row.shop_id),
      status: row.status,
      notes: row.notes,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    });
  }

  /**
   * Convert instance to database row format
   */
  toRow(): any {
    return {
      id: this.id,
      shop_id: this.shop_id,
      buyer_id: this.buyer_id,
      status: this.status,
      notes: this.notes,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export class OrderItem extends BaseModel {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;

  constructor(data: Partial<OrderItem> = {}) {
    super(data);
    this.id = data.id || 0;
    this.order_id = data.order_id || 0;
    this.product_id = data.product_id || 0;
    this.quantity = data.quantity || 0;
    this.price = data.price || 0;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): OrderItem {
    return new OrderItem({
      id: row.id,
      order_id: parseInt(row.order_id),
      product_id: parseInt(row.product_id),
      quantity: parseInt(row.quantity),
      price: parseFloat(row.price),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    });
  }

  /**
   * Convert instance to database row format
   */
  toRow(): any {
    return {
      id: this.id,
      order_id: this.order_id,
      product_id: this.product_id,
      quantity: this.quantity,
      price: this.price,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export class OrderItemWithProduct extends OrderItem {
  product_name: string;
  product_sku: string;

  constructor(orderItemData: Partial<OrderItemWithProduct> = {}, productData: Partial<Product> = {}) {
    super(orderItemData);
    this.product_name = productData.name || '';
    this.product_sku = productData.sku || '';
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): OrderItemWithProduct {
    return new OrderItemWithProduct(OrderItem.fromRow(row), {
      name: row.name,
      sku: row.sku,
    });
  }
}

export class OrderWithDetails extends Order {
  order_items: OrderItemWithProduct[];
  shop_name: string;

  constructor(order: Order, orderItems: OrderItemWithProduct[], shopName: string) {
    super(order);
    this.order_items = orderItems;
    this.shop_name = shopName;
  }
}

export type CreateOrderData = Omit<Order, TCreateIgnoreColumns>;

export type UpdateOrderData = Partial<Omit<Order, TUpdateIgnoreColumns>>;

export type CreateOrderItemData = Omit<OrderItem, TCreateIgnoreColumns>;

export type UpdateOrderItemData = Partial<Omit<OrderItem, TUpdateIgnoreColumns>>;
