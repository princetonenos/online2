import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * @desc    Create new assignment
 * @route   POST /api/v1/classes/:classId/assignments
 * @access  Private/Teacher
 */
export const createAssignment = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const {
      title,
      description,
      type,
      points,
      dueDate,
      topic,
      attachments,
      allowLateSubmission
    } = req.body;

    // Validate required fields
    if (!title) {
      throw new ApiError('Assignment title is required', 400);
    }

    if (!type || !['ASSIGNMENT', 'QUIZ', 'MATERIAL', 'QUESTION'].includes(type)) {
      throw new ApiError('Valid assignment type is required', 400);
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

    // Check authorization - only class owner or admin can create assignments
    const isOwner = classData.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ApiError('Not authorized to create assignments in this class', 403);
    }

    // Validate points if provided
    if (points !== undefined && points !== null) {
      const pointsNum = parseFloat(points);
      if (isNaN(pointsNum) || pointsNum < 0) {
        throw new ApiError('Points must be a positive number', 400);
      }
    }

    // Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        classId,
        createdById: req.user.id,
        title,
        description: description || null,
        type,
        points: points ? parseFloat(points) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        topic: topic || null,
        attachments: attachments || null,
        allowLateSubmission: allowLateSubmission !== undefined ? allowLateSubmission : true
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });

    // Create submission records for all enrolled students
    const enrollments = await prisma.enrollment.findMany({
      where: {
        classId,
        role: 'STUDENT',
        isActive: true
      },
      select: {
        userId: true
      }
    });

    if (enrollments.length > 0) {
      await prisma.submission.createMany({
        data: enrollments.map(enrollment => ({
          assignmentId: assignment.id,
          studentId: enrollment.userId,
          status: 'ASSIGNED'
        }))
      });
    }

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${classId}`).emit('assignmentCreated', { classId, assignment });
      if (classData.schoolId) io.to(`tenant:${classData.schoolId}:class:${classId}`).emit('assignmentCreated', { classId, assignment });
    }

    logger.info(`Assignment created: ${assignment.id} in class: ${classId} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    logger.error('Error creating assignment:', error);
    next(error);
  }
};

/**
 * @desc    Get all assignments for a class
 * @route   GET /api/v1/classes/:classId/assignments
 * @access  Private
 */
export const getAssignments = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { type, topic, page = 1, limit = 20 } = req.query;

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

    // Check authorization
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

    if (type) {
      where.type = type;
    }

    if (topic) {
      where.topic = topic;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get assignments with pagination
    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              fullName: true,
              avatarUrl: true
            }
          },
          _count: {
            select: {
              submissions: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: [
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.assignment.count({ where })
    ]);

    // If student, include their submission status
    if (enrollment && enrollment.role === 'STUDENT') {
      const assignmentIds = assignments.map(a => a.id);
      const submissions = await prisma.submission.findMany({
        where: {
          assignmentId: { in: assignmentIds },
          studentId: req.user.id
        },
        select: {
          assignmentId: true,
          status: true,
          grade: true,
          submittedAt: true
        }
      });

      const submissionMap = new Map(submissions.map(s => [s.assignmentId, s]));
      
      assignments.forEach(assignment => {
        assignment.mySubmission = submissionMap.get(assignment.id) || null;
      });
    }

    logger.info(`Retrieved ${assignments.length} assignments for class: ${classId}`);

    res.status(200).json({
      success: true,
      data: assignments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting assignments:', error);
    next(error);
  }
};

/**
 * @desc    Get single assignment by ID
 * @route   GET /api/v1/assignments/:id
 * @access  Private
 */
export const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            email: true,
            avatarUrl: true
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
            submissions: true
          }
        }
      }
    });

    if (!assignment) {
      throw new ApiError('Assignment not found', 404);
    }
    if (req.user.schoolId && assignment.class?.schoolId && assignment.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to access this assignment', 403);
    }

    // Check authorization
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_userId: {
          classId: assignment.classId,
          userId: req.user.id
        }
      }
    });

    const isOwner = assignment.class.ownerId === req.user.id;
    const isEnrolled = !!enrollment;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isEnrolled && !isAdmin) {
      throw new ApiError('Not authorized to access this assignment', 403);
    }

    // If student, include their submission
    if (enrollment && enrollment.role === 'STUDENT') {
      const submission = await prisma.submission.findUnique({
        where: {
          assignmentId_studentId: {
            assignmentId: id,
            studentId: req.user.id
          }
        }
      });
      assignment.mySubmission = submission;
    }

    // If teacher/admin, include submission statistics
    if (isOwner || isAdmin) {
      const submissionStats = await prisma.submission.groupBy({
        by: ['status'],
        where: {
          assignmentId: id
        },
        _count: true
      });

      assignment.submissionStats = submissionStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {});
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    logger.error('Error getting assignment:', error);
    next(error);
  }
};

