/**
 * Avatar Utility Helpers
 * Provides fallback avatar generation for users without profile images
 */

/**
 * Get avatar URL with fallback support
 * @param {Object} user - User object
 * @param {string} user.avatarUrl - Optional custom avatar URL
 * @param {string} user.firstName - User's first name
 * @param {string} user.lastName - User's last name
 * @param {string} user.name - User's full name (fallback)
 * @returns {string} Avatar URL or generated avatar
 */
export function getAvatarUrl(user) {
  // If user has a custom avatar and it's not a placeholder, use it
  if (user?.avatarUrl && !user.avatarUrl.includes('placeholder')) {
    return user.avatarUrl
  }
  
  // Generate avatar using UI Avatars service
  const name = getUserDisplayName(user)
  const initials = getInitials(name)
  
  // Use UI Avatars API with customization
  const params = new URLSearchParams({
    name: initials,
    background: getColorFromName(name),
    color: 'ffffff',
    size: '128',
    bold: 'true',
    format: 'svg'
  })
  
  return `https://ui-avatars.com/api/?${params.toString()}`
}

/**
 * Get user's display name
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export function getUserDisplayName(user) {
  if (!user) return 'User'
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  
  if (user.firstName) return user.firstName
  if (user.lastName) return user.lastName
  if (user.name) return user.name
  if (user.email) return user.email.split('@')[0]
  
  return 'User'
}

/**
 * Get initials from name
 * @param {string} name - User's name
 * @returns {string} Initials (max 2 characters)
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U'
  
  const parts = name.trim().split(/\s+/)
  
  if (parts.length >= 2) {
    // First and last name initials
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  
  if (parts[0].length >= 2) {
    // First two letters of single name
    return parts[0].substring(0, 2).toUpperCase()
  }
  
  return parts[0][0].toUpperCase()
}

/**
 * Generate a consistent color from a name
 * @param {string} name - User's name
 * @returns {string} Hex color code (without #)
 */
export function getColorFromName(name) {
  if (!name) return '3B82F6' // Default blue
  
  // Predefined color palette (Material Design colors)
  const colors = [
    '3B82F6', // Blue
    '10B981', // Green
    'F59E0B', // Amber
    'EF4444', // Red
    '8B5CF6', // Purple
    'EC4899', // Pink
    '06B6D4', // Cyan
    '84CC16', // Lime
    'F97316', // Orange
    '6366F1', // Indigo
  ]
  
  // Generate consistent hash from name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Use hash to pick a color
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

/**
 * Get avatar style object
 * @param {Object} user - User object
 * @param {string} size - Size (sm, md, lg, xl)
 * @returns {Object} Style object
 */
export function getAvatarStyle(user, size = 'md') {
  const sizes = {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px',
    '2xl': '96px',
    '3xl': '128px'
  }
  
  const dimension = sizes[size] || sizes.md
  
  return {
    width: dimension,
    height: dimension,
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: `#${getColorFromName(getUserDisplayName(user))}`
  }
}

/**
 * Create avatar element with fallback
 * @param {Object} user - User object
 * @param {string} size - Size class (w-8 h-8, w-10 h-10, etc.)
 * @returns {string} HTML string for avatar
 */
export function createAvatarHTML(user, size = 'w-10 h-10') {
  const name = getUserDisplayName(user)
  const initials = getInitials(name)
  const color = getColorFromName(name)
  const avatarUrl = getAvatarUrl(user)
  
  return `
    <div class="${size} rounded-full flex items-center justify-center text-white font-semibold text-sm" 
         style="background-color: #${color}">
      <img src="${avatarUrl}" 
           alt="${name}" 
           class="w-full h-full rounded-full object-cover"
           onerror="this.style.display='none'; this.parentElement.textContent='${initials}'"
      />
    </div>
  `
}

/**
 * Check if URL is a valid image
 * @param {string} url - Image URL
 * @returns {Promise<boolean>} True if valid image
 */
export async function isValidImageUrl(url) {
  if (!url) return false
  
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
    
    // Timeout after 3 seconds
    setTimeout(() => resolve(false), 3000)
  })
}

/**
 * Get Gravatar URL
 * @param {string} email - User's email
 * @param {number} size - Image size
 * @returns {string} Gravatar URL
 */
export function getGravatarUrl(email, size = 128) {
  if (!email) return null
  
  // Simple MD5-like hash for email (for demo purposes)
  // In production, use a proper MD5 library or backend
  const hash = btoa(email.toLowerCase().trim()).substring(0, 32)
  
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`
}

export default {
  getAvatarUrl,
  getUserDisplayName,
  getInitials,
  getColorFromName,
  getAvatarStyle,
  createAvatarHTML,
  isValidImageUrl,
  getGravatarUrl
}
