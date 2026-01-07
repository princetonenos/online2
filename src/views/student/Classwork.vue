<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Loading your assignments..." />

    <div v-else>
      <!-- Error Alert -->
      <ErrorAlert 
        :error="error" 
        :retry="true"
        @dismiss="error = null"
        @retry="loadClassworkData"
      />

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center mb-4">
          <button 
            @click="goBack"
            class="flex items-center space-x-2 text-classroom-gray-600 hover:text-classroom-primary transition-colors mb-2"
          >
            <span class="material-icons">arrow_back</span>
            <span>Back</span>
          </button>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Classwork</h1>
            <p class="text-classroom-gray-600">All your assignments across all classes</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <div class="text-2xl font-bold text-classroom-primary">{{ totalAssignments }}</div>
              <div class="text-xs text-classroom-gray-500">Total</div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600">{{ submittedCount }}</div>
              <div class="text-xs text-classroom-gray-500">Submitted</div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-orange-600">{{ pendingCount }}</div>
              <div class="text-xs text-classroom-gray-500">Pending</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignment filters -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button 
          v-for="filter in filters"
          :key="filter.id"
          @click="activeFilter = filter.id"
          class="px-4 py-2 rounded-classroom transition-all duration-200 flex items-center space-x-2"
          :class="activeFilter === filter.id 
            ? 'bg-classroom-primary text-white shadow-lg scale-105' 
            : 'bg-white text-classroom-gray-700 hover:bg-classroom-gray-50 classroom-shadow hover:scale-102'"
        >
          <span>{{ filter.name }}</span>
          <span class="px-2 py-0.5 rounded-full text-xs font-medium"
            :class="activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-200'">
            {{ getFilterCount(filter.id) }}
          </span>
        </button>
      </div>

      <!-- Assignments by class -->
      <div class="space-y-6">
        <div 
          v-for="course in coursesWithAssignments"
          :key="course.id"
          class="bg-white rounded-classroom classroom-shadow overflow-hidden"
        >
          <div class="p-4 border-b border-classroom-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-medium text-classroom-gray-900">{{ course.name }}</h2>
                <p class="text-classroom-gray-600">{{ course.teacherName }}</p>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-classroom-gray-700">
                  {{ getFilteredAssignments(course.id).length }} assignments
                </div>
              </div>
            </div>
          </div>
          
          <div class="divide-y divide-classroom-gray-100">
            <div
              v-for="assignment in getFilteredAssignments(course.id)"
              :key="assignment.id"
              class="p-4 hover:bg-classroom-gray-50 transition-colors cursor-pointer"
              @click="navigateToAssignment(assignment)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="font-medium text-classroom-gray-900">
                      {{ assignment.title }}
                    </h3>
                    <span v-if="isOverdue(assignment)" 
                          class="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                      Overdue
                    </span>
                    <span v-else-if="isDueSoon(assignment)" 
                          class="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                      Due Soon
                    </span>
                  </div>
                  <p class="text-sm text-classroom-gray-600 mb-3">
                    {{ assignment.description || 'No description' }}
                  </p>
                  <div class="flex items-center flex-wrap gap-3 text-xs">
                    <span class="flex items-center space-x-1 text-classroom-gray-500">
                      <span class="material-icons text-sm">schedule</span>
                      <span>Due {{ formatDueDate(assignment.dueDate) }}</span>
                    </span>
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {{ assignment.points }} points
                    </span>
                    <span v-if="getSubmissionStatus(assignment)" 
                          class="px-2 py-1 rounded-full font-medium"
                          :class="getStatusClasses(getSubmissionStatus(assignment))">
                      <span class="material-icons text-xs align-middle mr-1">
                        {{ getStatusIcon(getSubmissionStatus(assignment)) }}
                      </span>
                      {{ getStatusText(getSubmissionStatus(assignment)) }}
                    </span>
                    <span v-if="getSubmissionGrade(assignment)" 
                          class="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      Grade: {{ getSubmissionGrade(assignment) }}/{{ assignment.points }}
                    </span>
                  </div>
                </div>
                <span class="material-icons text-classroom-gray-400">chevron_right</span>
              </div>
            </div>
          </div>

          <div v-if="getFilteredAssignments(course.id).length === 0" class="p-8 text-center text-classroom-gray-500">
            <span class="material-icons text-4xl mb-2 opacity-50">assignment</span>
            <p>No {{ activeFilter }} assignments</p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="coursesWithAssignments.length === 0" class="text-center py-16">
        <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-classroom-gray-400 text-4xl">assignment</span>
        </div>
        <h3 class="text-xl font-medium text-classroom-gray-900 mb-2">No assignments yet</h3>
        <p class="text-classroom-gray-600 mb-6">Assignments will appear here when your teachers create them</p>
        <button 
          @click="router.push('/student/classes')"
          class="px-6 py-2 bg-classroom-primary text-white rounded-classroom hover:bg-blue-700 transition-colors"
        >
          View Your Classes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'
import { useAssignmentsStore } from '../../store/assignments'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

const loading = ref(false)
const error = ref(null)
const activeFilter = ref('all')

const filters = [
  { id: 'all', name: 'All' },
  { id: 'pending', name: 'Pending' },
  { id: 'submitted', name: 'Submitted' },
  { id: 'graded', name: 'Graded' }
]

