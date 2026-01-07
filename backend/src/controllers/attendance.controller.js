import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * @desc    Create session for attendance
 * @route   POST /api/v1/classes/:classId/sessions
 * @access  Private/Teacher
 */
export const createSession = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { title, description, startTime, endTime, resources, notes } = req.body;

    // Validate required fields
    if (!title) {
      throw new ApiError('Session title is required', 400);
    }

    if (!startTime) {
      throw new ApiError('Session start time is required', 400);
    }

    // Verify class exists
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
    const isOwner = classData.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ApiError('Not authorized to create sessions in this class', 403);
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        classId,
        title,
        description: description || null,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        resources: resources || null,
        notes: notes || null
      }
    });

    // Get all enrolled students
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

    // Create attendance records for all students (default: PRESENT)
    if (enrollments.length > 0) {
      await prisma.attendance.createMany({
        data: enrollments.map(enrollment => ({
          sessionId: session.id,
          studentId: enrollment.userId,
          status: 'PRESENT',
          timestamp: new Date()
        }))
      });
    }

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${classId}`).emit('sessionCreated', { classId, session });
      if (classData.schoolId) io.to(`tenant:${classData.schoolId}:class:${classId}`).emit('sessionCreated', { classId, session });
    }

    logger.info(`Session created: ${session.id} in class: ${classId} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    logger.error('Error creating session:', error);
    next(error);
  }
};

/**
 * @desc    Get all sessions for a class
 * @route   GET /api/v1/classes/:classId/sessions
 * @access  Private
 */
export const getSessions = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { page = 1, limit = 20, startDate, endDate } = req.query;

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
    const where = { classId };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) {
        where.startTime.gte = new Date(startDate);
      }
      if (endDate) {
        where.startTime.lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get sessions
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        include: {
          _count: {
            select: {
              attendance: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { startTime: 'desc' }
      }),
      prisma.session.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting sessions:', error);
    next(error);
  }
};

/**
 * @desc    Get single session by ID
 * @route   GET /api/v1/sessions/:id
 * @access  Private
 */
export const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            ownerId: true,
            schoolId: true
          }
        },
        attendance: {
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
          }
        }
      }
    });

    if (!session) {
      throw new ApiError('Session not found', 404);
    }
    if (req.user.schoolId && session.class?.schoolId && session.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to access this session', 403);
    }

    // Check authorization
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_userId: {
          classId: session.classId,
          userId: req.user.id
        }
      }
    });

    const isOwner = session.class.ownerId === req.user.id;
    const isEnrolled = !!enrollment;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isEnrolled && !isAdmin) {
      throw new ApiError('Not authorized to access this session', 403);
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    logger.error('Error getting session:', error);
    next(error);
  }
};

/**
 * @desc    Update session
 * @route   PUT /api/v1/sessions/:id
 * @access  Private/Teacher
 */
export const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, endTime, resources, notes } = req.body;

    // Get existing session
    const existingSession = await prisma.session.findUnique({
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

    if (!existingSession) {
      throw new ApiError('Session not found', 404);
    }
    // Tenant check via class.schoolId
    // If class had schoolId loaded (above), ensure it matches user.schoolId
    // (already present in selected fields)
    if (req.user.schoolId && existingSession.class?.schoolId && existingSession.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to update this session', 403);
    }

    // Check authorization
    const isOwner = existingSession.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ApiError('Not authorized to update this session', 403);
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (endTime !== undefined) updateData.endTime = endTime ? new Date(endTime) : null;
    if (resources !== undefined) updateData.resources = resources;
    if (notes !== undefined) updateData.notes = notes;

    // Update session
    const updatedSession = await prisma.session.update({
      where: { id },
      data: updateData
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${existingSession.classId}`).emit('sessionUpdated', { classId: existingSession.classId, session: updatedSession });
      if (existingSession.class?.schoolId) io.to(`tenant:${existingSession.class.schoolId}:class:${existingSession.classId}`).emit('sessionUpdated', { classId: existingSession.classId, session: updatedSession });
    }

    logger.info(`Session updated: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedSession
    });
  } catch (error) {
    logger.error('Error updating session:', error);
    next(error);
  }
};

/**
 * @desc    Delete session
 * @route   DELETE /api/v1/sessions/:id
 * @access  Private/Teacher
 */
