import { defineStore } from 'pinia'

export const useAdminClassesStore = defineStore('adminClasses', {
  state: () => ({ items: [] }),
  actions: {
    async fetchAll(){
      if (!localStorage.getItem('mock:classes')) {
        const seed = [{ id: 'c1', title: 'Biology 101', startAt: new Date().toISOString(), status:'active' }]
        localStorage.setItem('mock:classes', JSON.stringify(seed))
      }
      this.items = JSON.parse(localStorage.getItem('mock:classes') || '[]')
    },
    add(c){ this.items.unshift(c); localStorage.setItem('mock:classes', JSON.stringify(this.items)) },
    findById(id){ return this.items.find(x=>x.id===id) }
  }
})
