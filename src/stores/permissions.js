// permissions.js - Store for admin user permissions system
import { defineStore } from 'pinia'
import { useAuth } from '@/store/auth'

// Define permission constants
export const PERMISSIONS = {
  // User Management
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_BULK_IMPORT: 'user:bulk_import',
  
  // Class Management
  CLASS_VIEW: 'class:view',
  CLASS_CREATE: 'class:create',
  CLASS_EDIT: 'class:edit',
  CLASS_DELETE: 'class:delete',
  CLASS_MANAGE_ENROLLMENT: 'class:manage_enrollment',
  
  // Assignment Management
  ASSIGNMENT_VIEW: 'assignment:view',
  ASSIGNMENT_CREATE: 'assignment:create',
  ASSIGNMENT_EDIT: 'assignment:edit',
  ASSIGNMENT_DELETE: 'assignment:delete',
  ASSIGNMENT_GRADE: 'assignment:grade',
  ASSIGNMENT_MODERATE: 'assignment:moderate',
  
  // System Management
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_RESTORE: 'system:restore',
  SYSTEM_ANALYTICS: 'system:analytics',
  SYSTEM_AUDIT_LOGS: 'system:audit_logs',
  
  // Reports & Analytics
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',
  ANALYTICS_VIEW: 'analytics:view',
  
  // Bulk Operations
  BULK_OPERATIONS: 'bulk:operations'
}

// Default role permissions
export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS), // Admins get all permissions
  
  teacher: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.CLASS_VIEW,
    PERMISSIONS.CLASS_CREATE,
    PERMISSIONS.CLASS_EDIT,
    PERMISSIONS.CLASS_MANAGE_ENROLLMENT,
    PERMISSIONS.ASSIGNMENT_VIEW,
    PERMISSIONS.ASSIGNMENT_CREATE,
    PERMISSIONS.ASSIGNMENT_EDIT,
    PERMISSIONS.ASSIGNMENT_DELETE,
    PERMISSIONS.ASSIGNMENT_GRADE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW
  ],
  
  student: [
    PERMISSIONS.CLASS_VIEW,
    PERMISSIONS.ASSIGNMENT_VIEW
  ]
}

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    userPermissions: JSON.parse(localStorage.getItem('mock:userPermissions') || '{}'),
    customRoles: JSON.parse(localStorage.getItem('mock:customRoles') || '[]')
  }),

  actions: {
    initializeUserPermissions(userId, role) {
      if (!this.userPermissions[userId]) {
        this.userPermissions[userId] = {
          role,
          permissions: [...(ROLE_PERMISSIONS[role] || [])],
          customPermissions: []
        }
        this.savePermissions()
      }
    },

    hasPermission(permission) {
      const authStore = useAuth()
      const user = authStore.user
      
      if (!user) return false
      
      // Super admin bypass
      if (user.role === 'admin' && user.email?.includes('super')) {
        return true
      }

      const userPerms = this.userPermissions[user.id]
      
      if (!userPerms) {
        // Fall back to default role permissions
        return ROLE_PERMISSIONS[user.role]?.includes(permission) || false
      }

      return userPerms.permissions.includes(permission) || 
             userPerms.customPermissions.includes(permission)
    },

    hasAnyPermission(permissions) {
      return permissions.some(permission => this.hasPermission(permission))
    },

    hasAllPermissions(permissions) {
      return permissions.every(permission => this.hasPermission(permission))
    },

    grantPermission(userId, permission) {
      if (!this.userPermissions[userId]) {
        return false
      }

      if (!this.userPermissions[userId].customPermissions.includes(permission)) {
        this.userPermissions[userId].customPermissions.push(permission)
        this.savePermissions()
      }
      
      return true
    },

    revokePermission(userId, permission) {
      if (!this.userPermissions[userId]) {
        return false
      }

      const index = this.userPermissions[userId].customPermissions.indexOf(permission)
      if (index > -1) {
        this.userPermissions[userId].customPermissions.splice(index, 1)
        this.savePermissions()
      }
      
      return true
    },

    setUserPermissions(userId, permissions) {
      if (!this.userPermissions[userId]) {
        return false
      }

      this.userPermissions[userId].customPermissions = permissions
      this.savePermissions()
      return true
    },

    getUserPermissions(userId) {
      const userPerms = this.userPermissions[userId]
      
      if (!userPerms) {
        return []
      }

      return [
        ...userPerms.permissions,
        ...userPerms.customPermissions
      ]
    },

    createCustomRole(roleName, permissions, description) {
      const role = {
        id: Date.now(),
        name: roleName,
        permissions,
        description,
        createdAt: new Date().toISOString()
      }

      this.customRoles.push(role)
      this.saveRoles()
      return role
    },

    updateCustomRole(roleId, updates) {
      const role = this.customRoles.find(r => r.id === roleId)
      if (role) {
        Object.assign(role, updates)
        this.saveRoles()
      }
      return role
    },

    deleteCustomRole(roleId) {
      const index = this.customRoles.findIndex(r => r.id === roleId)
      if (index > -1) {
        this.customRoles.splice(index, 1)
        this.saveRoles()
        return true
      }
      return false
    },

    assignCustomRole(userId, roleId) {
      const role = this.customRoles.find(r => r.id === roleId)
      if (!role) return false

      if (!this.userPermissions[userId]) {
        this.userPermissions[userId] = {
          role: 'custom',
          permissions: [],
          customPermissions: []
        }
      }

      this.userPermissions[userId].customPermissions = [...role.permissions]
      this.userPermissions[userId].customRole = roleId
      this.savePermissions()
      return true
    },

    savePermissions() {
      localStorage.setItem('mock:userPermissions', JSON.stringify(this.userPermissions))
    },

    saveRoles() {
      localStorage.setItem('mock:customRoles', JSON.stringify(this.customRoles))
    },

    // Check permissions for UI elements
    canViewUsers() {
      return this.hasPermission(PERMISSIONS.USER_VIEW)
    },

    canCreateUsers() {
      return this.hasPermission(PERMISSIONS.USER_CREATE)
    },

    canEditUsers() {
      return this.hasPermission(PERMISSIONS.USER_EDIT)
    },

    canDeleteUsers() {
      return this.hasPermission(PERMISSIONS.USER_DELETE)
    },

    canManageClasses() {
      return this.hasAnyPermission([
        PERMISSIONS.CLASS_CREATE,
        PERMISSIONS.CLASS_EDIT,
        PERMISSIONS.CLASS_DELETE
      ])
    },

    canAccessSystemSettings() {
      return this.hasPermission(PERMISSIONS.SYSTEM_SETTINGS)
    },

    canViewAuditLogs() {
      return this.hasPermission(PERMISSIONS.SYSTEM_AUDIT_LOGS)
    },

    canPerformBulkOperations() {
      return this.hasPermission(PERMISSIONS.BULK_OPERATIONS)
    }
  },

  getters: {
    currentUserPermissions() {
      const authStore = useAuth()
      const user = authStore.user
      
      if (!user) return []
      
      return this.getUserPermissions(user.id)
    },

    allPermissions() {
      return Object.values(PERMISSIONS)
    },

    permissionsByCategory() {
      const categories = {}
      
      Object.entries(PERMISSIONS).forEach(([key, value]) => {
        const category = value.split(':')[0]
        if (!categories[category]) {
          categories[category] = []
        }
        categories[category].push({ key, value, label: key })
      })
      
      return categories
    }
  }
})
