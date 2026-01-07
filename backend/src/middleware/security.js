import xss from 'xss-clean';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Security middleware module
 * Provides XSS protection, CSRF protection, and enhanced authorization
 */

// ===== XSS PROTECTION =====
/**
 * XSS Clean middleware (already available from xss-clean package)
 * This sanitizes user input to prevent XSS attacks
 */
export const xssProtection = xss();

/**
 * Custom XSS sanitization for specific fields
 */
export const sanitizeHtml = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      // Remove script tags
      value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      // Remove event handlers
      value = value.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
      // Remove javascript: protocol
      value = value.replace(/javascript:/gi, '');
    }
    return value;
  };

  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeValue(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

// ===== ENHANCED AUTHORIZATION =====

/**
 * Check if user owns a class
 */
export const isClassOwner = async (req, res, next) => {
  try {
    const classId = req.params.classId || req.params.id;
    const userId = req.user.id;

    const classData = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!classData) {
      return next(new ApiError('Class not found', 404));
    }

    if (classData.ownerId !== userId && req.user.role !== 'ADMIN') {
      return next(new ApiError('You do not have permission to perform this action', 403));
    }

    req.class = classData;
    next();
  } catch (error) {
    logger.error('Error in isClassOwner middleware:', error);
    next(error);
  }
};

/**
 * Check if user is enrolled in a class
 */
export const isEnrolled = async (req, res, next) => {
  try {
    const classId = req.params.classId || req.body.classId;
    const userId = req.user.id;

    // Check if user is owner of the class
    const classData = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!classData) {
      return next(new ApiError('Class not found', 404));
    }

    // Owner always has access
    if (classData.ownerId === userId || req.user.role === 'ADMIN') {
      req.class = classData;
      return next();
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        classId,
        userId,
        isActive: true
      }
    });

    if (!enrollment) {
      return next(new ApiError('You are not enrolled in this class', 403));
    }

    req.class = classData;
    req.enrollment = enrollment;
    next();
  } catch (error) {
    logger.error('Error in isEnrolled middleware:', error);
    next(error);
  }
};

/**
 * Check if user owns a resource (post, comment, etc.)
 */
export const isResourceOwner = (model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.id;

      const resource = await prisma[model].findUnique({
        where: { id: resourceId }
      });

      if (!resource) {
        return next(new ApiError('Resource not found', 404));
      }

      // Check ownership (different models use different fields)
      const ownerField = resource.authorId || resource.createdById || resource.userId;
      
      if (ownerField !== userId && req.user.role !== 'ADMIN') {
        return next(new ApiError('You do not have permission to perform this action', 403));
      }

      req.resource = resource;
      next();
    } catch (error) {
      logger.error(`Error in isResourceOwner middleware for ${model}:`, error);
      next(error);
    }
  };
};

/**
 * Check if user can grade submissions (teacher or admin)
 */
export const canGrade = async (req, res, next) => {
  try {
    const submissionId = req.params.id || req.params.submissionId;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            class: true
          }
        }
      }
    });

    if (!submission) {
      return next(new ApiError('Submission not found', 404));
    }

    const classOwnerId = submission.assignment.class.ownerId;
    const userId = req.user.id;

    if (classOwnerId !== userId && req.user.role !== 'ADMIN') {
      return next(new ApiError('Only the class teacher can grade submissions', 403));
    }

    req.submission = submission;
    next();
  } catch (error) {
    logger.error('Error in canGrade middleware:', error);
    next(error);
  }
};

// ===== RATE LIMITING HELPERS =====

/**
 * Track failed login attempts
 */
const loginAttempts = new Map();

export const trackLoginAttempts = (req, res, next) => {
  const identifier = req.body.email || req.ip;
  const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: Date.now() };

  // Reset if last attempt was more than 15 minutes ago
  if (Date.now() - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }

  // Check if locked out (more than 5 attempts)
  if (attempts.count >= 5) {
    const timeRemaining = Math.ceil((15 * 60 * 1000 - (Date.now() - attempts.lastAttempt)) / 1000 / 60);
    return next(new ApiError(`Too many login attempts. Please try again in ${timeRemaining} minutes`, 429));
  }

  req.loginAttempts = attempts;
  req.loginIdentifier = identifier;
  next();
};

export const recordFailedLogin = (identifier) => {
  const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: Date.now() };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(identifier, attempts);
};

export const clearLoginAttempts = (identifier) => {
  loginAttempts.delete(identifier);
};

// ===== REQUEST LOGGING =====

/**
 * Enhanced request logging with user tracking
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };

    if (req.user) {
      logData.userId = req.user.id;
      logData.userRole = req.user.role;
    }

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};

// ===== AUDIT LOGGING =====

/**
 * Log sensitive operations for audit trail
 */
export const auditLog = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
      // Log after successful operation
      if (res.statusCode < 400) {
        logger.info('Audit log', {
          action,
          userId: req.user?.id,
          userRole: req.user?.role,
          ip: req.ip,
          timestamp: new Date().toISOString(),
          resourceId: req.params.id || req.params.classId,
          method: req.method,
          url: req.originalUrl
        });
      }

      originalSend.call(this, data);
    };

    next();
  };
};

// ===== SECURITY HEADERS =====

/**
 * Add additional security headers
 */
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

// ===== IP WHITELIST (OPTIONAL) =====

/**
 * Restrict access to specific IP addresses (for admin routes)
 */
export const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    if (allowedIPs.length === 0) {
      return next(); // No restrictions
    }

    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!allowedIPs.includes(clientIP)) {
      logger.warn(`Unauthorized IP access attempt: ${clientIP}`);
      return next(new ApiError('Access denied from this IP address', 403));
    }

    next();
  };
};

// ===== EXPORT ALL =====

export default {
  xssProtection,
  sanitizeHtml,
  isClassOwner,
  isEnrolled,
  isResourceOwner,
  canGrade,
  trackLoginAttempts,
  recordFailedLogin,
  clearLoginAttempts,
  requestLogger,
  auditLog,
  securityHeaders,
  ipWhitelist
};
