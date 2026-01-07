import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../../uploads');
const avatarsDir = path.join(uploadDir, 'avatars');
const attachmentsDir = path.join(uploadDir, 'attachments');
const materialsDir = path.join(uploadDir, 'materials');

[uploadDir, avatarsDir, attachmentsDir, materialsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`Created directory: ${dir}`);
  }
});

// File filter function
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    // Check file type
    const filetypes = allowedTypes;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new ApiError(`Only ${allowedTypes.source} files are allowed`, 400));
    }
  };
};

// Storage configuration
const createStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = crypto.randomBytes(16).toString('hex');
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${uniqueSuffix}${ext}`;
      cb(null, filename);
    }
  });
};

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  avatar: 5 * 1024 * 1024,      // 5MB for avatars
  attachment: 50 * 1024 * 1024,  // 50MB for attachments
  material: 100 * 1024 * 1024    // 100MB for materials
};

// Allowed file types
const ALLOWED_TYPES = {
  images: /jpeg|jpg|png|gif|webp/,
  documents: /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv/,
  archives: /zip|rar|7z|tar|gz/,
  all: /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|7z|tar|gz/
};

/**
 * Avatar upload middleware
 * - Only images allowed
 * - Max size: 5MB
 */
export const uploadAvatar = multer({
  storage: createStorage(avatarsDir),
  limits: {
    fileSize: FILE_SIZE_LIMITS.avatar
  },
  fileFilter: fileFilter(ALLOWED_TYPES.images)
}).single('avatar');

/**
 * Attachment upload middleware (for assignments, posts, etc.)
 * - Multiple files allowed
 * - Documents, images, archives
 * - Max size per file: 50MB
 */
export const uploadAttachments = multer({
  storage: createStorage(attachmentsDir),
  limits: {
    fileSize: FILE_SIZE_LIMITS.attachment,
    files: 10 // Max 10 files at once
  },
  fileFilter: fileFilter(ALLOWED_TYPES.all)
}).array('attachments', 10);

/**
 * Single attachment upload
 */
export const uploadSingleAttachment = multer({
  storage: createStorage(attachmentsDir),
  limits: {
    fileSize: FILE_SIZE_LIMITS.attachment
  },
  fileFilter: fileFilter(ALLOWED_TYPES.all)
}).single('file');

/**
 * Material upload middleware (for class materials)
 * - Multiple files allowed
 * - All document types
 * - Max size per file: 100MB
 */
export const uploadMaterials = multer({
  storage: createStorage(materialsDir),
  limits: {
    fileSize: FILE_SIZE_LIMITS.material,
    files: 20 // Max 20 files at once
  },
  fileFilter: fileFilter(ALLOWED_TYPES.all)
}).array('materials', 20);

/**
 * Multer error handler middleware
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    let message = 'File upload error';
    let statusCode = 400;

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size too large';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected field name';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Too many parts';
        break;
      default:
        message = err.message;
    }

    logger.error('Multer error:', err);
    return res.status(statusCode).json({
      success: false,
      message,
      error: err.code
    });
  }

  // Pass to next error handler if not a multer error
  next(err);
};

/**
 * Helper function to delete a file
 */
export const deleteFile = (filepath) => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      logger.info(`File deleted: ${filepath}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Helper function to get file info
 */
export const getFileInfo = (file) => {
  if (!file) return null;

  return {
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    url: `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`
  };
};

/**
 * Helper function to get multiple files info
 */
export const getFilesInfo = (files) => {
  if (!files || files.length === 0) return [];
  return files.map(file => getFileInfo(file));
};

export default {
  uploadAvatar,
  uploadAttachments,
  uploadSingleAttachment,
  uploadMaterials,
  handleMulterError,
  deleteFile,
  getFileInfo,
  getFilesInfo
};
