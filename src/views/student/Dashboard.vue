<template>
  <div class="min-h-screen bg-classroom-gray-50 p-6">
    <!-- Error Alert -->
    <ErrorAlert 
      :error="error" 
      :retry="true"
      @dismiss="error = null"
      @retry="loadDashboardData"
    />

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Loading your dashboard..." />

    <!-- Dashboard Content -->
    <div v-else>
    <!-- Enhanced Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-classroom-gray-900">
            Welcome, {{ currentUser?.firstName || currentUser?.name || 'Student' }}!
          </h1>
          <p class="text-classroom-gray-600 mt-2">{{ greetingMessage }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <div class="text-sm text-classroom-gray-500">Next class</div>
            <div class="text-base font-medium text-classroom-gray-900">{{ nextClassText }}</div>
          </div>
          <div class="w-12 h-12 bg-classroom-primary rounded-full flex items-center justify-center text-white font-semibold text-sm animate-scale-in">
            {{ initials(currentUser?.name) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced KPI Dashboard -->
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="router.push('/student/classes')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Your Classes</p>
            <p class="text-2xl font-bold text-gray-900">{{ enrolledClasses.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-lg">school</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="router.push('/student/classwork')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Upcoming</p>
            <p class="text-2xl font-bold text-gray-900">{{ upcomingAssignments.length }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-lg">assignment</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-xl border border-yellow-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="router.push('/student/classwork')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Due Today</p>
            <p class="text-2xl font-bold text-gray-900">{{ assignmentsDueToday }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-yellow-600 text-lg">schedule</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="router.push('/student/grades')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Completed</p>
            <p class="text-2xl font-bold text-gray-900">{{ completedAssignments }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-lg">check_circle</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="router.push('/student/grades')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Avg. Grade</p>
            <p class="text-2xl font-bold text-gray-900">{{ averageGrade }}%</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-lg">trending_up</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="router.push('/student/calendar')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Attendance</p>
            <p class="text-2xl font-bold text-gray-900">{{ attendanceRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-lg">person</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Next Class Countdown -->
    <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 mb-8" v-if="nextClass">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Next Class</h3>
          <p class="text-gray-600">{{ nextClass.name }}</p>
          <p class="text-sm text-gray-500">{{ formatClassTime(nextClass) }}</p>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{{ countdownTime }}</p>
          <p class="text-sm text-gray-500">starts in</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <button 
        @click="router.push({ name: 'StudentJoinClass' })"
        class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">group_add</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Join Class</h3>
            <p class="text-sm text-gray-600">Enter a class code</p>
          </div>
        </div>
      </button>

      <button 
        @click="router.push('/student/classes')"
        class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">school</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">View Classes</h3>
            <p class="text-sm text-gray-600">See all your classes</p>
          </div>
        </div>
      </button>

      <button 
        @click="router.push('/student/classwork')"
        class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">assignment</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">View Classwork</h3>
            <p class="text-sm text-gray-600">See all assignments</p>
          </div>
        </div>
      </button>

      <button 
        @click="router.push('/student/calendar')"
        class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">calendar_today</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">View Calendar</h3>
            <p class="text-sm text-gray-600">See your schedule</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Additional Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <button 
        @click="router.push('/student/grades')"
        class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">grade</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Grades</h3>
            <p class="text-sm text-gray-600">View your grades</p>
          </div>
        </div>
      </button>

      <button 
        @click="router.push('/student/people')"
        class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">people</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">People</h3>
            <p class="text-sm text-gray-600">Classmates & teachers</p>
          </div>
        </div>
      </button>

      <button 
        @click="router.push('/settings')"
        class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">settings</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Settings</h3>
            <p class="text-sm text-gray-600">Manage your settings</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Left Column: Recent Announcements & Classes -->
      <div class="xl:col-span-2 space-y-8">
        <!-- Recent Announcements -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Recent Announcements</h2>
            <button 
              @click="router.push('/student/stream')"
              class="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2"
            >
              <span>View all</span>
              <span class="material-icons text-sm">arrow_forward</span>
            </button>
          </div>

          <div class="space-y-4">
            <div 
              v-for="announcement in recentAnnouncements"
              :key="announcement.id"
              class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-classroom p-4 hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200"
              @click="navigateToAnnouncement(announcement)"
            >
              <div class="flex items-start space-x-4">
                <div class="w-10 h-10 bg-blue-100 rounded-classroom flex items-center justify-center flex-shrink-0">
                  <span class="material-icons text-blue-600 text-lg">campaign</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 mb-2">{{ announcement.title }}</h3>
                  <p class="text-gray-600 mb-3">{{ announcement.content }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span class="flex items-center space-x-1">
                      <span class="material-icons text-sm">school</span>
                      <span>{{ getCourseName(announcement.courseId) }}</span>
                    </span>
                    <span class="flex items-center space-x-1">
                      <span class="material-icons text-sm">schedule</span>
                      <span>{{ formatTime(announcement.createdAt) }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="recentAnnouncements.length === 0" class="text-center py-8 text-gray-500">
              <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-gray-400 text-2xl">campaign</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No Recent Announcements</h3>
              <p class="text-gray-500">Check back later for updates from your teachers</p>
            </div>
          </div>
        </div>

        <!-- Your Classes -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Your Classes</h2>
            <button 
              @click="router.push('/student/classes')"
              class="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2"
            >
              <span>View all</span>
              <span class="material-icons text-sm">arrow_forward</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              v-for="course in enrolledClasses.slice(0, 4)"
              :key="course.id"
              class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              @click="navigateToClass(course.id)"
            >
              <div class="w-full h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom mb-4 flex items-center justify-center">
                <span class="material-icons text-white text-3xl">school</span>
              </div>
              <h3 class="font-bold text-gray-900 mb-2 text-lg">{{ course.name }}</h3>
              <p class="text-gray-600 mb-3">{{ course.teacherName }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{{ course.section }}</span>
                <span>{{ course.enrolledStudents }} students</span>
              </div>
            </div>
          </div>

          <div v-if="enrolledClasses.length === 0" class="text-center py-8 text-gray-500">
            <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-gray-400 text-2xl">school</span>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Classes Enrolled</h3>
            <p class="text-gray-500 mb-4">Join your first class to get started</p>
            <button 
              @click="router.push({ name: 'StudentJoinClass' })"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors"
            >
              Join Class
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Pending Assignments & Quick Stats -->
      <div class="space-y-8">
        <!-- Pending Assignments -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Pending Assignments</h2>
          
          <div class="space-y-4">
            <div
              v-for="assignment in pendingAssignments"
              :key="assignment.id"
              class="bg-gradient-to-br from-white to-orange-50 rounded-classroom p-4 hover:shadow-md transition-all duration-300 cursor-pointer border border-orange-100"
              @click="navigateToAssignment(assignment)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 mb-2">{{ assignment.title }}</h3>
                  <p class="text-gray-600 mb-3">{{ getCourseName(assignment.courseId) }}</p>
                  <div class="flex items-center space-x-4 text-sm">
                    <span class="flex items-center space-x-1 text-gray-500">
                      <span class="material-icons text-sm">schedule</span>
                      <span>{{ formatDueDate(assignment.dueDate) }}</span>
                    </span>
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {{ assignment.points }} points
                    </span>
                    <span v-if="assignment.submissionStatus === 'submitted'" class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Submitted
                    </span>
                    <span v-else class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                      Pending
                    </span>
                  </div>
                </div>
                <span class="material-icons text-gray-400">chevron_right</span>
              </div>
            </div>
          </div>

          <div v-if="pendingAssignments.length === 0" class="text-center py-8 text-gray-500">
            <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-gray-400 text-2xl">assignment</span>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Pending Assignments</h3>
            <p class="text-gray-500">You're all caught up!</p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl border border-blue-100 p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-white rounded-classroom shadow-sm">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-green-600 text-lg">trending_up</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Performance</span>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">{{ averageGrade }}%</div>
                <div class="text-xs text-gray-500">Average</div>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 bg-white rounded-classroom shadow-sm">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-lg">check_circle</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Completed</span>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">{{ completedAssignments }}</div>
                <div class="text-xs text-gray-500">Assignments</div>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 bg-white rounded-classroom shadow-sm">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-orange-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-orange-600 text-lg">pending</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Pending</span>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">{{ pendingAssignments.length }}</div>
                <div class="text-xs text-gray-500">Assignments</div>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 bg-white rounded-classroom shadow-sm">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-purple-600 text-lg">person</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Attendance</span>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">{{ attendanceRate }}%</div>
                <div class="text-xs text-gray-500">Rate</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Deadlines -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Upcoming Deadlines</h2>
          
          <div class="space-y-3">
            <div 
              v-for="assignment in upcomingAssignments.slice(0, 3)"
              :key="assignment.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-classroom"
            >
              <div>
                <div class="text-sm font-medium text-gray-900">{{ assignment.title }}</div>
                <div class="text-xs text-gray-500">{{ formatDueDate(assignment.dueDate) }}</div>
              </div>
              <div class="text-right">
                <div class="text-xs font-medium" :class="getStatusClass(assignment)">
                  {{ assignment.submissionStatus === 'submitted' ? 'Submitted' : 'Due Soon' }}
                </div>
                <div class="text-xs text-gray-500">{{ assignment.points }} pts</div>
              </div>
            </div>
          </div>

          <div v-if="upcomingAssignments.length === 0" class="text-center py-4 text-gray-500">
            <span class="material-icons text-4xl opacity-50 mb-2">event_available</span>
            <p>No upcoming deadlines</p>
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
import {
  getInitials,
  getGreeting,
  getCountdownTime,
  formatDueDate,
  getPointsClass,
  safeLocalStorageGet,
  formatDate,
  formatTime
} from '../../utils/dashboardHelpers'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()
const postsStore = usePostsStore()

const loading = ref(false)
const error = ref(null)

const currentUser = computed(() => usersStore.currentUser)

function initials(name) {
  return getInitials(name)
}

// Enhanced computed properties
const enrolledClasses = computed(() => {
  if (!currentUser.value) return []
  return coursesStore.getCoursesForUser(currentUser.value.id)
})

const greetingMessage = computed(() => getGreeting())

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

// New computed properties for enhanced dashboard
const averageGrade = computed(() => {
  const gradedAssignments = assignmentsStore.assignments.filter(a => a.grade && a.submissionStatus === 'submitted')
  if (gradedAssignments.length === 0) return 0
  const total = gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0)
  return Math.round(total / gradedAssignments.length)
})

const attendanceRate = computed(() => {
  // Mock attendance rate - in real app this would come from attendance data
  return 95
})

const recentAnnouncements = computed(() => {
  // Load announcements from teacher
  const teacherAnnouncements = JSON.parse(localStorage.getItem('teacher:announcements') || '[]')
  
  // Also get from posts store
  const postAnnouncements = postsStore.posts
    .filter(post => post.type === 'announcement')
    .map(post => ({
      id: post.id,
      title: post.title || 'Announcement',
      content: post.content,
      courseId: post.courseId,
      createdAt: post.createdAt,
      author: post.authorName
    }))
  
  // Combine and sort
  const allAnnouncements = [...teacherAnnouncements, ...postAnnouncements]
  
  return allAnnouncements
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
const nextClassText = computed(() => {
  if (!nextClass.value) return 'No upcoming classes'
  const time = nextClass.value.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${time} - ${nextClass.value.name}`
})

// Utility functions
const getCourseName = (courseId) => {
  const course = coursesStore.getCourseById(courseId)
  return course?.name || 'Unknown Course'
}


const formatClassTime = (classItem) => {
  return classItem.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

const getStatusClass = (assignment) => {
  if (assignment.submissionStatus === 'submitted') {
    return 'text-green-600'
  } else {
    const dueDate = new Date(assignment.dueDate)
    const now = new Date()
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60)
    
    if (hoursUntilDue < 24) {
      return 'text-red-600'
    } else if (hoursUntilDue < 72) {
      return 'text-orange-600'
    } else {
      return 'text-blue-600'
    }
  }
}

const updateCountdown = () => {
  if (nextClass.value) {
    countdownTime.value = getCountdownTime(nextClass.value.startTime)
  }
}

let countdownInterval

const loadDashboardData = async () => {
  loading.value = true
  error.value = null
  
  try {
    await Promise.all([
      coursesStore.loadCourses(),
      assignmentsStore.loadAssignments(),
      postsStore.loadPosts()
    ])
    
    // Start countdown timer
    updateCountdown()
    if (countdownInterval) clearInterval(countdownInterval)
    countdownInterval = setInterval(updateCountdown, 60000) // Update every minute
  } catch (err) {
    error.value = 'Failed to load dashboard data. Please try again.'
    console.error('Error loading student data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
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

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