/**
 * @desc    Update assignment
 * @route   PUT /api/v1/assignments/:id
 * @access  Private/Teacher
 */
export const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      points,
      dueDate,
      topic,
      attachments,
      allowLateSubmission
    } = req.body;

    // Get existing assignment
    const existingAssignment = await prisma.assignment.findUnique({
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

    if (!existingAssignment) {
      throw new ApiError('Assignment not found', 404);
    }
    if (req.user.schoolId && existingAssignment.class?.schoolId && existingAssignment.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to update this assignment', 403);
    }

    // Check authorization
    const isCreator = existingAssignment.createdById === req.user.id;
    const isClassOwner = existingAssignment.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCreator && !isClassOwner && !isAdmin) {
      throw new ApiError('Not authorized to update this assignment', 403);
    }

    // Validate type if provided
    if (type && !['ASSIGNMENT', 'QUIZ', 'MATERIAL', 'QUESTION'].includes(type)) {
      throw new ApiError('Invalid assignment type', 400);
    }

    // Validate points if provided
    if (points !== undefined && points !== null) {
      const pointsNum = parseFloat(points);
      if (isNaN(pointsNum) || pointsNum < 0) {
        throw new ApiError('Points must be a positive number', 400);
      }
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (points !== undefined) updateData.points = points ? parseFloat(points) : null;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (topic !== undefined) updateData.topic = topic;
    if (attachments !== undefined) updateData.attachments = attachments;
    if (allowLateSubmission !== undefined) updateData.allowLateSubmission = allowLateSubmission;

    // Update assignment
    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${existingAssignment.classId}`).emit('assignmentUpdated', { classId: existingAssignment.classId, assignment: updatedAssignment });
      if (existingAssignment.class?.schoolId) io.to(`tenant:${existingAssignment.class.schoolId}:class:${existingAssignment.classId}`).emit('assignmentUpdated', { classId: existingAssignment.classId, assignment: updatedAssignment });
    }

    logger.info(`Assignment updated: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedAssignment
    });
  } catch (error) {
    logger.error('Error updating assignment:', error);
    next(error);
  }
};

/**
 * @desc    Delete assignment
 * @route   DELETE /api/v1/assignments/:id
 * @access  Private/Teacher
 */
export const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get assignment
    const assignment = await prisma.assignment.findUnique({
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

    if (!assignment) {
      throw new ApiError('Assignment not found', 404);
    }
    if (req.user.schoolId && assignment.class?.schoolId && assignment.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to delete this assignment', 403);
    }

    // Check authorization
    const isCreator = assignment.createdById === req.user.id;
    const isClassOwner = assignment.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCreator && !isClassOwner && !isAdmin) {
      throw new ApiError('Not authorized to delete this assignment', 403);
    }

    // Delete assignment (submissions will be cascade deleted)
    await prisma.assignment.delete({
      where: { id }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${assignment.classId}`).emit('assignmentDeleted', { classId: assignment.classId, assignmentId: id });
      if (assignment.class?.schoolId) io.to(`tenant:${assignment.class.schoolId}:class:${assignment.classId}`).emit('assignmentDeleted', { classId: assignment.classId, assignmentId: id });
    }

    logger.info(`Assignment deleted: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting assignment:', error);
    next(error);
  }
};

/**
 * @desc    Get submissions for an assignment
 * @route   GET /api/v1/assignments/:id/submissions
 * @access  Private/Teacher
 */
export const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 50 } = req.query;

    // Get assignment
    const assignment = await prisma.assignment.findUnique({
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

    if (!assignment) {
      throw new ApiError('Assignment not found', 404);
    }
    if (req.user.schoolId && assignment.class?.schoolId && assignment.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to view submissions', 403);
    }

    // Check authorization - only teacher/admin
    const isClassOwner = assignment.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClassOwner && !isAdmin) {
      throw new ApiError('Not authorized to view submissions', 403);
    }

    // Build where clause
    const where = {
      assignmentId: id
    };

    if (status) {
      where.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get submissions
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              fullName: true,
              email: true,
              avatarUrl: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: [
          { submittedAt: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.submission.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting assignment submissions:', error);
    next(error);
  }
};
