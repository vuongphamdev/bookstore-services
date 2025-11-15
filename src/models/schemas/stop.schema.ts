import { EStopStatus, EStopType } from '@constants';
import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class Stop extends BaseModel {
  id: number;
  order_id: number;
  type: EStopType;
  status: EStopStatus;
  sequence: number;
  manifest_sequence: number;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  postal_code: string | null;
  latitude: string | null;
  longitude: string | null;
  scheduled_time: Date | null;
  arrival_time: Date | null;
  departure_time: Date | null;
  estimated_time: Date | null;
  completed_at: Date | null;
  notes: string | null;

  constructor(data: Partial<Stop> = {}) {
    super(data);
    this.id = data.id || 0;
    this.order_id = data.order_id || 0;
    this.type = data.type || EStopType.DROPOFF;
    this.status = data.status || EStopStatus.PENDING;
    this.sequence = data.sequence || 0;
    this.manifest_sequence = data.manifest_sequence || 0;
    this.address = data.address || null;
    this.city = data.city || null;
    this.state = data.state || null;
    this.country = data.country || null;
    this.zip = data.zip || null;
    this.postal_code = data.postal_code || null;
    this.latitude = data.latitude || null;
    this.longitude = data.longitude || null;
    this.scheduled_time = data.scheduled_time || null;
    this.arrival_time = data.arrival_time || null;
    this.departure_time = data.departure_time || null;
    this.estimated_time = data.estimated_time || null;
    this.completed_at = data.completed_at || null;
    this.notes = data.notes || null;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): Stop {
    return new Stop({
      id: row.id,
      order_id: parseInt(row.order_id),
      type: row.type,
      status: row.status,
      sequence: parseInt(row.sequence),
      manifest_sequence: parseInt(row.manifest_sequence),
      address: row.address,
      city: row.city,
      state: row.state,
      country: row.country,
      zip: row.zip,
      postal_code: row.postal_code,
      latitude: row.latitude,
      longitude: row.longitude,
      scheduled_time: row.scheduled_time ? new Date(row.scheduled_time) : null,
      arrival_time: row.arrival_time ? new Date(row.arrival_time) : null,
      departure_time: row.departure_time ? new Date(row.departure_time) : null,
      estimated_time: row.estimated_time ? new Date(row.estimated_time) : null,
      completed_at: row.completed_at ? new Date(row.completed_at) : null,
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
      order_id: this.order_id,
      type: this.type,
      status: this.status,
      sequence: this.sequence,
      manifest_sequence: this.manifest_sequence,
      address: this.address,
      city: this.city,
      state: this.state,
      country: this.country,
      zip: this.zip,
      postal_code: this.postal_code,
      latitude: this.latitude,
      longitude: this.longitude,
      scheduled_time: this.scheduled_time,
      arrival_time: this.arrival_time,
      departure_time: this.departure_time,
      estimated_time: this.estimated_time,
      completed_at: this.completed_at,
      notes: this.notes,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export type CreateStopData = Omit<Stop, TCreateIgnoreColumns>;

export type UpdateStopData = Partial<Omit<Stop, TUpdateIgnoreColumns>>;
