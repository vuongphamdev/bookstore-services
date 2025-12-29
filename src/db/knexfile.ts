import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_MIGRATION_USER,
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
