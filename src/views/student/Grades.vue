<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Loading your grades..." />

    <div v-else>
      <!-- Error Alert -->
      <ErrorAlert 
        :error="error" 
        :retry="true"
        @dismiss="error = null"
        @retry="loadGradesData"
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
            <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Grades</h1>
            <p class="text-classroom-gray-600">Your assignment grades and overall performance</p>
          </div>
          <button
            @click="exportGrades"
            class="flex items-center space-x-2 px-4 py-2 bg-classroom-primary text-white rounded-classroom hover:bg-blue-700 transition-colors"
          >
            <span class="material-icons text-sm">download</span>
            <span>Export Grades</span>
          </button>
        </div>
      </div>

      <!-- Overall performance -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-white to-blue-50 rounded-classroom classroom-shadow p-6 text-center border border-blue-100">
          <div class="w-16 h-16 bg-classroom-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="material-icons text-classroom-primary text-2xl">grade</span>
          </div>
          <p class="text-sm text-classroom-gray-500 mb-1">Average Grade</p>
          <p class="text-3xl font-bold text-classroom-gray-900">{{ overallAverage }}%</p>
          <p class="text-xs text-classroom-gray-500 mt-1">GPA: {{ gpa }}</p>
        </div>

        <div class="bg-gradient-to-br from-white to-green-50 rounded-classroom classroom-shadow p-6 text-center border border-green-100">
          <div class="w-16 h-16 bg-classroom-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="material-icons text-classroom-secondary text-2xl">assignment_turned_in</span>
          </div>
          <p class="text-sm text-classroom-gray-500 mb-1">Graded</p>
          <p class="text-3xl font-bold text-classroom-gray-900">{{ gradedCount }}</p>
          <p class="text-xs text-classroom-gray-500 mt-1">assignments</p>
        </div>

        <div class="bg-gradient-to-br from-white to-yellow-50 rounded-classroom classroom-shadow p-6 text-center border border-yellow-100">
          <div class="w-16 h-16 bg-yellow-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="material-icons text-yellow-600 text-2xl">pending</span>
          </div>
          <p class="text-sm text-classroom-gray-500 mb-1">Pending Grading</p>
          <p class="text-3xl font-bold text-classroom-gray-900">{{ pendingGrading }}</p>
          <p class="text-xs text-classroom-gray-500 mt-1">assignments</p>
        </div>

        <div class="bg-gradient-to-br from-white to-purple-50 rounded-classroom classroom-shadow p-6 text-center border border-purple-100">
          <div class="w-16 h-16 bg-purple-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="material-icons text-purple-600 text-2xl">trending_up</span>
          </div>
          <p class="text-sm text-classroom-gray-500 mb-1">Total Points</p>
          <p class="text-3xl font-bold text-classroom-gray-900">{{ totalPointsEarned }}</p>
          <p class="text-xs text-classroom-gray-500 mt-1">of {{ totalPointsPossible }}</p>
        </div>
      </div>

      <!-- Grades by class -->
      <div class="space-y-6">
        <div 
          v-for="course in coursesWithGrades"
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
                <p class="text-2xl font-bold text-classroom-primary">{{ getCourseAverage(course.id) }}%</p>
                <p class="text-sm text-classroom-gray-600">{{ getCourseGradedCount(course.id) }} graded</p>
              </div>
            </div>
          </div>
          
          <div class="divide-y divide-classroom-gray-100">
            <div
              v-for="item in getGradedAssignments(course.id)"
              :key="item.submission.id"
              class="p-4 hover:bg-classroom-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <h3 class="font-medium text-classroom-gray-900">
                      {{ item.assignment.title }}
                    </h3>
                    <span 
                      class="px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="getGradeColorClass(item.submission.grade, item.assignment.points)"
                    >
                      {{ getLetterGrade(item.submission.grade, item.assignment.points) }}
                    </span>
                  </div>
                  <p class="text-sm text-classroom-gray-600 mb-2">
                    {{ item.assignment.description || 'No description' }}
                  </p>
                  <div class="flex items-center space-x-4 text-xs text-classroom-gray-500">
                    <span class="flex items-center space-x-1">
                      <span class="material-icons text-sm">schedule</span>
                      <span>Submitted {{ formatTime(item.submission.submittedAt) }}</span>
                    </span>
                    <span class="flex items-center space-x-1">
                      <span class="material-icons text-sm">event</span>
                      <span>Graded {{ formatTime(item.submission.returnedAt) }}</span>
                    </span>
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {{ item.assignment.points }} points possible
                    </span>
                  </div>
                </div>
                <div class="text-right ml-4">
                  <p class="text-3xl font-bold text-classroom-primary">{{ item.submission.grade }}</p>
                  <p class="text-sm text-classroom-gray-600">{{ Math.round((item.submission.grade / item.assignment.points) * 100) }}%</p>
                </div>
              </div>

              <!-- Teacher feedback -->
              <div v-if="item.submission.feedback" class="mt-3 p-3 bg-blue-50 rounded-classroom border border-blue-200">
                <div class="flex items-start space-x-2">
                  <span class="material-icons text-blue-600 text-sm mt-0.5">feedback</span>
                  <div class="flex-1">
                    <p class="text-xs font-medium text-blue-900 mb-1">Teacher Feedback</p>
                    <p class="text-sm text-classroom-gray-700">{{ item.submission.feedback }}</p>
                  </div>
                </div>
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
        <button 
          @click="router.push('/student/classwork')"
          class="px-6 py-2 bg-classroom-primary text-white rounded-classroom hover:bg-blue-700 transition-colors"
        >
          View Assignments
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
import { exportToCSV } from '../../utils/exportHelpers'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

