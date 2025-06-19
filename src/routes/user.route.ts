import { Router } from 'express';
import { isCelebrityMiddleware, isUserMiddleware } from '../middleware/auth.middleware';
import { UserController } from '../controller/user.controller';

const userController = new UserController();
export const userRouter = Router();

userRouter.get('/username', isUserMiddleware, userController.getUserByUsername.bind(userController));
userRouter.get('/followings', isUserMiddleware, userController.getFollowingCelebrities.bind(userController));
userRouter.get('/followers', isCelebrityMiddleware, userController.getFollowersOfCelebrity.bind(userController));
userRouter.get('/:id', userController.getUserById.bind(userController));
userRouter.post(
  '/celebrity/follow/:celebrity_id',
  isUserMiddleware,
  userController.followCelebrity.bind(userController),
);
userRouter.post(
  '/celebrity/unfollow/:celebrity_id',
  isUserMiddleware,
  userController.unfollowCelebrity.bind(userController),
);
