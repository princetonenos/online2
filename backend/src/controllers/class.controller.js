import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

// Generate human-friendly join code
const generateClassCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const prefixes = ['MAT', 'SCI', 'ENG', 'HIS', 'ART', 'PHY', 'CHE', 'BIO', 'COM', 'CLS'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const random = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}-${random}`;
};

/**
 * @desc    Create new class
 * @route   POST /api/v1/classes
 * @access  Private (TEACHER/ADMIN)
 */
export const createClass = async (req, res, next) => {
  try {
    const { title, name, subject, section, description, bannerUrl, status, settings } = req.body;

    // Normalize inputs: support either title or name from FE
    const className = (title || name || '').trim();
    if (!className) throw new ApiError(400, 'Class name/title is required');

    // Only teachers/admins
    if (!['TEACHER', 'ADMIN'].includes(req.user.role)) {
      throw new ApiError(403, 'Only teachers can create classes');
    }

    // Generate unique code
    let code = generateClassCode();
    while (await prisma.class.findUnique({ where: { code } })) {
      code = generateClassCode();
    }

    const newClass = await prisma.class.create({
      data: {
        name: className,
        section: section || null,
        subject: subject || null,
        description: description || null,
        bannerUrl: bannerUrl || null,
        status: status || 'ACTIVE',
        settings: settings || null,
        code,
        ownerId: req.user.id,
        schoolId: req.user.schoolId || null
      },
      include: {
        owner: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
        _count: { select: { enrollments: true, assignments: true, posts: true } }
      }
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('classCreated', { classId: newClass.id, ownerId: req.user.id });
      // tenant-scoped channel
      if (req.user.schoolId) io.to(`tenant:${req.user.schoolId}:classes`).emit('classCreated', { classId: newClass.id, ownerId: req.user.id });
    }

    logger.info(`Class created: ${newClass.id} by teacher: ${req.user.id}`);

    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    logger.error('Error creating class:', error);
    next(error);
  }
};

/**
 * @desc    Get classes for current user
 * @route   GET /api/v1/classes
 * @access  Private
 */
export const getClasses = async (req, res, next) => {
  try {
    const { search, subject, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const schoolId = req.user?.schoolId || req.tenant?.id || null;
    const where = schoolId ? { schoolId } : {};

    // Filter based on role
    if (req.user.role === 'TEACHER') {
      where.ownerId = req.user.id;
    } else if (req.user.role === 'STUDENT') {
      where.enrollments = { some: { userId: req.user.id, isActive: true } };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { section: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (subject) where.subject = subject;
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: {
          owner: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
          _count: { select: { enrollments: true, assignments: true, posts: true } }
        },
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.class.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting classes:', error);
    next(error);
  }
};

/**
 * @desc    Get class by ID
 * @route   GET /api/v1/classes/:id
 * @access  Private
 */
export const getClassById = async (req, res, next) => {
  try {
    const cls = await prisma.class.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
        enrollments: {
          where: { isActive: true },
          include: { user: { select: { id: true, fullName: true, email: true, avatarUrl: true } } }
        },
        assignments: true,
        posts: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { enrollments: true, assignments: true, posts: true } }
      }
    });

    if (!cls) throw new ApiError(404, 'Class not found');
    if (req.user.schoolId && cls.schoolId !== req.user.schoolId) {
      throw new ApiError(403, 'Not authorized to access this class');
    }

    const isOwner = cls.ownerId === req.user.id;
    const isStudent = !!(await prisma.enrollment.findUnique({
      where: { classId_userId: { classId: cls.id, userId: req.user.id } }
    }));
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isStudent && !isAdmin) throw new ApiError(403, 'Not authorized to access this class');

    res.status(200).json({ success: true, data: cls });
  } catch (error) {
    logger.error('Error getting class:', error);
    next(error);
  }
};

/**
 * @desc    Update class
 * @route   PUT /api/v1/classes/:id
 * @access  Private (TEACHER/ADMIN)
 */
export const updateClass = async (req, res, next) => {
  try {
    const { title, name, subject, section, description, bannerUrl, status, settings } = req.body;

    const existing = await prisma.class.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new ApiError(404, 'Class not found');
    if (req.user.schoolId && existing.schoolId !== req.user.schoolId) {
      throw new ApiError(403, 'Not authorized to update this class');
    }

    if (existing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'Not authorized to update this class');
    }

    const updateData = {
      name: title ?? name ?? undefined,
      subject: subject ?? undefined,
      section: section ?? undefined,
      description: description ?? undefined,
      bannerUrl: bannerUrl ?? undefined,
      status: status ?? undefined,
      settings: settings ?? undefined
    };

    const updated = await prisma.class.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        owner: { select: { id: true, fullName: true, email: true } },
        _count: { select: { enrollments: true, assignments: true } }
      }
    });

    const io = req.app.get('io');
    if (io) io.to(`class:${req.params.id}`).emit('classUpdated', updated);

    logger.info(`Class updated: ${req.params.id} by user: ${req.user.id}`);

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    logger.error('Error updating class:', error);
    next(error);
  }
};

/**
 * @desc    Delete class
 * @route   DELETE /api/v1/classes/:id
 * @access  Private (TEACHER/ADMIN)
 */
export const deleteClass = async (req, res, next) => {
  try {
    const existing = await prisma.class.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new ApiError(404, 'Class not found');

    if (existing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'Not authorized to delete this class');
    }

    await prisma.class.delete({ where: { id: req.params.id } });

    const io = req.app.get('io');
    if (io) {
      io.emit('classDeleted', { classId: req.params.id });
      if (existing.schoolId) io.to(`tenant:${existing.schoolId}:classes`).emit('classDeleted', { classId: req.params.id });
    }

    logger.info(`Class deleted: ${req.params.id} by user: ${req.user.id}`);

    res.status(200).json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    logger.error('Error deleting class:', error);
    next(error);
  }
};

/**
 * @desc    Join class with code
 * @route   POST /api/v1/classes/join
 * @access  Private (STUDENT)
 */
export const joinClass = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) throw new ApiError(400, 'Class code is required');

    const schoolId = req.user?.schoolId || req.tenant?.id || null;
    const cls = await prisma.class.findFirst({ where: { code: code.toUpperCase(), ...(schoolId ? { schoolId } : {}) } });
    if (!cls) throw new ApiError(404, 'Invalid class code');

    // Upsert enrollment
    await prisma.enrollment.upsert({
      where: { classId_userId: { classId: cls.id, userId: req.user.id } },
      create: { classId: cls.id, userId: req.user.id, role: 'STUDENT', isActive: true },
      update: { isActive: true }
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`class:${cls.id}`).emit('studentJoined', { classId: cls.id, studentId: req.user.id });
      if (cls.schoolId) io.to(`tenant:${cls.schoolId}:class:${cls.id}`).emit('studentJoined', { classId: cls.id, studentId: req.user.id });
    }

    logger.info(`Student ${req.user.id} joined class: ${cls.id}`);

    res.status(200).json({ success: true, message: 'Successfully joined class' });
  } catch (error) {
    logger.error('Error joining class:', error);
    next(error);
  }
};

/**
 * @desc    Leave class
 * @route   POST /api/v1/classes/:id/leave
 * @access  Private (STUDENT)
 */
export const leaveClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enrollment = await prisma.enrollment.findUnique({ where: { classId_userId: { classId: id, userId: req.user.id } } });
    if (!enrollment) throw new ApiError(400, 'Not enrolled in this class');

    await prisma.enrollment.delete({ where: { classId_userId: { classId: id, userId: req.user.id } } });

    const io = req.app.get('io');
    if (io) {
      io.to(`class:${id}`).emit('studentLeft', { classId: id, studentId: req.user.id });
      if (req.user.schoolId) io.to(`tenant:${req.user.schoolId}:class:${id}`).emit('studentLeft', { classId: id, studentId: req.user.id });
    }

    logger.info(`Student ${req.user.id} left class: ${id}`);

    res.status(200).json({ success: true, message: 'Successfully left class' });
  } catch (error) {
    logger.error('Error leaving class:', error);
    next(error);
  }
};

/**
 * @desc    Get class students
 * @route   GET /api/v1/classes/:id/students
 * @access  Private
 */
export const getClassStudents = async (req, res, next) => {
  try {
    const cls = await prisma.class.findUnique({ where: { id: req.params.id } });
    if (!cls) throw new ApiError(404, 'Class not found');
    if (req.user.schoolId && cls.schoolId !== req.user.schoolId) {
      throw new ApiError(403, 'Not authorized');
    }

    const isOwner = cls.ownerId === req.user.id;
    const isEnrolled = !!(await prisma.enrollment.findUnique({ where: { classId_userId: { classId: cls.id, userId: req.user.id } } }));
    const isAdmin = req.user.role === 'ADMIN';
    if (!isOwner && !isEnrolled && !isAdmin) throw new ApiError(403, 'Not authorized');

    const students = await prisma.enrollment.findMany({
      where: { classId: req.params.id, isActive: true },
      include: { user: { select: { id: true, fullName: true, email: true, avatarUrl: true, createdAt: true } } }
    });

    res.status(200).json({ success: true, data: students.map(e => e.user) });
  } catch (error) {
    logger.error('Error getting class students:', error);
    next(error);
  }
};

/**
 * @desc    Remove student from class
 * @route   DELETE /api/v1/classes/:id/students/:studentId
 * @access  Private (TEACHER/ADMIN)
 */
export const removeStudent = async (req, res, next) => {
  try {
    const { id, studentId } = req.params;

    const cls = await prisma.class.findUnique({ where: { id } });
    if (!cls) throw new ApiError(404, 'Class not found');
    if (req.user.schoolId && cls.schoolId !== req.user.schoolId) {
      throw new ApiError(403, 'Not authorized to remove students');
    }

    if (cls.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'Not authorized to remove students');
    }

    await prisma.enrollment.delete({ where: { classId_userId: { classId: id, userId: studentId } } });

    const io = req.app.get('io');
    if (io) {
      io.to(`class:${id}`).emit('studentRemoved', { classId: id, studentId });
      if (cls.schoolId) io.to(`tenant:${cls.schoolId}:class:${id}`).emit('studentRemoved', { classId: id, studentId });
    }

    logger.info(`Student ${studentId} removed from class: ${id}`);

    res.status(200).json({ success: true, message: 'Student removed from class' });
  } catch (error) {
    logger.error('Error removing student:', error);
    next(error);
  }
};

/**
 * @desc    Add students to class (enroll)
 * @route   POST /api/v1/classes/:id/students
 * @access  Private (TEACHER/ADMIN)
 */
export const addStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      throw new ApiError(400, 'studentIds array is required');
    }

    const cls = await prisma.class.findUnique({ where: { id } });
    if (!cls) throw new ApiError(404, 'Class not found');
    if (req.user.schoolId && cls.schoolId !== req.user.schoolId) {
      throw new ApiError(403, 'Not authorized to add students');
    }
    if (cls.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'Not authorized to add students');
    }

    // Upsert enrollments
    await Promise.all(
      studentIds.map((sid) =>
        prisma.enrollment.upsert({
          where: { classId_userId: { classId: id, userId: sid } },
          create: { classId: id, userId: sid, role: 'STUDENT', isActive: true },
          update: { isActive: true }
        })
      )
    );

    const updatedCount = await prisma.enrollment.count({ where: { classId: id, isActive: true } });

    const io = req.app.get('io');
    if (io) {
      io.to(`class:${id}`).emit('studentsAdded', { classId: id, studentIds });
      if (cls.schoolId) io.to(`tenant:${cls.schoolId}:class:${id}`).emit('studentsAdded', { classId: id, studentIds });
    }

    res.status(200).json({ success: true, data: { enrolled: studentIds.length, total: updatedCount } });
  } catch (error) {
    logger.error('Error adding students:', error);
    next(error);
  }
};

/**
 * @desc    Update class settings (e.g., subjects list, preferences)
 * @route   PUT /api/v1/classes/:id/settings
 * @access  Private (TEACHER/ADMIN)
 */
export const updateClassSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      throw new ApiError(400, 'settings object is required');
    }

    const cls = await prisma.class.findUnique({ where: { id } });
    if (!cls) throw new ApiError(404, 'Class not found');
    if (req.user.schoolId && cls.schoolId !== req.user.schoolId) {
      throw new ApiError(403, 'Not authorized to update class settings');
    }
    if (cls.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'Not authorized to update class settings');
    }

    // Merge existing settings with new settings
    const current = cls.settings || {};
    const merged = { ...current, ...settings };

    const updated = await prisma.class.update({
      where: { id },
      data: { settings: merged },
      include: {
        owner: { select: { id: true, fullName: true } },
        _count: { select: { enrollments: true, assignments: true } }
      }
    });

    const io = req.app.get('io');
    if (io) io.to(`class:${id}`).emit('classSettingsUpdated', { classId: id, settings: merged });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    logger.error('Error updating class settings:', error);
    next(error);
  }
};
