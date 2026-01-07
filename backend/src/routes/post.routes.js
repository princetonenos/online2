import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  publishPost
} from '../controllers/post.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(protect);

/**
 * Class-specific post routes (nested under /classes/:classId)
 * These routes are mounted in server.js as: /api/v1/classes/:classId/posts
 */

// @route   GET /api/v1/classes/:classId/posts
// @desc    Get all posts for a class
// @access  Private (enrolled students, teacher, admin)
router.get('/', getPosts);

// @route   POST /api/v1/classes/:classId/posts
// @desc    Create new post in a class
// @access  Private/Teacher (class owner, admin)
router.post('/', authorize('TEACHER', 'ADMIN'), createPost);

/**
 * Individual post routes (can be mounted at /api/v1/posts)
 * For operations that don't need classId in the URL
 */

// @route   GET /api/v1/posts/:id
// @desc    Get single post by ID
// @access  Private (enrolled students, teacher, admin)
router.get('/:id', getPostById);

// @route   PUT /api/v1/posts/:id
// @desc    Update post
// @access  Private/Teacher (post author, class owner, admin)
router.put('/:id', authorize('TEACHER', 'ADMIN'), updatePost);

// @route   DELETE /api/v1/posts/:id
// @desc    Delete post
// @access  Private/Teacher (post author, class owner, admin)
router.delete('/:id', authorize('TEACHER', 'ADMIN'), deletePost);

// @route   POST /api/v1/posts/:id/publish
// @desc    Publish a scheduled post immediately
// @access  Private/Teacher (post author, class owner, admin)
router.post('/:id/publish', authorize('TEACHER', 'ADMIN'), publishPost);

export default router;
