import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('order_items', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.integer('quantity').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.timestamps(true, true);

    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');

    table.index(['order_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('order_items');
}
