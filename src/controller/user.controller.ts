import { Request, Response } from 'express';
import { UserService } from '../service/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({ error: 'User Id required' });
        return;
      }
      const user = await this.userService.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      console.log('Error in UserController.getUserById:', error);
      res.status(500).json({
        message: 'Failed to fetch user by ID',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getUserByUsername(req: Request, res: Response): Promise<void> {
    try {
      const userName = req.query.user_name;
      if (!userName || typeof userName !== 'string') {
        if (!userName) res.status(400).json({ error: 'User name required' });
        if (typeof userName !== 'string') res.status(400).json({ error: 'User name must be a string' });
        return;
      }
      const users = await this.userService.getUserByUsername(userName);
      res.status(200).json(users);
    } catch (error) {
      console.log('Error in UserController.getUserByUsername:', error);
      res.status(500).json({
        message: 'Failed to fetch user by username',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getFollowingCelebrities(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        res.status(400).json({ error: 'Unauthorized' });
        return;
      }
      const followingCelebrities = await this.userService.getFollowingCelebrities(userId);
      res.status(200).json(followingCelebrities);
    } catch (error) {
      console.log('Error in UserController.getFollowingCelebrities:', error);
      res.status(500).json({
        message: 'Failed to fetch following celebrities',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getFollowersOfCelebrity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        res.status(400).json({ error: 'User Id required' });
        return;
      }
      const followers = await this.userService.getFollowersOfCelebrity(userId);
      res.status(200).json(followers);
    } catch (error) {
      console.log('Error in UserController.getFollowersOfCelebrity:', error);
      res.status(500).json({
        message: 'Failed to fetch followers of celebrity',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async followCelebrity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        res.status(400).json({ error: 'Unauthorized' });
        return;
      }
      const celebrityId = req.params.celebrity_id;
      if (!celebrityId) {
        res.status(400).json({ error: 'Celebrity Id required' });
        return;
      }
      await this.userService.followCelebrity(userId, celebrityId);
      res.status(200).json({ message: 'Followed celebrity successfully' });
    } catch (error) {
      console.log('Error in UserController.followCelebrity:', error);
      res.status(500).json({
        message: 'Failed to follow celebrity',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async unfollowCelebrity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        res.status(400).json({ error: 'Unauthorized' });
        return;
      }
      const celebrityId = req.params.celebrity_id;
      if (!celebrityId) {
        res.status(400).json({ error: 'Celebrity Id required' });
        return;
      }
      await this.userService.unfollowCelebrity(userId, celebrityId);
      res.status(200).json({ message: 'Unfollowed celebrity successfully' });
    } catch (error) {
      console.log('Error in UserController.unfollowCelebrity:', error);
      res.status(500).json({
        message: 'Failed to unfollow celebrity',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
