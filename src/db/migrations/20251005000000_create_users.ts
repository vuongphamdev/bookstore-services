import { ERole, EUserStatus } from '@constants';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('role').notNullable().defaultTo(ERole.USER);
    table.string('status').notNullable().defaultTo(EUserStatus.UNVERIFIED);
    table.string('dob');
    table.string('phone_number');
    table.string('address');
    table.timestamps(true, true);

    table.index(['email']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
