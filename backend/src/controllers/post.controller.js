import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * @desc    Create new post
 * @route   POST /api/v1/classes/:classId/posts
 * @access  Private/Teacher
 */
export const createPost = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { type, title, content, attachments, scheduledAt } = req.body;

    // Validate required fields
    if (!content) {
      throw new ApiError('Content is required', 400);
    }

    if (!['ANNOUNCEMENT', 'MATERIAL', 'ASSIGNMENT', 'QUESTION'].includes(type)) {
      throw new ApiError('Invalid post type', 400);
    }

    // Verify class exists
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      select: { 
        id: true, 
        ownerId: true,
        name: true,
        schoolId: true
      }
    });

    if (!classData) {
      throw new ApiError('Class not found', 404);
    }
    if (req.user.schoolId && classData.schoolId && classData.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to access this class', 403);
    }

    // Check authorization - only teachers/admins or class owner can post
    const isOwner = classData.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ApiError('Not authorized to post in this class', 403);
    }

    // Determine publishedAt
    const publishedAt = scheduledAt ? null : new Date();

    // Create post
    const post = await prisma.post.create({
      data: {
        classId,
        authorId: req.user.id,
        type,
        title: title || null,
        content,
        attachments: attachments || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt
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
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    // Emit Socket.IO event for real-time updates
    const io = req.app.get('io');
    if (io && publishedAt) {
      io.to(`class:${classId}`).emit('postCreated', { classId, post });
      if (classData.schoolId) io.to(`tenant:${classData.schoolId}:class:${classId}`).emit('postCreated', { classId, post });
    }

    logger.info(`Post created: ${post.id} in class: ${classId} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    logger.error('Error creating post:', error);
    next(error);
  }
};

/**
 * @desc    Get all posts for a class
 * @route   GET /api/v1/classes/:classId/posts
 * @access  Private
 */
export const getPosts = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { type, page = 1, limit = 20, includeScheduled = false } = req.query;

    // Verify class exists and user has access
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      select: { 
        id: true, 
        ownerId: true,
        schoolId: true
      }
    });

    if (!classData) {
      throw new ApiError('Class not found', 404);
    }
    if (req.user.schoolId && classData.schoolId && classData.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to access this class', 403);
    }

    // Check if user is enrolled or owns the class
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_userId: {
          classId,
          userId: req.user.id
        }
      }
    });

    const isOwner = classData.ownerId === req.user.id;
    const isEnrolled = !!enrollment;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isEnrolled && !isAdmin) {
      throw new ApiError('Not authorized to access this class', 403);
    }

    // Build where clause
    const where = {
      classId
    };

    // Filter by type if provided
    if (type) {
      where.type = type;
    }

    // Only show published posts unless teacher/admin wants to see scheduled
    if (!includeScheduled || (!isOwner && !isAdmin)) {
      where.publishedAt = {
        not: null,
        lte: new Date()
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get posts with pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  fullName: true,
                  avatarUrl: true
                }
              }
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.post.count({ where })
    ]);

    logger.info(`Retrieved ${posts.length} posts for class: ${classId}`);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting posts:', error);
    next(error);
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/v1/posts/:id
 * @access  Private
 */
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { commentsPage = 1, commentsLimit = 10 } = req.query;

    // Get post with all details
    const post = await prisma.post.findUnique({
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
        class: {
          select: {
            id: true,
            name: true,
            ownerId: true,
            schoolId: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    if (!post) {
      throw new ApiError('Post not found', 404);
    }
    if (req.user.schoolId && post.class?.schoolId && post.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to access this post', 403);
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
      throw new ApiError('Not authorized to access this post', 403);
    }

    // Get paginated comments
    const skip = (parseInt(commentsPage) - 1) * parseInt(commentsLimit);
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            avatarUrl: true,
            role: true
          }
        }
      },
      skip,
      take: parseInt(commentsLimit),
      orderBy: { createdAt: 'desc' }
    });

    const postWithComments = {
      ...post,
      comments,
      commentsPagination: {
        page: parseInt(commentsPage),
        limit: parseInt(commentsLimit),
        total: post._count.comments,
        pages: Math.ceil(post._count.comments / parseInt(commentsLimit))
      }
    };

    res.status(200).json({
      success: true,
      data: postWithComments
    });
  } catch (error) {
    logger.error('Error getting post:', error);
    next(error);
  }
};

/**
 * @desc    Update post
 * @route   PUT /api/v1/posts/:id
 * @access  Private/Teacher
 */
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, title, content, attachments, scheduledAt } = req.body;

    // Get existing post
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            ownerId: true,
            schoolId: true
          }
        }
      }
    });

    if (!existingPost) {
      throw new ApiError('Post not found', 404);
    }
    if (req.user.schoolId && existingPost.class?.schoolId && existingPost.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to update this post', 403);
    }

    // Check authorization - only post author, class owner, or admin can update
    const isAuthor = existingPost.authorId === req.user.id;
    const isClassOwner = existingPost.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isClassOwner && !isAdmin) {
      throw new ApiError('Not authorized to update this post', 403);
    }

    // Validate type if provided
    if (type && !['ANNOUNCEMENT', 'MATERIAL', 'ASSIGNMENT', 'QUESTION'].includes(type)) {
      throw new ApiError('Invalid post type', 400);
    }

    // Build update data
    const updateData = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (attachments !== undefined) updateData.attachments = attachments;
    if (scheduledAt !== undefined) {
      updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
      // If removing schedule, publish now
      if (!scheduledAt && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
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
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${existingPost.classId}`).emit('postUpdated', { classId: existingPost.classId, post: updatedPost });
      if (existingPost.class?.schoolId) io.to(`tenant:${existingPost.class.schoolId}:class:${existingPost.classId}`).emit('postUpdated', { classId: existingPost.classId, post: updatedPost });
    }

    logger.info(`Post updated: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    logger.error('Error updating post:', error);
    next(error);
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/v1/posts/:id
 * @access  Private/Teacher
 */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get post
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            ownerId: true,
            schoolId: true
          }
        }
      }
    });

    if (!post) {
      throw new ApiError('Post not found', 404);
    }
    if (req.user.schoolId && post.class?.schoolId && post.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to delete this post', 403);
    }

    // Check authorization - only post author, class owner, or admin can delete
    const isAuthor = post.authorId === req.user.id;
    const isClassOwner = post.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isClassOwner && !isAdmin) {
      throw new ApiError('Not authorized to delete this post', 403);
    }

    // Delete post (comments will be cascade deleted)
    await prisma.post.delete({
      where: { id }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${post.classId}`).emit('postDeleted', { classId: post.classId, postId: id });
      if (post.class?.schoolId) io.to(`tenant:${post.class.schoolId}:class:${post.classId}`).emit('postDeleted', { classId: post.classId, postId: id });
    }

    logger.info(`Post deleted: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting post:', error);
    next(error);
  }
};

/**
 * @desc    Publish scheduled post
 * @route   POST /api/v1/posts/:id/publish
 * @access  Private/Teacher
 */
export const publishPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get post
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            ownerId: true,
            schoolId: true
          }
        }
      }
    });

    if (!post) {
      throw new ApiError('Post not found', 404);
    }
    if (req.user.schoolId && post.class?.schoolId && post.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to publish this post', 403);
    }

    // Check authorization
    const isAuthor = post.authorId === req.user.id;
    const isClassOwner = post.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isClassOwner && !isAdmin) {
      throw new ApiError('Not authorized to publish this post', 403);
    }

    // Check if already published
    if (post.publishedAt) {
      throw new ApiError('Post is already published', 400);
    }

    // Publish post
    const publishedPost = await prisma.post.update({
      where: { id },
      data: {
        publishedAt: new Date(),
        scheduledAt: null
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
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${post.classId}`).emit('postPublished', {
        classId: post.classId,
        post: publishedPost
      });
    }

    logger.info(`Post published: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: publishedPost
    });
  } catch (error) {
    logger.error('Error publishing post:', error);
    next(error);
  }
};
