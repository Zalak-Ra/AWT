import express, { Application } from 'express';
import { createPaymentRoutes } from './routes/payment.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import logger from './config/logger';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
    });
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'payment-service',
    });
  });

  // API version 1 routes
  app.use('/v1/payments', createPaymentRoutes());

  // 404 handler
  app.use(notFoundHandler);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
