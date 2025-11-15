import { EManifestStatus } from '@constants';
import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class Manifest extends BaseModel {
  id: number;
  driver_id: number;
  vehicle_id: number;
  manifest_date: Date;
  status: EManifestStatus;
  notes: string | null;

  constructor(data: Partial<Manifest> = {}) {
    super(data);
    this.id = data.id || 0;
    this.driver_id = data.driver_id || 0;
    this.vehicle_id = data.vehicle_id || 0;
    this.manifest_date = data.manifest_date || new Date();
    this.status = data.status || EManifestStatus.NEW;
    this.notes = data.notes || null;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): Manifest {
    return new Manifest({
      id: row.id,
      driver_id: parseInt(row.driver_id),
      vehicle_id: parseInt(row.vehicle_id),
      manifest_date: new Date(row.manifest_date),
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
      driver_id: this.driver_id,
      vehicle_id: this.vehicle_id,
      manifest_date: this.manifest_date,
      status: this.status,
      notes: this.notes,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export type CreateManifestData = Omit<Manifest, TCreateIgnoreColumns>;

export type UpdateManifestData = Partial<Omit<Manifest, TUpdateIgnoreColumns>>;
