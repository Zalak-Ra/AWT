// src/modules/payments/payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    // We use an arrow function here to keep 'this' bound correctly
    createIntent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { amount, currency, description } = req.body;

            // 1. Basic Input Validation
            if (!amount || !currency) {
                res.status(400).json({ error: 'Amount and currency are required' });
                return;
            }

            // 2. Call the Business Logic
            const result = await this.paymentService.initPayment({
                amount: BigInt(amount), // Convert JSON number/string to BigInt
                currency,
                description
            });

            // 3. Send Success Response
            res.status(201).json({
                success: true,
                data: result
            });

        } catch (error: any) {
            // 4. Handle Errors Gracefully
            console.error('Payment Error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal Server Error'
            });
        }
    };
}