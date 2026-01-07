import express from 'express';
import {
  uploadFile,
  uploadMultipleFiles,
  getFileById,
  getMyFiles,
  deleteFileById,
  downloadFile,
  getFileStats,
  bulkDeleteFiles
} from '../controllers/file.controller.js';
import { protect } from '../middleware/auth.js';
import {
  uploadSingleAttachment,
  uploadAttachments,
  handleMulterError
} from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/v1/files/my-files
// @desc    Get user's uploaded files
// @access  Private
router.get('/my-files', getMyFiles);

// @route   GET /api/v1/files/stats
// @desc    Get file statistics
// @access  Private
router.get('/stats', getFileStats);

// @route   POST /api/v1/files/upload
// @desc    Upload single file
// @access  Private
router.post('/upload', uploadSingleAttachment, handleMulterError, uploadFile);

// @route   POST /api/v1/files/upload-multiple
// @desc    Upload multiple files
// @access  Private
router.post('/upload-multiple', uploadAttachments, handleMulterError, uploadMultipleFiles);

// @route   POST /api/v1/files/bulk-delete
// @desc    Bulk delete files
// @access  Private
router.post('/bulk-delete', bulkDeleteFiles);

// @route   GET /api/v1/files/:id
// @desc    Get file by ID
// @access  Private
router.get('/:id', getFileById);

// @route   GET /api/v1/files/:id/download
// @desc    Download file
// @access  Private
router.get('/:id/download', downloadFile);

// @route   DELETE /api/v1/files/:id
// @desc    Delete file
// @access  Private
router.delete('/:id', deleteFileById);

export default router;
