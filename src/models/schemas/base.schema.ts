/**
 * Base model class with common properties
 * Child classes should implement:
 * - static fromRow(row: any): T - Convert DB row to model instance
 * - toRow(): any - Convert model instance to DB row (for complete data)
 */
export abstract class BaseModel {
  id?: number;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<BaseModel> = {}) {
    this.id = data.id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export type TCreateIgnoreColumns = 'id' | 'created_at' | 'updated_at' | 'toRow';
export type TUpdateIgnoreColumns = 'id' | 'created_at';
