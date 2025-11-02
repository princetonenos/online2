<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Admin Settings</h1>
      <router-link 
        to="/admin/dashboard"
        class="btn-outline flex items-center space-x-2"
      >
        <span class="material-icons">arrow_back</span>
        <span>Back to Dashboard</span>
      </router-link>
    </div>

    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <p class="text-classroom-gray-600">Administrative settings interface - Coming soon</p>
      <p class="text-sm text-classroom-gray-500 mt-2">Configure system-wide settings, preferences, and administrative controls.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const settings = ref([])

onMounted(() => {
  setTimeout(() => {
    settings.value = [
      { id: 1, name: 'System Preferences', category: 'general' },
      { id: 2, name: 'Security Settings', category: 'security' },
      { id: 3, name: 'Notification Preferences', category: 'notifications' }
    ]
  }, 300)
})
</script>
