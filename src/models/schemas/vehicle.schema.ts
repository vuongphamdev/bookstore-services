import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TVehicle = TBaseModel & {
  name: string;
  description: string | null;
};

export type TCreateVehicleData = Omit<TVehicle, TCreateIgnoreColumns>;
export type TUpdateVehicleData = Partial<Omit<TVehicle, TUpdateIgnoreColumns>>;

export class Vehicle extends BaseModel<TVehicle> {}
