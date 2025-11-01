<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Welcome section -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">
        Welcome, {{ currentUser?.name }}!
      </h1>
      <p class="text-classroom-gray-600">
        {{ greetingMessage }}
      </p>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Your Classes</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ userCourses.length }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">school</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Upcoming</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ upcomingAssignments.length }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-secondary">assignment</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Due Today</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ assignmentsDueToday }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">schedule</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Completed</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ completedAssignments }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">check_circle</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button 
        @click="openCreateModal"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">add</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Create class</h3>
            <p class="text-sm text-classroom-gray-500">Start a new class</p>
          </div>
        </div>
      </button>

      <button 
        @click="openJoinModal"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-secondary">group_add</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Join class</h3>
            <p class="text-sm text-classroom-gray-500">Enter a class code</p>
          </div>
        </div>
      </button>

      <button 
        @click="navigateToCalendar"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">calendar_today</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">View calendar</h3>
            <p class="text-sm text-classroom-gray-500">See upcoming work</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Quick links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button 
        @click="router.push('/profile')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">person</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Profile</h3>
            <p class="text-sm text-classroom-gray-500">View your profile</p>
          </div>
        </div>
      </button>

      <button 
        @click="router.push('/settings')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">settings</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Settings</h3>
            <p class="text-sm text-classroom-gray-500">Manage your settings</p>
          </div>
        </div>
      </button>

      <button 
        @click="navigateToStream"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">stream</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Stream</h3>
            <p class="text-sm text-classroom-gray-500">View class announcements</p>
          </div>
        </div>
      </button>

      <button 
        v-if="userRole === 'teacher'"
        @click="router.push('/teacher/reports')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">assessment</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Reports</h3>
            <p class="text-sm text-classroom-gray-500">View reports and analytics</p>
          </div>
        </div>
      </button>

      <button 
        v-if="userRole === 'teacher'"
        @click="router.push('/teacher/assignments')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">assignment</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Assignments</h3>
            <p class="text-sm text-classroom-gray-500">Manage all assignments</p>
          </div>
        </div>
      </button>

      <button 
        v-if="userRole === 'admin'"
        @click="router.push('/admin/schools')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">school</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Schools</h3>
            <p class="text-sm text-classroom-gray-500">Manage school settings</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Courses section -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-medium text-classroom-gray-900">Your classes</h2>
        <div class="flex items-center space-x-2">
          <button 
            @click="toggleView"
            class="p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors focus-classroom"
            :aria-label="gridView ? 'Switch to list view' : 'Switch to grid view'"
          >
            <span class="material-icons text-classroom-gray-600">
              {{ gridView ? 'view_list' : 'view_module' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="n in 8" :key="n" class="bg-white rounded-classroom classroom-shadow p-4">
          <div class="skeleton w-full h-32 mb-3"></div>
          <div class="skeleton h-4 w-3/4 mb-2"></div>
          <div class="skeleton h-3 w-1/2"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="userCourses.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-classroom-gray-400 text-4xl">school</span>
        </div>
        <h3 class="text-xl font-medium text-classroom-gray-900 mb-2">No classes yet</h3>
        <p class="text-classroom-gray-600 mb-6">Get started by creating or joining a class</p>
        <button @click="openCreateModal" class="btn-primary">
          Create your first class
        </button>
      </div>

      <!-- Courses grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <CourseTile
          v-for="course in userCourses"
          :key="course.id"
          :course="course"
          @click="navigateToCourse(course.id)"
        />
      </div>
    </div>

    <!-- Upcoming assignments -->
    <div class="mt-12">
      <h2 class="text-2xl font-medium text-classroom-gray-900 mb-6">Upcoming</h2>
      
      <div class="bg-white rounded-classroom classroom-shadow overflow-hidden">
        <div v-if="upcomingAssignments.length === 0" class="p-8 text-center text-classroom-gray-500">
          <span class="material-icons text-4xl mb-2 opacity-50">assignment</span>
          <p>No upcoming assignments</p>
        </div>
        
        <div v-else class="divide-y divide-classroom-gray-100">
          <div
            v-for="assignment in upcomingAssignments"
            :key="assignment.id"
            class="p-4 hover:bg-classroom-gray-50 transition-colors cursor-pointer"
            @click="navigateToAssignment(assignment)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-classroom-gray-900 mb-1">
                  {{ assignment.title }}
                </h3>
                <p class="text-sm text-classroom-gray-600 mb-2">
                  {{ getCourseName(assignment.courseId) }}
                </p>
                <div class="flex items-center space-x-4 text-xs text-classroom-gray-500">
                  <span class="flex items-center space-x-1">
                    <span class="material-icons text-sm">schedule</span>
                    <span>{{ formatDueDate(assignment.dueDate) }}</span>
                  </span>
                  <span class="chip" :class="getPointsClass(assignment.points)">
                    {{ assignment.points }} points
                  </span>
                </div>
              </div>
              <span class="material-icons text-classroom-gray-400">chevron_right</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../store/users'
import { useCoursesStore } from '../store/courses'
import { useAssignmentsStore } from '../store/assignments'
import CourseTile from '../components/CourseTile.vue'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

const loading = ref(false)
const gridView = ref(true)

const currentUser = computed(() => usersStore.currentUser)
const userRole = computed(() => currentUser.value?.role || 'student')
const userCourses = computed(() => {
  if (!currentUser.value) return []
  return coursesStore.getCoursesForUser(currentUser.value.id)
})

const greetingMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready to learn something new today?'
  if (hour < 18) return 'Good afternoon! Hope your day is going well.'
  return 'Good evening! Time to wrap up your work.'
})

const upcomingAssignments = computed(() => {
  const assignments = assignmentsStore.assignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate)
    const now = new Date()
    return dueDate > now && dueDate < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
  })
  
  return assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5)
})

const assignmentsDueToday = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return assignmentsStore.assignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate)
    return dueDate >= today && dueDate < tomorrow
  }).length
})

const completedAssignments = computed(() => {
  // Mock data - in a real app this would come from user progress data
  return Math.floor(assignmentsStore.assignments.length * 0.6) // 60% completion rate
})

const getCourseName = (courseId) => {
  const course = coursesStore.getCourseById(courseId)
  return course?.name || 'Unknown Course'
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `In ${diffDays} days`
  
  return date.toLocaleDateString()
}

const getPointsClass = (points) => {
  if (points >= 100) return 'chip-primary'
  if (points >= 50) return 'chip-secondary'
  return 'chip-gray'
}

const openCreateModal = () => {
  if (currentUser.value?.role === 'teacher') {
    router.push('/teacher/create-class')
  } else {
    router.push('/create')
  }
}

const openJoinModal = () => {
  showToast('Join class modal would open here')
}

const navigateToCalendar = () => {
  router.push('/calendar')
}

const navigateToCourse = (courseId) => {
  router.push(`/course/${courseId}/stream`)
}

const navigateToAssignment = (assignment) => {
  router.push(`/course/${assignment.courseId}/assignments/${assignment.id}`)
}

const navigateToStream = () => {
  if (userCourses.value.length > 0) {
    // Navigate to the stream of the first course
    router.push(`/course/${userCourses.value[0].id}/stream`)
  } else {
    showToast('You need to join a class first to access the stream')
  }
}

const toggleView = () => {
  gridView.value = !gridView.value
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      coursesStore.loadCourses(),
      assignmentsStore.loadAssignments()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Error loading courses and assignments')
  } finally {
    loading.value = false
  }
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
