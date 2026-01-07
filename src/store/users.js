import { defineStore } from 'pinia'
import { hashPassword, constantTimeEqual } from '@/utils/password'

const STORAGE_KEY = 'mock:users'

// Precomputed SHA-256 for 'admin123'
const ADMIN_DEFAULT_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false
  }),

  getters: {
    getUserById: (state) => (id) => state.users.find(u => u.id === id),
    getByEmail: (state) => (email) => state.users.find(u => u.email?.toLowerCase() === email?.toLowerCase()),
    getTeachers: (state) => state.users.filter(u => u.role === 'teacher'),
    getStudents: (state) => state.users.filter(u => u.role === 'student'),
    isTeacher: (state) => state.currentUser?.role === 'teacher',
    isStudent: (state) => state.currentUser?.role === 'student'
  },

  actions: {
    async loadFromStorage() {
      this.loading = true
      try {
        if (typeof window === 'undefined') return
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          this.users = JSON.parse(stored)
        } else {
          // Seed with default admin user
          this.users = [
            {
              id: 'admin-1',
              name: 'System Administrator',
              email: 'admin@school.edu',
              role: 'admin',
              status: 'active',
              school: 'Main Campus',
              avatar: '/avatars/admin1.jpg',
              passwordHash: ADMIN_DEFAULT_HASH,
              createdAt: new Date().toISOString()
            }
          ]
          this.persist()
        }

        // Restore current user if present (both legacy and new key)
        const current = localStorage.getItem('auth:user') || localStorage.getItem('mock:currentUser')
        this.currentUser = current ? JSON.parse(current) : null
      } finally {
        this.loading = false
      }
    },

    async createUser(userData, password) {
      const newUser = {
        id: Date.now().toString(),
        name: userData.name?.trim() || '',
        email: userData.email?.trim().toLowerCase() || '',
        role: userData.role || 'student',
        school: userData.school || 'N/A',
        status: 'active',
        avatar: userData.avatar || '/avatars/user-default.jpg',
        createdAt: new Date().toISOString(),
        passwordHash: ''
      }

      if (password && password.length >= 6) {
        newUser.passwordHash = await hashPassword(password)
      } else {
        // Temporary password (prompt to change later)
        newUser.passwordHash = await hashPassword('changeme123')
      }

      this.users.push(newUser)
      this.persist()
      return newUser
    },

    async updateUser(userId, updates) {
      const idx = this.users.findIndex(u => u.id === userId)
      if (idx === -1) return null

      const user = { ...this.users[idx], ...updates }
      this.users[idx] = user
      this.persist()
      return user
    },

    async setPassword(userId, newPassword) {
      const idx = this.users.findIndex(u => u.id === userId)
      if (idx === -1) return false
      this.users[idx].passwordHash = await hashPassword(newPassword)
      this.persist()
      return true
    },

    async verifyCredentials(email, password) {
      const user = this.users.find(u => u.email?.toLowerCase() === email?.toLowerCase())
      if (!user || !user.passwordHash) return null
      const hash = await hashPassword(password)
      return constantTimeEqual(hash, user.passwordHash) ? user : null
    },

    setCurrentUser(user) {
      this.currentUser = user
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth:user', JSON.stringify(user))
        localStorage.setItem('mock:currentUser', JSON.stringify(user)) // legacy compatibility
      }
    },

    clearCurrentUser() {
      this.currentUser = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth:user')
        localStorage.removeItem('mock:currentUser')
      }
    },

    persist() {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users))
      }
    }
  }
})
