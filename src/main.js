import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize stores after pinia is set up
import { useUsersStore } from './store/users'
import { useClassesStore } from './store/classes'

// Initialize users store
const usersStore = useUsersStore()
usersStore.loadFromStorage()

// Initialize classes store
const classesStore = useClassesStore()
classesStore.loadClasses()

// Add global toast utility
if (typeof window !== 'undefined') {
  window.showToast = (message, type = 'info') => {
    // Simple toast implementation - in a real app you'd use a proper toast library
    console.log(`Toast (${type}):`, message)
    
    // Create a simple toast element
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #20A464;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 10000;
      font-family: 'Roboto', sans-serif;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `
    
    document.body.appendChild(toast)
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 3000)
  }
}

app.mount('#app')
