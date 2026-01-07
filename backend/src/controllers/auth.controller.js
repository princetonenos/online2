import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * Generate JWT access token
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

/**
 * Generate JWT refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Sanitize user object (remove sensitive data)
 */
const sanitizeUser = (user) => {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, schoolId } = req.body;
  
  // Validate input
  if (!email || !password || !firstName || !lastName) {
    throw ApiError.badRequest('Please provide all required fields');
  }
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      role: role || 'STUDENT',
      schoolId,
      emailVerified: false,
      isActive: true,
    },
  });
  
  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);
  
  // Save refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });
  
  logger.info(`New user registered: ${user.email}`);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    },
  });
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password');
  }
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  
  // Check if user is active
  if (!user.isActive) {
    throw ApiError.forbidden('Account is inactive. Please contact administrator.');
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  
  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);
  
  // Save refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });
  
  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  
  logger.info(`User logged in: ${user.email}`);
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    },
  });
});

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  
  if (!token) {
    throw ApiError.badRequest('Refresh token is required');
  }
  
  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw ApiError.unauthorized('Invalid refresh token');
  }
  
  // Check if refresh token exists in database and is not expired
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
  });
  
  if (!storedToken) {
    throw ApiError.unauthorized('Invalid refresh token');
  }
  
  if (storedToken.expiresAt < new Date()) {
    // Delete expired token
    await prisma.refreshToken.delete({ where: { token } });
    throw ApiError.unauthorized('Refresh token has expired');
  }
  
  // Get user
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });
  
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or inactive');
  }
  
  // Generate new access token
  const accessToken = generateAccessToken(user.id, user.role);
  
  // Optionally rotate refresh token
  const newRefreshToken = generateRefreshToken(user.id);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Delete old refresh token and create new one
  await prisma.refreshToken.delete({ where: { token } });
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt,
    },
  });
  
  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  });
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  
  if (token) {
    // Delete refresh token from database
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }
  
  logger.info(`User logged out: ${req.user?.email || 'Unknown'}`);
  
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    throw ApiError.badRequest('Email is required');
  }
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  
  if (!user) {
    // Don't reveal if user exists
    return res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
    });
  }
  
  // Generate reset token (in production, send this via email)
  const resetToken = jwt.sign(
    { userId: user.id, type: 'password-reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // In production, send email with reset link
  // For now, just log it
  logger.info(`Password reset requested for: ${user.email}`);
  logger.info(`Reset token: ${resetToken}`);
  
  // TODO: Send email with reset link
  // await sendPasswordResetEmail(user.email, resetToken);
  
  res.json({
    success: true,
    message: 'If the email exists, a password reset link has been sent',
    // Remove this in production:
    data: { resetToken }, // Only for development
  });
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    throw ApiError.badRequest('Token and new password are required');
  }
  
  // Verify reset token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password-reset') {
      throw new Error('Invalid token type');
    }
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired reset token');
  }
  
  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  // Update password
  await prisma.user.update({
    where: { id: decoded.userId },
    data: { passwordHash },
  });
  
  // Invalidate all refresh tokens for this user
  await prisma.refreshToken.deleteMany({
    where: { userId: decoded.userId },
  });
  
  logger.info(`Password reset successful for user ID: ${decoded.userId}`);
  
  res.json({
    success: true,
    message: 'Password reset successful. Please login with your new password.',
  });
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      school: true,
    },
  });
  
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  
  res.json({
    success: true,
    data: { user: sanitizeUser(user) },
  });
});

export default {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
