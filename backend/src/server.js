import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import rateLimiter from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import classRoutes from './routes/class.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import fileRoutes from './routes/file.routes.js';
import webrtcRoutes from './routes/webrtc.routes.js';

// Import utilities
import logger from './utils/logger.js';
import { connectRedis } from './utils/redis.js';
import { setupSocketIO } from './utils/socket.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Connect to Redis
connectRedis();

// Setup Socket.IO
setupSocketIO(io);

// Make io accessible to routes
app.set('io', io);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    // Allow explicit FRONTEND_URL and local dev
    const allowed = [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5173', 'http://localhost:5174']
    if (!origin || allowed.includes(origin)) return cb(null, true)
    // For subdomain tenants, allow *.domain in dev if configured
    try {
      const url = new URL(allowed[0])
      if (origin.endsWith(url.host)) return cb(null, true)
    } catch {}
    return cb(null, false)
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
app.use('/api/', rateLimiter);

// Tenant resolution must run before routes
import { tenantResolver } from './middleware/tenant.js';
app.use(tenantResolver);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';

// Auth and user routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);

// Class routes
app.use(`/api/${API_VERSION}/classes`, classRoutes);

// Nested routes under classes
app.use(`/api/${API_VERSION}/classes/:classId/posts`, postRoutes);
app.use(`/api/${API_VERSION}/classes/:classId/assignments`, assignmentRoutes);
app.use(`/api/${API_VERSION}/classes/:classId/sessions`, attendanceRoutes);

// Nested routes under posts
app.use(`/api/${API_VERSION}/posts/:postId/comments`, commentRoutes);

// Nested routes under assignments
app.use(`/api/${API_VERSION}/assignments/:assignmentId`, submissionRoutes);

// Individual resource routes (for operations that don't need parent context)
app.use(`/api/${API_VERSION}/posts`, postRoutes);
app.use(`/api/${API_VERSION}/comments`, commentRoutes);
app.use(`/api/${API_VERSION}/assignments`, assignmentRoutes);
app.use(`/api/${API_VERSION}/submissions`, submissionRoutes);
app.use(`/api/${API_VERSION}/sessions`, attendanceRoutes);

// Student attendance routes
app.use(`/api/${API_VERSION}/students`, attendanceRoutes);

// Notification and file routes
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${API_VERSION}/files`, fileRoutes);

// WebRTC routes
app.use(`/api/${API_VERSION}/webrtc`, webrtcRoutes);

// API documentation (Swagger)
if (process.env.NODE_ENV === 'development') {
  const swaggerUi = await import('swagger-ui-express');
  const swaggerJsdoc = await import('swagger-jsdoc');
  
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'GCO API',
        version: '1.0.0',
        description: 'Google Classroom Clone API Documentation',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 8080}/api/${API_VERSION}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
  };

  const swaggerSpec = swaggerJsdoc.default(swaggerOptions);
  app.use('/api-docs', swaggerUi.default.serve, swaggerUi.default.setup(swaggerSpec));
  logger.info('Swagger documentation available at /api-docs');
}

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`📚 API available at http://localhost:${PORT}/api/${API_VERSION}`);
  if (process.env.NODE_ENV === 'development') {
    logger.info(`📖 API docs available at http://localhost:${PORT}/api-docs`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

export default app;
