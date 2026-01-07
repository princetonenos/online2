import Joi from 'joi';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Validation middleware factory
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {string} source - Where to validate from: 'body', 'query', 'params'
 * @returns {Function} Express middleware
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown keys from the validated data
      convert: true, // Attempt to cast values to the required types
      presence: 'required' // Make all fields required by default
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      logger.warn(`Validation error on ${req.method} ${req.path}:`, {
        errors: error.details,
        data
      });

      return next(new ApiError(errorMessage, 400));
    }

    // Replace request data with validated & sanitized data
    req[source] = value;
    next();
  };
};

/**
 * Validate multiple sources at once
 * @param {Object} schemas - Object containing schemas for body, query, params
 * @returns {Function} Express middleware
 */
export const validateMultiple = (schemas) => {
  return async (req, res, next) => {
    try {
      const errors = [];

      // Validate each source
      for (const [source, schema] of Object.entries(schemas)) {
        const data = req[source];
        const { error, value } = schema.validate(data, {
          abortEarly: false,
          stripUnknown: true,
          convert: true
        });

        if (error) {
          errors.push(...error.details.map((d) => d.message));
        } else {
          req[source] = value;
        }
      }

      if (errors.length > 0) {
        logger.warn(`Multiple validation errors on ${req.method} ${req.path}`, {
          errors
        });
        return next(new ApiError(errors.join(', '), 400));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Sanitize common XSS attacks from string inputs
 */
export const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;

  // Remove script tags
  value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove on* event handlers
  value = value.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: protocol
  value = value.replace(/javascript:/gi, '');
  
  return value.trim();
};

/**
 * Custom Joi extensions for common patterns
 */
export const customJoi = Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.password': '{{#label}} must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character'
  },
  rules: {
    password: {
      validate(value, helpers) {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordRegex.test(value)) {
          return helpers.error('string.password');
        }
        
        return value;
      }
    }
  }
}));

// Common validation patterns
export const commonValidations = {
  // UUID validation
  uuid: Joi.string().uuid({ version: 'uuidv4' }),

  // Email validation
  email: Joi.string().email().lowercase().trim(),

  // Password validation
  password: customJoi.string().password().min(8).max(128),

  // Phone number (basic international format)
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),

  // URL validation
  url: Joi.string().uri(),

  // Date (ISO 8601)
  date: Joi.date().iso(),

  // Pagination
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),

  // Search query
  search: Joi.string().trim().max(200).allow(''),

  // Sort options
  sortBy: Joi.string().trim(),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),

  // Content fields
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().max(5000).allow(''),
  content: Joi.string().trim().min(1).max(10000),

  // Boolean with flexible input
  boolean: Joi.boolean().truthy('true', '1', 'yes').falsy('false', '0', 'no'),

  // Array of UUIDs
  uuidArray: Joi.array().items(Joi.string().uuid()),

  // File upload
  file: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string(),
    size: Joi.number(),
    filename: Joi.string(),
    path: Joi.string()
  })
};

// Validation error formatter
export const formatValidationError = (error) => {
  if (!error || !error.details) return 'Validation error';

  return error.details
    .map((detail) => {
      const field = detail.path.join('.');
      const message = detail.message.replace(/['"]/g, '');
      return `${field}: ${message}`;
    })
    .join('; ');
};

export default {
  validate,
  validateMultiple,
  sanitizeInput,
  customJoi,
  commonValidations,
  formatValidationError
};
