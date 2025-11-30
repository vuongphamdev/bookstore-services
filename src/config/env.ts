import { configDotenv } from 'dotenv';
import path from 'path';

// Only load .env file in local development (not in CI/CD)
if (process.env.CI !== 'true') {
  configDotenv({ path: path.resolve(__dirname, '../../.env') });
}

let isExit = false;

function warnIfMissing(key: string) {
  if (!process.env[key]) {
    console.warn(`⚠️  Warning: Environment variable ${key} is missing`);
    isExit = true;
  }
}

[
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_ACCESS_TOKEN_SECRET',
  'JWT_REFRESH_TOKEN_SECRET',
  'JWT_VERIFY_EMAIL_TOKEN_SECRET',
  'JWT_FORGOT_PASSWORD_TOKEN_SECRET',
  'PASSWORD_SALT',
].forEach(warnIfMissing);

if (isExit) {
  process.exit(0);
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: Number(process.env.DB_PORT ?? 3306),
  DB_USER: process.env.DB_USER ?? 'root',
  DB_PASSWORD: process.env.DB_PASSWORD ?? '',
  DB_NAME: process.env.DB_NAME ?? '',

  // Migration user credentials
  DB_MIGRATION_USER: process.env.DB_MIGRATION_USER,
  DB_MIGRATION_PASSWORD: process.env.DB_MIGRATION_PASSWORD,

  SERVER_URL: process.env.SERVER_URL ?? 'http://localhost:3000',
  PORT: Number(process.env.PORT ?? 3000),

  //JWT Secrets
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  JWT_FORGOT_PASSWORD_TOKEN_SECRET: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET!,
  JWT_VERIFY_EMAIL_TOKEN_SECRET: process.env.JWT_VERIFY_EMAIL_TOKEN_SECRET!,

  //JWT Expire Times
  JWT_ACCESS_TOKEN_EXPIRE_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME as any,
  JWT_REFRESH_TOKEN_EXPIRE_TIME: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME as any,
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRE_TIME: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRE_TIME as any,
  JWT_VERIFY_EMAIL_TOKEN_EXPIRE_TIME: process.env.JWT_VERIFY_EMAIL_TOKEN_EXPIRE_TIME as any,

  //Others
  PASSWORD_SALT: process.env.PASSWORD_SALT!,
};

export const IS_PRODUCTION = ENV.NODE_ENV === 'production';
