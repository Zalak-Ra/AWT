import dotenv from 'dotenv';
import { createApp } from './app';
import logger from './config/logger';
import prisma from './config/database';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Start the server
 */
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connection established');

    // Create Express app
    const app = createApp();

    // Start listening
    app.listen(PORT, () => {
      logger.info(`Payment Service is running on port ${PORT}`);
      logger.info(`Health check available at http://localhost:${PORT}/health`);
      logger.info(`API endpoints available at http://localhost:${PORT}/v1/payments`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      await prisma.$disconnect();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