export const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
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

    if (!session) {
      throw new ApiError('Session not found', 404);
    }
    if (req.user.schoolId && session.class?.schoolId && session.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to delete this session', 403);
    }

    // Check authorization
    const isOwner = session.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ApiError('Not authorized to delete this session', 403);
    }

    // Delete session (attendance records will be cascade deleted)
    await prisma.session.delete({
      where: { id }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${session.classId}`).emit('sessionDeleted', { classId: session.classId, sessionId: id });
      if (session.class?.schoolId) io.to(`tenant:${session.class.schoolId}:class:${session.classId}`).emit('sessionDeleted', { classId: session.classId, sessionId: id });
    }

    logger.info(`Session deleted: ${id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting session:', error);
    next(error);
  }
};

/**
 * @desc    Mark attendance for a session
 * @route   POST /api/v1/sessions/:sessionId/attendance
 * @access  Private/Teacher
 */
export const markAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { studentId, status, notes } = req.body;

    // Validate status
    if (!status || !['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].includes(status)) {
      throw new ApiError('Valid attendance status is required', 400);
    }

    // Get session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        class: {
          select: {
            ownerId: true,
            schoolId: true
          }
        }
      }
    });

    if (!session) {
      throw new ApiError('Session not found', 404);
    }
    if (req.user.schoolId && session.class?.schoolId && session.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to mark attendance for this session', 403);
    }

    // Check authorization
    const isOwner = session.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ApiError('Not authorized to mark attendance for this session', 403);
    }

    // Check if student is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_userId: {
          classId: session.classId,
          userId: studentId
        }
      }
    });

    if (!enrollment || enrollment.role !== 'STUDENT') {
      throw new ApiError('Student not enrolled in this class', 400);
    }

    // Upsert attendance record
    const attendance = await prisma.attendance.upsert({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId
        }
      },
      update: {
        status,
        notes: notes || null,
        timestamp: new Date()
      },
      create: {
        sessionId,
        studentId,
        status,
        notes: notes || null,
        timestamp: new Date()
      },
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
      }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${session.classId}`).emit('attendanceMarked', {
        sessionId,
        classId: session.classId,
        attendance
      });
    }

    logger.info(`Attendance marked: ${studentId} for session: ${sessionId} - ${status}`);

    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    logger.error('Error marking attendance:', error);
    next(error);
  }
};

/**
 * @desc    Bulk mark attendance for a session
 * @route   POST /api/v1/sessions/:sessionId/attendance/bulk
 * @access  Private/Teacher
 */
export const bulkMarkAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { attendanceRecords } = req.body;

    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      throw new ApiError('Attendance records array is required', 400);
    }

    // Get session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        class: {
          select: {
            ownerId: true,
            schoolId: true
          }
        }
      }
    });

    if (!session) {
      throw new ApiError('Session not found', 404);
    }
    if (req.user.schoolId && session.class?.schoolId && session.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to mark attendance for this session', 403);
    }

    // Check authorization
    const isOwner = session.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ApiError('Not authorized to mark attendance for this session', 403);
    }

    // Process each attendance record
    const results = await Promise.all(
      attendanceRecords.map(async ({ studentId, status, notes }) => {
        // Validate status
        if (!['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].includes(status)) {
          return { studentId, error: 'Invalid status' };
        }

        try {
          const attendance = await prisma.attendance.upsert({
            where: {
              sessionId_studentId: {
                sessionId,
                studentId
              }
            },
            update: {
              status,
              notes: notes || null,
              timestamp: new Date()
            },
            create: {
              sessionId,
              studentId,
              status,
              notes: notes || null,
              timestamp: new Date()
            }
          });
          return { studentId, success: true, attendance };
        } catch (error) {
          return { studentId, error: error.message };
        }
      })
    );

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${session.classId}`).emit('attendanceBulkMarked', {
        sessionId,
        classId: session.classId
      });
    }

    logger.info(`Bulk attendance marked for session: ${sessionId} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: results,
      message: 'Bulk attendance marked'
    });
  } catch (error) {
    logger.error('Error bulk marking attendance:', error);
    next(error);
  }
};

/**
 * @desc    Get student attendance records
 * @route   GET /api/v1/students/:studentId/attendance
 * @access  Private
 */
export const getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { classId, startDate, endDate, page = 1, limit = 50 } = req.query;

    // Check authorization
    const isSelf = studentId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // If checking another student's attendance, must be teacher of their class
    if (!isSelf && !isAdmin) {
      // Check if requester is teacher of any of student's classes
      const studentEnrollments = await prisma.enrollment.findMany({
        where: {
          userId: studentId,
          role: 'STUDENT'
        },
        select: {
          classId: true,
          class: {
            select: {
              ownerId: true
            }
          }
        }
      });

      const isTeacher = studentEnrollments.some(e => e.class.ownerId === req.user.id);
      if (!isTeacher) {
        throw new ApiError('Not authorized to view this student\'s attendance', 403);
      }
    }

    // Build where clause
    const where = {
      studentId,
      session: {}
    };

    if (classId) {
      where.session.classId = classId;
    }

    if (startDate || endDate) {
      where.session.startTime = {};
      if (startDate) {
        where.session.startTime.gte = new Date(startDate);
      }
      if (endDate) {
        where.session.startTime.lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [attendanceRecords, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        include: {
          session: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          timestamp: 'desc'
        }
      }),
      prisma.attendance.count({ where })
    ]);

    // Calculate statistics
    const stats = {
      total: attendanceRecords.length,
      present: attendanceRecords.filter(a => a.status === 'PRESENT').length,
      absent: attendanceRecords.filter(a => a.status === 'ABSENT').length,
      late: attendanceRecords.filter(a => a.status === 'LATE').length,
      excused: attendanceRecords.filter(a => a.status === 'EXCUSED').length
    };

    res.status(200).json({
      success: true,
      data: attendanceRecords,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting student attendance:', error);
    next(error);
  }
};
