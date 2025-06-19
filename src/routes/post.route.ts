import { Router } from 'express';
import { PostController } from '../controller/post.controller';
import { isCelebrityMiddleware, isUserMiddleware } from '../middleware/auth.middleware';

const postController = new PostController();

export const postRouter = Router();

postRouter.get('/data', postController.getAllPosts.bind(postController));
postRouter.get('/celebrity', isCelebrityMiddleware, postController.getPostsForCelebrity.bind(postController));
postRouter.get(
  '/celebrity/followed',
  isUserMiddleware,
  postController.getAllPostsOfFollowedCelebrities.bind(postController),
);
postRouter.get(
  '/celebrity/:celebrity_id',
  isUserMiddleware,
  postController.getAllPostsOfCelebrity.bind(postController),
);
postRouter.get('/:id', postController.getPostById.bind(postController));
postRouter.post('/', isCelebrityMiddleware, postController.createPost.bind(postController));
postRouter.delete('/:post_id', isCelebrityMiddleware, postController.deletePostForCelebrity.bind(postController));
