<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Users</h1>
      <router-link 
        to="/admin/users/create"
        class="btn-primary flex items-center space-x-2"
      >
        <span class="material-icons">add</span>
        <span>Create User</span>
      </router-link>
    </div>

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
        </div>
      </div>

      <div class="overflow-x-auto">
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
              v-for="user in filteredUsers"
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const users = ref([])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query)
  )
})

const getRoleClass = (role) => {
  switch (role) {
    case 'admin': return 'chip-primary'
    case 'teacher': return 'chip-secondary'
    case 'student': return 'chip-success'
    default: return 'chip-gray'
  }
}

const toggleUserStatus = (user) => {
  user.status = user.status === 'active' ? 'inactive' : 'active'
  // In a real app, this would update the store/API
  showToast(`User ${user.status === 'active' ? 'activated' : 'deactivated'}`)
}

onMounted(() => {
  // Load mock data
  setTimeout(() => {
    users.value = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@school.edu',
        role: 'teacher',
        school: 'Main Campus',
        status: 'active',
        avatar: '/avatars/teacher1.jpg'
      },
      {
        id: 2,
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@student.edu',
        role: 'student',
        school: 'Main Campus',
        status: 'active',
        avatar: '/avatars/student1.jpg'
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@school.edu',
        role: 'admin',
        school: 'Main Campus',
        status: 'active',
        avatar: '/avatars/admin1.jpg'
      }
    ]
  }, 300)
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
