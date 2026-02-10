// src/modules/payments/interfaces/payment.interface.ts
import { PaymentIntent } from '@prisma/client';

export interface CreatePaymentDTO {
    amount: bigint; // Use BigInt for money (cents/paisa)
    currency: string;
    description?: string;
    paymentMethodId?: string;
}

export interface UpdatePaymentStatusDTO {
    id: string;
    status: 'PROCESSING' | 'SUCCEEDED' | 'FAILED';
    providerRefId?: string; // The ID from the bank (e.g. Stripe ID)
}

// Re-export the Prisma type so we can use it elsewhere easily
export type { PaymentIntent };