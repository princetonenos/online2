<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Grades</h1>
      <p class="text-classroom-gray-600">Your assignment grades and overall performance</p>
    </div>

    <!-- Overall performance -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-classroom classroom-shadow p-6 text-center">
        <div class="w-16 h-16 bg-classroom-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="material-icons text-classroom-primary text-2xl">grade</span>
        </div>
        <p class="text-sm text-classroom-gray-500 mb-1">Average Grade</p>
        <p class="text-3xl font-medium text-classroom-gray-900">{{ overallAverage }}%</p>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-6 text-center">
        <div class="w-16 h-16 bg-classroom-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="material-icons text-classroom-secondary text-2xl">assignment_turned_in</span>
        </div>
        <p class="text-sm text-classroom-gray-500 mb-1">Assignments Submitted</p>
        <p class="text-3xl font-medium text-classroom-gray-900">{{ submittedAssignments }}</p>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-6 text-center">
        <div class="w-16 h-16 bg-classroom-support bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="material-icons text-classroom-support text-2xl">pending</span>
        </div>
        <p class="text-sm text-classroom-gray-500 mb-1">Pending Grading</p>
        <p class="text-3xl font-medium text-classroom-gray-900">{{ pendingGrading }}</p>
      </div>
    </div>

    <!-- Grades by class -->
    <div class="space-y-6">
      <div 
        v-for="course in coursesWithGrades"
        :key="course.id"
        class="bg-white rounded-classroom classroom-shadow overflow-hidden"
      >
        <div class="p-4 border-b border-classroom-gray-200 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-medium text-classroom-gray-900">{{ course.name }}</h2>
            <p class="text-classroom-gray-600">{{ course.teacherName }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-medium text-classroom-primary">{{ getCourseAverage(course.id) }}%</p>
            <p class="text-sm text-classroom-gray-600">Course Average</p>
          </div>
        </div>
        
        <div class="divide-y divide-classroom-gray-100">
          <div
            v-for="assignment in getGradedAssignments(course.id)"
            :key="assignment.id"
            class="p-4 hover:bg-classroom-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
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
                    <span>Submitted {{ formatTime(assignment.submittedAt) }}</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <span class="material-icons text-sm">grade</span>
                    <span>{{ assignment.points }} points</span>
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-medium text-classroom-primary">{{ assignment.grade }}/{{ assignment.points }}</p>
                <p class="text-sm text-classroom-gray-600">{{ Math.round((assignment.grade / assignment.points) * 100) }}%</p>
              </div>
            </div>

            <!-- Teacher feedback -->
            <div v-if="assignment.feedback" class="mt-3 p-3 bg-classroom-primary bg-opacity-5 rounded-classroom">
              <p class="text-sm text-classroom-gray-700">
                <strong>Teacher feedback:</strong> {{ assignment.feedback }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="getGradedAssignments(course.id).length === 0" class="p-8 text-center text-classroom-gray-500">
          <span class="material-icons text-4xl mb-2 opacity-50">grade</span>
          <p>No graded assignments yet</p>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="coursesWithGrades.length === 0" class="text-center py-16">
      <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-icons text-classroom-gray-400 text-4xl">grade</span>
      </div>
      <h3 class="text-xl font-medium text-classroom-gray-900 mb-2">No grades yet</h3>
      <p class="text-classroom-gray-600 mb-6">Your grades will appear here once assignments are graded</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'
import { useAssignmentsStore } from '../../store/assignments'

const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

const currentUser = computed(() => usersStore.currentUser)
const enrolledClasses = computed(() => {
  if (!currentUser.value) return []
  return coursesStore.getCoursesForUser(currentUser.value.id)
})

const gradedAssignments = computed(() => {
  return assignmentsStore.assignments.filter(assignment => assignment.grade)
})

const submittedAssignments = computed(() => {
  return assignmentsStore.assignments.filter(assignment => assignment.submissionStatus === 'submitted').length
})

const pendingGrading = computed(() => {
  return assignmentsStore.assignments.filter(assignment => 
    assignment.submissionStatus === 'submitted' && !assignment.grade
  ).length
})

const overallAverage = computed(() => {
  const graded = gradedAssignments.value
  if (graded.length === 0) return 0
  
  const totalPercentage = graded.reduce((sum, assignment) => {
    return sum + (assignment.grade / assignment.points) * 100
  }, 0)
  
  return Math.round(totalPercentage / graded.length)
})

const coursesWithGrades = computed(() => {
  return enrolledClasses.value.filter(course => 
    gradedAssignments.value.some(assignment => assignment.courseId === course.id)
  )
})

const getGradedAssignments = (courseId) => {
  return gradedAssignments.value
    .filter(assignment => assignment.courseId === courseId)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
}

const getCourseAverage = (courseId) => {
  const courseAssignments = getGradedAssignments(courseId)
  if (courseAssignments.length === 0) return 0
  
  const totalPercentage = courseAssignments.reduce((sum, assignment) => {
    return sum + (assignment.grade / assignment.points) * 100
  }, 0)
  
  return Math.round(totalPercentage / courseAssignments.length)
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleDateString()
}

onMounted(async () => {
  try {
    await Promise.all([
      coursesStore.loadCourses(),
      assignmentsStore.loadAssignments()
    ])
  } catch (error) {
    console.error('Error loading grades data:', error)
    showToast('Error loading grades information')
  }
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
