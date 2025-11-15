import { CorsOptions } from 'cors';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Define allowed origins based on environment
const getAllowedOrigins = (): string[] | boolean => {
  if (isDevelopment || isTest) {
    return true;
  }
  return ['https://bookstore.com', 'https://www.bookstore.com', 'https://admin.bookstore.com'];
};

export const corsConfig: CorsOptions = {
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Cache-Control',
    'Pragma',
    'User-Agent',
    'X-CSRF-Token',
  ],

  credentials: true,
  maxAge: isProduction ? 86400 : 0,
};
