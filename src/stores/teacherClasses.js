import { defineStore } from 'pinia'

const LS_CLASSES = 'mock:classes'
const LS_STUDENTS = 'mock:students'
const LS_EVENTS = 'mock:events'
const LS_COURSES = 'mock:courses'

export const useTeacherClassesStore = defineStore('teacherClasses', {
  state: () => ({
    items: [],        // classes
    students: [],     // students for this teacher
    events: [],       // calendar events owned by this teacher
    courses: []       // courses created by teacher
  }),
  actions: {
    async fetchAll() {
      if (!localStorage.getItem(LS_CLASSES)) {
        const seed = [
          { id: 'c1', title: 'Biology 101', startAt: new Date(Date.now()+3600*1000).toISOString(), duration: 60, level:'beginner', status:'active', teacherId: 'teacher-1' },
          { id: 'c2', title: 'Maths: Fractions', startAt: new Date(Date.now()+7200*1000).toISOString(), duration: 45, level:'intermediate', status:'scheduled', teacherId: 'teacher-1' }
        ]
        localStorage.setItem(LS_CLASSES, JSON.stringify(seed))
      }
      if (!localStorage.getItem(LS_STUDENTS)) {
        const seedStudents = [
          { id: 's1', name: 'Mark', email: 'mark@student.local', progress: 78 },
          { id: 's2', name: 'Lily', email: 'lily@student.local', progress: 92 }
        ]
        localStorage.setItem(LS_STUDENTS, JSON.stringify(seedStudents))
      }
      if (!localStorage.getItem(LS_EVENTS)) {
        const seedEvents = []
        localStorage.setItem(LS_EVENTS, JSON.stringify(seedEvents))
      }
      if (!localStorage.getItem(LS_COURSES)) {
        localStorage.setItem(LS_COURSES, JSON.stringify([]))
      }

      this.items = JSON.parse(localStorage.getItem(LS_CLASSES) || '[]')
      this.students = JSON.parse(localStorage.getItem(LS_STUDENTS) || '[]')
      this.events = JSON.parse(localStorage.getItem(LS_EVENTS) || '[]')
      this.courses = JSON.parse(localStorage.getItem(LS_COURSES) || '[]')
    },

    // classes
    addClass(c) {
      this.items.unshift(c)
      localStorage.setItem(LS_CLASSES, JSON.stringify(this.items))
    },
    updateClass(c) {
      const i = this.items.findIndex(x => x.id === c.id)
      if (i >= 0) this.items.splice(i, 1, c)
      localStorage.setItem(LS_CLASSES, JSON.stringify(this.items))
    },
    removeClass(id) {
      this.items = this.items.filter(x => x.id !== id)
      localStorage.setItem(LS_CLASSES, JSON.stringify(this.items))
    },
    active() { return this.items.filter(x => x.status === 'active' || x.status === 'scheduled') },
    upcoming(limit = 5) { return this.items.filter(x => new Date(x.startAt) > new Date()).slice(0, limit) },
    findClass(id) { return this.items.find(x => x.id === id) },

    // students
    getStudents() { return this.students },
    totalStudents() { return this.students.length },

    // events (calendar)
    fetchEventsForTeacher(teacherId) {
      // returns events owned by teacherId
      return this.events.filter(e => e.ownerId === teacherId)
    },
    addEvent(ev) {
      this.events.unshift(ev)
      localStorage.setItem(LS_EVENTS, JSON.stringify(this.events))
    },
    updateEvent(ev) {
      const i = this.events.findIndex(x => x.id === ev.id)
      if (i >= 0) this.events.splice(i, 1, ev)
      localStorage.setItem(LS_EVENTS, JSON.stringify(this.events))
    },
    removeEvent(id) {
      this.events = this.events.filter(x => x.id !== id)
      localStorage.setItem(LS_EVENTS, JSON.stringify(this.events))
    },

    // courses (separate from classes)
    addCourse(course) {
      this.courses.unshift(course)
      localStorage.setItem(LS_COURSES, JSON.stringify(this.courses))
    },
    updateCourse(course) {
      const i = this.courses.findIndex(x => x.id === course.id)
      if (i >= 0) this.courses.splice(i, 1, course)
      localStorage.setItem(LS_COURSES, JSON.stringify(this.courses))
    },
    removeCourse(id) {
      this.courses = this.courses.filter(x => x.id !== id)
      localStorage.setItem(LS_COURSES, JSON.stringify(this.courses))
    },

    // simple stats
    avgCompletion() {
      if (!this.students.length) return 0
      const sum = this.students.reduce((s, st) => s + (st.progress || 0), 0)
      return Math.round(sum / this.students.length)
    }
  }
})
