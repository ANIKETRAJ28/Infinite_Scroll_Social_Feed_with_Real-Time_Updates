import { IUserResponse } from '../interface/user.interface';
import { UserRepository } from '../repository/user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: string): Promise<IUserResponse> {
    try {
      return await this.userRepository.getUserById(id);
    } catch (error) {
      console.error('Error in UserService.getUserById:', error);
      throw new Error('Failed to fetch user by ID');
    }
  }

  async getUserByUsername(user_name: string): Promise<IUserResponse[]> {
    try {
      return await this.userRepository.getUserByUsername(user_name);
    } catch (error) {
      console.error('Error in UserService.getUserByUsername:', error);
      throw new Error('Failed to fetch user by username');
    }
  }

  async getFollowingCelebrities(user_id: string): Promise<IUserResponse[]> {
    try {
      return await this.userRepository.getFollowingCelebrities(user_id);
    } catch (error) {
      console.error('Error in UserService.getFollowingCelebrities:', error);
      throw new Error('Failed to fetch following celebrities');
    }
  }

  async getFollowersOfCelebrity(celebrity_id: string): Promise<IUserResponse[]> {
    try {
      return await this.userRepository.getFollowersOfCelebrity(celebrity_id);
    } catch (error) {
      console.error('Error in UserService.getFollowersOfCelebrity:', error);
      throw new Error('Failed to fetch followers of celebrity');
    }
  }

  async followCelebrity(user_id: string, celebrity_id: string): Promise<void> {
    try {
      await this.userRepository.followCelebrity(user_id, celebrity_id);
    } catch (error) {
      console.error('Error in UserService.followCelebrity:', error);
      throw new Error('Failed to follow celebrity');
    }
  }

  async unfollowCelebrity(user_id: string, celebrity_id: string): Promise<void> {
    try {
      await this.userRepository.unfollowCelebrity(user_id, celebrity_id);
    } catch (error) {
      console.error('Error in UserService.unfollowCelebrity:', error);
      throw new Error('Failed to unfollow celebrity');
    }
  }
}
