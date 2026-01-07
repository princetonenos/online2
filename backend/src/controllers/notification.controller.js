import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * @desc    Create notification
 * @route   POST /api/v1/notifications
 * @access  Private/Teacher/Admin
 */
export const createNotification = async (req, res, next) => {
  try {
    const { userId, type, title, content, relatedId } = req.body;

    // Validate required fields
    if (!userId || !type || !title || !content) {
      throw new ApiError('User ID, type, title and content are required', 400);
    }

    // Validate notification type
    const validTypes = [
      'ASSIGNMENT_CREATED',
      'ASSIGNMENT_GRADED',
      'POST_CREATED',
      'COMMENT_ADDED',
      'CLASS_INVITATION',
      'SUBMISSION_REMINDER',
      'SYSTEM'
    ];

    if (!validTypes.includes(type)) {
      throw new ApiError('Invalid notification type', 400);
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        relatedId: relatedId || null,
        senderId: req.user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${userId}`).emit('newNotification', notification);
    }

    logger.info(`Notification created: ${notification.id} for user: ${userId} by: ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error('Error creating notification:', error);
    next(error);
  }
};

/**
 * @desc    Get user's notifications
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false, type } = req.query;

    // Build where clause
    const where = {
      userId: req.user.id
    };

    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    if (type) {
      where.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get notifications
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              fullName: true,
              avatarUrl: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: req.user.id,
          isRead: false
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting notifications:', error);
    next(error);
  }
};

/**
 * @desc    Get single notification by ID
 * @route   GET /api/v1/notifications/:id
 * @access  Private
 */
export const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    });

    if (!notification) {
      throw new ApiError('Notification not found', 404);
    }

    // Check authorization
    if (notification.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError('Not authorized to access this notification', 403);
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error('Error getting notification:', error);
    next(error);
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/v1/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      throw new ApiError('Notification not found', 404);
    }

    // Check authorization
    if (notification.userId !== req.user.id) {
      throw new ApiError('Not authorized to update this notification', 403);
    }

    // Mark as read
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    logger.info(`Notification marked as read: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedNotification
    });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    next(error);
  }
};

/**
 * @desc    Mark notification as unread
 * @route   PUT /api/v1/notifications/:id/unread
 * @access  Private
 */
export const markAsUnread = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      throw new ApiError('Notification not found', 404);
    }

    // Check authorization
    if (notification.userId !== req.user.id) {
      throw new ApiError('Not authorized to update this notification', 403);
    }

    // Mark as unread
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        isRead: false,
        readAt: null
      }
    });

    logger.info(`Notification marked as unread: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedNotification
    });
  } catch (error) {
    logger.error('Error marking notification as unread:', error);
    next(error);
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/v1/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    logger.info(`All notifications marked as read for user: ${req.user.id} (count: ${result.count})`);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        count: result.count
      }
    });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    next(error);
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/v1/notifications/:id
 * @access  Private
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      throw new ApiError('Notification not found', 404);
    }

    // Check authorization
    if (notification.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError('Not authorized to delete this notification', 403);
    }

    await prisma.notification.delete({
      where: { id }
    });

    logger.info(`Notification deleted: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    next(error);
  }
};

/**
 * @desc    Delete all read notifications
 * @route   DELETE /api/v1/notifications/read
 * @access  Private
 */
export const deleteReadNotifications = async (req, res, next) => {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        userId: req.user.id,
        isRead: true
      }
    });

    logger.info(`Read notifications deleted for user: ${req.user.id} (count: ${result.count})`);

    res.status(200).json({
      success: true,
      message: 'Read notifications deleted successfully',
      data: {
        count: result.count
      }
    });
  } catch (error) {
    logger.error('Error deleting read notifications:', error);
    next(error);
  }
};

/**
 * @desc    Get notification count
 * @route   GET /api/v1/notifications/count
 * @access  Private
 */
export const getNotificationCount = async (req, res, next) => {
  try {
    const [total, unread] = await Promise.all([
      prisma.notification.count({
        where: { userId: req.user.id }
      }),
      prisma.notification.count({
        where: {
          userId: req.user.id,
          isRead: false
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        read: total - unread
      }
    });
  } catch (error) {
    logger.error('Error getting notification count:', error);
    next(error);
  }
};

/**
 * Helper function to create notification (for use in other controllers)
 */
export const createNotificationHelper = async (data) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        content: data.content,
        relatedId: data.relatedId || null,
        senderId: data.senderId || null
      }
    });

    logger.info(`Notification created (helper): ${notification.id} for user: ${data.userId}`);

    return notification;
  } catch (error) {
    logger.error('Error creating notification (helper):', error);
    throw error;
  }
};

/**
 * Helper function to create notifications for multiple users
 */
export const createBulkNotifications = async (data) => {
  try {
    const { userIds, type, title, content, relatedId, senderId } = data;

    const notifications = await prisma.notification.createMany({
      data: userIds.map(userId => ({
        userId,
        type,
        title,
        content,
        relatedId: relatedId || null,
        senderId: senderId || null
      }))
    });

    logger.info(`Bulk notifications created: ${notifications.count} notifications`);

    return notifications;
  } catch (error) {
    logger.error('Error creating bulk notifications:', error);
    throw error;
  }
};

export default {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getNotificationCount,
  createNotificationHelper,
  createBulkNotifications
};
