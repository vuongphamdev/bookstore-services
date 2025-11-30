import { EStopStatus, EStopType } from '@constants';
import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TStop = TBaseModel & {
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
};

export type TCreateStopData = Omit<TStop, TCreateIgnoreColumns>;
export type TUpdateStopData = Partial<Omit<TStop, TUpdateIgnoreColumns>>;

export class Stop extends BaseModel<TStop> {}
