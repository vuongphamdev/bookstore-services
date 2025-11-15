import { EProductCategory, EProductStatus } from '@constants';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('shop_id').notNullable();
    table.string('name').notNullable();
    table.string('sku').notNullable(); // Stock Keeping Unit
    table.string('category').notNullable().defaultTo(EProductCategory.OTHERS);
    table.text('description');
    table.decimal('price', 10, 2).notNullable();
    table.integer('stock').defaultTo(0);
    table.string('status').defaultTo(EProductStatus.AVAILABLE);
    table.json('metadata').nullable();
    table.timestamps(true, true);

    table.foreign('shop_id').references('id').inTable('shops').onDelete('CASCADE');

    table.index(['shop_id']);
    table.index(['name']);
    table.index(['category']);
    table.index(['sku']);

    table.unique(['shop_id', 'sku']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
}
