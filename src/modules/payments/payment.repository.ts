// src/modules/payments/payment.repository.ts
import { PrismaClient } from '@prisma/client';
import { CreatePaymentDTO, UpdatePaymentStatusDTO, PaymentIntent } from './interfaces/payment.interface';
import { randomUUID } from 'crypto';

// Lazy singleton — only connects when first DB call is made
let _prisma: PrismaClient | null = null;
function getPrisma(): PrismaClient {
    if (!_prisma) {
        _prisma = new PrismaClient();
    }
    return _prisma;
}

export class PaymentRepository {

    // 1. Create a new Payment Intent
    async create(data: CreatePaymentDTO): Promise<PaymentIntent> {
        return await getPrisma().paymentIntent.create({
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
        return await getPrisma().paymentIntent.findUnique({
            where: { id },
        });
    }

    // 3. Update Status (e.g., when Bank confirms payment)
    async updateStatus(data: UpdatePaymentStatusDTO): Promise<PaymentIntent> {
        return await getPrisma().paymentIntent.update({
            where: { id: data.id },
            data: {
                status: data.status,
                updated_at: new Date(),
            },
        });
    }

    // 4. Check for Idempotency (Prevent double charging)
    async findByIdempotencyKey(key: string): Promise<PaymentIntent | null> {
        return await getPrisma().paymentIntent.findUnique({
            where: { idempotency_key: key },
        });
    }
<<<<<<< HEAD
}
=======
<<<<<<< HEAD

    // 5. Log a Transaction Attempt (Bank Response)
    async addTransaction(paymentId: string, status: 'SUCCESS' | 'FAILURE', rawResponse: unknown) {
        return await prisma.transaction.create({
            data: {
                payment_intent_id: paymentId,
                status,
                raw_response: rawResponse as any,
                provider_ref_id: `tx_${randomUUID()}` // Mock Bank Transaction ID
            }
        });
    }

    // 6. Fetch all PaymentIntents with their Transaction history
    async findAllWithTransactions() {
        return await prisma.paymentIntent.findMany({
            orderBy: { created_at: 'desc' },
            include: { transactions: true },
        });
    }
}
=======
}
>>>>>>> 8618efe (backend)
>>>>>>> 7b18c20 (add front)
