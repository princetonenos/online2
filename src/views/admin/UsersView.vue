<template>
  <div class="p-6 max-w-7xl mx-auto" data-testid="page-users">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-medium text-classroom-gray-900">Users</h1>
        <p class="text-classroom-gray-600">Manage user accounts and permissions</p>
      </div>
      <div class="flex items-center space-x-3">
        <button class="btn-outline flex items-center space-x-2">
          <span class="material-icons text-lg">upload</span>
          <span>Import CSV</span>
        </button>
        <button class="btn-primary flex items-center space-x-2">
          <span class="material-icons text-lg">add</span>
          <span>Add User</span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-classroom classroom-shadow overflow-hidden">
      <!-- Filters and search -->
      <div class="p-4 border-b border-classroom-gray-100">
        <div class="flex items-center space-x-4">
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input
                type="text"
                placeholder="Search users..."
                class="w-full pl-10 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
              >
              <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-classroom-gray-400 text-lg">
                search
              </span>
            </div>
          </div>
          <select class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Teacher</option>
            <option>Student</option>
          </select>
          <select class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <!-- Users table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-classroom-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">User</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Email</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Role</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Last Active</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in users"
              :key="user.id"
              class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <img :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-full">
                  <div>
                    <p class="font-medium text-classroom-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-classroom-gray-500">{{ user.school }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-classroom-gray-900">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span class="chip text-xs" :class="getRoleClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-classroom-gray-500">{{ user.lastActive }}</td>
              <td class="px-4 py-3">
                <span class="chip text-xs" :class="user.status === 'active' ? 'chip-primary' : 'chip-gray'">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <button class="btn-outline text-xs px-2 py-1">Edit</button>
                  <button 
                    class="btn-outline text-xs px-2 py-1"
                    :class="user.status === 'active' ? 'text-red-600 border-red-600' : 'text-green-600 border-green-600'"
                  >
                    {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-classroom-gray-100 flex items-center justify-between">
        <p class="text-sm text-classroom-gray-500">Showing 1-6 of 42 users</p>
        <div class="flex items-center space-x-2">
          <button class="btn-outline text-sm px-3 py-1">Previous</button>
          <button class="btn-outline text-sm px-3 py-1 bg-classroom-primary text-white">1</button>
          <button class="btn-outline text-sm px-3 py-1">2</button>
          <button class="btn-outline text-sm px-3 py-1">3</button>
          <button class="btn-outline text-sm px-3 py-1">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock data for users
const users = ref([
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@school.edu',
    role: 'admin',
    school: 'Central High School',
    avatar: '/avatars/admin1.jpg',
    lastActive: '2 hours ago',
    status: 'active'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    role: 'teacher',
    school: 'Westside Academy',
    avatar: '/avatars/teacher1.jpg',
    lastActive: '1 hour ago',
    status: 'active'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@school.edu',
    role: 'teacher',
    school: 'Eastwood College',
    avatar: '/avatars/teacher2.jpg',
    lastActive: '5 hours ago',
    status: 'active'
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma.davis@school.edu',
    role: 'student',
    school: 'Central High School',
    avatar: '/avatars/student1.jpg',
    lastActive: '30 minutes ago',
    status: 'active'
  },
  {
    id: 5,
    name: 'Alex Wilson',
    email: 'alex.wilson@school.edu',
    role: 'student',
    school: 'Westside Academy',
    avatar: '/avatars/student2.jpg',
    lastActive: '3 hours ago',
    status: 'inactive'
  },
  {
    id: 6,
    name: 'Lisa Garcia',
    email: 'lisa.garcia@school.edu',
    role: 'teacher',
    school: 'Northridge Institute',
    avatar: '/avatars/teacher3.jpg',
    lastActive: '1 day ago',
    status: 'active'
  }
])

const getRoleClass = (role) => {
  const roleClasses = {
    admin: 'chip-primary',
    teacher: 'chip-secondary',
    student: 'chip-gray'
  }
  return roleClasses[role] || 'chip-gray'
}
</script>
