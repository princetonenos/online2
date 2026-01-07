<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Enhanced Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, {{ currentUser?.name || 'Teacher' }}!
          </h1>
          <p class="text-gray-600 mt-2">Manage your classes, assignments, and student progress</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <div class="text-sm text-gray-500">Next class</div>
            <div class="text-base font-medium text-gray-900">{{ nextClassText }}</div>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {{ initials(currentUser?.name) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced KPI Dashboard -->
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="goToClasses">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Active Classes</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeClasses }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-lg">school</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="goToStudents">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Students</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalStudents }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-lg">groups</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="goToAssignments">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Assignments</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalAssignments }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-purple-600 text-lg">assignment</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="goToGrading">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Pending Grading</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingGrading }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-lg">grading</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="goToAnalytics">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Avg. Progress</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.avgCompletion }}%</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-lg">trending_up</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300" @click="goToAttendance">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Attendance</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.attendanceRate }}%</p>
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
            <button @click="goToCommunications" class="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              <div class="text-indigo-600 text-lg">💬</div>
              <div class="text-sm font-medium">Messages</div>
              <div class="text-xs text-gray-500">Communicate</div>
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
            <button 
              type="button"
              @click.prevent="openAnnouncementModal" 
              class="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div class="text-blue-500 text-lg">📢</div>
              <div class="text-sm font-medium">Create Announcement</div>
              <div class="text-xs text-gray-500">Share with students</div>
            </button>
            
            <div v-for="announcement in recentAnnouncements" :key="announcement.id" 
                 class="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900">{{ announcement.title }}</div>
                  <div class="text-xs text-gray-600 mt-1">{{ announcement.content }}</div>
                  <div class="flex items-center gap-2 mt-2">
                    <div class="text-xs text-gray-500">{{ formatTimeAgo(announcement.createdAt) }}</div>
                    <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {{ announcement.targetClass || 'All Classes' }}
                    </span>
                  </div>
                </div>
                <button @click="deleteAnnouncement(announcement.id)" 
                        class="text-red-500 hover:text-red-700 ml-2"
                        title="Delete announcement">
                  <span class="material-icons text-sm">delete</span>
                </button>
              </div>
            </div>
            
            <div v-if="recentAnnouncements.length === 0" class="text-center text-sm text-gray-500 py-4">
              No announcements yet. Create one to share with your students!
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
    
    <!-- Announcement Modal -->
    <Teleport to="body">
      <div v-if="announcementModalOpen" 
           class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
           @click.self="closeAnnouncementModal">
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Create Announcement</h2>
              <p class="text-sm text-gray-500 mt-1">Share important updates with your students</p>
            </div>
            <button @click="closeAnnouncementModal" 
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <span class="material-icons text-gray-500">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-4">
            <!-- Title Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Announcement Title *
              </label>
              <input 
                v-model="newAnnouncement.title"
                type="text" 
                placeholder="e.g., Important Update, Homework Reminder"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': announcementErrors.title }"
              />
              <p v-if="announcementErrors.title" class="text-xs text-red-500 mt-1">
                {{ announcementErrors.title }}
              </p>
            </div>

            <!-- Content Textarea -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message Content *
              </label>
              <textarea 
                v-model="newAnnouncement.content"
                rows="5" 
                placeholder="Write your announcement message here..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                :class="{ 'border-red-500': announcementErrors.content }"
              ></textarea>
              <div class="flex items-center justify-between mt-1">
                <p v-if="announcementErrors.content" class="text-xs text-red-500">
                  {{ announcementErrors.content }}
                </p>
                <p class="text-xs text-gray-500 ml-auto">
                  {{ newAnnouncement.content.length }}/500 characters
                </p>
              </div>
            </div>

            <!-- Target Class Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Send To
              </label>
              <select 
                v-model="newAnnouncement.targetClass"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Classes</option>
                <option v-for="classItem in activeClasses" :key="classItem.id" :value="classItem.title">
                  {{ classItem.title }}
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                Select a specific class or send to all your classes
              </p>
            </div>

            <!-- Priority Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div class="flex gap-2">
                <button 
                  v-for="priority in ['low', 'normal', 'high']" 
                  :key="priority"
                  @click="newAnnouncement.priority = priority"
                  class="flex-1 px-4 py-2 rounded-lg border-2 transition-all capitalize"
                  :class="newAnnouncement.priority === priority 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' 
                    : 'border-gray-300 hover:border-gray-400'"
                >
                  {{ priority }}
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div class="text-sm text-gray-500">
              <span class="material-icons text-sm align-middle">info</span>
              Students will receive a notification
            </div>
            <div class="flex gap-3">
              <button 
                @click="closeAnnouncementModal"
                class="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="submitAnnouncement"
                :disabled="!canSubmitAnnouncement"
                class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
              >
                <span class="material-icons text-sm">send</span>
                Post Announcement
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeacherClassesStore } from '../../stores/teacherClasses'
import KpiWidget from '../../components/admin/KPIWidget.vue'
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
const announcementModalOpen = ref(false)

