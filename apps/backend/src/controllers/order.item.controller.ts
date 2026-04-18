import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const getOrderItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderItems = await prisma.orderItem.findMany();
    res.json(orderItems);
  } catch (error) {
    next(error);
  }
};