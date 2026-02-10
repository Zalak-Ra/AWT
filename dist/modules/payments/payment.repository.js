"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
// src/modules/payments/payment.repository.ts
const database_1 = require("../../config/database"); // Your DB connection
const crypto_1 = require("crypto");
class PaymentRepository {
    // 1. Create a new Payment Intent
    async create(data) {
        return await database_1.prisma.paymentIntent.create({
            data: {
                amount: data.amount,
                currency: data.currency,
                description: data.description,
                status: 'CREATED',
                // Generate a random client_secret (in production, use a stronger crypto lib)
                client_secret: `pi_${(0, crypto_1.randomUUID)()}_secret_${(0, crypto_1.randomUUID)().slice(0, 8)}`,
            },
        });
    }
    // 2. Find a Payment by ID
    async findById(id) {
        return await database_1.prisma.paymentIntent.findUnique({
            where: { id },
        });
    }
    // 3. Update Status (e.g., when Bank confirms payment)
    async updateStatus(data) {
        return await database_1.prisma.paymentIntent.update({
            where: { id: data.id },
            data: {
                status: data.status,
                updated_at: new Date(),
            },
        });
    }
    // 4. Check for Idempotency (Prevent double charging)
    async findByIdempotencyKey(key) {
        return await database_1.prisma.paymentIntent.findUnique({
            where: { idempotency_key: key },
        });
    }
}
exports.PaymentRepository = PaymentRepository;
