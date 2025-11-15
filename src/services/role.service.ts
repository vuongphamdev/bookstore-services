import { db } from '@config';
import { Role, CreateRoleData, UpdateRoleData } from '@models/schemas';

class RoleService {
  async getRoles(): Promise<Role[]> {
    const rows = await db<Role>('roles').select('*');
    return rows.map((row) => Role.fromRow(row));
  }

  async getRole(id: number): Promise<Role | null> {
    const row = await db<Role>('roles').where({ id }).first();
    return row ? Role.fromRow(row) : null;
  }

  async getRoleByName(name: string): Promise<Role | null> {
    const row = await db<Role>('roles').where({ name }).first();
    return row ? Role.fromRow(row) : null;
  }

  async createRole(roleData: CreateRoleData): Promise<number[]> {
    return await db<Role>('roles').insert(roleData);
  }

  async updateRole(id: number, roleData: UpdateRoleData): Promise<number> {
    return await db<Role>('roles').where({ id }).update(roleData);
  }

  async deleteRole(id: number): Promise<number> {
    return await db<Role>('roles').where({ id }).del();
  }

  async getUsersWithRole(roleId: number): Promise<any[]> {
    return await db('user_roles')
      .join('users', 'user_roles.user_id', 'users.id')
      .select('users.id', 'users.name', 'users.email', 'user_roles.created_at as assigned_at')
      .where('user_roles.role_id', roleId);
  }

  async getRolesForUser(userId: number): Promise<Role[]> {
    const rows = await db('user_roles')
      .join('roles', 'user_roles.role_id', 'roles.id')
      .select('roles.*')
      .where('user_roles.user_id', userId);

    return rows.map((row) => Role.fromRow(row));
  }
}

export const roleService = new RoleService();
