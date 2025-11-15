import { EUserRole, EUserStatus } from '@constants/enums';
import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class User extends BaseModel {
  id: number;
  name: string;
  email: string;
  password: string;
  role: EUserRole;
  status: EUserStatus;
  dob: Date | null;
  phone_number: string | null;
  address: string | null;

  constructor(data: Partial<User>) {
    super(data);
    this.id = data.id || 0;
    this.name = data.name || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.role = data.role || EUserRole.USER;
    this.status = data.status || EUserStatus.UNVERIFIED;
    this.dob = data.dob || null;
    this.phone_number = data.phone_number || null;
    this.address = data.address || null;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): User {
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      role: row.role,
      status: row.status,
      dob: row.dob ? new Date(row.dob) : null,
      phone_number: row.phone_number,
      address: row.address,
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
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      status: this.status,
      dob: this.dob,
      phone_number: this.phone_number,
      address: this.address,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export type CreateUserData = Omit<User, TCreateIgnoreColumns>;

export type UpdateUserData = Partial<Omit<User, TUpdateIgnoreColumns>>;
