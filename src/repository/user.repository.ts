import { prisma } from '../config/db.config';
import { IUser, IUserResponse } from '../interface/user.interface';

export class UserRepository {
  async isUserCelebrity(userId: string): Promise<boolean> {
    try {
      const user: IUser | null = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user.role === 'CELEBRITY';
    } catch (error) {
      console.error('Error checking if user is a celebrity:', error);
      throw new Error('Failed to check user role');
    }
  }

  async getUserById(id: string): Promise<IUserResponse> {
    try {
      const user: IUser | null = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('User not found');
    }
  }

  async getUserByUsername(user_name: string): Promise<IUserResponse[]> {
    try {
      const users: IUserResponse[] = await prisma.user.findMany({
        where: {
          user_name: {
            contains: user_name,
            mode: 'insensitive', // case-insensitive search
          },
          AND: {
            role: 'CELEBRITY',
          },
        },
        select: {
          id: true,
          user_name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return users;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw new Error('User not found');
    }
  }

  async getFollowingCelebrities(userId: string): Promise<IUserResponse[]> {
    try {
      const userfollowing = await prisma.follows.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              user_name: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      const followingUserDetails: IUserResponse[] = userfollowing.map((following) => ({
        id: following.following.id,
        user_name: following.following.user_name,
        role: following.following.role,
        createdAt: following.following.createdAt,
        updatedAt: following.following.updatedAt,
      }));
      return followingUserDetails;
    } catch (error) {
      console.error('Error fetching user following:', error);
      throw new Error('Failed to fetch following users');
    }
  }

  async getFollowersOfCelebrity(celebrityId: string): Promise<IUserResponse[]> {
    try {
      const followers = await prisma.follows.findMany({
        where: { followingId: celebrityId },
        include: {
          follower: {
            select: {
              id: true,
              user_name: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      const followerDetails: IUserResponse[] = followers.map((follow) => ({
        id: follow.follower.id,
        user_name: follow.follower.user_name,
        role: follow.follower.role,
        createdAt: follow.follower.createdAt,
        updatedAt: follow.follower.updatedAt,
      }));
      return followerDetails;
    } catch (error) {
      console.error('Error fetching followers of celebrity:', error);
      throw new Error('Failed to fetch followers');
    }
  }

  async followCelebrity(userId: string, celebrityId: string): Promise<void> {
    try {
      if (!(await this.isUserCelebrity(celebrityId))) {
        throw new Error('User is not a celebrity');
      }
      await prisma.follows.create({
        data: {
          followerId: userId,
          followingId: celebrityId,
        },
      });
    } catch (error) {
      console.error('Error following celebrity:', error);
      throw new Error('Failed to follow celebrity');
    }
  }

  async unfollowCelebrity(userId: string, celebrityId: string): Promise<void> {
    try {
      if (!(await this.isUserCelebrity(celebrityId))) {
        throw new Error('User is not a celebrity');
      }
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: celebrityId,
          },
        },
      });
    } catch (error) {
      console.error('Error unfollowing celebrity:', error);
      throw new Error('Failed to unfollow celebrity');
    }
  }
}
