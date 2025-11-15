import { EProductStatus } from '@constants';
import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class Product extends BaseModel {
  id?: number;
  shop_id: number;
  name: string;
  sku: string;
  category: string;
  description: string | null;
  price: number;
  stock: number;
  status: EProductStatus;
  metadata: string | null;

  constructor(data: Partial<Product>) {
    super(data);
    this.id = data.id;
    this.shop_id = data.shop_id!;
    this.name = data.name!;
    this.sku = data.sku!;
    this.category = data.category!;
    this.description = data.description || null;
    this.price = data.price!;
    this.stock = data.stock || 0;
    this.status = data.status || EProductStatus.AVAILABLE;
    this.metadata = data.metadata || null;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): Product {
    return new Product({
      id: row.id,
      shop_id: parseInt(row.shop_id),
      name: row.name,
      sku: row.sku,
      category: row.category,
      description: row.description,
      price: parseFloat(row.price),
      stock: parseInt(row.stock),
      status: row.status,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      created_at: row.created_at ? new Date(row.created_at) : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at) : undefined,
    });
  }

  /**
   * Convert instance to database row format
   */
  toRow(): any {
    return {
      id: this.id,
      shop_id: this.shop_id,
      name: this.name,
      sku: this.sku,
      category: this.category,
      description: this.description,
      price: this.price,
      stock: this.stock,
      status: this.status,
      metadata: this.metadata,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export type CreateProductData = Omit<Product, TCreateIgnoreColumns>;

export type UpdateProductData = Partial<Omit<Product, TUpdateIgnoreColumns>>;
