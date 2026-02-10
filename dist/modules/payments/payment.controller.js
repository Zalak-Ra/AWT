"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
class PaymentController {
    paymentService;
    constructor() {
        this.paymentService = new payment_service_1.PaymentService();
    }
    // We use an arrow function here to keep 'this' bound correctly
    createIntent = async (req, res) => {
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
        }
        catch (error) {
            // 4. Handle Errors Gracefully
            console.error('Payment Error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal Server Error'
            });
        }
    };
}
exports.PaymentController = PaymentController;
