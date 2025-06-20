import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IJWT } from '../interface/jwt.interface';
import { options } from '../util/cookie.util';

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const jwtCookie = req.cookies['JWT'];
    if (!jwtCookie) {
      throw new Error('User not authenticated');
    }
    const decodedToken = jwt.decode(jwtCookie);
    if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.exp) {
      throw new Error('User not authenticated');
    }
    if (decodedToken.exp * 1000 < Date.now()) {
      res.clearCookie('JWT');
      throw new Error('User not authenticated');
    }
    const tokenData = decodedToken as unknown as IJWT;

    req.id = tokenData.id;
    req.user_name = tokenData.user_name;
    req.role = tokenData.role;
    next();
  } catch (error) {
    console.error('JWT Middleware Error:', error);
    res.status(401).json({
      message: 'User not authenticated',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export function isCelebrityMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.role !== 'CELEBRITY') {
      throw new Error('Access denied. Only celebrities can perform this action.');
    }
    next();
  } catch (error) {
    console.error('Celebrity Middleware Error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export function isUserMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.role !== 'USER') {
      throw new Error('Access denied. Only users can perform this action.');
    }
    next();
  } catch (error) {
    console.error('Celebrity Middleware Error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export function logoutUser(req: Request, res: Response) {
  try {
    res.clearCookie('JWT', options);
    res.status(200).json({
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      message: 'Failed to log out user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export function verifyUser(req: Request, res: Response) {
  const jwtCookie = req.cookies['JWT'];
  if (!jwtCookie) {
    throw new Error('User not authenticated');
  }
  const decodedToken = jwt.decode(jwtCookie) as unknown as IJWT;
  if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.exp) {
    res.status(401).json({ message: 'User not authenticated' });
  }
  if (decodedToken.exp * 1000 < Date.now()) {
    res.clearCookie('JWT');
    res.status(401).json({ message: 'User not authenticated' });
  }
  const tokenData = decodedToken as unknown as IJWT;
  res.status(200).json({ data: tokenData, message: 'User is authenticated' });
}
