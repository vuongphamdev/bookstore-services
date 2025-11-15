// import { configDotenv } from "dotenv";
import type { Knex } from 'knex';
import { ENV } from '@config/env';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: ENV.DB_HOST,
      user: ENV.DB_MIGRATION_USER, // Use migration user for migrations
      password: ENV.DB_MIGRATION_PASSWORD,
      database: ENV.DB_NAME,
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
