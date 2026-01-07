import logger from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;
  
  // If it's not an ApiError, convert it to one
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  
  // Log error
  const errorLog = {
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
  };
  
  if (error.statusCode >= 500) {
    logger.error('Server Error:', errorLog);
  } else {
    logger.warn('Client Error:', errorLog);
  }
  
  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: error,
    }),
  });
};

/**
 * Handle async errors in route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
