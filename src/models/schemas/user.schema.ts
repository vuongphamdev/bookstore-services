import { ERole, EUserStatus } from '@constants/enums';
import { BaseModel, TBaseModel, TCreateIgnoreColumns } from './base.schema';

export type TUser = TBaseModel & {
  name: string;
  email: string;
  password: string;
  role: ERole;
  status: EUserStatus;
  dob: Date | null;
  phone_number: string | null;
  address: string | null;
};

export type TCreateUserData = Omit<TUser, TCreateIgnoreColumns>;
export type TUpdateUserData = Partial<Pick<TUser, 'address' | 'dob' | 'name' | 'phone_number'>>;

export class User extends BaseModel<TUser> {}
