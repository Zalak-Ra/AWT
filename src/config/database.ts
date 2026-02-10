// src/config/database.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Define a global type to prevent "global.prisma" errors
const globalForPrisma = global as typeof globalThis & { prisma?: PrismaClient };

// Lazy initialization to ensure DATABASE_URL is loaded from .env first
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Pass PoolConfig directly to PrismaPg (it accepts pg.Pool | pg.PoolConfig)
  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });

  // Cache in dev mode to prevent "Too many connections" error
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
}

export const prisma = globalForPrisma.prisma || createPrismaClient();