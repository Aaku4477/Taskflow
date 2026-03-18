import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';
import { UnauthorizedError } from '../lib/errors';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token required');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid or expired access token'));
    }
  }
}
