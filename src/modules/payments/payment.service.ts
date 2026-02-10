// src/modules/payments/payment.service.ts
import { PaymentRepository } from './payment.repository';
import { CreatePaymentDTO } from './interfaces/payment.interface';

export class PaymentService {
    private paymentRepo: PaymentRepository;

    constructor() {
        this.paymentRepo = new PaymentRepository();
    }

    // The logic to start a payment
    async initPayment(data: CreatePaymentDTO) {
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