import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';

const prisma = new PrismaClient();

/**
 * Authenticate user with JWT token
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle both userId and id in token (robust fallback)
    const userId = decoded.userId ?? decoded.id;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        fullName: true,
        avatarUrl: true,
        isActive: true,
        schoolId: true
      }
    });
    
    if (!user) {
      throw new ApiError(401, 'User not found');
    }
    
    if (!user.isActive) {
      throw new ApiError(403, 'Account is inactive');
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    next(error);
  }
};

/**
 * Authorize user based on roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }
    
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Not authorized to access this resource');
    }
    
    next();
  };
};

// Alias for backward compatibility - many routes import 'protect'
export const protect = authenticate;

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Handle both userId and id in token (robust fallback)
      const userId = decoded.userId ?? decoded.id;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          fullName: true,
          avatarUrl: true,
          schoolId: true
        }
      });
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};

/**
 * Check if user owns a resource or has appropriate role
 */
export const checkOwnership = (resourceOwnerId) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }
    
    // Admin can access everything
    if (req.user.role === 'ADMIN') {
      return next();
    }
    
    // Check if user owns the resource
    if (req.user.id !== resourceOwnerId) {
      throw new ApiError(403, 'Not authorized to access this resource');
    }
    
    next();
  };
};
