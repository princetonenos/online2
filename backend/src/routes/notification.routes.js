import express from 'express';
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getNotificationCount
} from '../controllers/notification.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/v1/notifications/count
// @desc    Get notification count
// @access  Private
router.get('/count', getNotificationCount);

// @route   PUT /api/v1/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', markAllAsRead);

// @route   DELETE /api/v1/notifications/read
// @desc    Delete all read notifications
// @access  Private
router.delete('/read', deleteReadNotifications);

// @route   GET /api/v1/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', getNotifications);

// @route   POST /api/v1/notifications
// @desc    Create notification
// @access  Private/Teacher/Admin
router.post('/', authorize('TEACHER', 'ADMIN'), createNotification);

// @route   GET /api/v1/notifications/:id
// @desc    Get single notification by ID
// @access  Private
router.get('/:id', getNotificationById);

// @route   PUT /api/v1/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', markAsRead);

// @route   PUT /api/v1/notifications/:id/unread
// @desc    Mark notification as unread
// @access  Private
router.put('/:id/unread', markAsUnread);

// @route   DELETE /api/v1/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', deleteNotification);

export default router;
