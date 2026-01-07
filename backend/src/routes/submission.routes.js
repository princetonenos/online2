import express from 'express';
import {
  getMySubmission,
  submitAssignment,
  unsubmitAssignment,
  getSubmissionById,
  gradeSubmission,
  returnSubmission,
  updateSubmission
} from '../controllers/submission.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(protect);

/**
 * Assignment-specific submission routes (nested under /assignments/:assignmentId)
 * These routes are mounted in server.js as: /api/v1/assignments/:assignmentId/submission
 */

// @route   GET /api/v1/assignments/:assignmentId/submission
// @desc    Get student's own submission for an assignment
// @access  Private/Student
router.get('/submission', getMySubmission);

// @route   POST /api/v1/assignments/:assignmentId/submit
// @desc    Submit assignment (create or update submission)
// @access  Private/Student
router.post('/submit', submitAssignment);

// @route   POST /api/v1/assignments/:assignmentId/unsubmit
// @desc    Unsubmit assignment (revert to assigned status)
// @access  Private/Student
router.post('/unsubmit', unsubmitAssignment);

/**
 * Individual submission routes (can be mounted at /api/v1/submissions)
 * For operations that need direct submission ID access
 */

// @route   GET /api/v1/submissions/:id
// @desc    Get single submission by ID
// @access  Private (student owner, teacher, admin)
router.get('/:id', getSubmissionById);

// @route   PUT /api/v1/submissions/:id
// @desc    Update submission (teacher updates grade/feedback/status)
// @access  Private/Teacher (class owner, admin)
router.put('/:id', authorize('TEACHER', 'ADMIN'), updateSubmission);

// @route   POST /api/v1/submissions/:id/grade
// @desc    Grade submission
// @access  Private/Teacher (class owner, admin)
router.post('/:id/grade', authorize('TEACHER', 'ADMIN'), gradeSubmission);

// @route   POST /api/v1/submissions/:id/return
// @desc    Return graded submission to student
// @access  Private/Teacher (class owner, admin)
router.post('/:id/return', authorize('TEACHER', 'ADMIN'), returnSubmission);

export default router;
