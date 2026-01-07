<template>
  <div class="min-h-screen bg-classroom-gray-50 p-6">
    <!-- Enhanced Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-classroom-gray-900">
            Welcome, {{ currentUser?.name || 'Teacher' }}!
          </h1>
          <p class="text-classroom-gray-600 mt-2">Manage your classes, assignments, and student progress</p>
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
      <div class="bg-white classroom-shadow rounded-classroom p-4 cursor-pointer animate-hover-lift animate-press" @click="goToClasses">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Active Classes</p>
            <p class="text-2xl font-bold text-classroom-gray-900">{{ stats.activeClasses }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary text-lg">school</span>
          </div>
        </div>
      </div>

      <div class="bg-white classroom-shadow rounded-classroom p-4 cursor-pointer animate-hover-lift animate-press" @click="goToStudents">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Total Students</p>
            <p class="text-2xl font-bold text-classroom-gray-900">{{ stats.totalStudents }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-secondary text-lg">groups</span>
          </div>
        </div>
      </div>

      <div class="bg-white classroom-shadow rounded-classroom p-4 cursor-pointer animate-hover-lift animate-press" @click="goToAssignments">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Assignments</p>
            <p class="text-2xl font-bold text-classroom-gray-900">{{ stats.totalAssignments }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support text-lg">assignment</span>
          </div>
        </div>
      </div>

      <div class="bg-white classroom-shadow rounded-classroom p-4 cursor-pointer animate-hover-lift animate-press" @click="goToGrading">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Pending Grading</p>
            <p class="text-2xl font-bold text-classroom-gray-900">{{ stats.pendingGrading }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-lg">grading</span>
          </div>
        </div>
      </div>

      <div class="bg-white classroom-shadow rounded-classroom p-4 cursor-pointer animate-hover-lift animate-press" @click="goToAnalytics">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Avg. Progress</p>
            <p class="text-2xl font-bold text-classroom-gray-900">{{ stats.avgCompletion }}%</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-lg">trending_up</span>
          </div>
        </div>
      </div>

      <div class="bg-white classroom-shadow rounded-classroom p-4 cursor-pointer animate-hover-lift animate-press" @click="goToAttendance">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Attendance</p>
            <p class="text-2xl font-bold text-classroom-gray-900">{{ stats.attendanceRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-lg">person</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Left Column: Class Management & Quick Actions -->
      <div class="space-y-6">
        <!-- Class Management -->
        <section class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Class Management</h3>
            <button @click="goToClasses" class="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <button @click="openCreateClass" class="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div class="text-blue-600 text-lg">➕</div>
                <div class="text-sm font-medium">Create Class</div>
                <div class="text-xs text-gray-500">New session</div>
              </button>
              <button @click="openCreateAssignment" class="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div class="text-green-600 text-lg">📝</div>
                <div class="text-sm font-medium">New Assignment</div>
                <div class="text-xs text-gray-500">Create task</div>
              </button>
            </div>
            
            <!-- Active Classes Quick List -->
            <div class="mt-4">
              <h4 class="text-sm font-medium mb-2">Active Classes</h4>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <div v-for="classItem in activeClasses" :key="classItem.id" 
                     class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <div class="text-sm font-medium">{{ classItem.title }}</div>
                    <div class="text-xs text-gray-500">{{ classItem.students }} students</div>
                  </div>
                  <div class="flex gap-1">
                    <button @click="viewClass(classItem.id)" class="text-xs text-blue-600 hover:text-blue-800">View</button>
                    <button @click="manageClass(classItem.id)" class="text-xs text-green-600 hover:text-green-800">Manage</button>
                  </div>
                </div>
                <div v-if="activeClasses.length === 0" class="text-center text-sm text-gray-500 py-2">
                  No active classes
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Tools -->
        <section class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-4">Quick Tools</h3>
          <div class="grid grid-cols-2 gap-3">
            <button @click="startLiveClass" class="p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group relative">
              <div class="text-red-600 text-lg">🎥</div>
              <div class="text-sm font-medium">Start Live Class</div>
              <div class="text-xs text-gray-500">Video session</div>
              <div class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Live
              </div>
            </button>
            <button @click="goToGradebook" class="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div class="text-purple-600 text-lg">📊</div>
              <div class="text-sm font-medium">Gradebook</div>
              <div class="text-xs text-gray-500">View grades</div>
            </button>
            <button @click="goToAttendance" class="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <div class="text-orange-600 text-lg">📋</div>
              <div class="text-sm font-medium">Attendance</div>
              <div class="text-xs text-gray-500">Track presence</div>
            </button>
            <button @click="goToResources" class="p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
              <div class="text-teal-600 text-lg">📚</div>
              <div class="text-sm font-medium">Resources</div>
              <div class="text-xs text-gray-500">Materials</div>
            </button>
          </div>
        </section>
      </div>

      <!-- Middle Column: Upcoming & Recent Activity -->
      <div class="space-y-6">
        <!-- Upcoming Classes -->
        <section class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Upcoming Classes</h3>
            <button @click="goToCalendar" class="text-sm text-blue-600 hover:text-blue-800">View Calendar</button>
          </div>
          <ul class="space-y-3">
            <li v-for="classItem in upcomingClasses" :key="classItem.id" 
                class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="text-blue-600 text-sm font-medium">{{ formatTime(classItem.startAt) }}</span>
                </div>
                <div>
                  <div class="text-sm font-medium">{{ classItem.title }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(classItem.startAt) }}</div>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="viewClass(classItem.id)" class="text-xs text-blue-600 hover:text-blue-800">View</button>
                <button @click="joinClass(classItem.id)" class="text-xs text-green-600 hover:text-green-800">Join</button>
              </div>
            </li>
            <li v-if="upcomingClasses.length === 0" class="text-center text-sm text-gray-500 py-4">
              No upcoming classes
            </li>
          </ul>
        </section>

        <!-- Assignments Needing Grading -->
        <section class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Assignments Needing Grading</h3>
            <button @click="goToGrading" class="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <ul class="space-y-3">
            <li v-for="assignment in assignmentsNeedingGrading" :key="assignment.id" 
                class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <div class="text-sm font-medium">{{ assignment.title }}</div>
                <div class="text-xs text-gray-500">
                  Due: {{ formatDate(assignment.dueDate) }} • 
                  Submissions: {{ assignment.submissions }} • 
                  Graded: {{ assignment.graded }}/{{ assignment.submissions }}
                </div>
              </div>
              <button @click="gradeAssignment(assignment.id)" 
                      class="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600">
                Grade
              </button>
            </li>
            <li v-if="assignmentsNeedingGrading.length === 0" class="text-center text-sm text-gray-500 py-4">
              No assignments need grading
            </li>
          </ul>
        </section>

        <!-- Recent Student Activity -->
        <section class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Recent Student Activity</h3>
            <button @click="goToActivity" class="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <ul class="space-y-3">
            <li v-for="activity in recentActivity" :key="activity.id" 
                class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                {{ initials(activity.studentName) }}
              </div>
              <div class="flex-1">
                <div class="text-sm">
                  <span class="font-medium">{{ activity.studentName }}</span> {{ activity.action }}
                </div>
                <div class="text-xs text-gray-500">{{ formatTimeAgo(activity.timestamp) }}</div>
              </div>
            </li>
            <li v-if="recentActivity.length === 0" class="text-center text-sm text-gray-500 py-2">
              No recent activity
            </li>
          </ul>
        </section>
      </div>

      <!-- Right Column: Analytics & Quick Access -->
      <div class="space-y-6">
        <!-- Class Performance -->
        <section class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-4">Class Performance</h3>
          <div class="space-y-4">
            <div v-for="classPerf in classPerformance" :key="classPerf.id" 
                 class="flex items-center justify-between">
              <div class="flex-1">
                <div class="text-sm font-medium">{{ classPerf.name }}</div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-green-500 h-2 rounded-full" :style="{ width: classPerf.progress + '%' }"></div>
                </div>
              </div>
              <div class="text-sm font-medium ml-2">{{ classPerf.progress }}%</div>
            </div>
            <div v-if="classPerformance.length === 0" class="text-center text-sm text-gray-500 py-2">
              No performance data available
            </div>
          </div>
        </section>

        <!-- Quick Announcements -->
        <section class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-4">Quick Announcements</h3>
          <div class="space-y-3">
            <button @click="createAnnouncement" class="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div class="text-blue-500 text-lg">📢</div>
              <div class="text-sm font-medium">Create Announcement</div>
              <div class="text-xs text-gray-500">Share with students</div>
            </button>
            
            <div v-for="announcement in recentAnnouncements" :key="announcement.id" 
                 class="p-3 bg-blue-50 rounded-lg">
              <div class="text-sm font-medium">{{ announcement.title }}</div>
              <div class="text-xs text-gray-600 mt-1">{{ announcement.content }}</div>
              <div class="text-xs text-gray-500 mt-2">{{ formatTimeAgo(announcement.createdAt) }}</div>
            </div>
          </div>
        </section>

        <!-- Student Progress Alerts -->
        <section class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-4">Student Progress Alerts</h3>
          <div class="space-y-2">
            <div v-for="alert in studentAlerts" :key="alert.id" 
                 class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span class="text-red-600 text-xs">⚠️</span>
                </div>
                <div class="text-sm">{{ alert.studentName }} - {{ alert.message }}</div>
              </div>
              <button @click="viewStudent(alert.studentId)" class="text-xs text-blue-600 hover:text-blue-800">
                View
              </button>
            </div>
            <div v-if="studentAlerts.length === 0" class="text-center text-sm text-gray-500 py-2">
              No alerts
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Modals -->
    <CreateClassModal v-model:open="createOpen" @created="onClassCreated" />
    <CreateCourseModal v-model:open="createCourseOpen" @created="onCourseCreated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeacherClassesStore } from '../../stores/teacherClasses'
import CreateClassModal from '../../components/teacher/CreateClassModal.vue'
import CreateCourseModal from '../../components/teacher/CreateCourseModal.vue'
import {
  getInitials,
  formatDate,
  formatTime,
  formatTimeAgo,
  generateMockStats,
  safeLocalStorageGet
} from '../../utils/dashboardHelpers'

const router = useRouter()
const store = useTeacherClassesStore()

const currentUser = safeLocalStorageGet('mock:currentUser')
const createOpen = ref(false)
const createCourseOpen = ref(false)

function initials(name) {
  return getInitials(name)
}

// Enhanced stats with more comprehensive data
const stats = ref(generateMockStats('teacher'))

// Mock data for enhanced features
const activeClasses = computed(() => {
  return store.active().slice(0, 5).map(classItem => ({
    ...classItem,
    students: Math.floor(Math.random() * 30) + 10
  }))
})

const upcomingClasses = computed(() => store.upcoming(5))

const assignmentsNeedingGrading = computed(() => {
  return [
    { id: 1, title: 'Math Homework', dueDate: new Date(Date.now() + 86400000), submissions: 15, graded: 5 },
    { id: 2, title: 'Science Project', dueDate: new Date(Date.now() + 172800000), submissions: 22, graded: 10 }
  ]
})

const recentActivity = ref([
  { id: 1, studentName: 'John Smith', action: 'submitted Math Homework', timestamp: new Date(Date.now() - 1800000) },
  { id: 2, studentName: 'Sarah Johnson', action: 'completed Science Quiz', timestamp: new Date(Date.now() - 3600000) },
  { id: 3, studentName: 'Mike Davis', action: 'asked a question in Math Class', timestamp: new Date(Date.now() - 5400000) }
])

const classPerformance = ref([
  { id: 1, name: 'Math 101', progress: 85 },
  { id: 2, name: 'Science 202', progress: 72 },
  { id: 3, name: 'History 301', progress: 91 }
])

const recentAnnouncements = ref([
  { id: 1, title: 'Important Update', content: 'Class schedule changed for next week', createdAt: new Date(Date.now() - 86400000) },
  { id: 2, title: 'Assignment Reminder', content: 'Math homework due tomorrow', createdAt: new Date(Date.now() - 172800000) }
])

const studentAlerts = ref([
  { id: 1, studentId: 101, studentName: 'Alex Brown', message: 'Missing 3 assignments' },
  { id: 2, studentId: 102, studentName: 'Emma Wilson', message: 'Low attendance rate' }
])

// Enhanced loading function
async function load() {
  await store.fetchAll()
  
  stats.value.activeClasses = store.active().length
  stats.value.totalStudents = store.getStudents().length
  stats.value.totalAssignments = store.courses.length
  stats.value.pendingGrading = assignmentsNeedingGrading.value.reduce((acc, a) => acc + (a.submissions - a.graded), 0)
  stats.value.avgCompletion = store.avgCompletion()
}

onMounted(() => {
  load().catch(error => {
    console.error('Failed to load teacher dashboard:', error)
  })
})

// Enhanced navigation functions
function goToClasses() { router.push({ name: 'TeacherClasses' }) }
function goToStudents() { router.push({ name: 'TeacherStudents' }) }
function goToAssignments() { router.push({ name: 'TeacherAssignments' }) }
function goToCalendar() { router.push({ name: 'TeacherCalendar' }) }
function goToGrading() { router.push({ name: 'TeacherGrading' }) }
function goToAnalytics() { router.push({ name: 'TeacherAnalytics' }) }
function goToAttendance() { router.push('/teacher/students') } // Fallback to students
function goToGradebook() { router.push('/teacher/grading') } // Fallback to grading
function goToResources() { router.push('/teacher/classes') } // Fallback to classes
function goToCommunications() { router.push('/teacher/classes') } // Fallback to classes
function goToActivity() { router.push('/teacher/analytics') } // Fallback to analytics

function openCreateClass() { createOpen.value = true }
function openCreateAssignment() { router.push({ name: 'TeacherAssignmentCreate' }) }
function openCreateCourse() { createCourseOpen.value = true }

function onClassCreated(payload) {
  store.addClass(payload)
  createOpen.value = false
  load()
}

function onCourseCreated(payload) {
  store.addCourse(payload)
  createCourseOpen.value = false
  load()
}

function viewClass(id) { 
  router.push({ name: 'TeacherClassDetail', params: { id } }) 
}

function manageClass(id) { 
  router.push({ name: 'TeacherClassManagement', params: { id } }) 
}

function joinClass(id) { 
  router.push({ name: 'LiveSession', params: { id } }) 
}

function gradeAssignment(id) { 
  router.push({ name: 'TeacherAssignmentGrade', params: { id } }) 
}

function viewStudent(studentId) { 
  router.push({ name: 'TeacherStudentDetail', params: { id: studentId } }) 
}

function createAnnouncement() {
  router.push({ name: 'TeacherAnnouncementCreate' })
}

function startLiveClass() {
  // Get the first active class or create a default one
  const activeClass = activeClasses.value[0] || { id: 1, title: 'Live Class Session' }
  router.push({ name: 'LiveSession', params: { id: activeClass.id } })
}

const nextClassText = computed(() => {
  const next = store.upcoming(1)[0]
  return next ? `${formatTime(next.startAt)} - ${next.title}` : 'No upcoming classes'
})
</script>

<style scoped>
.quick-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0,1fr));
}
</style>
