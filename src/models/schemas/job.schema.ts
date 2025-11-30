import { EJobStatus } from '@constants';
import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TJob = TBaseModel & {
  order_id: number;
  manifest_id: number | null;
  status: EJobStatus;
  notes: string | null;
};
export type TCreateJobData = Omit<TJob, TCreateIgnoreColumns>;
export type TUpdateJobData = Partial<Omit<TJob, TUpdateIgnoreColumns>>;

export class Job extends BaseModel<TJob> {}
