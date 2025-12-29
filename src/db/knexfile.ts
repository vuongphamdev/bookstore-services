import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

const dbConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_MIGRATION_USER || process.env.DB_USER,
    password: process.env.DB_MIGRATION_PASSWORD || process.env.DB_PASSWORD,
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};

const config: { [key: string]: Knex.Config } = {
  development: dbConfig,
  staging: dbConfig,
  production: dbConfig,
};

module.exports = config;
export default config;
