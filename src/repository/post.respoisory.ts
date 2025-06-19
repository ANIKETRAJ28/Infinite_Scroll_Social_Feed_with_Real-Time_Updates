import { prisma } from '../config/db.config';
import { IPost, IPostRequest } from '../interface/post.interface';
import { UserRepository } from './user.repository';
import { publisher } from '../util/redis.util';

export class PostRepository {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async isAuthorPost(user_id: string, post_id: string): Promise<boolean> {
    try {
      const post = await prisma.post.findUnique({
        where: { id: post_id },
      });
      if (!post) {
        throw new Error('Post not found');
      }
      return post.authorId === user_id;
    } catch (error) {
      console.error('Error checking if user is author of post:', error);
      throw new Error('Failed to check author of post');
    }
  }

  async createPost(user_id: string, data: IPostRequest): Promise<IPost> {
    try {
      const post = await prisma.post.create({
        data: {
          content: data.content,
          imageUrl: data.imageURL || null,
          authorId: user_id,
        },
      });
      const postDetail = await prisma.post.findUnique({
        where: { id: post.id },
        include: {
          author: {
            select: {
              user_name: true,
              role: true,
            },
          },
        },
      });
      if (!postDetail) {
        throw new Error('Post detail not found');
      }
      const followers = await this.userRepository.getFollowersOfCelebrity(user_id);
      followers.forEach(async (follower) => {
        const data = JSON.stringify({
          type: 'NEW_POST',
          user_id: follower.id,
          post: {
            id: postDetail.id,
            content: postDetail.content,
            imageURL: postDetail.imageUrl ? postDetail.imageUrl : undefined,
            authorId: postDetail.authorId,
            authorName: postDetail.author.user_name,
            authorRole: postDetail.author.role,
            createdAt: postDetail.createdAt,
            updatedAt: postDetail.updatedAt,
          },
        });
        await publisher(data);
        // listenToQueue();
      });
      return {
        id: postDetail.id,
        content: postDetail.content,
        imageURL: postDetail.imageUrl ? postDetail.imageUrl : undefined,
        authorId: postDetail.authorId,
        authorName: postDetail.author.user_name,
        authorRole: postDetail.author.role,
        createdAt: postDetail.createdAt,
        updatedAt: postDetail.updatedAt,
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Post creation failed');
    }
  }

  async getPostById(id: string): Promise<IPost> {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              user_name: true,
              role: true,
            },
          },
        },
      });
      if (!post) {
        throw new Error('Post not found');
      }
      return {
        id: post.id,
        content: post.content,
        imageURL: post.imageUrl ? post.imageUrl : undefined,
        authorId: post.authorId,
        authorName: post.author.user_name,
        authorRole: post.author.role,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw new Error('Post not found');
    }
  }

  async getAllPosts(limit: number, offset: number): Promise<IPost[]> {
    try {
      const posts = await prisma.post.findMany({
        where: {
          author: {
            role: 'CELEBRITY',
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              user_name: true,
              role: true,
            },
          },
        },
        skip: offset,
        take: limit,
      });
      return posts.map((post) => ({
        id: post.id,
        content: post.content,
        imageURL: post.imageUrl ? post.imageUrl : undefined,
        authorId: post.authorId,
        authorName: post.author.user_name,
        authorRole: post.author.role,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching all posts of celebrities:', error);
      throw new Error('Posts not found');
    }
  }

  async getAllPostsOfCelebrity(id: string): Promise<IPost[]> {
    try {
      const posts = await prisma.post.findMany({
        where: {
          author: {
            id,
            role: 'CELEBRITY',
          },
        },
        include: {
          author: {
            select: {
              user_name: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return posts.map((post) => ({
        id: post.id,
        content: post.content,
        imageURL: post.imageUrl ? post.imageUrl : undefined,
        authorId: post.authorId,
        authorName: post.author.user_name,
        authorRole: post.author.role,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching all posts of celebrities:', error);
      throw new Error('Posts not found');
    }
  }

  async getAllPostsOfFollowedCelebrities(user_id: string): Promise<IPost[]> {
    try {
      const followedCelebrities = await this.userRepository.getFollowingCelebrities(user_id);
      const posts = await prisma.post.findMany({
        where: {
          authorId: {
            in: followedCelebrities.map((celebrity) => celebrity.id),
          },
        },
        include: {
          author: {
            select: {
              user_name: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return posts.map((post) => ({
        id: post.id,
        content: post.content,
        imageURL: post.imageUrl ? post.imageUrl : undefined,
        authorId: post.authorId,
        authorName: post.author.user_name,
        authorRole: post.author.role,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching posts of followed celebrities:', error);
      throw new Error('Posts not found');
    }
  }

  async getPostsForCelebrity(user_id: string): Promise<IPost[]> {
    try {
      const posts = await prisma.post.findMany({
        where: { authorId: user_id },
        include: {
          author: {
            select: {
              user_name: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return posts.map((post) => ({
        id: post.id,
        content: post.content,
        imageURL: post.imageUrl ? post.imageUrl : undefined,
        authorId: post.authorId,
        authorName: post.author.user_name,
        authorRole: post.author.role,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching posts by user ID:', error);
      throw new Error('Posts not found');
    }
  }

  async deletePostForCelebrity(celebrity_id: string, post_id: string): Promise<void> {
    try {
      if (!(await this.isAuthorPost(celebrity_id, post_id))) {
        throw new Error('You are not the author of this post');
      }
      const postDetail = await prisma.post.delete({
        where: { id: post_id },
        include: {
          author: {
            select: {
              user_name: true,
              role: true,
            },
          },
        },
      });
      const followers = await this.userRepository.getFollowersOfCelebrity(celebrity_id);
      followers.forEach(async (follower) => {
        const data = JSON.stringify({
          type: 'DELETE_POST',
          user_id: follower.id,
          post: {
            id: postDetail.id,
            content: postDetail.content,
            imageURL: postDetail.imageUrl ? postDetail.imageUrl : undefined,
            authorId: postDetail.authorId,
            authorName: postDetail.author.user_name,
            authorRole: postDetail.author.role,
            createdAt: postDetail.createdAt,
            updatedAt: postDetail.updatedAt,
          },
        });
        await publisher(data);
      });
    } catch (error) {
      console.error('Error deleting post for celebrity:', error);
      throw new Error('Failed to delete post');
    }
  }
}
