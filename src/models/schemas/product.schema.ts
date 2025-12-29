import { EProductStatus } from '@constants';
import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TProduct = TBaseModel & {
  shop_id: number;
  name: string;
  sku: string;
  category: string;
  description?: string | null;
  price: number;
  stock: number;
  status: EProductStatus;
  metadata?: string | null;
};

export type TCreateProductData = Omit<TProduct, TCreateIgnoreColumns>;
export type TUpdateProductData = Partial<Omit<TProduct, TUpdateIgnoreColumns | 'shop_id'>>;

export class Product extends BaseModel<TProduct> {}

export type TTopSellingProduct = TProduct & {
  total_sales: number;
};
