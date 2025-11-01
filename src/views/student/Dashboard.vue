<template>
  <div class="p-6 max-w-7xl mx-auto" data-testid="page-student-dashboard">
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
            <p class="text-2xl font-medium text-classroom-gray-900">{{ enrolledClasses.length }}</p>
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

    <!-- Next class countdown -->
    <div class="bg-white rounded-classroom classroom-shadow p-6 mb-8" v-if="nextClass">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-classroom-gray-900 mb-2">Next Class</h3>
          <p class="text-classroom-gray-600">{{ nextClass.name }}</p>
          <p class="text-sm text-classroom-gray-500">{{ formatClassTime(nextClass) }}</p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-classroom-primary">{{ countdownTime }}</p>
          <p class="text-sm text-classroom-gray-500">starts in</p>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button 
        @click="router.push('/student/join')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">group_add</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Join class</h3>
            <p class="text-sm text-classroom-gray-500">Enter a class code</p>
          </div>
        </div>
      </button>

      <button 
        @click="router.push('/student/classwork')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-secondary">assignment</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">View classwork</h3>
            <p class="text-sm text-classroom-gray-500">See all assignments</p>
          </div>
        </div>
      </button>

      <button 
        @click="router.push('/student/calendar')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">calendar_today</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">View calendar</h3>
            <p class="text-sm text-classroom-gray-500">See your schedule</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Quick links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button 
        @click="router.push('/student/grades')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">grade</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Grades</h3>
            <p class="text-sm text-classroom-gray-500">View your grades</p>
          </div>
        </div>
      </button>

      <button 
        @click="router.push('/student/people')"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">people</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">People</h3>
            <p class="text-sm text-classroom-gray-500">Classmates & teachers</p>
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
    </div>

    <!-- Recent announcements -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-medium text-classroom-gray-900">Recent Announcements</h2>
        <button 
          @click="router.push('/student/stream')"
          class="text-classroom-primary hover:text-classroom-primary-dark transition-colors"
        >
          View all
        </button>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow overflow-hidden">
        <div v-if="recentAnnouncements.length === 0" class="p-8 text-center text-classroom-gray-500">
          <span class="material-icons text-4xl mb-2 opacity-50">campaign</span>
          <p>No recent announcements</p>
        </div>
        
        <div v-else class="divide-y divide-classroom-gray-100">
          <div
            v-for="announcement in recentAnnouncements"
            :key="announcement.id"
            class="p-4 hover:bg-classroom-gray-50 transition-colors cursor-pointer"
            @click="navigateToAnnouncement(announcement)"
          >
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-classroom-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-classroom-primary text-sm">campaign</span>
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-classroom-gray-900 mb-1">
                  {{ announcement.title }}
                </h3>
                <p class="text-sm text-classroom-gray-600 mb-2">
                  {{ announcement.content }}
                </p>
                <div class="flex items-center space-x-4 text-xs text-classroom-gray-500">
                  <span>{{ getCourseName(announcement.courseId) }}</span>
                  <span>{{ formatTime(announcement.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enrolled classes -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-medium text-classroom-gray-900">Your Classes</h2>
        <button 
          @click="router.push('/student/classes')"
          class="text-classroom-primary hover:text-classroom-primary-dark transition-colors"
        >
          View all
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="course in enrolledClasses.slice(0, 4)"
          :key="course.id"
          class="bg-white rounded-classroom classroom-shadow p-4 hover:shadow-classroom transition-shadow cursor-pointer"
          @click="navigateToClass(course.id)"
        >
          <div class="w-full h-32 bg-gradient-to-br from-classroom-primary to-classroom-secondary rounded-classroom mb-3 flex items-center justify-center">
            <span class="material-icons text-white text-4xl">school</span>
          </div>
          <h3 class="font-medium text-classroom-gray-900 mb-1">{{ course.name }}</h3>
          <p class="text-sm text-classroom-gray-600 mb-2">{{ course.teacherName }}</p>
          <div class="flex items-center justify-between text-xs text-classroom-gray-500">
            <span>{{ course.section }}</span>
            <span>{{ course.enrolledStudents }} students</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending assignments -->
    <div>
      <h2 class="text-2xl font-medium text-classroom-gray-900 mb-6">Pending Assignments</h2>
      
      <div class="bg-white rounded-classroom classroom-shadow overflow-hidden">
        <div v-if="pendingAssignments.length === 0" class="p-8 text-center text-classroom-gray-500">
          <span class="material-icons text-4xl mb-2 opacity-50">assignment</span>
          <p>No pending assignments</p>
        </div>
        
        <div v-else class="divide-y divide-classroom-gray-100">
          <div
            v-for="assignment in pendingAssignments"
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
                  <span v-if="assignment.submissionStatus === 'submitted'" class="chip chip-primary">
                    Submitted
                  </span>
                  <span v-else class="chip chip-secondary">
                    Pending
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'
import { useAssignmentsStore } from '../../store/assignments'
import { usePostsStore } from '../../store/posts'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()
const postsStore = usePostsStore()

const currentUser = computed(() => usersStore.currentUser)
const enrolledClasses = computed(() => {
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
  
  return assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
})

const pendingAssignments = computed(() => {
  return upcomingAssignments.value.filter(assignment => 
    assignment.submissionStatus !== 'submitted'
  ).slice(0, 5)
})

const assignmentsDueToday = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return assignmentsStore.assignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate)
    return dueDate >= today && dueDate < tomorrow && assignment.submissionStatus !== 'submitted'
  }).length
})

const completedAssignments = computed(() => {
  return assignmentsStore.assignments.filter(assignment => 
    assignment.submissionStatus === 'submitted'
  ).length
})

const recentAnnouncements = computed(() => {
  return postsStore.posts
    .filter(post => post.type === 'announcement')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
})

const nextClass = computed(() => {
  // Mock next class - in real app this would come from schedule data
  return enrolledClasses.value.length > 0 ? {
    ...enrolledClasses.value[0],
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  } : null
})

const countdownTime = ref('')

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

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleDateString()
}

const formatClassTime = (classItem) => {
  return classItem.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getPointsClass = (points) => {
  if (points >= 100) return 'chip-primary'
  if (points >= 50) return 'chip-secondary'
  return 'chip-gray'
}

const navigateToClass = (classId) => {
  router.push(`/student/classes/${classId}`)
}

const navigateToAssignment = (assignment) => {
  router.push(`/student/classwork/${assignment.id}`)
}

const navigateToAnnouncement = (announcement) => {
  router.push(`/course/${announcement.courseId}/stream`)
}

const updateCountdown = () => {
  if (nextClass.value) {
    const now = new Date()
    const diff = nextClass.value.startTime - now
    
    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      countdownTime.value = `${hours}h ${minutes}m`
    } else {
      countdownTime.value = 'Starting soon'
    }
  }
}

let countdownInterval

onMounted(async () => {
  try {
    await Promise.all([
      coursesStore.loadCourses(),
      assignmentsStore.loadAssignments(),
      postsStore.loadPosts()
    ])
    
    // Start countdown timer
    updateCountdown()
    countdownInterval = setInterval(updateCountdown, 60000) // Update every minute
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Error loading student data')
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
