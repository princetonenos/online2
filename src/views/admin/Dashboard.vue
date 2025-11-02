<template>
  <div class="p-6 space-y-6">
    <admin-header :user="currentUser" />

    <!-- Top row: KPIs + quick actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <!-- KPI row -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <kpi-widget title="Total users" :value="stats.totalUsers" />
          <kpi-widget title="Active classes" :value="stats.activeClasses" />
          <kpi-widget title="Pending flags" :value="stats.flaggedAssignments" />
        </div>

        <!-- Trend chart placeholder -->
        <section class="bg-white rounded shadow p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-medium">Engagement (30d)</h3>
            <div class="text-sm text-gray-500">Last 30 days</div>
          </div>
          <div class="h-40 bg-gray-50 flex items-center justify-center text-gray-400">
            Chart placeholder (add Chart.js or Recharts)
          </div>
        </section>
      </div>

      <!-- Quick actions -->
      <aside class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <QuickActionCard icon="➕" title="Create class" subtitle="Live / Scheduled" @click="openCreateClass" />
          <QuickActionCard icon="👤" title="Create user" subtitle="Teacher / Student" @click="goCreateUser" />
          <QuickActionCard icon="🚩" title="Moderation" subtitle="Flagged items" @click="goModeration" />
          <QuickActionCard icon="📥" title="Export CSV" subtitle="Users/classes" @click="openExport" />
        </div>

        <!-- Pending strip -->
        <div class="bg-white p-3 rounded shadow space-y-2">
          <div class="text-sm text-gray-600">Pending</div>
          <div class="flex flex-col gap-2">
            <button class="text-left" @click="goModeration">🔴 Flagged assignments <span class="ml-2 text-xs text-gray-500">({{ stats.flaggedAssignments }})</span></button>
            <button class="text-left" @click="goEnrollments">🟠 Pending enrollments <span class="ml-2 text-xs text-gray-500">({{ stats.pendingEnrollments }})</span></button>
            <button class="text-left" @click="goUsers">🟢 New user requests <span class="ml-2 text-xs text-gray-500">({{ stats.pendingUsers }})</span></button>
          </div>
        </div>

        <!-- Quick search -->
        <div class="bg-white p-3 rounded shadow">
          <input v-model="quickSearch" @keydown.enter.prevent="runQuickSearch" placeholder="Jump to user / class id or name" class="w-full p-2 border rounded" />
          <div class="mt-2 flex gap-2">
            <button class="px-3 py-1 bg-gray-100 rounded" @click="runQuickSearch">Go</button>
            <button class="px-3 py-1 border rounded" @click="clearQuick">Clear</button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Middle: recent activity and users quick list -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section class="lg:col-span-2 bg-white rounded shadow p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium">Recent activity</h3>
          <button class="text-sm text-blue-600" @click="openLogs">View all</button>
        </div>

        <ul class="space-y-3">
          <li v-for="item in recent" :key="item.id" class="flex items-start justify-between">
            <div>
              <div class="text-sm"><strong>{{ item.actor }}</strong> {{ item.action }}</div>
              <div class="text-xs text-gray-500">{{ formatDate(item.timestamp) }}</div>
            </div>
            <div class="flex items-center gap-2">
              <button v-if="item.canUndo" class="text-sm text-red-600" @click="undo(item)">Undo</button>
            </div>
          </li>
        </ul>
      </section>

      <aside class="bg-white rounded shadow p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium">Top users</h3>
          <button class="text-sm text-blue-600" @click="goUsers">All</button>
        </div>

        <ul class="space-y-2">
          <li v-for="u in topUsers" :key="u.id" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-sm">{{ initials(u.name) }}</div>
              <div>
                <div class="text-sm">{{ u.name }}</div>
                <div class="text-xs text-gray-500">{{ u.role }}</div>
              </div>
            </div>
            <div>
              <button class="text-sm text-blue-600" @click="impersonate(u)">Impersonate</button>
            </div>
          </li>
        </ul>
      </aside>
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
import AdminHeader from '../../components/admin/AdminHeader.vue'
import KpiWidget from '../../components/admin/KPIWidget.vue'
import QuickActionCard from '../../components/admin/QuickActionCard.vue'
import QuickCreateClassModal from '../../components/admin/QuickCreateClassModal.vue'

const router = useRouter()
const usersStore = useAdminUsersStore()
const classesStore = useAdminClassesStore()

const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')

const stats = ref({ totalUsers: 0, activeClasses: 0, flaggedAssignments: 0, pendingEnrollments: 0, pendingUsers: 0 })
const recent = ref([])
const topUsers = ref([])
const quickSearch = ref('')
const createOpen = ref(false)

function loadData() {
  // load from stores / mock files; simulate API
  usersStore.fetchAll()
  classesStore.fetchAll()
  stats.value.totalUsers = usersStore.items.length
  stats.value.activeClasses = classesStore.items.filter(c=>c.status==='active').length
  stats.value.flaggedAssignments = 2 // read from adminReports in real impl
  stats.value.pendingEnrollments = 3
  stats.value.pendingUsers = usersStore.items.filter(u=>u.status==='pending').length

  recent.value = JSON.parse(localStorage.getItem('mock:adminRecent') || '[]').slice(0,6)
  topUsers.value = usersStore.items.slice(0,5)
}

onMounted(() => {
  // small delay to show skeletons if needed
  setTimeout(loadData, 200)
})

// routing helpers
function goUsers() { router.push({ name: 'AdminUsers' }) }
function goModeration() { router.push({ name: 'AdminAssignmentsModeration' }) }
function goEnrollments() { router.push({ name: 'AdminEnrollments' }) }
function openExport() { /* open export modal (not included) */ }
function goCreateUser() { router.push({ name: 'AdminUserCreate' }) }
function openCreateClass() { createOpen.value = true }
function handleClassCreated(payload) {
  classesStore.add(payload)
  createOpen.value = false
  loadData()
}

// utilities
function initials(name = '') { return name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() }
function formatDate(ts){ return new Date(ts).toLocaleString() }

function runQuickSearch() {
  const q = quickSearch.value.trim()
  if (!q) return
  // try class id
  const c = classesStore.findById(q) || usersStore.findById(q)
  if (c) {
    // route to appropriate detail
    const target = c.title ? { name: 'AdminClassDetail', params: { id: c.id }} : { name: 'AdminUserEdit', params: { id: c.id } }
    router.push(target)
  } else {
    // fallback: search by name
    const u = usersStore.items.find(x=>x.name.toLowerCase().includes(q.toLowerCase()))
    if (u) router.push({ name: 'AdminUserEdit', params: { id: u.id }})
    else alert('No match found')
  }
}
function clearQuick(){ quickSearch.value = '' }

// quick action: impersonate
function impersonate(user){
  if (!confirm(`Impersonate ${user.name}?`)) return
  const admin = JSON.parse(localStorage.getItem('mock:currentUser'))
  localStorage.setItem('mock:impersonatedBy', JSON.stringify(admin))
  localStorage.setItem('mock:currentUser', JSON.stringify(user))
  // route to the correct panel for user role
  router.push({ name: user.role === 'teacher' ? 'TeacherDashboard' : 'StudentDashboard' })
}
function undo(item){
  // very small optimistic example: remove last action
  alert('Undo not implemented in stub. Implement adminLogsStore.undo(item.id)')
}
</script>

<style scoped>
/* minimal; adapt to your tokens */
</style>
