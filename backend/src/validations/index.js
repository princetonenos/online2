import Joi from 'joi';
import { commonValidations } from '../middleware/validate.js';

/**
 * Consolidated validation schemas for all API modules
 * This file exports all validation schemas in one place for easy imports
 */

// ===== POST VALIDATIONS =====
export const postValidation = {
  create: Joi.object({
    type: Joi.string().valid('ANNOUNCEMENT', 'MATERIAL', 'ASSIGNMENT', 'QUESTION').default('ANNOUNCEMENT'),
    title: commonValidations.title.optional().allow('', null),
    content: commonValidations.content.required(),
    attachments: Joi.array().items(Joi.object()).optional(),
    scheduledAt: commonValidations.date.optional().allow(null)
  }),
  
  update: Joi.object({
    type: Joi.string().valid('ANNOUNCEMENT', 'MATERIAL', 'ASSIGNMENT', 'QUESTION').optional(),
    title: commonValidations.title.optional().allow('', null),
    content: commonValidations.content.optional(),
    attachments: Joi.array().items(Joi.object()).optional(),
    scheduledAt: commonValidations.date.optional().allow(null)
  }).min(1),
  
  query: Joi.object({
    page: commonValidations.page,
    limit: commonValidations.limit,
    type: Joi.string().valid('ANNOUNCEMENT', 'MATERIAL', 'ASSIGNMENT', 'QUESTION').optional(),
    search: commonValidations.search
  })
};

// ===== COMMENT VALIDATIONS =====
export const commentValidation = {
  create: Joi.object({
    content: Joi.string().trim().min(1).max(1000).required()
      .messages({
        'string.empty': 'Comment content is required',
        'string.max': 'Comment must not exceed 1000 characters'
      })
  }),
  
  update: Joi.object({
    content: Joi.string().trim().min(1).max(1000).required()
  }),
  
  query: Joi.object({
    page: commonValidations.page,
    limit: commonValidations.limit
  })
};

// ===== ASSIGNMENT VALIDATIONS =====
export const assignmentValidation = {
  create: Joi.object({
    title: commonValidations.title.required(),
    description: commonValidations.description.optional().allow('', null),
    type: Joi.string().valid('ASSIGNMENT', 'QUIZ', 'MATERIAL', 'QUESTION').default('ASSIGNMENT'),
    points: Joi.number().integer().min(0).max(1000).optional().allow(null)
      .messages({
        'number.min': 'Points cannot be negative',
        'number.max': 'Points cannot exceed 1000'
      }),
    dueDate: commonValidations.date.optional().allow(null),
    topic: Joi.string().trim().max(100).optional().allow('', null),
    attachments: Joi.array().items(Joi.object()).optional(),
    allowLateSubmission: commonValidations.boolean.default(true)
  }),
  
  update: Joi.object({
    title: commonValidations.title.optional(),
    description: commonValidations.description.optional().allow('', null),
    type: Joi.string().valid('ASSIGNMENT', 'QUIZ', 'MATERIAL', 'QUESTION').optional(),
    points: Joi.number().integer().min(0).max(1000).optional().allow(null),
    dueDate: commonValidations.date.optional().allow(null),
    topic: Joi.string().trim().max(100).optional().allow('', null),
    attachments: Joi.array().items(Joi.object()).optional(),
    allowLateSubmission: commonValidations.boolean.optional()
  }).min(1),
  
  query: Joi.object({
    page: commonValidations.page,
    limit: commonValidations.limit,
    type: Joi.string().valid('ASSIGNMENT', 'QUIZ', 'MATERIAL', 'QUESTION').optional(),
    status: Joi.string().valid('ALL', 'ASSIGNED', 'MISSING', 'LATE', 'DONE').optional()
  })
};

// ===== SUBMISSION VALIDATIONS =====
export const submissionValidation = {
  submit: Joi.object({
    content: Joi.string().trim().max(10000).optional().allow('', null),
    attachments: Joi.array().items(Joi.object()).optional()
  }),
  
  grade: Joi.object({
    grade: Joi.number().min(0).required()
      .messages({
        'number.base': 'Grade must be a number',
        'number.min': 'Grade cannot be negative'
      }),
    feedback: Joi.string().trim().max(5000).optional().allow('', null)
  }),
  
  update: Joi.object({
    grade: Joi.number().min(0).optional(),
    feedback: Joi.string().trim().max(5000).optional().allow('', null),
    status: Joi.string().valid('ASSIGNED', 'TURNED_IN', 'GRADED', 'RETURNED', 'MISSING', 'LATE').optional()
  }).min(1)
};

