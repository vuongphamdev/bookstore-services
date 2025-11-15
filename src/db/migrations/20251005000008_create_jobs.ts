import { EJobStatus } from '@constants';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('jobs', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable();
    table.integer('manifest_id').unsigned();
    table.string('status').notNullable().defaultTo(EJobStatus.PENDING);
    table.text('notes');
    table.timestamps(true, true);

    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.index(['order_id']);
    table.index(['manifest_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('jobs');
}