const loading = ref(false)
const error = ref(null)

const currentUser = computed(() => usersStore.currentUser)

const enrolledClasses = computed(() => {
  if (!currentUser.value) return []
  return coursesStore.getCoursesForUser(currentUser.value.id)
})

// Get graded submissions for current user
const gradedSubmissions = computed(() => {
  return assignmentsStore.submissions.filter(
    sub => sub.studentId === currentUser.value?.id && sub.grade
  )
})

const gradedCount = computed(() => gradedSubmissions.value.length)

const pendingGrading = computed(() => {
  return assignmentsStore.submissions.filter(
    sub => sub.studentId === currentUser.value?.id && 
    sub.status === 'submitted' && !sub.grade
  ).length
})

// Calculate overall average from graded submissions
const overallAverage = computed(() => {
  const graded = gradedSubmissions.value
  if (graded.length === 0) return 0
  
  let totalPercentage = 0
  let count = 0
  
  graded.forEach(submission => {
    const assignment = assignmentsStore.assignments.find(a => a.id === submission.assignmentId)
    if (assignment && assignment.points > 0) {
      totalPercentage += (submission.grade / assignment.points) * 100
      count++
    }
  })
  
  return count > 0 ? Math.round(totalPercentage / count) : 0
})

// Calculate GPA (4.0 scale)
const gpa = computed(() => {
  const graded = gradedSubmissions.value
  if (graded.length === 0) return '0.00'
  
  let totalGPA = 0
  let count = 0
  
  graded.forEach(submission => {
    const assignment = assignmentsStore.assignments.find(a => a.id === submission.assignmentId)
    if (assignment && assignment.points > 0) {
      const percentage = (submission.grade / assignment.points) * 100
      totalGPA += percentageToGPA(percentage)
      count++
    }
  })
  
  return count > 0 ? (totalGPA / count).toFixed(2) : '0.00'
})

// Calculate total points
const totalPointsEarned = computed(() => {
  return gradedSubmissions.value.reduce((sum, sub) => sum + sub.grade, 0)
})

const totalPointsPossible = computed(() => {
  let total = 0
  gradedSubmissions.value.forEach(submission => {
    const assignment = assignmentsStore.assignments.find(a => a.id === submission.assignmentId)
    if (assignment) {
      total += assignment.points
    }
  })
  return total
})

