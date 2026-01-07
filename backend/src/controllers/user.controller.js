import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/users/me
 * @access  Private
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error getting current user:', error);
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error getting user:', error);
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/:id
 * @access  Private
 */
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id }
    });

    if (!existingUser) {
      throw new ApiError('User not found', 404);
    }

    // Only allow users to update their own profile or admins
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      throw new ApiError('Not authorized to update this user', 403);
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExists) {
        throw new ApiError('Email already in use', 400);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, avatar },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/v1/users/:id/password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      throw new ApiError('Please provide current and new password', 400);
    }

    if (newPassword.length < 6) {
      throw new ApiError('New password must be at least 6 characters', 400);
    }

    // Only allow users to change their own password
    if (req.user.id !== req.params.id) {
      throw new ApiError('Not authorized to change this password', 403);
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: req.params.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Error changing password:', error);
    next(error);
  }
};

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;

    const where = {};
    
    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          createdAt: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting users:', error);
    next(error);
  }
};

/**
 * @desc    Delete user (admin only)
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      throw new ApiError('Cannot delete your own account', 400);
    }

    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    next(error);
  }
};

/**
 * @desc    Upload user avatar
 * @route   PUT /api/v1/users/:id/avatar
 * @access  Private
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError('Please upload an image file', 400);
    }

    // Only allow users to upload their own avatar
    if (req.user.id !== req.params.id) {
      throw new ApiError('Not authorized to upload avatar for this user', 403);
    }

    // File URL would come from S3/Cloudinary upload
    const avatarUrl = req.file.location || req.file.path;

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true
      }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    logger.error('Error uploading avatar:', error);
    next(error);
  }
};
