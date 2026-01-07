import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * @desc    Get student's own submission for an assignment
 * @route   GET /api/v1/assignments/:assignmentId/submission
 * @access  Private/Student
 */
export const getMySubmission = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    // Verify assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        class: {
          select: {
            id: true,
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
      throw new ApiError('Not authorized to access this assignment', 403);
    }

    // Check if user is enrolled in the class
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_userId: {
          classId: assignment.classId,
          userId: req.user.id
        }
      }
    });

    if (!enrollment && assignment.class.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError('Not authorized to access this assignment', 403);
    }

    // Get or create submission
    let submission = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: req.user.id
        }
      }
    });

    // If no submission exists, create one
    if (!submission && enrollment && enrollment.role === 'STUDENT') {
      submission = await prisma.submission.create({
        data: {
          assignmentId,
          studentId: req.user.id,
          status: 'ASSIGNED'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    logger.error('Error getting submission:', error);
    next(error);
  }
};

/**
 * @desc    Submit assignment (student)
 * @route   POST /api/v1/assignments/:assignmentId/submit
 * @access  Private/Student
 */
export const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { content, attachments } = req.body;

    // Verify assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            schoolId: true
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

    // Check if user is enrolled as student
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_userId: {
          classId: assignment.classId,
          userId: req.user.id
        }
      }
    });

    if (!enrollment || enrollment.role !== 'STUDENT') {
      throw new ApiError('Only enrolled students can submit assignments', 403);
    }

    // Check if late submission is allowed
    const now = new Date();
    const isLate = assignment.dueDate && now > assignment.dueDate;

    if (isLate && !assignment.allowLateSubmission) {
      throw new ApiError('Late submissions are not allowed for this assignment', 403);
    }

    // Get or create submission
    let submission = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: req.user.id
        }
      }
    });

    if (!submission) {
      // Create new submission
      submission = await prisma.submission.create({
        data: {
          assignmentId,
          studentId: req.user.id,
          content: content || null,
          attachments: attachments || null,
          status: isLate ? 'LATE' : 'TURNED_IN',
          submittedAt: now
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
    } else {
      // Update existing submission
      submission = await prisma.submission.update({
        where: {
          assignmentId_studentId: {
            assignmentId,
            studentId: req.user.id
          }
        },
        data: {
          content: content || null,
          attachments: attachments || null,
          status: isLate ? 'LATE' : 'TURNED_IN',
          submittedAt: now
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
    }

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${assignment.classId}`).emit('assignmentSubmitted', { assignmentId, classId: assignment.classId, studentId: req.user.id, submission });
      if (assignment.class?.schoolId) io.to(`tenant:${assignment.class.schoolId}:class:${assignment.classId}`).emit('assignmentSubmitted', { assignmentId, classId: assignment.classId, studentId: req.user.id, submission });
    }

    logger.info(`Assignment submitted: ${assignmentId} by student: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: submission,
      message: 'Assignment submitted successfully'
    });
  } catch (error) {
    logger.error('Error submitting assignment:', error);
    next(error);
  }
};

/**
 * @desc    Unsubmit assignment (student)
 * @route   POST /api/v1/assignments/:assignmentId/unsubmit
 * @access  Private/Student
 */
export const unsubmitAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    // Get submission
    const submission = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: req.user.id
        }
      },
      include: {
        assignment: {
          include: {
            class: {
              select: {
                id: true,
                schoolId: true
              }
            }
          }
        }
      }
    });

    if (!submission) {
      throw new ApiError('Submission not found', 404);
    }
    if (req.user.schoolId && submission.assignment.class?.schoolId && submission.assignment.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to access this submission', 403);
    }

    // Can't unsubmit if already graded
    if (submission.status === 'GRADED' || submission.status === 'RETURNED') {
      throw new ApiError('Cannot unsubmit a graded assignment', 403);
    }

    // Update submission status
    const updatedSubmission = await prisma.submission.update({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: req.user.id
        }
      },
      data: {
        status: 'ASSIGNED',
        submittedAt: null
      }
    });

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`class:${submission.assignment.classId}`).emit('assignmentUnsubmitted', {
        assignmentId,
        classId: submission.assignment.classId,
        studentId: req.user.id
      });
    }

    logger.info(`Assignment unsubmitted: ${assignmentId} by student: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedSubmission,
      message: 'Assignment unsubmitted successfully'
    });
  } catch (error) {
    logger.error('Error unsubmitting assignment:', error);
    next(error);
  }
};

/**
 * @desc    Get single submission by ID
 * @route   GET /api/v1/submissions/:id
 * @access  Private
 */
export const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id },
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
        },
        assignment: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                ownerId: true
              }
            },
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    if (!submission) {
      throw new ApiError('Submission not found', 404);
    }

    // Check authorization
    const isStudent = submission.studentId === req.user.id;
    const isTeacher = submission.assignment.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isStudent && !isTeacher && !isAdmin) {
      throw new ApiError('Not authorized to view this submission', 403);
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    logger.error('Error getting submission:', error);
    next(error);
  }
};

/**
 * @desc    Grade submission (teacher)
 * @route   POST /api/v1/submissions/:id/grade
 * @access  Private/Teacher
 */
export const gradeSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    // Validate grade
    if (grade === undefined || grade === null) {
      throw new ApiError('Grade is required', 400);
    }

    const gradeNum = parseFloat(grade);
    if (isNaN(gradeNum) || gradeNum < 0) {
      throw new ApiError('Grade must be a positive number', 400);
    }

    // Get submission
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            class: {
              select: {
                id: true,
                ownerId: true,
                schoolId: true
              }
            }
          }
        },
        student: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    if (!submission) {
      throw new ApiError('Submission not found', 404);
    }
    if (req.user.schoolId && submission.assignment.class?.schoolId && submission.assignment.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to grade this submission', 403);
    }

    // Check authorization - only class owner or admin can grade
    const isTeacher = submission.assignment.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isTeacher && !isAdmin) {
      throw new ApiError('Not authorized to grade this submission', 403);
    }

    // Validate grade doesn't exceed assignment points
    if (submission.assignment.points && gradeNum > submission.assignment.points) {
      throw new ApiError(`Grade cannot exceed ${submission.assignment.points} points`, 400);
    }

    // Update submission
    const now = new Date();
    const gradedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        grade: gradeNum,
        feedback: feedback || null,
        status: 'GRADED',
        gradedById: req.user.id,
        gradedAt: now
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
      io.to(`class:${submission.assignment.classId}`).emit('submissionGraded', { submissionId: id, assignmentId: submission.assignmentId, classId: submission.assignment.classId, studentId: submission.studentId, grade: gradeNum });
      if (submission.assignment.class?.schoolId) io.to(`tenant:${submission.assignment.class.schoolId}:class:${submission.assignment.classId}`).emit('submissionGraded', { submissionId: id, assignmentId: submission.assignmentId, classId: submission.assignment.classId, studentId: submission.studentId, grade: gradeNum });
    }

    logger.info(`Submission graded: ${id} by teacher: ${req.user.id} - Grade: ${gradeNum}`);

    res.status(200).json({
      success: true,
      data: gradedSubmission,
      message: 'Submission graded successfully'
    });
  } catch (error) {
    logger.error('Error grading submission:', error);
    next(error);
  }
};

/**
 * @desc    Return submission to student (teacher)
 * @route   POST /api/v1/submissions/:id/return
 * @access  Private/Teacher
 */
export const returnSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get submission
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            class: {
              select: {
                id: true,
                ownerId: true,
                schoolId: true
              }
            }
          }
        }
      }
    });

    if (!submission) {
      throw new ApiError('Submission not found', 404);
    }
    if (req.user.schoolId && submission.assignment.class?.schoolId && submission.assignment.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to return this submission', 403);
    }

    // Check authorization
    const isTeacher = submission.assignment.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isTeacher && !isAdmin) {
      throw new ApiError('Not authorized to return this submission', 403);
    }

    // Must be graded first
    if (submission.status !== 'GRADED') {
      throw new ApiError('Submission must be graded before returning', 400);
    }

    // Update submission
    const returnedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        status: 'RETURNED',
        returnedAt: new Date()
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
      io.to(`class:${submission.assignment.classId}`).emit('submissionReturned', { submissionId: id, assignmentId: submission.assignmentId, classId: submission.assignment.classId, studentId: submission.studentId });
      if (submission.assignment.class?.schoolId) io.to(`tenant:${submission.assignment.class.schoolId}:class:${submission.assignment.classId}`).emit('submissionReturned', { submissionId: id, assignmentId: submission.assignmentId, classId: submission.assignment.classId, studentId: submission.studentId });
    }

    logger.info(`Submission returned: ${id} by teacher: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: returnedSubmission,
      message: 'Submission returned to student'
    });
  } catch (error) {
    logger.error('Error returning submission:', error);
    next(error);
  }
};

