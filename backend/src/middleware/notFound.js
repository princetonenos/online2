import { ApiError } from '../utils/ApiError.js';

/**
 * 404 handler for undefined routes
 */
export const notFound = (req, res, next) => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};
