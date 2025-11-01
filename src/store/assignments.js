import { defineStore } from 'pinia'
import assignmentsData from '../data/mock/assignments.json'

export const useAssignmentsStore = defineStore('assignments', {
  state: () => ({
    assignments: [],
    submissions: [],
    loading: false
  }),

  getters: {
    getAssignmentsByCourse: (state) => (courseId) => {
      return state.assignments
        .filter(assignment => assignment.courseId === courseId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    getAssignmentById: (state) => (assignmentId) => {
      return state.assignments.find(assignment => assignment.id === assignmentId)
    },
    getSubmissionsByAssignment: (state) => (assignmentId) => {
      return state.submissions.filter(submission => submission.assignmentId === assignmentId)
    },
    getSubmissionByUser: (state) => (assignmentId, userId) => {
      return state.submissions.find(
        submission => submission.assignmentId === assignmentId && submission.studentId === userId
      )
    },
    getAssignmentsByTopic: (state) => (courseId, topicId) => {
      return state.assignments
        .filter(assignment => assignment.courseId === courseId && assignment.topicId === topicId)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    }
  },

  actions: {
    async loadAssignments() {
      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 500))
      this.assignments = assignmentsData.assignments
      this.submissions = assignmentsData.submissions
      this.loading = false
    },

    async createAssignment(assignmentData) {
      const newAssignment = {
        id: Date.now().toString(),
        ...assignmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      this.assignments.push(newAssignment)
      this.persistToStorage()
      
      return newAssignment
    },

    async updateAssignment(assignmentId, updates) {
      const assignmentIndex = this.assignments.findIndex(assignment => assignment.id === assignmentId)
      if (assignmentIndex !== -1) {
        this.assignments[assignmentIndex] = {
          ...this.assignments[assignmentIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        this.persistToStorage()
      }
    },

    async deleteAssignment(assignmentId) {
      this.assignments = this.assignments.filter(assignment => assignment.id !== assignmentId)
      // Also remove submissions for this assignment
      this.submissions = this.submissions.filter(submission => submission.assignmentId !== assignmentId)
      this.persistToStorage()
    },

    async submitAssignment(submissionData) {
      const existingSubmission = this.getSubmissionByUser(
        submissionData.assignmentId, 
        submissionData.studentId
      )
      
      if (existingSubmission) {
        // Update existing submission
        Object.assign(existingSubmission, submissionData, {
          submittedAt: new Date().toISOString(),
          status: 'submitted'
        })
      } else {
        // Create new submission
        const newSubmission = {
          id: Date.now().toString(),
          ...submissionData,
          submittedAt: new Date().toISOString(),
          status: 'submitted',
          grade: null,
          feedback: null,
          returnedAt: null
        }
        this.submissions.push(newSubmission)
      }
      
      this.persistToStorage()
    },

    async gradeAssignment(submissionId, gradeData) {
      const submission = this.submissions.find(sub => sub.id === submissionId)
      if (submission) {
        Object.assign(submission, gradeData, {
          returnedAt: new Date().toISOString(),
          status: 'graded'
        })
        this.persistToStorage()
      }
    },

    async markAsMissing(assignmentId, studentId) {
      const submission = this.getSubmissionByUser(assignmentId, studentId)
      if (!submission) {
        const newSubmission = {
          id: Date.now().toString(),
          assignmentId,
          studentId,
          status: 'missing',
          submittedAt: null,
          grade: null,
          feedback: null,
          returnedAt: null
        }
        this.submissions.push(newSubmission)
      } else {
        submission.status = 'missing'
      }
      this.persistToStorage()
    },

    persistToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('assignments', JSON.stringify(this.assignments))
        localStorage.setItem('submissions', JSON.stringify(this.submissions))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const storedAssignments = localStorage.getItem('assignments')
        const storedSubmissions = localStorage.getItem('submissions')
        
        if (storedAssignments) {
          this.assignments = JSON.parse(storedAssignments)
        } else {
          this.assignments = assignmentsData.assignments
        }
        
        if (storedSubmissions) {
          this.submissions = JSON.parse(storedSubmissions)
        } else {
          this.submissions = assignmentsData.submissions
        }
      }
    }
  }
})
