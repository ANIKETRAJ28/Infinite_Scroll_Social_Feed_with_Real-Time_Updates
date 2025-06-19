import jwt from 'jsonwebtoken';
import { IUserResponse } from '../interface/user.interface';

export function createJWTtoken(user: Omit<IUserResponse, 'createdAt' | 'updatedAt'>): string {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
  return token;
}