/**
 * @desc    Update submission grade/feedback (teacher)
 * @route   PUT /api/v1/submissions/:id
 * @access  Private/Teacher
 */
export const updateSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { grade, feedback, status } = req.body;

    // Get submission
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            class: {
              select: {
                id: true,
                ownerId: true,
                schoolId: true
              }
            }
          }
        }
      }
    });

    if (!submission) {
      throw new ApiError('Submission not found', 404);
    }
    if (req.user.schoolId && submission.assignment.class?.schoolId && submission.assignment.class.schoolId !== req.user.schoolId) {
      throw new ApiError('Not authorized to update this submission', 403);
    }

    // Check authorization
    const isTeacher = submission.assignment.class.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isTeacher && !isAdmin) {
      throw new ApiError('Not authorized to update this submission', 403);
    }

    // Build update data
    const updateData = {};

    if (grade !== undefined) {
      const gradeNum = parseFloat(grade);
      if (isNaN(gradeNum) || gradeNum < 0) {
        throw new ApiError('Grade must be a positive number', 400);
      }
      if (submission.assignment.points && gradeNum > submission.assignment.points) {
        throw new ApiError(`Grade cannot exceed ${submission.assignment.points} points`, 400);
      }
      updateData.grade = gradeNum;
    }

    if (feedback !== undefined) {
      updateData.feedback = feedback;
    }

    if (status !== undefined) {
      if (!['ASSIGNED', 'TURNED_IN', 'GRADED', 'RETURNED', 'MISSING', 'LATE'].includes(status)) {
        throw new ApiError('Invalid submission status', 400);
      }
      updateData.status = status;
    }

    // Update submission
    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: updateData,
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
      io.to(`class:${submission.assignment.classId}`).emit('submissionUpdated', { submissionId: id, assignmentId: submission.assignmentId, classId: submission.assignment.classId, studentId: submission.studentId });
      if (submission.assignment.class?.schoolId) io.to(`tenant:${submission.assignment.class.schoolId}:class:${submission.assignment.classId}`).emit('submissionUpdated', { submissionId: id, assignmentId: submission.assignmentId, classId: submission.assignment.classId, studentId: submission.studentId });
    }

    logger.info(`Submission updated: ${id} by teacher: ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedSubmission
    });
  } catch (error) {
    logger.error('Error updating submission:', error);
    next(error);
  }
};
