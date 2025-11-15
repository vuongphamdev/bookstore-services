import { EStopStatus } from '@constants';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('stops', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable();
    table.string('type').notNullable();
    table.string('status').notNullable().defaultTo(EStopStatus.PENDING);
    table.integer('sequence').notNullable();
    table.integer('manifest_sequence').notNullable();
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('country');
    table.string('zip');
    table.string('postal_code');
    table.string('latitude');
    table.string('longitude');
    table.datetime('scheduled_time');
    table.datetime('arrival_time');
    table.datetime('departure_time');
    table.datetime('estimated_time');
    table.datetime('completed_at');
    table.text('notes');
    table.timestamps(true, true);

    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.index(['order_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('stops');
}
