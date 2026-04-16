import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const foundUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, email: true, createdAt: true },
    });

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(foundUser);
  } catch (error) {
    next(error);
  }
};