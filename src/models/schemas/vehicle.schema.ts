import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class Vehicle extends BaseModel {
  id: number;
  name: string;
  description: string | null;

  constructor(data: Partial<Vehicle> = {}) {
    super(data);
    this.id = data.id || 0;
    this.name = data.name || '';
    this.description = data.description || null;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): Vehicle {
    return new Vehicle({
      id: row.id,
      name: row.name,
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
      description: this.description,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export type CreateVehicleData = Omit<Vehicle, TCreateIgnoreColumns>;

export type UpdateVehicleData = Partial<Omit<Vehicle, TUpdateIgnoreColumns>>;
