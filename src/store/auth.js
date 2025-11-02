// src/store/auth.js
import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
  }),
  actions: {
    async login({ email, password }) {
      // simulate network delay
      await new Promise(r => setTimeout(r, 400))

      // simple mock: role by email prefix. Replace with your mock API.
      let role = 'student'
      if (email?.includes('admin')) role = 'admin'
      else if (email?.includes('teacher')) role = 'teacher'

      const user = { id: Date.now(), name: email.split('@')[0] || 'User', email, role }
      this.user = user
      localStorage.setItem('mock:currentUser', JSON.stringify(user))
      return user
    },
    quickSignIn(role = 'student') {
      // quick dev sign-in
      const user = { id: Date.now(), name: `${role}-dev`, email: `${role}@dev.local`, role }
      this.user = user
      localStorage.setItem('mock:currentUser', JSON.stringify(user))
      return Promise.resolve(user)
    },
    logout() {
      this.user = null
      localStorage.removeItem('mock:currentUser')
    }
  },
  getters: {
    isTeacher: (s) => s.user?.role === 'teacher',
    isAdmin: (s) => s.user?.role === 'admin',
    isStudent: (s) => s.user?.role === 'student'
  }
})
