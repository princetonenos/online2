import logger from './logger.js';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

let io = null;
const connectedUsers = new Map(); // userId -> socketId mapping
const prisma = new PrismaClient();

/**
 * Setup Socket.IO with authentication
 */
export const setupSocketIO = (socketIO) => {
  io = socketIO;
  
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId ?? decoded.id;
      socket.userRole = decoded.role;
      socket.schoolId = decoded.schoolId;

      // Fallback: load user to get schoolId if not present in token
      if (!socket.schoolId && socket.userId) {
        try {
          const user = await prisma.user.findUnique({ where: { id: socket.userId }, select: { schoolId: true } });
          socket.schoolId = user?.schoolId;
        } catch {}
      }
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });
  
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId} (Socket ID: ${socket.id})`);
    
    // Store user connection
    connectedUsers.set(socket.userId, socket.id);
    
    // Join user-specific room
    socket.join(`user:${socket.userId}`);

    // Join tenant rooms automatically if known
    if (socket.schoolId) {
      socket.join(`tenant:${socket.schoolId}`);
      socket.join(`tenant:${socket.schoolId}:classes`);
    }
    
    // Handle joining class rooms
    socket.on('join:class', (classId) => {
      socket.join(`class:${classId}`);
      logger.info(`User ${socket.userId} joined class room: ${classId}`);
    });
    
    // Handle leaving class rooms
    socket.on('leave:class', (classId) => {
      socket.leave(`class:${classId}`);
      logger.info(`User ${socket.userId} left class room: ${classId}`);
    });

    // Join tenant rooms explicitly (in case of late school switch)
    socket.on('join:tenant', (schoolId) => {
      if (!schoolId) return;
      socket.join(`tenant:${schoolId}`);
      socket.join(`tenant:${schoolId}:classes`);
      logger.info(`User ${socket.userId} joined tenant rooms for school: ${schoolId}`);
    });

    // Simple chat relay for live classes
    socket.on('chat:message', ({ classId, text, user }) => {
      try {
        const payload = {
          id: Date.now(),
          text,
          user: { id: socket.userId, name: user?.name || `User ${socket.userId}` },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        // emit to all except sender
        socket.to(`class:${classId}`).emit('chat:message', payload)
      } catch (err) {
        logger.error('chat:message error', err)
      }
    })
    
    // Handle typing indicators for comments
    socket.on('typing:start', ({ postId }) => {
      socket.to(`post:${postId}`).emit('user:typing', {
        userId: socket.userId,
        postId
      });
    });
    
    socket.on('typing:stop', ({ postId }) => {
      socket.to(`post:${postId}`).emit('user:stopped-typing', {
        userId: socket.userId,
        postId
      });
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId} (Socket ID: ${socket.id})`);
      connectedUsers.delete(socket.userId);
    });
    
    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${socket.userId}:`, error);
    });
  });
  
  logger.info('✅ Socket.IO setup complete');
};

/**
 * Get Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

/**
 * Emit event to specific user
 */
export const emitToUser = (userId, event, data) => {
  try {
    if (!io) {
      logger.warn('Socket.IO not initialized');
      return false;
    }
    
    io.to(`user:${userId}`).emit(event, data);
    return true;
  } catch (error) {
    logger.error(`Failed to emit to user ${userId}:`, error);
    return false;
  }
};

/**
 * Emit event to all users in a class
 */
export const emitToClass = (classId, event, data) => {
  try {
    if (!io) {
      logger.warn('Socket.IO not initialized');
      return false;
    }
    
    io.to(`class:${classId}`).emit(event, data);
    return true;
  } catch (error) {
    logger.error(`Failed to emit to class ${classId}:`, error);
    return false;
  }
};

/**
 * Emit event to multiple users
 */
export const emitToUsers = (userIds, event, data) => {
  try {
    if (!io) {
      logger.warn('Socket.IO not initialized');
      return false;
    }
    
    userIds.forEach(userId => {
      io.to(`user:${userId}`).emit(event, data);
    });
    return true;
  } catch (error) {
    logger.error('Failed to emit to users:', error);
    return false;
  }
};

/**
 * Broadcast event to all connected clients
 */
export const broadcast = (event, data) => {
  try {
    if (!io) {
      logger.warn('Socket.IO not initialized');
      return false;
    }
    
    io.emit(event, data);
    return true;
  } catch (error) {
    logger.error('Failed to broadcast:', error);
    return false;
  }
};

/**
 * Check if user is online
 */
export const isUserOnline = (userId) => {
  return connectedUsers.has(userId);
};

/**
 * Get all online users
 */
export const getOnlineUsers = () => {
  return Array.from(connectedUsers.keys());
};

/**
 * Get online users count
 */
export const getOnlineUsersCount = () => {
  return connectedUsers.size;
};

export default {
  setupSocketIO,
  getIO,
  emitToUser,
  emitToClass,
  emitToUsers,
  broadcast,
  isUserOnline,
  getOnlineUsers,
  getOnlineUsersCount,
};
