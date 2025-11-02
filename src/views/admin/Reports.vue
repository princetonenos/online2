<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Reports</h1>
      <router-link 
        to="/admin/dashboard"
        class="btn-outline flex items-center space-x-2"
      >
        <span class="material-icons">arrow_back</span>
        <span>Back to Dashboard</span>
      </router-link>
    </div>

    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <p class="text-classroom-gray-600">Reports and analytics interface - Coming soon</p>
      <p class="text-sm text-classroom-gray-500 mt-2">View system-wide reports, analytics, and performance metrics.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const reports = ref([])

onMounted(() => {
  setTimeout(() => {
    reports.value = [
      { id: 1, name: 'User Activity Report', type: 'analytics', generatedAt: '2024-01-01' },
      { id: 2, name: 'Class Performance', type: 'performance', generatedAt: '2024-01-01' },
      { id: 3, name: 'System Usage', type: 'usage', generatedAt: '2024-01-01' }
    ]
  }, 300)
})
</script>
