<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-white border-b border-classroom-gray-200 h-16">
    <div class="flex items-center justify-between h-full px-4">
      <!-- Left section -->
      <div class="flex items-center space-x-4">
        <!-- Hamburger menu for mobile -->
        <button 
          @click="toggleDrawer"
          class="md:hidden p-2 rounded-full hover:bg-classroom-gray-100 transition-colors focus-classroom"
          aria-label="Toggle navigation menu"
        >
          <span class="material-icons text-classroom-gray-600">menu</span>
        </button>
        
        <!-- Logo/Wordmark area -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-classroom-primary rounded-classroom flex items-center justify-center">
            <span class="material-icons text-white text-sm">school</span>
          </div>
          <span class="text-xl font-medium text-classroom-gray-900 hidden sm:block">
            Classroom
          </span>
        </div>
      </div>

      <!-- Middle section - Search -->
      <div class="flex-1 max-w-2xl mx-8">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search courses and content..."
            class="w-full pl-10 pr-4 py-2 bg-classroom-gray-100 border border-transparent rounded-classroom focus:bg-white focus:border-classroom-primary focus:outline-none transition-colors"
            @input="handleSearch"
          >
          <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-classroom-gray-500 text-lg">
            search
          </span>
        </div>
      </div>

      <!-- Right section -->
      <div class="flex items-center space-x-2">
        <!-- Notifications -->
        <button 
          class="p-2 rounded-full hover:bg-classroom-gray-100 transition-colors relative focus-classroom"
          aria-label="Notifications"
        >
          <span class="material-icons text-classroom-gray-600">notifications</span>
          <span v-if="unreadNotifications" class="absolute top-1 right-1 w-2 h-2 bg-classroom-secondary rounded-full"></span>
        </button>

        <!-- Help -->
        <button 
          class="p-2 rounded-full hover:bg-classroom-gray-100 transition-colors focus-classroom"
          aria-label="Help"
        >
          <span class="material-icons text-classroom-gray-600">help_outline</span>
        </button>

        <!-- User menu -->
        <div class="relative">
          <button 
            @click="toggleUserMenu"
            class="flex items-center space-x-2 p-1 rounded-full hover:bg-classroom-gray-100 transition-colors focus-classroom"
            aria-label="User menu"
          >
            <img 
              :src="currentUser?.avatar" 
              :alt="currentUser?.name"
              class="w-8 h-8 rounded-full"
            >
          </button>

          <!-- User dropdown menu -->
          <div 
            v-if="showUserMenu"
            class="absolute right-0 top-full mt-2 w-64 bg-white rounded-classroom shadow-classroom-lg border border-classroom-gray-200 py-2 z-50"
          >
            <!-- Current user info -->
            <div class="px-4 py-3 border-b border-classroom-gray-100">
              <p class="font-medium text-classroom-gray-900">{{ currentUser?.name }}</p>
              <p class="text-sm text-classroom-gray-500">{{ currentUser?.email }}</p>
            </div>

            <!-- Role switcher -->
            <div class="px-4 py-2 border-b border-classroom-gray-100">
              <p class="text-xs font-medium text-classroom-gray-500 uppercase mb-2">Switch Role</p>
              <div class="space-y-1">
                <button 
                  v-for="user in availableUsers" 
                  :key="user.id"
                  @click="switchUser(user.id)"
                  class="w-full text-left px-2 py-1 rounded hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
                  :class="{ 'bg-classroom-primary bg-opacity-10': user.id === currentUser?.id }"
                >
                  <img :src="user.avatar" :alt="user.name" class="w-6 h-6 rounded-full">
                  <span>{{ user.name }}</span>
                  <span class="chip text-xs" :class="user.role === 'teacher' ? 'chip-primary' : 'chip-secondary'">
                    {{ user.role }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Menu items -->
            <div class="py-1">
              <button class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2">
                <span class="material-icons text-classroom-gray-600 text-lg">settings</span>
                <span>Settings</span>
              </button>
              <button class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2">
                <span class="material-icons text-classroom-gray-600 text-lg">help</span>
                <span>Help & Support</span>
              </button>
              <button 
                @click="handleLogout"
                class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2 text-classroom-gray-500"
              >
                <span class="material-icons text-classroom-gray-600 text-lg">logout</span>
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../store/users'

const router = useRouter()
const usersStore = useUsersStore()

const searchQuery = ref('')
const showUserMenu = ref(false)
const unreadNotifications = ref(3) // Mock notification count

const currentUser = computed(() => usersStore.currentUser)
const availableUsers = computed(() => usersStore.users)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleDrawer = () => {
  // This will be handled by the parent component
  window.dispatchEvent(new CustomEvent('toggle-drawer'))
}

const switchUser = (userId) => {
  usersStore.switchRole(userId)
  showToast(`Switched to ${usersStore.getUserById(userId)?.name}`)
  showUserMenu.value = false
}

const handleLogout = () => {
  // Clear current user from store and localStorage
  usersStore.currentUser = null
  localStorage.removeItem('mock:currentUser')
  
  showToast('You have been logged out')
  showUserMenu.value = false
  
  // Redirect to login page
  router.push('/')
}

const handleSearch = () => {
  // Search functionality will be implemented in respective components
  console.log('Search query:', searchQuery.value)
}

// Close user menu when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
