<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Learning Analytics
          </h1>
          <p class="text-gray-600 mt-2">Track your progress and performance across all classes</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select class="bg-white border border-gray-300 rounded-classroom pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option>This Semester</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <span class="material-icons text-gray-400 text-sm">arrow_drop_down</span>
            </div>
          </div>
          <button 
            @click="$router.back()"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-classroom transition-colors flex items-center space-x-2"
          >
            <span class="material-icons text-sm">arrow_back</span>
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Overall Average</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ analytics.overallAverage }}%</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">trending_up</span>
              +3.2% from last month
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-xl">trending_up</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Assignments Completed</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ analytics.assignmentsCompleted }}</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">check_circle</span>
              92% completion rate
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-xl">assignment_turned_in</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Study Hours</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ analytics.studyHours }}</p>
            <p class="text-blue-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">schedule</span>
              12h this week
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-purple-600 text-xl">schedule</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Attendance Rate</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ analytics.attendanceRate }}%</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">verified</span>
              Perfect this month
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-xl">person</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Analytics Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
      <!-- Performance Trends -->
      <div class="xl:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Performance Trends</h2>
            <div class="flex items-center space-x-2">
              <button class="text-sm text-gray-600 hover:text-gray-900">Weekly</button>
              <button class="text-sm text-gray-600 hover:text-gray-900">Monthly</button>
              <button class="text-sm text-blue-600 font-medium">Semester</button>
            </div>
          </div>
          <div class="h-80 bg-gradient-to-br from-gray-50 to-blue-50 rounded-classroom flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-blue-600 text-2xl">bar_chart</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h3>
              <p class="text-gray-500 mb-4">Chart.js or Recharts integration ready</p>
              <div class="flex justify-center space-x-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Mathematics</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Science</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>English</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject Performance -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Subject Performance</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-sm">calculate</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Mathematics</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ subjectPerformance.mathematics }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-blue-500 h-2 rounded-full" :style="{ width: subjectPerformance.mathematics + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-green-600 text-sm">science</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Science</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ subjectPerformance.science }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-green-500 h-2 rounded-full" :style="{ width: subjectPerformance.science + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-purple-600 text-sm">menu_book</span>
                </div>
                <span class="text-sm font-medium text-gray-900">English</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ subjectPerformance.english }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-purple-500 h-2 rounded-full" :style="{ width: subjectPerformance.english + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-orange-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-orange-600 text-sm">history</span>
                </div>
                <span class="text-sm font-medium text-gray-900">History</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ subjectPerformance.history }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-orange-500 h-2 rounded-full" :style="{ width: subjectPerformance.history + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Learning Goals -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Learning Goals</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Weekly Study Target</span>
              <span class="text-sm font-semibold text-gray-900">{{ learningGoals.weeklyStudy }}h / 15h</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Assignment Completion</span>
              <span class="text-sm font-semibold text-gray-900">{{ learningGoals.assignmentCompletion }}%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Target Grade Average</span>
              <span class="text-sm font-semibold text-gray-900">{{ learningGoals.targetGrade }}%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Class Participation</span>
              <span class="text-sm font-semibold text-gray-900">{{ learningGoals.classParticipation }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Analytics Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Assignment Performance -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Assignment Performance</h2>
        <div class="space-y-4">
          <div 
            v-for="assignment in assignmentPerformance"
            :key="assignment.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom flex items-center justify-center text-white font-semibold text-sm">
                {{ assignment.subject.charAt(0) }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ assignment.name }}</div>
                <div class="text-xs text-gray-500">{{ assignment.subject }} • {{ assignment.type }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-900">{{ assignment.grade }}%</div>
              <div class="text-xs text-gray-500" :class="getGradeColor(assignment.grade)">{{ getGradeStatus(assignment.grade) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Study Habits -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Study Habits</h2>
        <div class="space-y-4">
          <div 
            v-for="habit in studyHabits"
            :key="habit.id"
            class="flex items-start justify-between p-4 bg-gray-50 rounded-classroom hover:bg-green-50 transition-colors"
          >
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center flex-shrink-0 mt-1">
                <span class="material-icons text-green-600 text-sm">{{ habit.icon }}</span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ habit.name }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ habit.description }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ habit.frequency }}</div>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-xs font-medium" :class="habit.statusClass">{{ habit.status }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ habit.score }}/10</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Learning Activity -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Learning Activity Timeline</h2>
      <div class="space-y-4">
        <div 
          v-for="activity in learningActivity"
          :key="activity.id"
          class="flex items-start space-x-4 p-4 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors"
        >
          <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center flex-shrink-0 mt-1">
            <span class="material-icons text-blue-600 text-sm">{{ activity.icon }}</span>
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-900">{{ activity.title }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ activity.description }}</div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-xs text-gray-500">{{ activity.time }}</div>
            <div class="text-xs font-medium mt-1" :class="activity.scoreClass">{{ activity.score }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl border border-green-100 p-6 mt-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Personalized Recommendations</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-classroom p-4 border border-green-200">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 bg-green-100 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-green-600 text-lg">lightbulb</span>
            </div>
            <h3 class="font-bold text-gray-900">Focus Areas</h3>
          </div>
          <ul class="text-sm text-gray-600 space-y-2">
            <li class="flex items-center space-x-2">
              <span class="material-icons text-green-500 text-sm">check_circle</span>
              <span>Review quadratic equations in Mathematics</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="material-icons text-green-500 text-sm">check_circle</span>
              <span>Practice essay writing for English</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="material-icons text-green-500 text-sm">check_circle</span>
              <span>Study chemical reactions in Science</span>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-classroom p-4 border border-blue-200">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 bg-blue-100 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-blue-600 text-lg">schedule</span>
            </div>
            <h3 class="font-bold text-gray-900">Study Schedule</h3>
          </div>
          <ul class="text-sm text-gray-600 space-y-2">
            <li class="flex items-center space-x-2">
              <span class="material-icons text-blue-500 text-sm">schedule</span>
              <span>Mathematics: 2 hours daily</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="material-icons text-blue-500 text-sm">schedule</span>
              <span>Science: 1.5 hours daily</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="material-icons text-blue-500 text-sm">schedule</span>
              <span>English: 1 hour daily</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Mock data for analytics
const analytics = ref({
  overallAverage: 87,
  assignmentsCompleted: 45,
  studyHours: 28,
  attendanceRate: 95
})

const subjectPerformance = ref({
  mathematics: 85,
  science: 92,
  english: 78,
  history: 88
})

const learningGoals = ref({
  weeklyStudy: 12,
  assignmentCompletion: 92,
  targetGrade: 90,
  classParticipation: 85
})

const assignmentPerformance = ref([
  {
    id: 1,
    name: 'Algebra Test',
    subject: 'Mathematics',
    type: 'Exam',
    grade: 88
  },
  {
    id: 2,
    name: 'Chemistry Lab Report',
    subject: 'Science',
    type: 'Lab',
    grade: 94
  },
  {
    id: 3,
    name: 'Essay - Modern Literature',
    subject: 'English',
    type: 'Essay',
    grade: 76
  },
  {
    id: 4,
    name: 'World War II Presentation',
    subject: 'History',
    type: 'Presentation',
    grade: 92
  },
  {
    id: 5,
    name: 'Trigonometry Quiz',
    subject: 'Mathematics',
    type: 'Quiz',
    grade: 82
  }
])

const studyHabits = ref([
  {
    id: 1,
    icon: 'schedule',
    name: 'Consistent Study Schedule',
    description: 'Studying at the same time daily',
    frequency: '5 days/week',
    status: 'Excellent',
    statusClass: 'text-green-600',
    score: 9
  },
  {
    id: 2,
    icon: 'assignment',
    name: 'Assignment Completion',
    description: 'Submitting assignments on time',
    frequency: '95% on time',
    status: 'Good',
    statusClass: 'text-blue-600',
    score: 8
  },
  {
    id: 3,
    icon: 'note',
    name: 'Note Taking',
    description: 'Quality of class notes',
    frequency: 'All classes',
    status: 'Excellent',
    statusClass: 'text-green-600',
    score: 9
  },
  {
    id: 4,
    icon: 'group',
    name: 'Group Study',
    description: 'Collaborative learning sessions',
    frequency: '2 sessions/week',
    status: 'Good',
    statusClass: 'text-blue-600',
    score: 7
  }
])

const learningActivity = ref([
  {
    id: 1,
    icon: 'school',
    title: 'Mathematics Class',
    description: 'Advanced algebra concepts and problem solving',
    time: '2 hours ago',
    score: '95%',
    scoreClass: 'text-green-600'
  },
  {
    id: 2,
    icon: 'assignment',
    title: 'Science Assignment',
    description: 'Completed chemistry lab report',
    time: '4 hours ago',
    score: '94%',
    scoreClass: 'text-green-600'
  },
  {
    id: 3,
    icon: 'menu_book',
    title: 'English Reading',
    description: 'Modern literature analysis and discussion',
    time: '1 day ago',
    score: '88%',
    scoreClass: 'text-blue-600'
  },
  {
    id: 4,
    icon: 'quiz',
    title: 'History Quiz',
    description: 'World War II timeline and key events',
    time: '2 days ago',
    score: '92%',
    scoreClass: 'text-green-600'
  }
])

// Helper functions
const getGradeColor = (grade) => {
  if (grade >= 90) return 'text-green-600'
  if (grade >= 80) return 'text-blue-600'
  if (grade >= 70) return 'text-orange-600'
  return 'text-red-600'
}

const getGradeStatus = (grade) => {
  if (grade >= 90) return 'Excellent'
  if (grade >= 80) return 'Good'
  if (grade >= 70) return 'Satisfactory'
  return 'Needs Improvement'
}

// Computed properties for enhanced analytics
const performanceTrend = computed(() => {
  // Mock trend calculation
  return '+3.2%'
})

const studyConsistency = computed(() => {
  // Mock consistency calculation
  return 85
})

onMounted(() => {
  // Initialize analytics data
  loadAnalyticsData()
})

const loadAnalyticsData = () => {
  // In a real application, this would fetch data from an analytics API
  console.log('Loading student analytics data...')
}

// Export functionality
const exportAnalyticsReport = () => {
  showToast('Exporting analytics report...')
  // This would generate and download a PDF report
}

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  } else {
    alert(message)
  }
}
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
