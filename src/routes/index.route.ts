import { Router } from 'express';
import { jwtMiddleware } from '../middleware/auth.middleware';
import { authRouter } from './auth.route';
import { postRouter } from './post.route';
import { userRouter } from './user.route';

export const router = Router();

router.use('/auth', authRouter);
router.use('/user', jwtMiddleware, userRouter);
router.use('/post', jwtMiddleware, postRouter);
