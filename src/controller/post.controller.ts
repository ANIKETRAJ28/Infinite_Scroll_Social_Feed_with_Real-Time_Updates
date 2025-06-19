import { Request, Response } from 'express';
import { PostService } from '../service/post.service';
import { IPostRequest } from '../interface/post.interface';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        res.status(400).json({ error: 'Unauthorized' });
        return;
      }
      const data: IPostRequest = req.body;
      if (!data || !data.content) {
        res.status(400).json({ error: 'Post content is required' });
        return;
      }
      const post = await this.postService.createPost(userId, data);
      res.status(201).json(post);
    } catch (error) {
      console.log('Error in PostController.createPost:', error);
      res.status(500).json({
        message: 'Failed to create post',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const posts = await this.postService.getPostById(id);
      res.status(200).json(posts);
    } catch (error) {
      console.log('Error in PostController.getPostById:', error);
      res.status(500).json({
        message: 'Failed to fetch post by ID',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const { limit, offset } = req.query;
      const take = parseInt(limit as string);
      const skip = parseInt(offset as string);
      const posts = await this.postService.getAllPosts(take, skip);
      res.status(200).json(posts);
    } catch (error) {
      console.log('Error in PostController.getAllPosts:', error);
      res.status(500).json({
        message: 'Failed to fetch all posts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAllPostsOfFollowedCelebrities(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        res.status(400).json({ error: 'Unauthorized' });
        return;
      }
      const posts = await this.postService.getAllPostsOfFollowedCelebrities(userId);
      res.status(200).json(posts);
    } catch (error) {
      console.log('Error in PostController.getAllPostsOfFollowedCelebrities:', error);
      res.status(500).json({
        message: 'Failed to fetch posts of followed celebrities',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAllPostsOfCelebrity(req: Request, res: Response): Promise<void> {
    try {
      const celebrityId = req.params.celebrity_id;
      const posts = await this.postService.getAllPostOfCelebrity(celebrityId);
      res.status(200).json(posts);
    } catch (error) {
      console.log('Error in PostController.getAllPostsOfCelebrity:', error);
      res.status(500).json({
        message: 'Failed to fetch posts of celebrity',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getPostsForCelebrity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        res.status(400).json({ error: 'Unauthorized' });
        return;
      }
      const posts = await this.postService.getPostsForCelebrity(userId);
      res.status(200).json(posts);
    } catch (error) {
      console.log('Error in PostController.getPostsForCelebrity:', error);
      res.status(500).json({
        message: 'Failed to fetch posts for celebrity',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deletePostForCelebrity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        res.status(400).json({ error: 'Unauthorized' });
        return;
      }
      const postId = req.params.post_id;
      if (!postId) {
        res.status(400).json({ error: 'Post ID is required' });
        return;
      }
      await this.postService.deletePostForCelebrity(userId, postId);
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.log('Error in PostController.deletePostForCelebrity:', error);
      res.status(500).json({
        message: 'Failed to delete post',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
