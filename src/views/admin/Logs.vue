<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">System Logs</h1>
      <router-link 
        to="/admin/dashboard"
        class="btn-outline flex items-center space-x-2"
      >
        <span class="material-icons">arrow_back</span>
        <span>Back to Dashboard</span>
      </router-link>
    </div>

    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <p class="text-classroom-gray-600">System logs and audit trail interface - Coming soon</p>
      <p class="text-sm text-classroom-gray-500 mt-2">View system activity logs, user actions, and security events.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const logs = ref([])

onMounted(() => {
  setTimeout(() => {
    logs.value = [
      { id: 1, action: 'User login', user: 'admin@school.edu', timestamp: '2024-01-01 10:30:00' },
      { id: 2, action: 'Class created', user: 'sarah.johnson@school.edu', timestamp: '2024-01-01 09:15:00' },
      { id: 3, action: 'Assignment submitted', user: 'alex.rodriguez@student.edu', timestamp: '2024-01-01 08:45:00' }
    ]
  }, 300)
})
</script>
