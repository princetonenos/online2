import express from 'express';
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  markAttendance,
  bulkMarkAttendance,
  getStudentAttendance
} from '../controllers/attendance.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(protect);

/**
 * Class-specific session routes (nested under /classes/:classId)
 * These routes are mounted in server.js as: /api/v1/classes/:classId/sessions
 */

// @route   GET /api/v1/classes/:classId/sessions
// @desc    Get all sessions for a class
// @access  Private (enrolled students, teacher, admin)
router.get('/', getSessions);

// @route   POST /api/v1/classes/:classId/sessions
// @desc    Create new session in a class
// @access  Private/Teacher (class owner, admin)
router.post('/', authorize('TEACHER', 'ADMIN'), createSession);

/**
 * Individual session routes (can be mounted at /api/v1/sessions)
 * For operations that don't need classId in the URL
 */

// @route   GET /api/v1/sessions/:id
// @desc    Get single session by ID
// @access  Private (enrolled students, teacher, admin)
router.get('/:id', getSessionById);

// @route   PUT /api/v1/sessions/:id
// @desc    Update session
// @access  Private/Teacher (class owner, admin)
router.put('/:id', authorize('TEACHER', 'ADMIN'), updateSession);

// @route   DELETE /api/v1/sessions/:id
// @desc    Delete session
// @access  Private/Teacher (class owner, admin)
router.delete('/:id', authorize('TEACHER', 'ADMIN'), deleteSession);

// @route   POST /api/v1/sessions/:sessionId/attendance
// @desc    Mark attendance for a session
// @access  Private/Teacher (class owner, admin)
router.post('/:sessionId/attendance', authorize('TEACHER', 'ADMIN'), markAttendance);

// @route   POST /api/v1/sessions/:sessionId/attendance/bulk
// @desc    Bulk mark attendance for a session
// @access  Private/Teacher (class owner, admin)
router.post('/:sessionId/attendance/bulk', authorize('TEACHER', 'ADMIN'), bulkMarkAttendance);

/**
 * Student attendance routes
 */

// @route   GET /api/v1/students/:studentId/attendance
// @desc    Get student attendance records
// @access  Private (student themselves, their teachers, admin)
router.get('/students/:studentId/attendance', getStudentAttendance);

export default router;
