import { db } from '@config';
import { TCreateUserData, TUpdateUserData, TUser, TUserResponse } from '@models/schemas';

class UserService {
  async getUserById(id: number): Promise<TUserResponse | null> {
    const row = await db<TUser>('users')
      .select('id', 'name', 'email', 'role', 'status', 'dob', 'phone_number', 'address', 'created_at', 'updated_at')
      .where({ id })
      .first();
    return (row as TUserResponse) ?? null;
  }

  async getUserByEmail(email: string): Promise<TUser | null> {
    const row = await db<TUser>('users').where({ email }).first();
    return row ?? null;
  }

  async createUser(createData: TCreateUserData): Promise<number> {
    const [id] = await db('users').insert(createData);
    return id;
  }

  async updateUser(id: number, updateData: TUpdateUserData): Promise<number> {
    return await db<TUser>('users')
      .where({ id })
      .update({ ...updateData, updated_at: db.fn.now() });
  }

  async deleteUser(id: number): Promise<number> {
    return await db<TUser>('users').where({ id }).del();
  }
}

export const userService = new UserService();
