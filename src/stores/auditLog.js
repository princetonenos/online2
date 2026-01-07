// auditLog.js - Store for audit logging of admin actions
import { defineStore } from 'pinia'
import { useAuth } from '@/store/auth'

export const useAuditLogStore = defineStore('auditLog', {
  state: () => ({
    logs: JSON.parse(localStorage.getItem('mock:auditLogs') || '[]')
  }),

  actions: {
    logAction(action, details = {}) {
      const authStore = useAuth()
      const user = authStore.user

      const logEntry = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
        userRole: user?.role,
        action,
        details,
        ipAddress: '127.0.0.1', // Mock IP
        userAgent: navigator.userAgent
      }

      this.logs.unshift(logEntry)
      
      // Keep only last 1000 logs
      if (this.logs.length > 1000) {
        this.logs = this.logs.slice(0, 1000)
      }

      this.saveLogs()
      return logEntry
    },

    // Specific action loggers
    logUserCreated(userData) {
      return this.logAction('USER_CREATED', {
        userId: userData.id,
        userName: userData.name,
        userEmail: userData.email,
        userRole: userData.role
      })
    },

    logUserUpdated(userId, changes) {
      return this.logAction('USER_UPDATED', {
        userId,
        changes
      })
    },

    logUserDeleted(userId, userName) {
      return this.logAction('USER_DELETED', {
        userId,
        userName
      })
    },

    logClassCreated(classData) {
      return this.logAction('CLASS_CREATED', {
        classId: classData.id,
        className: classData.name
      })
    },

    logClassUpdated(classId, changes) {
      return this.logAction('CLASS_UPDATED', {
        classId,
        changes
      })
    },

    logClassDeleted(classId, className) {
      return this.logAction('CLASS_DELETED', {
        classId,
        className
      })
    },

    logBulkOperation(operationType, count, details) {
      return this.logAction('BULK_OPERATION', {
        operationType,
        count,
        ...details
      })
    },

    logSystemSettingsChanged(settings) {
      return this.logAction('SYSTEM_SETTINGS_CHANGED', {
        settings
      })
    },

    logBackupCreated(backupId) {
      return this.logAction('BACKUP_CREATED', {
        backupId
      })
    },

    logBackupRestored(backupId) {
      return this.logAction('BACKUP_RESTORED', {
        backupId
      })
    },

    logDataExport(exportType, recordCount) {
      return this.logAction('DATA_EXPORTED', {
        exportType,
        recordCount
      })
    },

    logDataImport(importType, recordCount, status) {
      return this.logAction('DATA_IMPORTED', {
        importType,
        recordCount,
        status
      })
    },

    logLogin(success = true) {
      return this.logAction(success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED', {
        timestamp: new Date().toISOString()
      })
    },

    logLogout() {
      return this.logAction('LOGOUT', {
        timestamp: new Date().toISOString()
      })
    },

    logPermissionChanged(userId, oldPermissions, newPermissions) {
      return this.logAction('PERMISSION_CHANGED', {
        userId,
        oldPermissions,
        newPermissions
      })
    },

    async fetchLogs(filters = {}) {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let filtered = [...this.logs]

      if (filters.action) {
        filtered = filtered.filter(log => log.action === filters.action)
      }

      if (filters.userId) {
        filtered = filtered.filter(log => log.userId === filters.userId)
      }

      if (filters.startDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.startDate))
      }

      if (filters.endDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.endDate))
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(log => 
          log.action.toLowerCase().includes(searchLower) ||
          log.userName?.toLowerCase().includes(searchLower) ||
          log.userEmail?.toLowerCase().includes(searchLower) ||
          JSON.stringify(log.details).toLowerCase().includes(searchLower)
        )
      }

      return filtered
    },

    saveLogs() {
      localStorage.setItem('mock:auditLogs', JSON.stringify(this.logs))
    },

    clearOldLogs(daysToKeep = 90) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      this.logs = this.logs.filter(log => 
        new Date(log.timestamp) >= cutoffDate
      )

      this.saveLogs()
    },

    exportLogs(format = 'json') {
      if (format === 'json') {
        return JSON.stringify(this.logs, null, 2)
      } else if (format === 'csv') {
        const headers = ['Timestamp', 'User', 'Email', 'Role', 'Action', 'Details']
        const rows = this.logs.map(log => [
          log.timestamp,
          log.userName,
          log.userEmail,
          log.userRole,
          log.action,
          JSON.stringify(log.details)
        ])
        
        const csv = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')
        
        return csv
      }
    }
  },

  getters: {
    recentLogs: (state) => state.logs.slice(0, 50),
    
    logsByAction: (state) => (action) => {
      return state.logs.filter(log => log.action === action)
    },

    logsByUser: (state) => (userId) => {
      return state.logs.filter(log => log.userId === userId)
    },

    logsByDateRange: (state) => (startDate, endDate) => {
      return state.logs.filter(log => {
        const logDate = new Date(log.timestamp)
        return logDate >= new Date(startDate) && logDate <= new Date(endDate)
      })
    },

    actionSummary: (state) => {
      const summary = {}
      state.logs.forEach(log => {
        summary[log.action] = (summary[log.action] || 0) + 1
      })
      return summary
    }
  }
})
