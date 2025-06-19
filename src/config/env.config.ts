import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const BACKEND_URL = process.env.BACKEND_URL;
export const SALT = process.env.SALT || 10;
export const ENVIRONMENT = process.env.ENVIRONMENT;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
