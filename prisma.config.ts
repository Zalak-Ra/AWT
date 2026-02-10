// prisma.config.ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    // This connects Prisma CLI (migrations/push) to your DB
    url: process.env.DATABASE_URL!,
  },
});