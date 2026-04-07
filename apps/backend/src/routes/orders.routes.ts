import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Orders endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create order' });
});

export default router;