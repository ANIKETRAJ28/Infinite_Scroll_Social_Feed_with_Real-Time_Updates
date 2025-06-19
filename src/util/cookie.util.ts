import { CookieOptions } from 'express';
import { ENVIRONMENT } from '../config/env.config';

const domain = ENVIRONMENT === 'production' ? '*' : 'localhost'; // Adjust domain based on environment
const httpOnly = ENVIRONMENT === 'production'; // Set httpOnly based on environment
const secure = ENVIRONMENT === 'production'; // Set secure based on environment
const sameSite = ENVIRONMENT === 'production' ? 'None' : 'lax'; // Adjust sameSite based on environment

export const options = {
  domain,
  maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
  httpOnly,
  secure,
  sameSite,
  path: '/',
} as CookieOptions;
