import { PrismaClient } from '@prisma/client';
import path from 'path';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import { deleteFile as removeFile, getFileInfo, getFilesInfo } from '../middleware/upload.js';

const prisma = new PrismaClient();

/**
 * @desc    Upload single file
 * @route   POST /api/v1/files/upload
 * @access  Private
 */
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError('No file uploaded', 400);
    }

    const fileInfo = getFileInfo(req.file);

    // Save file metadata to database
    const file = await prisma.file.create({
      data: {
        filename: fileInfo.filename,
        originalName: fileInfo.originalName,
        mimeType: fileInfo.mimetype,
        size: fileInfo.size,
        url: fileInfo.url,
        uploadedById: req.user.id
      }
    });

    logger.info(`File uploaded: ${file.id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: file,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    // Delete file if database operation fails
    if (req.file) {
      removeFile(req.file.path);
    }
    logger.error('Error uploading file:', error);
    next(error);
  }
};

/**
 * @desc    Upload multiple files
 * @route   POST /api/v1/files/upload-multiple
 * @access  Private
 */
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError('No files uploaded', 400);
    }

    const filesInfo = getFilesInfo(req.files);

    // Save all files metadata to database
    const fileRecords = await Promise.all(
      filesInfo.map(fileInfo =>
        prisma.file.create({
          data: {
            filename: fileInfo.filename,
            originalName: fileInfo.originalName,
            mimeType: fileInfo.mimetype,
            size: fileInfo.size,
            url: fileInfo.url,
            uploadedById: req.user.id
          }
        })
      )
    );

    logger.info(`${fileRecords.length} files uploaded by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: fileRecords,
      message: `${fileRecords.length} files uploaded successfully`
    });
  } catch (error) {
    // Delete files if database operation fails
    if (req.files) {
      req.files.forEach(file => removeFile(file.path));
    }
    logger.error('Error uploading multiple files:', error);
    next(error);
  }
};

/**
 * @desc    Get file by ID
 * @route   GET /api/v1/files/:id
 * @access  Private
 */
export const getFileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id }
    });

    if (!file) {
      throw new ApiError('File not found', 404);
    }

    // Check authorization (users can only access their own files unless admin)
    if (file.uploadedById !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError('Not authorized to access this file', 403);
    }

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    logger.error('Error getting file:', error);
    next(error);
  }
};

/**
 * @desc    Get user's uploaded files
 * @route   GET /api/v1/files/my-files
 * @access  Private
 */
export const getMyFiles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, mimeType } = req.query;

    const where = {
      uploadedById: req.user.id
    };

    if (mimeType) {
      where.mimeType = {
        contains: mimeType
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.file.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting user files:', error);
    next(error);
  }
};

/**
 * @desc    Delete file
 * @route   DELETE /api/v1/files/:id
 * @access  Private
 */
export const deleteFileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id }
    });

    if (!file) {
      throw new ApiError('File not found', 404);
    }

    // Check authorization
    if (file.uploadedById !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError('Not authorized to delete this file', 403);
    }

    // Delete from database
    await prisma.file.delete({
      where: { id }
    });

    // Delete physical file
    const filePath = path.join(process.cwd(), 'uploads', path.basename(file.url));
    removeFile(filePath);

    logger.info(`File deleted: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting file:', error);
    next(error);
  }
};

/**
 * @desc    Download file
 * @route   GET /api/v1/files/:id/download
 * @access  Private
 */
export const downloadFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id }
    });

    if (!file) {
      throw new ApiError('File not found', 404);
    }

    // Check authorization
    if (file.uploadedById !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError('Not authorized to download this file', 403);
    }

    // Construct file path
    const filePath = path.join(process.cwd(), 'uploads', path.basename(file.url));

    // Check if file exists
    const fs = await import('fs');
    if (!fs.existsSync(filePath)) {
      throw new ApiError('File not found on server', 404);
    }

    // Set headers for download
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);

    // Stream file
    res.download(filePath, file.originalName, (err) => {
      if (err) {
        logger.error('Error downloading file:', err);
        if (!res.headersSent) {
          next(new ApiError('Error downloading file', 500));
        }
      }
    });

    logger.info(`File downloaded: ${id} by user: ${req.user.id}`);
  } catch (error) {
    logger.error('Error in download file:', error);
    next(error);
  }
};

/**
 * @desc    Get file statistics
 * @route   GET /api/v1/files/stats
 * @access  Private
 */
export const getFileStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [totalFiles, totalSize, filesByType] = await Promise.all([
      prisma.file.count({
        where: { uploadedById: userId }
      }),
      prisma.file.aggregate({
        where: { uploadedById: userId },
        _sum: {
          size: true
        }
      }),
      prisma.file.groupBy({
        by: ['mimeType'],
        where: { uploadedById: userId },
        _count: true,
        _sum: {
          size: true
        }
      })
    ]);

    const stats = {
      totalFiles,
      totalSize: totalSize._sum.size || 0,
      filesByType: filesByType.map(item => ({
        mimeType: item.mimeType,
        count: item._count,
        totalSize: item._sum.size
      }))
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting file stats:', error);
    next(error);
  }
};

/**
 * @desc    Bulk delete files
 * @route   POST /api/v1/files/bulk-delete
 * @access  Private
 */
export const bulkDeleteFiles = async (req, res, next) => {
  try {
    const { fileIds } = req.body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      throw new ApiError('File IDs array is required', 400);
    }

    // Get files
    const files = await prisma.file.findMany({
      where: {
        id: { in: fileIds }
      }
    });

    // Check authorization - only delete own files unless admin
    const unauthorizedFiles = files.filter(
      file => file.uploadedById !== req.user.id && req.user.role !== 'ADMIN'
    );

    if (unauthorizedFiles.length > 0) {
      throw new ApiError('Not authorized to delete some files', 403);
    }

    // Delete from database
    await prisma.file.deleteMany({
      where: {
        id: { in: fileIds }
      }
    });

    // Delete physical files
    files.forEach(file => {
      const filePath = path.join(process.cwd(), 'uploads', path.basename(file.url));
      removeFile(filePath);
    });

    logger.info(`Bulk deleted ${files.length} files by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: `${files.length} files deleted successfully`,
      data: {
        deletedCount: files.length
      }
    });
  } catch (error) {
    logger.error('Error bulk deleting files:', error);
    next(error);
  }
};
