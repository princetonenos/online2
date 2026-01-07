<template>
  <div class="p-6 space-y-6">
    <admin-header :user="currentUser" />

    <!-- Enhanced KPI Dashboard -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      <kpi-widget title="Total Users" :value="stats.totalUsers" :trend="stats.userTrend" />
      <kpi-widget title="Active Classes" :value="stats.activeClasses" :trend="stats.classTrend" />
      <kpi-widget title="System Health" :value="stats.systemHealth" suffix="%" />
      <kpi-widget title="Avg. Engagement" :value="stats.avgEngagement" suffix="%" />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Left Column: Class Management & Quick Actions -->
      <div class="space-y-6">
        <!-- Class Management -->
        <section class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Class Managements</h3>
            <button @click="goClasses" class="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <button @click="openCreateClass" class="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div class="text-blue-600 text-lg">➕</div>
                <div class="text-sm font-medium">Create Class</div>
                <div class="text-xs text-gray-500">New session</div>
              </button>
              <button @click="goClassTemplates" class="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div class="text-green-600 text-lg">📋</div>
                <div class="text-sm font-medium">Templates</div>
                <div class="text-xs text-gray-500">Reuse layouts</div>
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
                    <div class="text-xs text-gray-500">{{ classItem.teacherName }}</div>
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

        <!-- System Tools -->
        <section class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-4">System Tools</h3>
          <div class="grid grid-cols-2 gap-3">
            <button @click="goBulkOperations" class="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div class="text-purple-600 text-lg">📦</div>
              <div class="text-sm font-medium">Bulk Ops</div>
              <div class="text-xs text-gray-500">Import/Export</div>
            </button>
            <button @click="goSystemSettings" class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="text-gray-600 text-lg">⚙️</div>
              <div class="text-sm font-medium">Settings</div>
              <div class="text-xs text-gray-500">System config</div>
            </button>
            <button @click="goAnalytics" class="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <div class="text-orange-600 text-lg">📊</div>
              <div class="text-sm font-medium">Analytics</div>
              <div class="text-xs text-gray-500">Usage stats</div>
            </button>
            <button @click="goBackup" class="p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <div class="text-red-600 text-lg">💾</div>
              <div class="text-sm font-medium">Backup</div>
              <div class="text-xs text-gray-500">Data safety</div>
            </button>
          </div>
        </section>
      </div>

      <!-- Middle Column: User Management & Recent Activity -->
      <div class="space-y-6">
        <!-- User Management -->
        <section class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">User Management</h3>
            <button @click="goUsers" class="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <button @click="goCreateUser" class="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div class="text-blue-600 text-lg">👤</div>
              <div class="text-sm font-medium">Create User</div>
              <div class="text-xs text-gray-500">Teacher/Student</div>
            </button>
            <button @click="goBulkOperations" class="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div class="text-green-600 text-lg">👥</div>
              <div class="text-sm font-medium">Bulk Import</div>
              <div class="text-xs text-gray-500">CSV upload</div>
            </button>
          </div>

          <!-- User Quick Stats -->
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2 bg-gray-50 rounded">
              <div class="text-sm font-medium text-gray-600">Teachers</div>
              <div class="text-lg font-bold">{{ stats.teacherCount }}</div>
            </div>
            <div class="p-2 bg-gray-50 rounded">
              <div class="text-sm font-medium text-gray-600">Students</div>
              <div class="text-lg font-bold">{{ stats.studentCount }}</div>
            </div>
            <div class="p-2 bg-gray-50 rounded">
              <div class="text-sm font-medium text-gray-600">Admins</div>
              <div class="text-lg font-bold">{{ stats.adminCount }}</div>
            </div>
          </div>
        </section>

        <!-- Recent Activity -->
        <section class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Recent Activity</h3>
            <button @click="openLogs" class="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <ul class="space-y-3">
            <li v-for="item in recent" :key="item.id" class="flex items-start justify-between">
              <div>
                <div class="text-sm"><strong>{{ item.actor }}</strong> {{ item.action }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(item.timestamp) }}</div>
              </div>
              <div class="flex items-center gap-2">
                <button v-if="item.canUndo" @click="undo(item)" class="text-xs text-red-600 hover:text-red-800">Undo</button>
              </div>
            </li>
            <li v-if="recent.length === 0" class="text-center text-sm text-gray-500 py-2">
              No recent activity
            </li>
          </ul>
        </section>
      </div>

      <!-- Right Column: System Health & Quick Access -->
      <div class="space-y-6">
        <!-- System Health -->
        <section class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-4">System Health</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm">Server Status</span>
              <span class="text-sm font-medium" :class="stats.serverStatus === 'Online' ? 'text-green-600' : 'text-red-600'">
                {{ stats.serverStatus }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm">Database</span>
              <span class="text-sm font-medium" :class="stats.dbStatus === 'Connected' ? 'text-green-600' : 'text-red-600'">
                {{ stats.dbStatus }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm">Storage Usage</span>
              <span class="text-sm font-medium">{{ stats.storageUsage }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm">Active Sessions</span>
              <span class="text-sm font-medium">{{ stats.activeSessions }}</span>
            </div>
          </div>
        </section>

        <!-- Password Reset Requests -->
        <section class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Password Reset Requests</h3>
            <button @click="viewResetRequests" class="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div class="space-y-2">
            <div v-for="request in pendingResetRequests" :key="request.id" 
                 class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{{ request.email }}</div>
                <div class="text-xs text-gray-500">{{ formatTimeAgo(request.timestamp) }}</div>
              </div>
              <div class="flex gap-1">
                <button @click="markResetComplete(request.id)" 
                        class="text-xs text-green-600 hover:text-green-800"
                        title="Mark as completed">
                  ✓
                </button>
              </div>
            </div>
            <div v-if="pendingResetRequests.length === 0" class="text-center text-sm text-gray-500 py-2">
              No pending requests
            </div>
          </div>
        </section>

        <!-- Quick Access -->
        <section class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-4">Quick Access</h3>
          <div class="space-y-2">
            <button @click="goModeration" class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div class="flex items-center gap-2">
                <span>🚩</span>
                <span class="text-sm">Content Moderation</span>
              </div>
              <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded" v-if="stats.flaggedAssignments > 0">
                {{ stats.flaggedAssignments }}
              </span>
            </button>
            <button @click="goEnrollments" class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div class="flex items-center gap-2">
                <span>📋</span>
                <span class="text-sm">Enrollments</span>
              </div>
              <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded" v-if="stats.pendingEnrollments > 0">
                {{ stats.pendingEnrollments }}
              </span>
            </button>
            <button @click="goReports" class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div class="flex items-center gap-2">
                <span>📈</span>
                <span class="text-sm">Reports</span>
              </div>
            </button>
            <button @click="goAuditLogs" class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div class="flex items-center gap-2">
                <span>📝</span>
                <span class="text-sm">Audit Logs</span>
              </div>
            </button>
          </div>
        </section>

        <!-- Quick Search -->
        <section class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-3">Quick Search</h3>
          <input v-model="quickSearch" @keydown.enter.prevent="runQuickSearch" 
                 placeholder="Search users, classes, or content..." 
                 class="w-full p-2 border rounded-lg mb-2" />
          <div class="flex gap-2">
            <button @click="runQuickSearch" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Search
            </button>
            <button @click="clearQuick" class="px-3 py-2 border rounded-lg hover:bg-gray-50">
              Clear
            </button>
          </div>
        </section>
      </div>
    </div>

    <!-- Quick create modal -->
    <QuickCreateClassModal v-model:open="createOpen" @created="handleClassCreated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminUsersStore } from '../../stores/adminUsers'
import { useAdminClassesStore } from '../../stores/adminClasses'
import { useAuth } from '../../store/auth'
import AdminHeader from '../../components/admin/AdminHeader.vue'
import KpiWidget from '../../components/admin/KPIWidget.vue'
import QuickCreateClassModal from '../../components/admin/QuickCreateClassModal.vue'
import {
  getInitials,
  formatDate,
  generateMockStats,
  safeLocalStorageGet,
  safeLocalStorageSet
} from '../../utils/dashboardHelpers'

const router = useRouter()
const usersStore = useAdminUsersStore()
const classesStore = useAdminClassesStore()
const auth = useAuth()

const currentUser = safeLocalStorageGet('mock:currentUser')

// Enhanced stats with more comprehensive data
const stats = ref(generateMockStats('admin'))

const recent = ref([])
const quickSearch = ref('')
const createOpen = ref(false)

// Computed properties
const activeClasses = computed(() => {
  return classesStore.items
    .filter(c => c.status === 'active')
    .slice(0, 5)
    .map(classItem => ({
      ...classItem,
      teacherName: usersStore.items.find(u => u.id === classItem.teacherId)?.name || 'Unknown'
    }))
})

function loadData() {
  // Load from stores / mock files; simulate API
  usersStore.fetchAll()
  classesStore.fetchAll()
  
  const users = usersStore.items
  const classes = classesStore.items
  
  stats.value.totalUsers = users.length
  stats.value.activeClasses = classes.filter(c => c.status === 'active').length
  stats.value.flaggedAssignments = classes.filter(c => c.flagged).length
  stats.value.pendingEnrollments = classes.reduce((acc, c) => acc + (c.pendingEnrollments || 0), 0)
  stats.value.pendingUsers = users.filter(u => u.status === 'pending').length
  
  // User breakdown
  stats.value.teacherCount = users.filter(u => u.role === 'teacher').length
  stats.value.studentCount = users.filter(u => u.role === 'student').length
  stats.value.adminCount = users.filter(u => u.role === 'admin').length

  // Mock recent activity
  recent.value = JSON.parse(localStorage.getItem('mock:adminRecent') || '[]').slice(0, 6)
  if (recent.value.length === 0) {
    // Generate some mock recent activity if none exists
    recent.value = [
      { id: 1, actor: 'System', action: 'System backup completed', timestamp: new Date().toISOString(), canUndo: false },
      { id: 2, actor: 'Admin User', action: 'Created new class template', timestamp: new Date(Date.now() - 3600000).toISOString(), canUndo: true },
      { id: 3, actor: 'Teacher Smith', action: 'Published new assignment', timestamp: new Date(Date.now() - 7200000).toISOString(), canUndo: false }
    ]
  }
}

onMounted(() => {
  setTimeout(loadData, 200)
})

// Enhanced navigation functions
function goUsers() { router.push({ name: 'AdminUsers' }) }
function goClasses() { router.push({ name: 'AdminClassesList' }) }
function goModeration() { router.push({ name: 'AdminAssignmentsModeration' }) }
function goEnrollments() { router.push({ name: 'AdminEnrollments' }) }
function goReports() { router.push({ name: 'AdminReports' }) }
function goAuditLogs() { router.push({ name: 'AdminLogs' }) }
function goCreateUser() { router.push({ name: 'AdminUserCreate' }) }
function goUserBulk() { router.push({ name: 'AdminUserBulkImport' }) }
function goClassTemplates() { router.push({ name: 'AdminClassTemplates' }) }
function goBulkOperations() { router.push({ name: 'AdminBulkOperations' }) }
function goSystemSettings() { router.push({ name: 'AdminSettings' }) }
function goAnalytics() { router.push({ name: 'AdminAnalytics' }) }
function goBackup() { router.push({ name: 'AdminBackup' }) }
function openLogs() { router.push({ name: 'AdminLogs' }) }

function openCreateClass() { createOpen.value = true }
function handleClassCreated(payload) {
  classesStore.add(payload)
  createOpen.value = false
  loadData()
}

function viewClass(id) { 
  router.push({ name: 'AdminClassDetail', params: { id } }) 
}

function manageClass(id) { 
  router.push({ name: 'AdminClassManagement', params: { id } }) 
}


function runQuickSearch() {
  const q = quickSearch.value.trim()
  if (!q) return
  
  // Try class ID or user ID first
  const c = classesStore.findById(q) || usersStore.findById(q)
  if (c) {
    const target = c.title ? 
      { name: 'AdminClassDetail', params: { id: c.id }} : 
      { name: 'AdminUserEdit', params: { id: c.id } }
    router.push(target)
  } else {
    // Fallback: search by name
    const user = usersStore.items.find(x => x.name.toLowerCase().includes(q.toLowerCase()))
    if (user) {
      router.push({ name: 'AdminUserEdit', params: { id: user.id }})
    } else {
      const classItem = classesStore.items.find(x => x.title.toLowerCase().includes(q.toLowerCase()))
      if (classItem) {
        router.push({ name: 'AdminClassDetail', params: { id: classItem.id }})
      } else {
        alert('No match found for: ' + q)
      }
    }
  }
}

function clearQuick() { 
  quickSearch.value = '' 
}

// Password reset request functions
const pendingResetRequests = computed(() => {
  return auth.pendingResetRequests.slice(0, 5)
})

function formatTimeAgo(timestamp) {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

async function markResetComplete(requestId) {
  try {
    await auth.markResetRequestComplete(requestId)
    // Reload data to refresh the list
    loadData()
  } catch (error) {
    console.error('Failed to mark reset request as complete:', error)
    alert('Failed to update request status')
  }
}

function viewResetRequests() {
  // Navigate to a dedicated reset requests page (could be implemented later)
  alert('Password reset requests management page would open here')
}

function undo(item) {
  // Simple undo implementation - in real app, this would call an API
  recent.value = recent.value.filter(r => r.id !== item.id)
  alert(`Undid action: ${item.action}`)
}
</script>

<style scoped>
/* minimal; adapt to your tokens */
</style>
