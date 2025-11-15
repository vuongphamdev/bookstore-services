import { EManifestStatus } from '@constants';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('manifests', (table) => {
    table.increments('id').primary();
    table.integer('driver_id').unsigned().notNullable();
    table.integer('vehicle_id').unsigned().notNullable();
    table.datetime('manifest_date').notNullable();
    table.string('status').notNullable().defaultTo(EManifestStatus.NEW);
    table.text('notes');
    table.timestamps(true, true);

    table.index(['manifest_date']);
    table.index(['driver_id']);
    table.foreign('driver_id').references('id').inTable('drivers').onDelete('CASCADE');
    table.foreign('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('manifests');
}