// ===== USER VALIDATIONS =====
export const userValidation = {
  update: Joi.object({
    firstName: Joi.string().trim().min(1).max(50).optional(),
    lastName: Joi.string().trim().min(1).max(50).optional(),
    phone: commonValidations.phone.optional().allow('', null),
    bio: Joi.string().trim().max(1000).optional().allow('', null),
    gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY').optional(),
    dateOfBirth: commonValidations.date.optional().allow(null)
  }).min(1),
  
  query: Joi.object({
    page: commonValidations.page,
    limit: commonValidations.limit,
    role: Joi.string().valid('STUDENT', 'TEACHER', 'ADMIN').optional(),
    search: commonValidations.search,
    isActive: commonValidations.boolean.optional()
  })
};

// ===== ATTENDANCE VALIDATIONS =====
export const attendanceValidation = {
  createSession: Joi.object({
    title: commonValidations.title.required(),
    description: commonValidations.description.optional().allow('', null),
    startTime: commonValidations.date.required()
      .messages({
        'date.base': 'Start time must be a valid date'
      }),
    endTime: commonValidations.date.optional().allow(null)
      .greater(Joi.ref('startTime'))
      .messages({
        'date.greater': 'End time must be after start time'
      }),
    resources: Joi.array().items(Joi.object()).optional(),
    notes: Joi.string().trim().max(5000).optional().allow('', null)
  }),
  
  updateSession: Joi.object({
    title: commonValidations.title.optional(),
    description: commonValidations.description.optional().allow('', null),
    startTime: commonValidations.date.optional(),
    endTime: commonValidations.date.optional().allow(null),
    resources: Joi.array().items(Joi.object()).optional(),
    notes: Joi.string().trim().max(5000).optional().allow('', null)
  }).min(1),
  
  markAttendance: Joi.object({
    studentId: commonValidations.uuid.required(),
    status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'EXCUSED').required(),
    notes: Joi.string().trim().max(500).optional().allow('', null)
  }),
  
  bulkMarkAttendance: Joi.object({
    attendanceRecords: Joi.array().items(
      Joi.object({
        studentId: commonValidations.uuid.required(),
        status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'EXCUSED').required(),
        notes: Joi.string().trim().max(500).optional().allow('', null)
      })
    ).min(1).max(500).required()
  }),
  
  query: Joi.object({
    page: commonValidations.page,
    limit: commonValidations.limit,
    startDate: commonValidations.date.optional(),
    endDate: commonValidations.date.optional().min(Joi.ref('startDate'))
  })
};

// ===== NOTIFICATION VALIDATIONS =====
export const notificationValidation = {
  create: Joi.object({
    userId: commonValidations.uuid.required(),
    type: Joi.string().valid(
      'ASSIGNMENT_CREATED',
      'ASSIGNMENT_GRADED',
      'POST_CREATED',
      'COMMENT_ADDED',
      'CLASS_INVITATION',
      'SUBMISSION_REMINDER',
      'SYSTEM'
    ).required(),
    title: commonValidations.title.required(),
    content: Joi.string().trim().min(1).max(5000).required(),
    relatedId: commonValidations.uuid.optional().allow(null)
  }),
  
  query: Joi.object({
    page: commonValidations.page,
    limit: commonValidations.limit,
    unreadOnly: commonValidations.boolean.optional(),
    type: Joi.string().valid(
      'ASSIGNMENT_CREATED',
      'ASSIGNMENT_GRADED',
      'POST_CREATED',
      'COMMENT_ADDED',
      'CLASS_INVITATION',
      'SUBMISSION_REMINDER',
      'SYSTEM'
    ).optional()
  })
};

// ===== FILE VALIDATIONS =====
export const fileValidation = {
  query: Joi.object({
    page: commonValidations.page,
    limit: commonValidations.limit,
    mimeType: Joi.string().optional()
  }),
  
  bulkDelete: Joi.object({
    fileIds: Joi.array()
      .items(commonValidations.uuid)
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.min': 'At least one file ID is required',
        'array.max': 'Cannot delete more than 50 files at once'
      })
  })
};

// ===== PARAM VALIDATIONS (for URL params) =====
export const paramValidation = {
  uuid: Joi.object({
    id: commonValidations.uuid.required()
      .messages({
        'string.guid': 'Invalid ID format'
      })
  }),
  
  classId: Joi.object({
    classId: commonValidations.uuid.required()
      .messages({
        'string.guid': 'Invalid class ID format'
      })
  }),
  
  postId: Joi.object({
    postId: commonValidations.uuid.required()
      .messages({
        'string.guid': 'Invalid post ID format'
      })
  }),
  
  assignmentId: Joi.object({
    assignmentId: commonValidations.uuid.required()
      .messages({
        'string.guid': 'Invalid assignment ID format'
      })
  }),
  
  sessionId: Joi.object({
    sessionId: commonValidations.uuid.required()
      .messages({
        'string.guid': 'Invalid session ID format'
      })
  })
};

// Export all validations
export default {
  post: postValidation,
  comment: commentValidation,
  assignment: assignmentValidation,
  submission: submissionValidation,
  user: userValidation,
  attendance: attendanceValidation,
  notification: notificationValidation,
  file: fileValidation,
  param: paramValidation
};
