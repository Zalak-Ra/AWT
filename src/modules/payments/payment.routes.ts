// src/modules/payments/payment.routes.ts
import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();
const controller = new PaymentController();

// Map the Endpoint to the Controller Function
// POST /api/v1/payments/intents
router.post('/intents', controller.createIntent);

export default router;