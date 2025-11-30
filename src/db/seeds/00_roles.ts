import { ERole } from '@constants';
import { TCreateRoleData } from '@models/schemas';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('roles').del();
  // Inserts seed entries
  const roles: (TCreateRoleData & { id: number })[] = [
    {
      id: 1,
      name: 'admin',
      code: ERole.ADMIN,
      description: 'Administrator with full access',
    },
    {
      id: 2,
      name: 'user',
      code: ERole.USER,
      description: 'Regular user with standard access',
    },
    {
      id: 3,
      name: 'guest',
      code: ERole.GUEST,
      description: 'Guest user with minimal access',
    },
  ];

  await knex('roles').insert(roles);
  console.log('Seeded roles table');
}
