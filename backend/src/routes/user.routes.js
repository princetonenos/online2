import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

// Protect all routes - require authentication
router.use(protect);

// Current user routes
router.get('/me', userController.getCurrentUser);

// User profile routes
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.put('/:id/password', userController.changePassword);
router.put('/:id/avatar', userController.uploadAvatar);

// Admin only routes
router.get('/', authorize('admin'), userController.getAllUsers);
router.delete('/:id', authorize('admin'), userController.deleteUser);

export default router;
