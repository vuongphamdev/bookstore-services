import { EShopStatus } from '@constants';
import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class Shop extends BaseModel {
  id: number;
  name: string;
  user_id: number; // Owner of the shop
  status: EShopStatus;
  description: string | null;

  constructor(data: Partial<Shop> = {}) {
    super(data);
    this.id = data.id || 0;
    this.name = data.name || '';
    this.user_id = data.user_id || 0;
    this.status = data.status || EShopStatus.INACTIVE;
    this.description = data.description || null;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): Shop {
    return new Shop({
      id: parseInt(row.id),
      name: row.name,
      user_id: parseInt(row.user_id),
      status: row.status,
      description: row.description,
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
      name: this.name,
      user_id: this.user_id,
      status: this.status,
      description: this.description,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export type CreateShopData = Omit<Shop, TCreateIgnoreColumns>;

export type UpdateShopData = Partial<Omit<Shop, TUpdateIgnoreColumns>>;
