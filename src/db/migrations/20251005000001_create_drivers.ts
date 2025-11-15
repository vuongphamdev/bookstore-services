import { EUserStatus } from '@constants';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('drivers', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('code').unique().notNullable();
    table.string('status').defaultTo(EUserStatus.UNVERIFIED);
    table.integer('age').unsigned().notNullable();
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('country');
    table.string('zip');
    table.string('license_number').unique().notNullable();
    table.integer('vehicle_id').unsigned();
    table.string('phone_number').notNullable();
    table.timestamps(true, true);

    table.index(['id']);
    table.index(['code']);
    table.index(['license_number']);
    table.index(['phone_number']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('drivers');
}
