import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import ordersRoutes from './orders.routes';
import orderItemRoutes from './order.item.routes';
import inventoryRoutes from './inventory.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/orders', ordersRoutes);
router.use('/order-items', orderItemRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/payments', paymentRoutes);

export default router;