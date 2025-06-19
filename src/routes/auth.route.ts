import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';
import { logoutUser, verifyUser } from '../middleware/auth.middleware';

const authController = new AuthController();

export const authRouter = Router();

authRouter.post('/signup', authController.signup.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.get('/logout', logoutUser);
authRouter.get('/verify', verifyUser);
authRouter.get('/random/celebrity', authController.getRandomCelebrityCredentials.bind(authController));
authRouter.get('/random/user', authController.getRandomUserCredentials.bind(authController));
