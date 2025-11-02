<template>
  <div class="min-h-screen font-roboto" :class="isLoginPage ? 'bg-gradient-to-br from-classroom-primary to-classroom-secondary' : 'bg-classroom-gray-50'">
    <!-- ARIA live region for accessibility -->
    <div aria-live="polite" aria-atomic="true" class="aria-live"></div>
    
    <!-- Simple router view - layouts are now handled by individual route components -->
    <router-view />
    
    <!-- Toast notifications -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="bg-classroom-gray-800 text-white px-4 py-3 rounded-classroom shadow-classroom-lg animate-slide-up"
      >
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from './store/users'
import { useCoursesStore } from './store/courses'
import { usePostsStore } from './store/posts'
import { useAssignmentsStore } from './store/assignments'

const route = useRoute()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const postsStore = usePostsStore()
const assignmentsStore = useAssignmentsStore()

const toasts = ref([])

// Computed properties for layout
const isLoginPage = computed(() => {
  return route.path === '/'
})

// Load initial data
onMounted(async () => {
  try {
    // Check if user is logged in
    const savedUser = localStorage.getItem('mock:currentUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      usersStore.setCurrentUser(user)
    }

    // Load from localStorage first, then fall back to mock data
    usersStore.loadFromStorage()
    coursesStore.loadFromStorage()
    postsStore.loadFromStorage()
    assignmentsStore.loadFromStorage()
    
    // If no data in localStorage, load from mock files
    if (usersStore.users.length === 0) {
      await usersStore.loadUsers()
    }
    if (coursesStore.courses.length === 0) {
      await coursesStore.loadCourses()
    }
    if (postsStore.posts.length === 0) {
      await postsStore.loadPosts()
    }
    if (assignmentsStore.assignments.length === 0) {
      await assignmentsStore.loadAssignments()
    }
  } catch (error) {
    console.error('Error loading initial data:', error)
    showToast('Error loading data. Please refresh the page.')
  }
})

// Toast utility function
const showToast = (message, duration = 3000) => {
  const id = Date.now()
  toasts.value.push({ id, message })
  
  setTimeout(() => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }, duration)
}

// Expose toast function globally for components to use
window.showToast = showToast
</script>
