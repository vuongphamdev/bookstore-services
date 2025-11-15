import { EShopStatus } from '@constants';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('shops', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.string('status').notNullable().defaultTo(EShopStatus.INACTIVE);
    table.text('description').nullable();
    table.timestamps(true, true);

    table.index(['user_id']);
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('shops');
}
