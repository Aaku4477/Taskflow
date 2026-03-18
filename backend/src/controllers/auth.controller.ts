import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
} from '../lib/jwt';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '../lib/errors';
import { AuthRequest } from '../middleware/auth.middleware';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = await generateRefreshToken(user.id);

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = await generateRefreshToken(user.id);

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError('Refresh token required');
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await revokeRefreshToken(refreshToken);
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Rotate refresh token
    await revokeRefreshToken(refreshToken);
    const newRefreshToken = await generateRefreshToken(stored.userId);
    const accessToken = generateAccessToken({ userId: stored.userId, email: stored.user.email });

    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // Optionally revoke all tokens for this user
    if (req.user?.userId) {
      await revokeAllUserRefreshTokens(req.user.userId);
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) throw new NotFoundError('User not found');

    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}
