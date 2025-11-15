import { EUserRole } from '@constants';
import { BaseModel, TCreateIgnoreColumns, TUpdateIgnoreColumns } from './base.schema';

export class Role extends BaseModel {
  id: number;
  code: EUserRole;
  name: string;
  description: string | null;

  constructor(data: Partial<Role> = {}) {
    super(data);
    this.id = data.id || 0;
    this.code = data.code || EUserRole.USER;
    this.name = data.name || '';
    this.description = data.description || null;
  }

  /**
   * Create instance from database row
   */
  static fromRow(row: any): Role {
    return new Role({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    });
  }
}

export type CreateRoleData = Omit<Role, TCreateIgnoreColumns>;

export type UpdateRoleData = Partial<Omit<Role, TUpdateIgnoreColumns>>;
