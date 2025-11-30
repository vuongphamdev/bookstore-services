import { db } from '@config';
import { TCreateRoleData, TRole, TUpdateRoleData } from '@models/schemas';

class RoleService {
  async getRoles(): Promise<TRole[]> {
    const rows = await db<TRole>('roles').select('*');
    return rows;
  }

  async getRole(id: number): Promise<TRole | null> {
    const row = await db<TRole>('roles').where({ id }).first();
    return row ?? null;
  }

  async getRoleByName(name: string): Promise<TRole | null> {
    const row = await db<TRole>('roles').where({ name }).first();
    return row ?? null;
  }

  async createRole(createData: TCreateRoleData): Promise<number> {
    const [id] = await db<TRole>('roles').insert(createData);
    return id;
  }

  async updateRole(id: number, updateData: TUpdateRoleData): Promise<number> {
    return await db<TRole>('roles')
      .where({ id })
      .update({ ...updateData, updated_at: db.fn.now() });
  }

  async deleteRole(id: number): Promise<number> {
    return await db<TRole>('roles').where({ id }).del();
  }
}

export const roleService = new RoleService();
