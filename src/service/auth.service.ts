import { IUserRequest, IUserResponse } from '../interface/user.interface';
import { AuthRepository } from '../repository/auth.repository';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async getRandomCelebrityCredentials(): Promise<IUserRequest> {
    try {
      return await this.authRepository.getRandomCelebrityCredentials();
    } catch (error) {
      console.error('Error in AuthService.getRandomCelebrityCredentials:', error);
      throw new Error('Failed to fetch random celebrity credentials');
    }
  }

  async getRandomUserCredentials(): Promise<IUserRequest> {
    try {
      return await this.authRepository.getRandomUserCredentials();
    } catch (error) {
      console.error('Error in AuthService.getRandomUserCredentials:', error);
      throw new Error('Failed to fetch random user credentials');
    }
  }

  async signup(data: IUserRequest): Promise<IUserResponse> {
    try {
      return await this.authRepository.signup(data);
    } catch (error) {
      console.error('Error in AuthService.signup:', error);
      throw new Error('User signup failed');
    }
  }

  async login(user_name: string, password: string): Promise<IUserResponse> {
    try {
      return await this.authRepository.login(user_name, password);
    } catch (error) {
      console.error('Error in AuthService.login:', error);
      throw new Error('User login failed');
    }
  }
}
