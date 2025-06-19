import { CookieOptions } from 'express';
import { ENVIRONMENT } from '../config/env.config';

const httpOnly = ENVIRONMENT === 'production'; // Set httpOnly based on environment
const secure = ENVIRONMENT === 'production'; // Set secure based on environment
const sameSite = ENVIRONMENT === 'production' ? 'None' : 'lax'; // Adjust sameSite based on environment

export const options = {
  maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
  httpOnly,
  secure,
  sameSite,
  path: '/',
} as CookieOptions;
