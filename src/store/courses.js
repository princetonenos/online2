import { defineStore } from 'pinia'
import coursesData from '../data/mock/courses.json'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    loading: false,
    currentCourse: null
  }),

  getters: {
    getCourseById: (state) => (id) => {
      return state.courses.find(course => course.id === id)
    },
    getCoursesForUser: (state) => (userId) => {
      return state.courses.filter(course => 
        course.teachers.some(teacher => teacher.id === userId) ||
        course.students.some(student => student.id === userId)
      )
    }
  },

  actions: {
    async loadCourses() {
      this.loading = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      this.courses = coursesData
      this.loading = false
    },

    async createCourse(courseData) {
      const newCourse = {
        id: Date.now().toString(),
        ...courseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      this.courses.push(newCourse)
      
      // Persist to localStorage
      this.persistToStorage()
      
      return newCourse
    },

    async updateCourse(courseId, updates) {
      const courseIndex = this.courses.findIndex(course => course.id === courseId)
      if (courseIndex !== -1) {
        this.courses[courseIndex] = {
          ...this.courses[courseIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        this.persistToStorage()
      }
    },

    async deleteCourse(courseId) {
      this.courses = this.courses.filter(course => course.id !== courseId)
      this.persistToStorage()
    },

    setCurrentCourse(courseId) {
      this.currentCourse = this.getCourseById(courseId)
    },

    persistToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('courses', JSON.stringify(this.courses))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('courses')
        if (stored) {
          this.courses = JSON.parse(stored)
        } else {
          this.courses = coursesData
        }
      }
    }
  }
})
