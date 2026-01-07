import express from 'express';
import {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(protect);

/**
 * Post-specific comment routes (nested under /posts/:postId)
 * These routes are mounted in server.js as: /api/v1/posts/:postId/comments
 */

// @route   GET /api/v1/posts/:postId/comments
// @desc    Get all comments for a post
// @access  Private (enrolled students, teacher, admin)
router.get('/', getComments);

// @route   POST /api/v1/posts/:postId/comments
// @desc    Create new comment on a post
// @access  Private (enrolled students, teacher, admin)
router.post('/', createComment);

/**
 * Individual comment routes (can be mounted at /api/v1/comments)
 * For operations that don't need postId in the URL
 */

// @route   GET /api/v1/comments/:id
// @desc    Get single comment by ID
// @access  Private (enrolled students, teacher, admin)
router.get('/:id', getCommentById);

// @route   PUT /api/v1/comments/:id
// @desc    Update comment
// @access  Private (comment author, class owner, admin)
router.put('/:id', updateComment);

// @route   DELETE /api/v1/comments/:id
// @desc    Delete comment
// @access  Private (comment author, class owner, admin)
router.delete('/:id', deleteComment);

export default router;
