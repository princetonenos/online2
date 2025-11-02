import { defineStore } from 'pinia'

export const useTeacherClassesStore = defineStore('teacherClasses', {
  state: () => ({ items: [], students: [] }),
  actions: {
    async fetchAll() {
      if (!localStorage.getItem('mock:classes')) {
        const seed = [
          { id: 'c1', title: 'Biology 101', startAt: new Date(Date.now()+3600*1000).toISOString(), duration: 60, level:'beginner', status:'active' },
          { id: 'c2', title: 'Maths: Fractions', startAt: new Date(Date.now()+7200*1000).toISOString(), duration: 45, level:'intermediate', status:'scheduled' }
        ]
        localStorage.setItem('mock:classes', JSON.stringify(seed))
      }
      if (!localStorage.getItem('mock:students')) {
        const seedStudents = [
          { id: 's1', name: 'Mark', email: 'mark@student.local', progress: 78 },
          { id: 's2', name: 'Lily', email: 'lily@student.local', progress: 92 }
        ]
        localStorage.setItem('mock:students', JSON.stringify(seedStudents))
      }
      this.items = JSON.parse(localStorage.getItem('mock:classes') || '[]')
      this.students = JSON.parse(localStorage.getItem('mock:students') || '[]')
    },
    add(c) { this.items.unshift(c); localStorage.setItem('mock:classes', JSON.stringify(this.items)) },
    active() { return this.items.filter(x => x.status === 'active' || x.status === 'scheduled') },
    upcoming(limit=5) { return this.items.filter(x=>new Date(x.startAt) > new Date()).slice(0,limit) },
    findById(id){ return this.items.find(x=>x.id===id) },
    getStudents(){ return this.students },
    totalStudents(){ return this.students.length },
    avgCompletion(){ 
      if (!this.students.length) return 0
      const sum = this.students.reduce((s,st)=>s+(st.progress||0),0)
      return Math.round(sum/this.students.length)
    },
    getAssignments(){ return [] } // stub
  }
})
