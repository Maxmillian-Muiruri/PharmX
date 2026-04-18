import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const getOrderItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};