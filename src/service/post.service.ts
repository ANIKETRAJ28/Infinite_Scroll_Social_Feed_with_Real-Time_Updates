import { IPost, IPostRequest } from '../interface/post.interface';
import { PostRepository } from '../repository/post.respoisory';

export class PostService {
  private postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  async createPost(user_id: string, data: IPostRequest): Promise<IPost> {
    try {
      return await this.postRepository.createPost(user_id, data);
    } catch (error) {
      console.error('Error in PostService.createPost:', error);
      throw new Error('Failed to create post');
    }
  }

  async getPostById(id: string): Promise<IPost> {
    try {
      return await this.postRepository.getPostById(id);
    } catch (error) {
      console.error('Error in PostService.getPostById:', error);
      throw new Error('Failed to fetch post by ID');
    }
  }

  async getAllPosts(limit: number, offset: number): Promise<IPost[]> {
    try {
      return await this.postRepository.getAllPosts(limit, offset);
    } catch (error) {
      console.error('Error in PostService.getAllPosts:', error);
      throw new Error('Failed to fetch all posts');
    }
  }

  async getAllPostOfCelebrity(id: string): Promise<IPost[]> {
    try {
      return await this.postRepository.getAllPostsOfCelebrity(id);
    } catch (error) {
      console.error('Error in PostService.getAllPostOfCelebrity:', error);
      throw new Error('Failed to fetch posts of celebrity');
    }
  }

  async getAllPostsOfFollowedCelebrities(user_id: string): Promise<IPost[]> {
    try {
      return await this.postRepository.getAllPostsOfFollowedCelebrities(user_id);
    } catch (error) {
      console.error('Error in PostService.getAllPostsOfFollowedCelebrities:', error);
      throw new Error('Failed to fetch posts of followed celebrities');
    }
  }

  async getPostsForCelebrity(user_id: string): Promise<IPost[]> {
    try {
      return await this.postRepository.getPostsForCelebrity(user_id);
    } catch (error) {
      console.error('Error in PostService.getPostsForCelebrity:', error);
      throw new Error('Failed to fetch posts for celebrity');
    }
  }

  async deletePostForCelebrity(celebrity_id: string, post_id: string): Promise<void> {
    try {
      await this.postRepository.deletePostForCelebrity(celebrity_id, post_id);
    } catch (error) {
      console.error('Error in PostService.deletePostForCelebrity:', error);
      throw new Error('Failed to delete post');
    }
  }
}
