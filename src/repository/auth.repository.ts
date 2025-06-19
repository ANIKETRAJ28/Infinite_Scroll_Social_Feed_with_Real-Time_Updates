import bcrypt from 'bcrypt';
import { prisma } from '../config/db.config';
import { IUser, IUserRequest, IUserResponse } from '../interface/user.interface';
import { SALT } from '../config/env.config';

export class AuthRepository {
  async getRandomCelebrityCredentials(): Promise<IUserRequest> {
    try {
      const celebrities: IUser[] = await prisma.user.findMany({
        where: { role: 'CELEBRITY', isSeeded: true },
      });

      if (celebrities.length === 0) {
        throw new Error('No celebrities found');
      }

      const randomCelebrity = celebrities[Math.floor(Math.random() * celebrities.length)];
      return {
        user_name: randomCelebrity.user_name,
        password: randomCelebrity.password,
        role: randomCelebrity.role,
      };
    } catch (error) {
      console.error('Error fetching random celebrity credentials:', error);
      throw new Error('Failed to fetch celebrity credentials');
    }
  }

  async getRandomUserCredentials(): Promise<IUserRequest> {
    try {
      const users: IUser[] = await prisma.user.findMany({
        where: {
          role: 'USER',
          isSeeded: true,
        },
      });
      console.log('user...', users);
      if (users.length === 0) {
        throw new Error('No users found');
      }
      const randomUser = users[Math.floor(Math.random() * users.length)];
      return {
        user_name: randomUser.user_name,
        password: randomUser.password,
        role: randomUser.role,
      };
    } catch (error) {
      console.error('Error fetching random user credentials:', error);
      throw new Error('Failed to fetch user credentials');
    }
  }

  async signup(data: IUserRequest): Promise<IUserResponse> {
    try {
      const salt = await bcrypt.genSalt(+SALT);
      data.password = await bcrypt.hash(data.password, salt);
      const user: IUser = await prisma.user.create({
        data: {
          user_name: data.user_name,
          password: data.password,
          role: data.role || 'USER',
        },
      });
      return {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User creation failed');
    }
  }

  async login(user_name: string, password: string): Promise<IUserResponse> {
    try {
      const user: IUser | null = await prisma.user.findUnique({
        where: { user_name },
      });
      if (!user) {
        throw new Error('User not found');
      }
      if (user.isSeeded) {
        return {
          id: user.id,
          user_name: user.user_name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      return {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error during user login:', error);
      throw new Error('User login failed');
    }
  }
}
