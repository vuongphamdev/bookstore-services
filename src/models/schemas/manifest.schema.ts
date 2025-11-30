import { EManifestStatus } from '@constants';
import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TManifest = TBaseModel & {
  driver_id: number;
  vehicle_id: number;
  manifest_date: Date;
  status: EManifestStatus;
  notes: string | null;
};

export type TCreateManifestData = Omit<TManifest, TCreateIgnoreColumns>;
export type TUpdateManifestData = Partial<Omit<TManifest, TUpdateIgnoreColumns>>;

export class Manifest extends BaseModel<TManifest> {}
