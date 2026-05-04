import { Router } from 'express';
import { getOrderItems, trackOrder } from '../controllers/orders.controller';

const router = Router();

router.get('/', getOrderItems);

router.get('/track/:id', trackOrder);

router.post('/', (req, res) => {
  res.json({ message: 'Create order' });
});

export default router;