import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * @desc    Create comment on post
 * @route   POST /api/v1/posts/:postId/comments
 * @access  Private
 */
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      throw new ApiError('Comment content is required', 400);
    }

    if (content.length > 1000) {
      throw new ApiError('Comment cannot exceed 1000 characters', 400);
    }

    // Verify post exists and user has access to the class
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        class: {
          select: {
            id: true,
            ownerId: true
          }
        }
      }
    });

    if (!post) {
      throw new ApiError('Post not found', 404);
    }

    // Check if post is published
    if (!post.publishedAt || post.publishedAt > new Date()) {
      throw new ApiError('Cannot comment on unpublished post', 403);
    }

    // Check if user is enrolled in the class or is the owner
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_userId: {
          classId: post.classId,
          userId: req.user.id
        }
      }
    });

    const isOwner = post.class.ownerId === req.user.id;
    const isEnrolled = !!enrollment;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isEnrolled && !isAdmin) {
      throw new ApiError('Not authorized to comment on this post', 403);
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: req.user.id,
        content: content.trim()
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            role: true
          }
        }
      }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${post.classId}`).emit('commentCreated', {
        postId,
        classId: post.classId,
        comment
      });
    }

    logger.info(`Comment created: ${comment.id} on post: ${postId} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    logger.error('Error creating comment:', error);
    next(error);
  }
};

/**
 * @desc    Get comments for a post
 * @route   GET /api/v1/posts/:postId/comments
 * @access  Private
 */
export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verify post exists and user has access
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        class: {
          select: {
            id: true,
            ownerId: true
          }
        }
      }
    });

    if (!post) {
      throw new ApiError('Post not found', 404);
    }

    // Check authorization
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_userId: {
          classId: post.classId,
          userId: req.user.id
        }
      }
    });

    const isOwner = post.class.ownerId === req.user.id;
    const isEnrolled = !!enrollment;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isEnrolled && !isAdmin) {
      throw new ApiError('Not authorized to view comments on this post', 403);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get comments with pagination
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              role: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'asc' }
      }),
      prisma.comment.count({ where: { postId } })
    ]);

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting comments:', error);
    next(error);
  }
};

/**
 * @desc    Get single comment by ID
 * @route   GET /api/v1/comments/:id
 * @access  Private
 */
export const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            role: true
          }
        },
        post: {
          include: {
            class: {
              select: {
                id: true,
                ownerId: true
              }
            }
          }
        }
      }
    });

    if (!comment) {
      throw new ApiError('Comment not found', 404);
    }

    // Check authorization
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_userId: {
          classId: comment.post.classId,
          userId: req.user.id
        }
      }
    });

    const isOwner = comment.post.class.ownerId === req.user.id;
    const isEnrolled = !!enrollment;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isEnrolled && !isAdmin) {
      throw new ApiError('Not authorized to view this comment', 403);
    }

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    logger.error('Error getting comment:', error);
    next(error);
  }
};

/**
 * @desc    Update comment
 * @route   PUT /api/v1/comments/:id
 * @access  Private
 */
export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      throw new ApiError('Comment content is required', 400);
    }

    if (content.length > 1000) {
      throw new ApiError('Comment cannot exceed 1000 characters', 400);
    }

    // Get existing comment
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: {
          include: {
            class: {
              select: {
                id: true,
                ownerId: true
              }
            }
          }
        }
      }
    });

    if (!existingComment) {
      throw new ApiError('Comment not found', 404);
    }

    // Check authorization - only comment author, class owner, or admin can update
    const isAuthor = existingComment.authorId === req.user.id;
    const isClassOwner = existingComment.post.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isClassOwner && !isAdmin) {
      throw new ApiError('Not authorized to update this comment', 403);
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content: content.trim()
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            role: true
          }
        }
      }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${existingComment.post.classId}`).emit('commentUpdated', {
        postId: existingComment.postId,
        classId: existingComment.post.classId,
        comment: updatedComment
      });
    }

    logger.info(`Comment updated: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedComment
    });
  } catch (error) {
    logger.error('Error updating comment:', error);
    next(error);
  }
};

/**
 * @desc    Delete comment
 * @route   DELETE /api/v1/comments/:id
 * @access  Private
 */
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get comment
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: {
          include: {
            class: {
              select: {
                id: true,
                ownerId: true
              }
            }
          }
        }
      }
    });

    if (!comment) {
      throw new ApiError('Comment not found', 404);
    }

    // Check authorization - only comment author, class owner, or admin can delete
    const isAuthor = comment.authorId === req.user.id;
    const isClassOwner = comment.post.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isClassOwner && !isAdmin) {
      throw new ApiError('Not authorized to delete this comment', 403);
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${comment.post.classId}`).emit('commentDeleted', {
        postId: comment.postId,
        classId: comment.post.classId,
        commentId: id
      });
    }

    logger.info(`Comment deleted: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting comment:', error);
    next(error);
  }
};
