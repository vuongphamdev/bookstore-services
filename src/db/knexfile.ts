import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_MIGRATION_USER, // Use migration user for migrations
      password: process.env.DB_MIGRATION_PASSWORD,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};

export default config;
