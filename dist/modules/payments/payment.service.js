"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
// src/modules/payments/payment.service.ts
const payment_repository_1 = require("./payment.repository");
class PaymentService {
    paymentRepo;
    constructor() {
        this.paymentRepo = new payment_repository_1.PaymentRepository();
    }
    // The logic to start a payment
    async initPayment(data) {
        // 1. Validation (Business Logic)
        if (data.amount <= 0) {
            throw new Error('Amount must be greater than zero');
        }
        // 2. Create the Intent in DB
        const payment = await this.paymentRepo.create(data);
        // 3. Return the secrets to the Controller
        return {
            id: payment.id,
            client_secret: payment.client_secret,
            amount: payment.amount.toString(), // Convert BigInt to string for JSON
            currency: payment.currency,
            status: payment.status
        };
    }
}
exports.PaymentService = PaymentService;
