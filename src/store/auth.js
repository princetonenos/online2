// src/store/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsersStore } from './users'

// API base URL (backend optional during localStorage mode)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
const IS_PRODUCTION = import.meta.env.PROD

// Configure axios with default settings
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Add request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth:token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const useAuth = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('auth:user') || 'null'),
    token: localStorage.getItem('auth:token') || null,
    passwordResetRequests: JSON.parse(localStorage.getItem('auth:passwordResetRequests') || '[]')
  }),
  actions: {
    async login({ email, password }) {
      // Prefer localStorage users (migration to local mode)
      try {
        const usersStore = useUsersStore()
        if (!usersStore.users?.length) await usersStore.loadFromStorage()
        const user = await usersStore.verifyCredentials(email, password)
        if (user) {
          this.user = user
          this.token = 'local-' + Date.now()
          localStorage.setItem('auth:user', JSON.stringify(user))
          localStorage.setItem('auth:token', this.token)
          // keep legacy key for parts that still read it
          localStorage.setItem('mock:currentUser', JSON.stringify(user))
          return user
        }
      } catch (e) {
        // fall through to API attempt
      }

      // Fallback to backend API (optional)
      try {
        const response = await api.post('/auth/login', {
          email: email.trim().toLowerCase(),
          password
        })

        // Normalize expected shape
        const data = response.data?.data || response.data || {}
        const user = data.user || data
        const accessToken = data.accessToken || data.token

        if (!user || !user.id || !user.role) throw new Error('Invalid response from server')

        this.user = user
        this.token = accessToken
        localStorage.setItem('auth:user', JSON.stringify(user))
        localStorage.setItem('auth:token', accessToken)
        localStorage.setItem('mock:currentUser', JSON.stringify(user))
        return user
      } catch (error) {
        // Unify error messages
        if (error.response) {
          const status = error.response.status
          const message = error.response.data?.message || error.response.data?.error
          if (status === 401) throw new Error(message || 'Invalid email or password')
          if (status === 429) throw new Error('Too many login attempts. Please try again later')
          if (status === 403) throw new Error('Account is disabled. Contact administrator')
          throw new Error(message || `Login failed (Error ${status})`)
        } else if (error.request) {
          throw new Error('Cannot connect to server. Please check your connection')
        } else {
          throw new Error(error.message || 'Login failed. Please try again')
        }
      }
    },

    async quickSignIn(role = 'student') {
      // Development-only quick sign-in
      if (IS_PRODUCTION) throw new Error('Quick sign-in is disabled in production')

      const user = {
        id: Date.now(),
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        email: `${role}@dev.local`,
        role,
        firstName: role.charAt(0).toUpperCase() + role.slice(1),
        lastName: 'User'
      }

      this.user = user
      this.token = 'mock-jwt-token-' + Date.now()
      localStorage.setItem('auth:user', JSON.stringify(user))
      localStorage.setItem('auth:token', this.token)
      localStorage.setItem('mock:currentUser', JSON.stringify(user))
      return Promise.resolve(user)
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/auth/logout').catch(() => {})
        }
      } finally {
        this.user = null
        this.token = null
        localStorage.removeItem('auth:user')
        localStorage.removeItem('auth:token')
        localStorage.removeItem('mock:currentUser')
      }
    },

    async requestPasswordReset(email) {
      // Local placeholder; push a request record for UI feedback
      const resetRequest = {
        id: Date.now(),
        email: email.trim().toLowerCase(),
        timestamp: new Date().toISOString(),
        status: 'pending',
        type: 'password_reset'
      }
      this.passwordResetRequests.push(resetRequest)
      localStorage.setItem('auth:passwordResetRequests', JSON.stringify(this.passwordResetRequests))
      return resetRequest
    },

    async getResetRequests() {
      return this.passwordResetRequests
    },

    async markResetRequestComplete(requestId) {
      const request = this.passwordResetRequests.find(r => r.id === requestId)
      if (request) {
        request.status = 'completed'
        request.completedAt = new Date().toISOString()
        localStorage.setItem('auth:passwordResetRequests', JSON.stringify(this.passwordResetRequests))
      }
      return request
    },

    async validateSession() {
      // Local session validation
      const userStr = localStorage.getItem('auth:user')
      const token = localStorage.getItem('auth:token')
      if (userStr && token) {
        this.user = JSON.parse(userStr)
        this.token = token
        return true
      }
      return false
    }
  },
  getters: {
    isAuthenticated: (s) => !!s.user && !!s.token,
    isTeacher: (s) => s.user?.role === 'teacher',
    isAdmin: (s) => s.user?.role === 'admin',
    isStudent: (s) => s.user?.role === 'student',
    currentUser: (s) => s.user,
    pendingResetRequests: (s) => s.passwordResetRequests.filter(req => req.status === 'pending'),
    isProduction: () => IS_PRODUCTION
  }
})
