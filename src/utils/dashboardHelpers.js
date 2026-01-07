/**
 * Dashboard Helper Utilities
 * 
 * This file contains shared utility functions used across admin, teacher, and student dashboards.
 * Centralizing these functions reduces code duplication and ensures consistency.
 */

/**
 * Format initials from a full name
 * @param {string} name - Full name to extract initials from
 * @returns {string} - 2-letter uppercase initials
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Format date to localized string
 * @param {string|Date} timestamp - Date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(timestamp) {
  try {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return String(timestamp);
  }
}

/**
 * Format time to localized string
 * @param {string|Date} timestamp - Date to format
 * @returns {string} - Formatted time string
 */
export function formatTime(timestamp) {
  try {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(timestamp);
  }
}

/**
 * Format date and time to localized string
 * @param {string|Date} timestamp - Date to format
 * @returns {string} - Formatted date and time string
 */
export function formatDateTime(timestamp) {
  try {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(timestamp);
  }
}

/**
 * Format relative time (e.g., "2h ago", "3d ago")
 * @param {string|Date} timestamp - Date to format
 * @returns {string} - Relative time string
 */
export function formatTimeAgo(timestamp) {
  try {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return String(timestamp);
  }
}

/**
 * Get appropriate greeting based on time of day
 * @returns {string} - Greeting message
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning! Ready to learn something new today?';
  if (hour < 18) return 'Good afternoon! Hope your day is going well.';
  return 'Good evening! Time to wrap up your work.';
}

/**
 * Generate mock stats for dashboard displays
 * @param {string} role - User role (admin, teacher, student)
 * @returns {Object} - Mock statistics object
 */
export function generateMockStats(role) {
  const baseStats = {
    admin: {
      totalUsers: 0,
      activeClasses: 0,
      flaggedAssignments: 0,
      pendingEnrollments: 0,
      teacherCount: 0,
      studentCount: 0,
      adminCount: 0,
      systemHealth: 98,
      avgEngagement: 85,
      userTrend: '+5%',
      classTrend: '+12%',
      serverStatus: 'Online',
      dbStatus: 'Connected',
      storageUsage: 65,
      activeSessions: 42
    },
    teacher: {
      activeClasses: 0,
      totalStudents: 0,
      totalAssignments: 0,
      pendingGrading: 0,
      avgCompletion: 0,
      attendanceRate: 92,
      classTrend: '+2%',
      studentTrend: '+5%',
      assignmentTrend: '+8%'
    },
    student: {
      enrolledClasses: 0,
      upcomingAssignments: 0,
      assignmentsDueToday: 0,
      completedAssignments: 0,
      averageGrade: 0,
      attendanceRate: 95
    }
  };

  return { ...baseStats[role] };
}

/**
 * Safe localStorage getter with fallback
 * @param {string} key - localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} - Parsed value or default
 */
export function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safe localStorage setter
 * @param {string} key - localStorage key
 * @param {*} value - Value to store
 */
export function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to set localStorage key "${key}":`, error);
  }
}

/**
 * Calculate countdown time for next class/event
 * @param {Date} targetTime - Target time for countdown
 * @returns {string} - Formatted countdown string
 */
export function getCountdownTime(targetTime) {
  if (!targetTime) return 'No upcoming events';
  
  const now = new Date();
  const diff = targetTime - now;
  
  if (diff <= 0) return 'Starting soon';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

/**
 * Format assignment due date with relative terms
 * @param {string|Date} dueDate - Assignment due date
 * @returns {string} - Formatted due date string
 */
export function formatDueDate(dueDate) {
  try {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return formatDate(date);
  } catch {
    return String(dueDate);
  }
}

/**
 * Get CSS class for points display
 * @param {number} points - Assignment points
 * @returns {string} - CSS class name
 */
export function getPointsClass(points) {
  if (points >= 100) return 'chip-primary';
  if (points >= 50) return 'chip-secondary';
  return 'chip-gray';
}

export default {
  getInitials,
  formatDate,
  formatTime,
  formatDateTime,
  formatTimeAgo,
  getGreeting,
  generateMockStats,
  safeLocalStorageGet,
  safeLocalStorageSet,
  getCountdownTime,
  formatDueDate,
  getPointsClass
};
