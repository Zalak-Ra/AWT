// src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import paymentRoutes from './modules/payments/payment.routes';

const app: Application = express();

// 1. Global Middleware
app.use(helmet()); // Security Headers
app.use(cors());   // Allow Cross-Origin Requests
app.use(express.json()); // Parse JSON bodies

// 2. Register Routes
app.use('/api/v1/payments', paymentRoutes);

// 3. Health Check (To see if server is alive)
app.get('/health', (_req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

export default app;