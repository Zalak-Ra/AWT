// src/app.ts
import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import paymentRoutes from './modules/payments/payment.routes';

const app: Application = express();

// 1. Global Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Security Headers (CSP off for inline styles/fonts)
app.use(cors());   // Allow Cross-Origin Requests
app.use(express.json()); // Parse JSON bodies

// 2. Serve Frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 3. Register Routes
app.use('/api/v1/payments', paymentRoutes);

// 3. Health Check (To see if server is alive)
app.get('/health', (_req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

export default app;