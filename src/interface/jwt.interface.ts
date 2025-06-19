import { IRole } from './user.interface';

export interface IJWT {
  id: string;
  user_name: string;
  email: string;
  role: IRole;
  iat: number;
  exp: number;
}
