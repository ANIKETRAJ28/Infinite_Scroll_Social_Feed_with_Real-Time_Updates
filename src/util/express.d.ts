// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';
import { IRole } from '../interface/user.interface';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user_name?: string;
      role?: IRole;
    }
  }
}
