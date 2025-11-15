import { EJobStatus } from '@constants';
import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class Job extends BaseModel {
  id: number;
  order_id: number;
  manifest_id: number | null;
  status: EJobStatus;
  notes: string | null;

  constructor(data: Partial<Job> = {}) {
    super(data);
    this.id = data.id || 0;
    this.order_id = data.order_id || 0;
    this.manifest_id = data.manifest_id || null;
    this.status = data.status || EJobStatus.PENDING;
    this.notes = data.notes || null;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): Job {
    return new Job({
      id: row.id,
      order_id: parseInt(row.order_id),
      manifest_id: row.manifest_id ? parseInt(row.manifest_id) : null,
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
      order_id: this.order_id,
      manifest_id: this.manifest_id,
      status: this.status,
      notes: this.notes,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export type CreateJobData = Omit<Job, TCreateIgnoreColumns>;

export type UpdateJobData = Partial<Omit<Job, TUpdateIgnoreColumns>>;