// Announcement state
const newAnnouncement = ref({
  title: '',
  content: '',
  targetClass: '',
  priority: 'normal'
})

const announcementErrors = ref({
  title: '',
  content: ''
})

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

// Load announcements from localStorage or use defaults
const recentAnnouncements = ref(
  JSON.parse(localStorage.getItem('teacher:announcements') || '[]').length > 0
    ? JSON.parse(localStorage.getItem('teacher:announcements') || '[]')
    : [
        { 
          id: 1, 
          title: 'Important Update', 
          content: 'Class schedule changed for next week', 
          targetClass: 'Math 101',
          priority: 'high',
          createdAt: new Date(Date.now() - 86400000).toISOString() 
        },
        { 
          id: 2, 
          title: 'Assignment Reminder', 
          content: 'Math homework due tomorrow', 
          targetClass: '',
          priority: 'normal',
          createdAt: new Date(Date.now() - 172800000).toISOString() 
        }
      ]
)

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

onMounted(load)

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

// Announcement functions
function openAnnouncementModal() {
  announcementModalOpen.value = true
  // Reset form
  newAnnouncement.value = {
    title: '',
    content: '',
    targetClass: '',
    priority: 'normal'
  }
  announcementErrors.value = {
    title: '',
    content: ''
  }
}

function closeAnnouncementModal() {
  announcementModalOpen.value = false
}

const canSubmitAnnouncement = computed(() => {
  return newAnnouncement.value.title.trim().length > 0 && 
         newAnnouncement.value.content.trim().length > 0 &&
         newAnnouncement.value.content.length <= 500
})

function validateAnnouncement() {
  let isValid = true
  announcementErrors.value = { title: '', content: '' }
  
  if (!newAnnouncement.value.title.trim()) {
    announcementErrors.value.title = 'Title is required'
    isValid = false
  }
  
  if (!newAnnouncement.value.content.trim()) {
    announcementErrors.value.content = 'Message content is required'
    isValid = false
  } else if (newAnnouncement.value.content.length > 500) {
    announcementErrors.value.content = 'Message must be 500 characters or less'
    isValid = false
  }
  
  return isValid
}

function submitAnnouncement() {
  if (!validateAnnouncement()) {
    return
  }
  
  const announcement = {
    id: Date.now(),
    title: newAnnouncement.value.title.trim(),
    content: newAnnouncement.value.content.trim(),
    targetClass: newAnnouncement.value.targetClass || 'All Classes',
    priority: newAnnouncement.value.priority,
    createdAt: new Date().toISOString(),
    author: currentUser?.name || 'Teacher'
  }
  
  // Add to beginning of array
  recentAnnouncements.value.unshift(announcement)
  
  // Save to localStorage
  localStorage.setItem('teacher:announcements', JSON.stringify(recentAnnouncements.value))
  
  // Show success message
  if (window.showToast) {
    window.showToast(`Announcement "${announcement.title}" posted successfully!`)
  }
  
  // Close modal
  closeAnnouncementModal()
}

function deleteAnnouncement(id) {
  if (confirm('Are you sure you want to delete this announcement?')) {
    recentAnnouncements.value = recentAnnouncements.value.filter(a => a.id !== id)
    localStorage.setItem('teacher:announcements', JSON.stringify(recentAnnouncements.value))
    
    if (window.showToast) {
      window.showToast('Announcement deleted successfully!')
    }
  }
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
