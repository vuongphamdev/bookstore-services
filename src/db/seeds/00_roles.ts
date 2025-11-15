import { EUserRole } from '@constants';
import { CreateRoleData } from '@models/schemas';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('roles').del();
  // Inserts seed entries
  const roles: CreateRoleData[] = [
    {
      name: 'admin',
      code: EUserRole.ADMIN,
      description: 'Administrator with full access',
    },
    {
      name: 'user',
      code: EUserRole.USER,
      description: 'Regular user with standard access',
    },
    {
      name: 'guest',
      code: EUserRole.GUEST,
      description: 'Guest user with minimal access',
    },
  ];

  await knex('roles').insert(roles);
  console.log('Seeded roles table');
}
