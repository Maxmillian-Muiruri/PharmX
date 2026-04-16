import { Router } from 'express';
import { getPayment } from '../controllers/payment.controller';

const router = Router();

router.get('/', getPayment);

export default router;