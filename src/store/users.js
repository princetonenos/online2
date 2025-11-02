import { defineStore } from 'pinia'
import usersData from '../data/mock/users.json'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false
  }),

  getters: {
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },
    getTeachers: (state) => {
      return state.users.filter(user => user.role === 'teacher')
    },
    getStudents: (state) => {
      return state.users.filter(user => user.role === 'student')
    },
    isTeacher: (state) => {
      return state.currentUser?.role === 'teacher'
    },
    isStudent: (state) => {
      return state.currentUser?.role === 'student'
    }
  },

  actions: {
    async loadUsers() {
      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 300))
      this.users = usersData
      this.loading = false
    },

    async setCurrentUser(userId) {
      const user = this.getUserById(userId)
      if (user) {
        this.currentUser = user
        this.persistCurrentUser()
      }
    },

    async switchRole(userId) {
      const user = this.getUserById(userId)
      if (user) {
        this.currentUser = user
        this.persistCurrentUser()
      }
    },

    async createUser(userData) {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      }
      
      this.users.push(newUser)
      this.persistToStorage()
      
      return newUser
    },

    async updateUser(userId, updates) {
      const userIndex = this.users.findIndex(user => user.id === userId)
      if (userIndex !== -1) {
        this.users[userIndex] = {
          ...this.users[userIndex],
          ...updates
        }
        this.persistToStorage()
      }
    },

    persistCurrentUser() {
      if (typeof window !== 'undefined' && this.currentUser) {
        localStorage.setItem('mock:currentUser', JSON.stringify(this.currentUser))
      }
    },

    persistToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('users', JSON.stringify(this.users))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const storedUsers = localStorage.getItem('users')
        const storedCurrentUser = localStorage.getItem('mock:currentUser')
        
        if (storedUsers) {
          this.users = JSON.parse(storedUsers)
        } else {
          this.users = usersData
        }
        
        if (storedCurrentUser) {
          this.currentUser = JSON.parse(storedCurrentUser)
        } else {
          // Don't set a default user - let login handle it
          this.currentUser = null
        }
      }
    }
  }
})
