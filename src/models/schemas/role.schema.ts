import { ERole } from '@constants';
import { BaseModel, TBaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export type TRole = TBaseModel & {
  code: ERole;
  name: string;
  description: string | null;
};

export type TCreateRoleData = Omit<TRole, TCreateIgnoreColumns>;
export type TUpdateRoleData = Partial<Omit<TRole, TUpdateIgnoreColumns | 'code'>>;

export class Role extends BaseModel<TRole> {}
