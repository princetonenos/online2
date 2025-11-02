import { defineStore } from 'pinia'

export const useAdminUsersStore = defineStore('adminUsers', {
  state: () => ({ items: [] }),
  actions: {
    async fetchAll(){
      if (!localStorage.getItem('mock:users')) {
        // seed sample
        const seed = [{ id: 'u1', name: 'Alice Teacher', role: 'teacher', status: 'active' }, { id: 'u2', name:'Bob Student', role:'student', status:'active' }]
        localStorage.setItem('mock:users', JSON.stringify(seed))
      }
      this.items = JSON.parse(localStorage.getItem('mock:users') || '[]')
    },
    add(u){ this.items.unshift(u); localStorage.setItem('mock:users', JSON.stringify(this.items)) },
    findById(id){ return this.items.find(x=>x.id===id) }
  }
})
