import express from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions
} from '../controllers/assignment.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(protect);

/**
 * Class-specific assignment routes (nested under /classes/:classId)
 * These routes are mounted in server.js as: /api/v1/classes/:classId/assignments
 */

// @route   GET /api/v1/classes/:classId/assignments
// @desc    Get all assignments for a class
// @access  Private (enrolled students, teacher, admin)
router.get('/', getAssignments);

// @route   POST /api/v1/classes/:classId/assignments
// @desc    Create new assignment in a class
// @access  Private/Teacher (class owner, admin)
router.post('/', authorize('TEACHER', 'ADMIN'), createAssignment);

/**
 * Individual assignment routes (can be mounted at /api/v1/assignments)
 * For operations that don't need classId in the URL
 */

// @route   GET /api/v1/assignments/:id
// @desc    Get single assignment by ID
// @access  Private (enrolled students, teacher, admin)
router.get('/:id', getAssignmentById);

// @route   PUT /api/v1/assignments/:id
// @desc    Update assignment
// @access  Private/Teacher (assignment creator, class owner, admin)
router.put('/:id', authorize('TEACHER', 'ADMIN'), updateAssignment);

// @route   DELETE /api/v1/assignments/:id
// @desc    Delete assignment
// @access  Private/Teacher (assignment creator, class owner, admin)
router.delete('/:id', authorize('TEACHER', 'ADMIN'), deleteAssignment);

// @route   GET /api/v1/assignments/:id/submissions
// @desc    Get all submissions for an assignment
// @access  Private/Teacher (class owner, admin)
router.get('/:id/submissions', authorize('TEACHER', 'ADMIN'), getAssignmentSubmissions);

export default router;
