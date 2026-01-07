<template>
  <nav class="bg-classroom-gray-50 border-b border-classroom-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-2 py-3">
        <!-- Home Link -->
        <router-link 
          to="/" 
          class="text-classroom-gray-500 hover:text-classroom-primary transition-colors duration-150"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </router-link>

        <!-- Separator -->
        <span class="text-classroom-gray-300">/</span>

        <!-- Role-based root -->
        <router-link 
          v-if="currentUser?.role === 'teacher'"
          to="/teacher/dashboard"
          class="text-classroom-gray-500 hover:text-classroom-primary transition-colors duration-150 text-sm font-medium"
        >
          Teacher
        </router-link>
        <router-link 
          v-else-if="currentUser?.role === 'student'"
          to="/student/dashboard"
          class="text-classroom-gray-500 hover:text-classroom-primary transition-colors duration-150 text-sm font-medium"
        >
          Student
        </router-link>
        <router-link 
          v-else-if="currentUser?.role === 'admin'"
          to="/admin/dashboard"
          class="text-classroom-gray-500 hover:text-classroom-primary transition-colors duration-150 text-sm font-medium"
        >
          Admin
        </router-link>

        <!-- Dynamic breadcrumbs based on route -->
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <span class="text-classroom-gray-300">/</span>
          <router-link 
            v-if="crumb.path"
            :to="crumb.path"
            class="text-classroom-gray-500 hover:text-classroom-primary transition-colors duration-150 text-sm font-medium"
            :class="{ 'text-classroom-primary': index === breadcrumbs.length - 1 }"
          >
            {{ crumb.name }}
          </router-link>
          <span 
            v-else
            class="text-classroom-primary text-sm font-medium"
          >
            {{ crumb.name }}
          </span>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Get current user from localStorage
const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
  } catch {
    return null
  }
})

// Generate breadcrumbs based on current route
const breadcrumbs = computed(() => {
  const crumbs = []
  const pathArray = route.path.split('/').filter(path => path)
  
  // Remove role prefix (teacher, student, admin) since we handle it separately
  const filteredPathArray = pathArray.filter(path => 
    !['teacher', 'student', 'admin'].includes(path)
  )

  // Build breadcrumbs
  filteredPathArray.forEach((path, index) => {
    const routePath = '/' + filteredPathArray.slice(0, index + 1).join('/')
    const isLast = index === filteredPathArray.length - 1
    
    // Format breadcrumb name
    let name = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // Special cases
    if (name === 'Classwork') name = 'Classwork'
    if (name === 'Dashboard') name = 'Dashboard'
    if (name === 'Analytics') name = 'Analytics'
    if (name === 'Assignments') name = 'Assignments'
    if (name === 'Grading') name = 'Grading'
    if (name === 'Students') name = 'Students'
    if (name === 'Calendar') name = 'Calendar'
    if (name === 'Reports') name = 'Reports'
    if (name === 'Users') name = 'Users'
    if (name === 'Classes') name = 'Classes'
    if (name === 'Settings') name = 'Settings'
    if (name === 'Resources') name = 'Resources'
    if (name === 'Achievements') name = 'Achievements'
    if (name === 'Bulk Operations') name = 'Bulk Operations'
    if (name === 'Backup') name = 'Backup'
    
    crumbs.push({
      name,
      path: isLast ? null : routePath
    })
  })

  return crumbs
})
</script>
