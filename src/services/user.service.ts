import { db } from '@config';
import { User } from '@models/schemas';

export type TNewUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type TUpdateUser = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;

class UserService {
  async getUserById(id: number) {
    const row = await db<User>('users')
      .select('id', 'name', 'role', 'dob', 'email', 'created_at', 'updated_at')
      .where({ id })
      .first();
    return row ? User.fromRow(row) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const row = await db<User>('users').where({ email }).first();
    return row ? User.fromRow(row) : null;
  }

  async createUser(userData: User): Promise<number[]> {
    // Use toInsert() to exclude id, created_at, updated_at - DB will auto-generate them
    return await db<User>('users').insert(userData.toRow());
  }

  async updateUser(id: number, userData: User): Promise<number> {
    // Use toUpdate() to exclude id, created_at and auto-update updated_at
    return await db<User>('users').where({ id }).update(userData.toRow());
  }

  async deleteUser(id: number): Promise<number> {
    return await db<User>('users').where({ id }).del();
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const roles = await db('user_roles')
      .join('roles', 'user_roles.role_id', 'roles.id')
      .select('roles.name')
      .where('user_roles.user_id', userId);

    return roles.map((role) => role.name);
  }

  async assignRole(userId: number, roleId: number): Promise<void> {
    await db('user_roles').insert({
      user_id: userId,
      role_id: roleId,
    });
  }

  async removeRole(userId: number, roleId: number): Promise<number> {
    return await db('user_roles').where({ user_id: userId, role_id: roleId }).del();
  }

  async hasRole(userId: number, roleId: number): Promise<boolean> {
    const result = await db('user_roles').where({ user_id: userId, role_id: roleId }).first();
    return !!result;
  }
}

export const userService = new UserService();
