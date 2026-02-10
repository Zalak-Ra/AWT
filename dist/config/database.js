"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// src/config/database.ts
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
// Define a global type to prevent "global.prisma" errors
const globalForPrisma = global;
// Lazy initialization to ensure DATABASE_URL is loaded from .env first
function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    // Pass PoolConfig directly to PrismaPg (it accepts pg.Pool | pg.PoolConfig)
    const adapter = new adapter_pg_1.PrismaPg({ connectionString });
    const client = new client_1.PrismaClient({ adapter });
    // Cache in dev mode to prevent "Too many connections" error
    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = client;
    }
    return client;
}
exports.prisma = globalForPrisma.prisma || createPrismaClient();
