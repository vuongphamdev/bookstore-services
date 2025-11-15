import { EUserStatus } from '@constants';
import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class Driver extends BaseModel {
  id: number;
  name: string;
  code: string;
  status: EUserStatus;
  age: number;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  license_number: string;
  vehicle_id: number | null;
  phone_number: string;

  constructor(data: Partial<Driver> = {}) {
    super(data);
    this.id = data.id || 0;
    this.name = data.name || '';
    this.code = data.code || '';
    this.status = data.status || EUserStatus.UNVERIFIED;
    this.age = data.age || 0;
    this.address = data.address || null;
    this.city = data.city || null;
    this.state = data.state || null;
    this.country = data.country || null;
    this.zip = data.zip || null;
    this.license_number = data.license_number || '';
    this.vehicle_id = data.vehicle_id || null;
    this.phone_number = data.phone_number || '';
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): Driver {
    return new Driver({
      id: row.id,
      name: row.name,
      code: row.code,
      status: row.status,
      age: parseInt(row.age),
      address: row.address,
      city: row.city,
      state: row.state,
      country: row.country,
      zip: row.zip,
      license_number: row.license_number,
      vehicle_id: row.vehicle_id ? parseInt(row.vehicle_id) : null,
      phone_number: row.phone_number,
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
      code: this.code,
      status: this.status,
      age: this.age,
      address: this.address,
      city: this.city,
      state: this.state,
      country: this.country,
      zip: this.zip,
      license_number: this.license_number,
      vehicle_id: this.vehicle_id,
      phone_number: this.phone_number,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export type CreateDriverData = Omit<Driver, TCreateIgnoreColumns>;

export type UpdateDriverData = Partial<Omit<Driver, TUpdateIgnoreColumns>>;