const currentUser = computed(() => usersStore.currentUser)
const enrolledClasses = computed(() => {
  if (!currentUser.value) return []
  return coursesStore.getCoursesForUser(currentUser.value.id)
})

const coursesWithAssignments = computed(() => {
  return enrolledClasses.value.filter(course => 
    assignmentsStore.assignments.some(assignment => assignment.courseId === course.id)
  )
})

// Stats computed properties
const totalAssignments = computed(() => assignmentsStore.assignments.length)

const submittedCount = computed(() => {
  return assignmentsStore.submissions.filter(sub => 
    sub.studentId === currentUser.value?.id && sub.status === 'submitted'
  ).length
})

const pendingCount = computed(() => {
  const submitted = assignmentsStore.submissions
    .filter(sub => sub.studentId === currentUser.value?.id)
    .map(sub => sub.assignmentId)
  
  return assignmentsStore.assignments.filter(a => !submitted.includes(a.id)).length
})

const getFilterCount = (filterId) => {
  let count = 0
  const userId = currentUser.value?.id
  
  switch (filterId) {
    case 'all':
      count = assignmentsStore.assignments.length
      break
    case 'pending':
      const submitted = assignmentsStore.submissions
        .filter(sub => sub.studentId === userId)
        .map(sub => sub.assignmentId)
      count = assignmentsStore.assignments.filter(a => !submitted.includes(a.id)).length
      break
    case 'submitted':
      count = assignmentsStore.submissions.filter(sub => 
        sub.studentId === userId && sub.status === 'submitted' && !sub.grade
      ).length
      break
    case 'graded':
      count = assignmentsStore.submissions.filter(sub => 
        sub.studentId === userId && sub.grade
      ).length
      break
  }
  
  return count
}

// Submission status helpers
const getSubmissionStatus = (assignment) => {
  const submission = assignmentsStore.submissions.find(
    sub => sub.assignmentId === assignment.id && sub.studentId === currentUser.value?.id
  )
  return submission?.status || null
}

const getSubmissionGrade = (assignment) => {
  const submission = assignmentsStore.submissions.find(
    sub => sub.assignmentId === assignment.id && sub.studentId === currentUser.value?.id
  )
  return submission?.grade || null
}

const getStatusClasses = (status) => {
  switch (status) {
    case 'submitted':
      return 'bg-green-100 text-green-700'
    case 'graded':
      return 'bg-blue-100 text-blue-700'
    case 'missing':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'submitted':
      return 'check_circle'
    case 'graded':
      return 'star'
    case 'missing':
      return 'error'
    default:
      return 'pending'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'submitted':
      return 'Submitted'
    case 'graded':
      return 'Graded'
    case 'missing':
      return 'Missing'
    default:
      return 'Pending'
  }
}

// Due date helpers
const isOverdue = (assignment) => {
  const submission = getSubmissionStatus(assignment)
  if (submission === 'submitted' || submission === 'graded') return false
  
  const dueDate = new Date(assignment.dueDate)
  const now = new Date()
  return dueDate < now
}

const isDueSoon = (assignment) => {
  const submission = getSubmissionStatus(assignment)
  if (submission === 'submitted' || submission === 'graded') return false
  
  const dueDate = new Date(assignment.dueDate)
  const now = new Date()
  const diffHours = (dueDate - now) / (1000 * 60 * 60)
  
  return diffHours > 0 && diffHours <= 48 // Due within 48 hours
}

const getFilteredAssignments = (courseId) => {
  const userId = currentUser.value?.id
  let assignments = assignmentsStore.assignments.filter(assignment => assignment.courseId === courseId)
  
  switch (activeFilter.value) {
    case 'pending':
      const submitted = assignmentsStore.submissions
        .filter(sub => sub.studentId === userId)
        .map(sub => sub.assignmentId)
      assignments = assignments.filter(a => !submitted.includes(a.id))
      break
    case 'submitted':
      const submittedIds = assignmentsStore.submissions
        .filter(sub => sub.studentId === userId && sub.status === 'submitted' && !sub.grade)
        .map(sub => sub.assignmentId)
      assignments = assignments.filter(a => submittedIds.includes(a.id))
      break
    case 'graded':
      const gradedIds = assignmentsStore.submissions
        .filter(sub => sub.studentId === userId && sub.grade)
        .map(sub => sub.assignmentId)
      assignments = assignments.filter(a => gradedIds.includes(a.id))
      break
  }
  
  return assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'tomorrow'
  if (diffDays < 7) return `in ${diffDays} days`
  
  return `on ${date.toLocaleDateString()}`
}

const getPointsClass = (points) => {
  if (points >= 100) return 'chip-primary'
  if (points >= 50) return 'chip-secondary'
  return 'chip-gray'
}

const navigateToAssignment = (assignment) => {
  router.push(`/student/classwork/${assignment.id}`)
}

const goBack = () => {
  router.back()
}

const loadClassworkData = async () => {
  loading.value = true
  error.value = null
  
  try {
    await Promise.all([
      coursesStore.loadCourses(),
      assignmentsStore.loadAssignments()
    ])
    
    // Also load from localStorage if available
    assignmentsStore.loadFromStorage()
  } catch (err) {
    error.value = 'Failed to load assignments. Please try again.'
    console.error('Error loading classwork data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadClassworkData()
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
