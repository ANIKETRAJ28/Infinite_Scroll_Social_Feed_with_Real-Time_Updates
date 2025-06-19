import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { IUserRequest } from '../interface/user.interface';
import { createJWTtoken } from '../util/jwt.util';
import { options } from '../util/cookie.util';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async getRandomCelebrityCredentials(req: Request, res: Response): Promise<void> {
    try {
      const credentials = await this.authService.getRandomCelebrityCredentials();
      res.status(200).json({
        message: 'Random Celebrity Credentials Fetched Successfully',
        data: credentials,
      });
    } catch (error) {
      console.error('Error in AuthController.getRandomCelebrityCredentials:', error);
      res.status(500).json({
        message: 'Failed to fetch random celebrity credentials',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getRandomUserCredentials(req: Request, res: Response): Promise<void> {
    try {
      const credentials = await this.authService.getRandomUserCredentials();
      res.status(200).json({
        message: 'Random User Credentials Fetched Successfully',
        data: credentials,
      });
    } catch (error) {
      console.error('Error in AuthController.getRandomUserCredentials:', error);
      res.status(500).json({
        message: 'Failed to fetch random user credentials',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const data: IUserRequest = req.body;
      if (!data || !data.user_name || !data.password) {
        res.status(400).json({ error: 'User name and password are required' });
        return;
      }
      const user = await this.authService.signup(data);
      const tokenPayload = {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
      };
      const token = createJWTtoken(tokenPayload);
      res.cookie('JWT', token, options);
      res.status(201).json({
        message: 'User Signup Successful',
      });
    } catch (error) {
      console.error('Error in AuthController.signup:', error);
      res.status(500).json({
        message: 'User Signup Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { user_name, password } = req.body;
      if (!user_name || !password) {
        res.status(400).json({ error: 'User name and password are required' });
        return;
      }
      const user = await this.authService.login(user_name, password);
      const tokenPayload = {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
      };
      const token = createJWTtoken(tokenPayload);
      res.cookie('JWT', token, options);
      res.status(200).json({
        message: 'User Login Successful',
      });
    } catch (error) {
      console.error('Error in AuthController.login:', error);
      res.status(500).json({
        message: 'User Login Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