// Filter courses that have graded assignments
const coursesWithGrades = computed(() => {
  return enrolledClasses.value.filter(course => {
    return gradedSubmissions.value.some(submission => {
      const assignment = assignmentsStore.assignments.find(a => a.id === submission.assignmentId)
      return assignment && assignment.courseId === course.id
    })
  })
})

// Get graded assignments with submission data for a course
const getGradedAssignments = (courseId) => {
  const results = []
  
  gradedSubmissions.value.forEach(submission => {
    const assignment = assignmentsStore.assignments.find(a => a.id === submission.assignmentId)
    if (assignment && assignment.courseId === courseId) {
      results.push({
        assignment,
        submission
      })
    }
  })
  
  return results.sort((a, b) => 
    new Date(b.submission.returnedAt || b.submission.submittedAt) - 
    new Date(a.submission.returnedAt || a.submission.submittedAt)
  )
}

const getCourseAverage = (courseId) => {
  const courseItems = getGradedAssignments(courseId)
  if (courseItems.length === 0) return 0
  
  const totalPercentage = courseItems.reduce((sum, item) => {
    return sum + (item.submission.grade / item.assignment.points) * 100
  }, 0)
  
  return Math.round(totalPercentage / courseItems.length)
}

const getCourseGradedCount = (courseId) => {
  return getGradedAssignments(courseId).length
}

// Helper functions for letter grades
const getLetterGrade = (score, total) => {
  const percentage = (score / total) * 100
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

const getGradeColorClass = (score, total) => {
  const percentage = (score / total) * 100
  if (percentage >= 90) return 'bg-green-100 text-green-700'
  if (percentage >= 80) return 'bg-blue-100 text-blue-700'
  if (percentage >= 70) return 'bg-yellow-100 text-yellow-700'
  if (percentage >= 60) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

const percentageToGPA = (percentage) => {
  if (percentage >= 93) return 4.0
  if (percentage >= 90) return 3.7
  if (percentage >= 87) return 3.3
  if (percentage >= 83) return 3.0
  if (percentage >= 80) return 2.7
  if (percentage >= 77) return 2.3
  if (percentage >= 73) return 2.0
  if (percentage >= 70) return 1.7
  if (percentage >= 67) return 1.3
  if (percentage >= 65) return 1.0
  return 0.0
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Export grades to CSV
const exportGrades = () => {
  const data = []
  
  coursesWithGrades.value.forEach(course => {
    const courseItems = getGradedAssignments(course.id)
    
    courseItems.forEach(item => {
      data.push({
        'Course': course.name,
        'Assignment': item.assignment.title,
        'Points Earned': item.submission.grade,
        'Points Possible': item.assignment.points,
        'Percentage': Math.round((item.submission.grade / item.assignment.points) * 100) + '%',
        'Letter Grade': getLetterGrade(item.submission.grade, item.assignment.points),
        'Submitted': formatTime(item.submission.submittedAt),
        'Graded': formatTime(item.submission.returnedAt),
        'Feedback': item.submission.feedback || 'No feedback'
      })
    })
  })
  
  // Add summary row
  data.push({})
  data.push({
    'Course': 'OVERALL SUMMARY',
    'Assignment': `Total: ${gradedCount.value} assignments`,
    'Points Earned': totalPointsEarned.value,
    'Points Possible': totalPointsPossible.value,
    'Percentage': overallAverage.value + '%',
    'Letter Grade': `GPA: ${gpa.value}`,
    'Submitted': '',
    'Graded': '',
    'Feedback': ''
  })
  
  exportToCSV(data, `grades_${currentUser.value?.name}_${new Date().toISOString().split('T')[0]}`)
  showToast('Grades exported successfully!')
}

const loadGradesData = async () => {
  loading.value = true
  error.value = null
  
  try {
    await Promise.all([
      coursesStore.loadCourses(),
      assignmentsStore.loadAssignments()
    ])
    
    // Load from localStorage
    assignmentsStore.loadFromStorage()
  } catch (err) {
    error.value = 'Failed to load grades. Please try again.'
    console.error('Error loading grades data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadGradesData()
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}

const goBack = () => {
  router.back()
}
</script>
