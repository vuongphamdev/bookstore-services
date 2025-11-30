import { EOrderStatus } from '@constants';
import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TOrder = TBaseModel & {
  shop_id: number;
  buyer_id: number;
  status: EOrderStatus;
  notes: string | null;
};

export type TOrderItem = TBaseModel & {
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
};

export type TOrderItemWithProduct = TOrderItem & {
  product_name: string;
  product_sku: string;
};

export type TOrderWithDetails = TOrder & {
  order_items: TOrderItemWithProduct[];
  shop_name: string;
};

export type TCreateOrderData = Omit<TOrder, TCreateIgnoreColumns>;
export type TUpdateOrderData = Partial<Omit<TOrder, TUpdateIgnoreColumns | 'shop_id' | 'buyer_id'>>;
export type TCreateOrderItemData = Omit<TOrderItem, TCreateIgnoreColumns>;
export type TUpdateOrderItemData = Partial<
  Omit<TOrderItem, TUpdateIgnoreColumns | 'order_id' | 'product_id' | 'price'>
>;

export class Order extends BaseModel<TOrder> {}

export class OrderItem extends BaseModel<TOrderItem> {}

export class OrderItemWithProduct extends BaseModel<TOrderItemWithProduct> {}

export class OrderWithDetails extends Order {}
