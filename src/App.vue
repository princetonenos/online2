<template>
  <div class="min-h-screen font-roboto" :class="isLoginPage ? 'bg-gradient-to-br from-classroom-primary to-classroom-secondary' : 'bg-classroom-gray-50'">
    <!-- ARIA live region for accessibility -->
    <div aria-live="polite" aria-atomic="true" class="aria-live"></div>
    
    <!-- Main layout for authenticated pages -->
    <div v-if="!isLoginPage">
      <!-- App Header -->
      <AppHeader />
      
      <!-- Portal Navigation (for Admin, Teacher, Student portals) -->
      <PortalNavigation v-if="showPortalNavigation" />
      
      <div class="flex h-screen" :class="showPortalNavigation ? 'pt-32' : 'pt-16'">
        <!-- App Drawer -->
        <AppDrawer v-if="showSidebar" />
        
        <!-- Main Content -->
        <main class="flex-1 overflow-auto" :class="{ 'ml-0': !showSidebar }">
          <router-view />
        </main>
      </div>
    </div>
    
    <!-- Login page layout -->
    <div v-else>
      <router-view />
    </div>
    
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
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from './store/users'
import { useCoursesStore } from './store/courses'
import { usePostsStore } from './store/posts'
import { useAssignmentsStore } from './store/assignments'
import AppHeader from './components/AppHeader.vue'
import AppDrawer from './components/AppDrawer.vue'
import PortalNavigation from './components/PortalNavigation.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const postsStore = usePostsStore()
const assignmentsStore = useAssignmentsStore()

const toasts = ref([])

// Computed properties for layout
const isLoginPage = computed(() => {
  return route.path === '/'
})

const showPortalNavigation = computed(() => {
  const currentUser = usersStore.currentUser
  return currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher' || currentUser.role === 'student')
})

const showSidebar = computed(() => {
  // Show sidebar on dashboard, teacher pages, and course pages
  return route.path === '/dashboard' || route.path.includes('/course/') || route.path.startsWith('/teacher')
})

// Load initial data
onMounted(async () => {
  try {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      usersStore.setCurrentUser(user)
      
      // If on login page and user is logged in, redirect to appropriate dashboard
      if (route.path === '/') {
        switch (user.role) {
          case 'admin':
            router.push('/admin/schools')
            break
          case 'teacher':
            router.push('/teacher')
            break
          case 'student':
          default:
            router.push('/dashboard')
            break
        }
      }
    } else {
      // Redirect to login if no user is logged in and not already on login page
      if (route.path !== '/') {
        router.push('/')
      }
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
