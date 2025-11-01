<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Classwork</h1>
      <p class="text-classroom-gray-600">All your assignments across all classes</p>
    </div>

    <!-- Assignment filters -->
    <div class="flex space-x-2 mb-6">
      <button 
        v-for="filter in filters"
        :key="filter.id"
        @click="activeFilter = filter.id"
        class="px-4 py-2 rounded-classroom transition-colors"
        :class="activeFilter === filter.id 
          ? 'bg-classroom-primary text-white' 
          : 'bg-white text-classroom-gray-700 hover:bg-classroom-gray-50 classroom-shadow'"
      >
        {{ filter.name }}
      </button>
    </div>

    <!-- Assignments by class -->
    <div class="space-y-6">
      <div 
        v-for="course in coursesWithAssignments"
        :key="course.id"
        class="bg-white rounded-classroom classroom-shadow overflow-hidden"
      >
        <div class="p-4 border-b border-classroom-gray-200">
          <h2 class="text-xl font-medium text-classroom-gray-900">{{ course.name }}</h2>
          <p class="text-classroom-gray-600">{{ course.teacherName }}</p>
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
                <h3 class="font-medium text-classroom-gray-900 mb-1">
                  {{ assignment.title }}
                </h3>
                <p class="text-sm text-classroom-gray-600 mb-2">
                  {{ assignment.description }}
                </p>
                <div class="flex items-center space-x-4 text-xs text-classroom-gray-500">
                  <span class="flex items-center space-x-1">
                    <span class="material-icons text-sm">schedule</span>
                    <span>Due {{ formatDueDate(assignment.dueDate) }}</span>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'
import { useAssignmentsStore } from '../../store/assignments'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

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

const getFilteredAssignments = (courseId) => {
  let assignments = assignmentsStore.assignments.filter(assignment => assignment.courseId === courseId)
  
  switch (activeFilter.value) {
    case 'pending':
      assignments = assignments.filter(a => a.submissionStatus !== 'submitted')
      break
    case 'submitted':
      assignments = assignments.filter(a => a.submissionStatus === 'submitted' && !a.grade)
      break
    case 'graded':
      assignments = assignments.filter(a => a.grade)
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

onMounted(async () => {
  try {
    await Promise.all([
      coursesStore.loadCourses(),
      assignmentsStore.loadAssignments()
    ])
  } catch (error) {
    console.error('Error loading classwork data:', error)
    showToast('Error loading assignments')
  }
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
