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

export const trackOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Order ID or Order Number is required' });
    }

    // Try to find by UUID first (database id)
    let order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            order: true,
          },
        },
      },
    });

    // If not found by UUID, try to find by orderNumber
    if (!order) {
      order = await prisma.order.findUnique({
        where: { orderNumber: id },
        include: {
          orderItems: {
            include: {
              order: true,
            },
          },
        },
      });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      orderItems: order.orderItems,
    });
  } catch (error) {
    next(error);
  }
};