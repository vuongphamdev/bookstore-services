import { EUserStatus } from '@constants';
import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TDriver = TBaseModel & {
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
};

export type TCreateDriverData = Omit<TDriver, TCreateIgnoreColumns>;
export type TUpdateDriverData = Partial<Omit<TDriver, TUpdateIgnoreColumns>>;

export class Driver extends BaseModel<TDriver> {}
