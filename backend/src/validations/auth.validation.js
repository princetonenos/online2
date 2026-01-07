import Joi from 'joi';
import { customJoi, commonValidations } from '../middleware/validate.js';

/**
 * Auth validation schemas
 */

// Register validation
export const registerSchema = Joi.object({
  email: commonValidations.email.required(),
  password: commonValidations.password.required(),
  firstName: Joi.string().trim().min(1).max(50).required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 1 character',
      'string.max': 'First name must not exceed 50 characters'
    }),
  lastName: Joi.string().trim().min(1).max(50).required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 1 character',
      'string.max': 'Last name must not exceed 50 characters'
    }),
  role: Joi.string().valid('STUDENT', 'TEACHER', 'ADMIN').default('STUDENT')
    .messages({
      'any.only': 'Role must be STUDENT, TEACHER, or ADMIN'
    }),
  phone: commonValidations.phone.optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY').optional(),
  dateOfBirth: commonValidations.date.optional()
});

// Login validation
export const loginSchema = Joi.object({
  email: commonValidations.email.required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// Refresh token validation
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
    .messages({
      'string.empty': 'Refresh token is required'
    })
});

// Forgot password validation
export const forgotPasswordSchema = Joi.object({
  email: commonValidations.email.required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    })
});

// Reset password validation
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required()
    .messages({
      'string.empty': 'Reset token is required'
    }),
  password: commonValidations.password.required()
    .messages({
      'string.empty': 'New password is required'
    })
});

// Change password validation
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required()
    .messages({
      'string.empty': 'Current password is required'
    }),
  newPassword: commonValidations.password.required()
    .messages({
      'string.empty': 'New password is required'
    })
}).custom((value, helpers) => {
  if (value.currentPassword === value.newPassword) {
    return helpers.error('any.invalid', {
      message: 'New password must be different from current password'
    });
  }
  return value;
});

// Verify email validation
export const verifyEmailSchema = Joi.object({
  token: Joi.string().required()
    .messages({
      'string.empty': 'Verification token is required'
    })
});

export default {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema
};
