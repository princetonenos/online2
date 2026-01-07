<template>
  <!-- Desktop Navigation -->
  <nav class="hidden md:flex items-center space-x-1">
    <!-- Teacher Navigation -->
    <template v-if="currentUser?.role === 'teacher'">
      <router-link 
        v-for="link in teacherLinks"
        :key="link.path"
        :to="link.path" 
        class="nav-link"
        :class="{ active: $route.path.startsWith(link.path) }"
      >
        <span class="material-icons text-sm mr-1">{{ link.icon }}</span>
        {{ link.label }}
      </router-link>
    </template>

    <!-- Student Navigation -->
    <template v-else-if="currentUser?.role === 'student'">
      <router-link 
        v-for="link in studentLinks"
        :key="link.path"
        :to="link.path" 
        class="nav-link"
        :class="{ active: $route.path.startsWith(link.path) }"
      >
        <span class="material-icons text-sm mr-1">{{ link.icon }}</span>
        {{ link.label }}
      </router-link>
    </template>

    <!-- Admin Navigation -->
    <template v-else-if="currentUser?.role === 'admin'">
      <router-link 
        v-for="link in adminLinks"
        :key="link.path"
        :to="link.path" 
        class="nav-link"
        :class="{ active: $route.path.startsWith(link.path) }"
      >
        <span class="material-icons text-sm mr-1">{{ link.icon }}</span>
        {{ link.label }}
      </router-link>
    </template>
  </nav>

  <!-- Mobile Menu Button -->
  <button
    @click="toggleMobileMenu"
    class="md:hidden p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors"
    aria-label="Toggle menu"
  >
    <span class="material-icons text-classroom-gray-700">
      {{ mobileMenuOpen ? 'close' : 'menu' }}
    </span>
  </button>

  <!-- Mobile Navigation Overlay -->
  <Transition name="fade">
    <div
      v-if="mobileMenuOpen"
      @click="closeMobileMenu"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
    ></div>
  </Transition>

  <!-- Mobile Navigation Drawer -->
  <Transition name="slide">
    <div
      v-if="mobileMenuOpen"
      class="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
    >
      <!-- Mobile Menu Header -->
      <div class="flex items-center justify-between p-4 border-b border-classroom-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-primary rounded-classroom flex items-center justify-center">
            <span class="material-icons text-white">school</span>
          </div>
          <div>
            <h2 class="font-semibold text-classroom-gray-900">{{ currentUser?.name }}</h2>
            <p class="text-xs text-classroom-gray-500 capitalize">{{ currentUser?.role }}</p>
          </div>
        </div>
        <button
          @click="closeMobileMenu"
          class="p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors"
        >
          <span class="material-icons text-classroom-gray-700">close</span>
        </button>
      </div>

      <!-- Mobile Menu Links -->
      <div class="p-4">
        <!-- Teacher Links -->
        <template v-if="currentUser?.role === 'teacher'">
          <router-link
            v-for="link in teacherLinks"
            :key="link.path"
            :to="link.path"
            @click="closeMobileMenu"
            class="mobile-nav-link"
            :class="{ active: $route.path.startsWith(link.path) }"
          >
            <span class="material-icons">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
            <span class="material-icons ml-auto text-classroom-gray-400">chevron_right</span>
          </router-link>
        </template>

        <!-- Student Links -->
        <template v-else-if="currentUser?.role === 'student'">
          <router-link
            v-for="link in studentLinks"
            :key="link.path"
            :to="link.path"
            @click="closeMobileMenu"
            class="mobile-nav-link"
            :class="{ active: $route.path.startsWith(link.path) }"
          >
            <span class="material-icons">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
            <span class="material-icons ml-auto text-classroom-gray-400">chevron_right</span>
          </router-link>
        </template>

        <!-- Admin Links -->
        <template v-else-if="currentUser?.role === 'admin'">
          <router-link
            v-for="link in adminLinks"
            :key="link.path"
            :to="link.path"
            @click="closeMobileMenu"
            class="mobile-nav-link"
            :class="{ active: $route.path.startsWith(link.path) }"
          >
            <span class="material-icons">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
            <span class="material-icons ml-auto text-classroom-gray-400">chevron_right</span>
          </router-link>
        </template>
      </div>

      <!-- Mobile Menu Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-classroom-gray-200 bg-classroom-gray-50">
        <router-link
          to="/profile"
          @click="closeMobileMenu"
          class="flex items-center space-x-3 p-3 rounded-classroom hover:bg-white transition-colors"
        >
          <span class="material-icons text-classroom-primary">person</span>
          <span class="font-medium text-classroom-gray-900">Profile Settings</span>
        </router-link>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

// Get current user from localStorage
const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
  } catch {
    return null
  }
})

// Navigation links with icons
const teacherLinks = [
  { path: '/teacher/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/teacher/classes', label: 'Classes', icon: 'school' },
  { path: '/teacher/assignments', label: 'Assignments', icon: 'assignment' },
  { path: '/teacher/grading', label: 'Grading', icon: 'grade' },
  { path: '/teacher/students', label: 'Students', icon: 'people' },
  { path: '/teacher/analytics', label: 'Analytics', icon: 'bar_chart' },
  { path: '/teacher/calendar', label: 'Calendar', icon: 'calendar_month' },
  { path: '/teacher/reports', label: 'Reports', icon: 'assessment' }
]

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/student/classes', label: 'Classes', icon: 'school' },
  { path: '/student/classwork', label: 'Classwork', icon: 'assignment' },
  { path: '/student/grades', label: 'Grades', icon: 'grade' },
  { path: '/student/calendar', label: 'Calendar', icon: 'calendar_month' },
  { path: '/student/analytics', label: 'Analytics', icon: 'bar_chart' },
  { path: '/student/resources', label: 'Resources', icon: 'folder' },
  { path: '/student/achievements', label: 'Achievements', icon: 'emoji_events' }
]

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/admin/users', label: 'Users', icon: 'people' },
  { path: '/admin/classes', label: 'Classes', icon: 'school' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'bar_chart' },
  { path: '/admin/reports', label: 'Reports', icon: 'assessment' },
  { path: '/admin/settings', label: 'Settings', icon: 'settings' },
  { path: '/admin/bulk-operations', label: 'Bulk Ops', icon: 'inventory' },
  { path: '/admin/backup', label: 'Backup', icon: 'backup' }
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  
  // Prevent body scroll when menu is open
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Close mobile menu when route changes
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-md text-sm font-medium transition-all duration-200;
  @apply text-classroom-gray-700 hover:text-classroom-primary hover:bg-classroom-gray-50;
  @apply flex items-center;
}

.nav-link.active {
  @apply text-classroom-primary bg-classroom-primary bg-opacity-10;
}

.nav-link:hover {
  @apply transform -translate-y-0.5;
}

.mobile-nav-link {
  @apply flex items-center space-x-3 px-4 py-3 rounded-classroom;
  @apply text-classroom-gray-700 hover:bg-classroom-gray-50;
  @apply transition-all duration-200 mb-1;
}

.mobile-nav-link.active {
  @apply bg-classroom-primary bg-opacity-10 text-classroom-primary font-medium;
}

.mobile-nav-link:hover {
  @apply transform translate-x-1;
}

/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
