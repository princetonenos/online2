<template>
  <div class="relative" ref="menuRef">
    <!-- User Avatar Button -->
    <button 
      @click="toggleMenu"
      class="flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 hover:bg-classroom-gray-100 focus:outline-none focus:ring-2 focus:ring-classroom-primary focus:ring-offset-2"
      :class="{ 'bg-classroom-gray-100': isOpen }"
    >
      <div class="text-right">
        <p class="text-sm font-medium text-classroom-gray-900">{{ currentUser?.name }}</p>
        <p class="text-xs text-classroom-gray-500 capitalize">{{ currentUser?.role }}</p>
      </div>
      <div class="w-10 h-10 bg-classroom-primary rounded-full flex items-center justify-center transition-transform duration-200" :class="{ 'ring-2 ring-classroom-primary ring-offset-2': isOpen }">
        <span class="text-white font-medium text-sm">{{ initials }}</span>
      </div>
      <svg 
        class="w-4 h-4 text-classroom-gray-500 transition-transform duration-200" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-classroom-gray-200 py-2 z-50"
      >
        <!-- User Info -->
        <div class="px-4 py-3 border-b border-classroom-gray-100">
          <p class="text-sm font-medium text-classroom-gray-900">{{ currentUser?.name }}</p>
          <p class="text-xs text-classroom-gray-500">{{ currentUser?.email || `${currentUser?.name?.toLowerCase()}@school.edu` }}</p>
          <p class="text-xs text-classroom-primary capitalize mt-1">{{ currentUser?.role }}</p>
        </div>

        <!-- Menu Items -->
        <div class="py-1">

          <router-link 
            to="/profile" 
            class="flex items-center px-4 py-2 text-sm text-classroom-gray-700 hover:bg-classroom-gray-50 transition-colors duration-150"
            @click="closeMenu"
          >
            <svg class="w-4 h-4 mr-3 text-classroom-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </router-link>
          
          <router-link 
            to="/settings" 
            class="flex items-center px-4 py-2 text-sm text-classroom-gray-700 hover:bg-classroom-gray-50 transition-colors duration-150"
            @click="closeMenu"
          >
            <svg class="w-4 h-4 mr-3 text-classroom-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </router-link>

          <div class="border-t border-classroom-gray-100 my-1"></div>

          <button 
            @click="logout"
            class="flex items-center w-full px-4 py-2 text-sm text-classroom-gray-700 hover:bg-classroom-gray-50 transition-colors duration-150"
          >
            <svg class="w-4 h-4 mr-3 text-classroom-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getInitials } from '../utils/dashboardHelpers'

const router = useRouter()
const isOpen = ref(false)
const menuRef = ref(null)

// Get current user from localStorage
const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
  } catch {
    return null
  }
})

// Get user initials
const initials = computed(() => {
  return getInitials(currentUser.value?.name || '')
})

// Toggle menu
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

// Close menu
const closeMenu = () => {
  isOpen.value = false
}

// Click outside handler
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    closeMenu()
  }
}

// Logout function
const logout = () => {
  localStorage.removeItem('mock:currentUser')
  closeMenu()
  router.push('/')
}

// Add event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
