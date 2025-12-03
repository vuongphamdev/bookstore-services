import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('orders');
  if (!hasTable) {
    return knex.schema.createTable('orders', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('shop_id').unsigned().notNullable();
      table.string('status');
      table.text('notes').nullable();
      table.timestamps(true, true);

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.index(['user_id']);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('orders');
}
