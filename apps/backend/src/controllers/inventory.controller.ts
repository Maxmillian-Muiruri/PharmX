import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventory = await prisma.inventory.findMany();
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};