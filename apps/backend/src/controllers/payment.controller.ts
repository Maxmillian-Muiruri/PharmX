import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await prisma.payment.findMany();
    res.json(payments);
  } catch (error) {
    next(error);
  }
};