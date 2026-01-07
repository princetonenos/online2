import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { ensureTenantAccess } from '../middleware/tenant.js';
import * as classController from '../controllers/class.controller.js';

const router = express.Router();

// Protect all routes - require authentication
router.use(protect);
// Ensure authenticated user's school matches resolved tenant (if both present)
router.use(ensureTenantAccess);

// Public class operations
router.get('/', classController.getClasses);
router.get('/:id', classController.getClassById);

// Join/Leave class (students)
router.post('/join', classController.joinClass);
router.post('/:id/leave', classController.leaveClass);

// Class students management
router.get('/:id/students', classController.getClassStudents);
router.post(
  '/:id/students',
  authorize('TEACHER', 'ADMIN'),
  classController.addStudents
);
router.delete(
  '/:id/students/:studentId',
  authorize('TEACHER', 'ADMIN'),
  classController.removeStudent
);

// Class settings
router.put(
  '/:id/settings',
  authorize('TEACHER', 'ADMIN'),
  classController.updateClassSettings
);

// Class CRUD (teachers/admins only)
router.post(
  '/',
  authorize('TEACHER', 'ADMIN'),
  classController.createClass
);

router.put(
  '/:id',
  authorize('TEACHER', 'ADMIN'),
  classController.updateClass
);

router.delete(
  '/:id',
  authorize('TEACHER', 'ADMIN'),
  classController.deleteClass
);

export default router;
