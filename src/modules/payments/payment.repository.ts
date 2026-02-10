// src/modules/payments/payment.repository.ts
import { prisma } from '../../config/database'; // Your DB connection
import { CreatePaymentDTO, UpdatePaymentStatusDTO, PaymentIntent } from './interfaces/payment.interface';
import { randomUUID } from 'crypto';

export class PaymentRepository {

    // 1. Create a new Payment Intent
    async create(data: CreatePaymentDTO): Promise<PaymentIntent> {
        return await prisma.paymentIntent.create({
            data: {
                amount: data.amount,
                currency: data.currency,
                description: data.description,
                status: 'CREATED',
                // Generate a random client_secret (in production, use a stronger crypto lib)
                client_secret: `pi_${randomUUID()}_secret_${randomUUID().slice(0, 8)}`,
            },
        });
    }

    // 2. Find a Payment by ID
    async findById(id: string): Promise<PaymentIntent | null> {
        return await prisma.paymentIntent.findUnique({
            where: { id },
        });
    }

    // 3. Update Status (e.g., when Bank confirms payment)
    async updateStatus(data: UpdatePaymentStatusDTO): Promise<PaymentIntent> {
        return await prisma.paymentIntent.update({
            where: { id: data.id },
            data: {
                status: data.status,
                updated_at: new Date(),
            },
        });
    }

    // 4. Check for Idempotency (Prevent double charging)
    async findByIdempotencyKey(key: string): Promise<PaymentIntent | null> {
        return await prisma.paymentIntent.findUnique({
            where: { idempotency_key: key },
        });
    }
}