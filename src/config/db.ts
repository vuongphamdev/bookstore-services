import knex from 'knex';
import { ENV } from './env';

export const db = knex({
  client: 'mysql2',
  connection: {
    host: ENV.DB_HOST,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  },
});
