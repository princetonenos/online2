import Joi from 'joi';
import { commonValidations } from '../middleware/validate.js';

/**
 * Class validation schemas
 */

// Create class validation
export const createClassSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required()
    .messages({
      'string.empty': 'Class name is required',
      'string.min': 'Class name must be at least 1 character',
      'string.max': 'Class name must not exceed 200 characters'
    }),
  section: Joi.string().trim().max(50).optional().allow('', null)
    .messages({
      'string.max': 'Section must not exceed 50 characters'
    }),
  subject: Joi.string().trim().max(100).optional().allow('', null)
    .messages({
      'string.max': 'Subject must not exceed 100 characters'
    }),
  room: Joi.string().trim().max(50).optional().allow('', null)
    .messages({
      'string.max': 'Room must not exceed 50 characters'
    }),
  description: commonValidations.description.optional().allow('', null),
  bannerUrl: commonValidations.url.optional().allow('', null)
    .messages({
      'string.uri': 'Banner URL must be a valid URL'
    }),
  status: Joi.string().valid('ACTIVE', 'ARCHIVED', 'DRAFT').default('ACTIVE')
    .messages({
      'any.only': 'Status must be ACTIVE, ARCHIVED, or DRAFT'
    }),
  settings: Joi.object().optional()
});

// Update class validation
export const updateClassSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).optional()
    .messages({
      'string.empty': 'Class name cannot be empty',
      'string.min': 'Class name must be at least 1 character',
      'string.max': 'Class name must not exceed 200 characters'
    }),
  section: Joi.string().trim().max(50).optional().allow('', null),
  subject: Joi.string().trim().max(100).optional().allow('', null),
  room: Joi.string().trim().max(50).optional().allow('', null),
  description: commonValidations.description.optional().allow('', null),
  bannerUrl: commonValidations.url.optional().allow('', null),
  status: Joi.string().valid('ACTIVE', 'ARCHIVED', 'DRAFT').optional()
    .messages({
      'any.only': 'Status must be ACTIVE, ARCHIVED, or DRAFT'
    }),
  settings: Joi.object().optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Join class validation
export const joinClassSchema = Joi.object({
  code: Joi.string().trim().min(3).max(50).required()
    .messages({
      'string.empty': 'Class code is required',
      'string.min': 'Class code must be at least 3 characters',
      'string.max': 'Class code must not exceed 50 characters'
    })
});

// Get classes query validation
export const getClassesQuerySchema = Joi.object({
  page: commonValidations.page,
  limit: commonValidations.limit,
  status: Joi.string().valid('ACTIVE', 'ARCHIVED', 'DRAFT').optional(),
  search: commonValidations.search,
  sortBy: Joi.string().valid('name', 'createdAt', 'updatedAt').optional(),
  sortOrder: commonValidations.sortOrder
});

// Add students to class validation
export const addStudentsSchema = Joi.object({
  studentIds: Joi.array()
    .items(commonValidations.uuid)
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one student ID is required',
      'array.max': 'Cannot add more than 100 students at once',
      'array.base': 'Student IDs must be an array'
    })
});

// Remove student from class validation
export const removeStudentSchema = Joi.object({
  studentId: commonValidations.uuid.required()
    .messages({
      'string.empty': 'Student ID is required',
      'string.guid': 'Student ID must be a valid UUID'
    })
});

// Update class settings validation
export const updateSettingsSchema = Joi.object({
  settings: Joi.object({
    allowStudentPosts: Joi.boolean().optional(),
    allowLateSubmissions: Joi.boolean().optional(),
    gradeVisibility: Joi.string().valid('PUBLIC', 'PRIVATE').optional(),
    notificationPreferences: Joi.object({
      email: Joi.boolean().optional(),
      push: Joi.boolean().optional(),
      sms: Joi.boolean().optional()
    }).optional(),
    allowComments: Joi.boolean().optional(),
    theme: Joi.string().max(50).optional()
  }).required()
    .messages({
      'object.base': 'Settings must be an object'
    })
});

// Class ID param validation
export const classIdParamSchema = Joi.object({
  id: commonValidations.uuid.required()
    .messages({
      'string.empty': 'Class ID is required',
      'string.guid': 'Class ID must be a valid UUID'
    })
});

export default {
  createClassSchema,
  updateClassSchema,
  joinClassSchema,
  getClassesQuerySchema,
  addStudentsSchema,
  removeStudentSchema,
  updateSettingsSchema,
  classIdParamSchema
};
