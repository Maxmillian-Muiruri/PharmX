import { Router } from 'express';
import { getOrderItems } from '../controllers/order.item.controller';

const router = Router();

router.get('/', getOrderItems);

export default router;