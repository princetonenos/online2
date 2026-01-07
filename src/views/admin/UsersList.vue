<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Users</h1>
      <div class="flex items-center space-x-3">
        <button
          @click="exportUsers"
          class="btn-outline flex items-center space-x-2"
        >
          <span class="material-icons">download</span>
          <span>Export</span>
        </button>
        <router-link 
          to="/admin/users/create"
          class="btn-primary flex items-center space-x-2"
        >
          <span class="material-icons">add</span>
          <span>Create User</span>
        </router-link>
      </div>
    </div>

    <!-- Error Alert -->
    <ErrorAlert 
      :error="error" 
      :retry="true"
      @dismiss="error = null"
      @retry="loadUsers"
    />

    <div class="bg-white rounded-classroom classroom-shadow">
      <div class="p-4 border-b border-classroom-gray-100">
        <div class="flex items-center space-x-4">
          <div class="relative flex-1 max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="w-full pl-10 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
            >
            <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-classroom-gray-400">
              search
            </span>
          </div>
          <select
            v-model="roleFilter"
            class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" message="Loading users..." />

      <!-- Users Table -->
      <div v-else-if="!loading && paginatedUsers.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-classroom-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">User</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Role</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">School</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in paginatedUsers"
              :key="user.id"
              class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <img :src="user.avatar" :alt="user.name" class="w-8 h-8 rounded-full">
                  <div>
                    <p class="font-medium text-classroom-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-classroom-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="chip" :class="getRoleClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3 text-classroom-gray-900">{{ user.school || 'N/A' }}</td>
              <td class="px-4 py-3">
                <span class="chip" :class="user.status === 'active' ? 'chip-success' : 'chip-warning'">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <router-link 
                    :to="`/admin/users/${user.id}/edit`"
                    class="btn-outline text-xs px-2 py-1"
                  >
                    Edit
                  </router-link>
                  <button 
                    @click="toggleUserStatus(user)"
                    class="btn-outline text-xs px-2 py-1"
                    :class="user.status === 'active' ? 'text-red-600' : 'text-green-600'"
                  >
                    {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="p-12 text-center">
        <span class="material-icons text-6xl text-classroom-gray-300 mb-4">people_outline</span>
        <p class="text-classroom-gray-500">No users found</p>
      </div>

      <!-- Pagination -->
      <PaginationControls
        v-if="!loading && filteredUsers.length > 0"
        :current-page="pagination.currentPage.value"
        :total-pages="pagination.totalPages.value"
        :total-items="pagination.totalItems.value"
        :start-index="pagination.startIndex.value"
        :end-index="pagination.endIndex.value"
        :page-numbers="pagination.pageNumbers.value"
        :has-next-page="pagination.hasNextPage.value"
        :has-previous-page="pagination.hasPreviousPage.value"
        @previous="pagination.previousPage"
        @next="pagination.nextPage"
        @goto="pagination.goToPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { useAuditLogStore } from '@/stores/auditLog'
import { useUsersStore } from '@/store/users'
import { exportToCSV } from '@/utils/exportHelpers'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import PaginationControls from '@/components/PaginationControls.vue'

const searchQuery = ref('')
const roleFilter = ref('')
const loading = ref(false)
const error = ref(null)

const auditStore = useAuditLogStore()
const usersStore = useUsersStore()

const allUsers = computed(() => usersStore.users)

const filteredUsers = computed(() => {
  let filtered = allUsers.value || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    )
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  return filtered
})

const pagination = usePagination(10)
const paginatedUsers = computed(() => pagination.paginate(filteredUsers.value))

const getRoleClass = (role) => {
  switch (role) {
    case 'admin': return 'chip-primary'
    case 'teacher': return 'chip-secondary'
    case 'student': return 'chip-success'
    default: return 'chip-gray'
  }
}

const toggleUserStatus = async (user) => {
  const previousStatus = user.status
  const updated = user.status === 'active' ? 'inactive' : 'active'
  
  try {
    await usersStore.updateUser(user.id, { status: updated })
    auditStore.logUserUpdated(user.id, { status: { from: previousStatus, to: updated } })
    showToast(`User ${updated === 'active' ? 'activated' : 'deactivated'}`)
  } catch (err) {
    error.value = 'Failed to update user status'
  }
}

const loadUsers = async () => {
  loading.value = true
  error.value = null
  try {
    await usersStore.loadFromStorage()
  } catch (err) {
    error.value = 'Failed to load users. Please try again.'
    console.error('Error loading users:', err)
  } finally {
    loading.value = false
  }
}

const exportUsers = () => {
  try {
    const exportData = filteredUsers.value.map(user => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      School: user.school || 'N/A',
      Status: user.status
    }))

    exportToCSV(exportData, 'users-export.csv')
    auditStore.logDataExport('users', exportData.length)
    showToast('Users exported successfully')
  } catch (err) {
    error.value = 'Failed to export users'
  }
}

onMounted(() => {
  loadUsers()
})

const showToast = (message) => {
  if (window.showToast) window.showToast(message)
}
</script>
