<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Roles Management</h1>
      <router-link 
        to="/admin/dashboard"
        class="btn-outline flex items-center space-x-2"
      >
        <span class="material-icons">arrow_back</span>
        <span>Back to Dashboard</span>
      </router-link>
    </div>

    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <p class="text-classroom-gray-600">Roles management interface - Coming soon</p>
      <p class="text-sm text-classroom-gray-500 mt-2">Manage user roles and permissions across the platform.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const roles = ref([])

onMounted(() => {
  setTimeout(() => {
    roles.value = [
      { id: 1, name: 'Admin', permissions: ['all'], userCount: 2 },
      { id: 2, name: 'Teacher', permissions: ['manage_classes', 'create_assignments'], userCount: 15 },
      { id: 3, name: 'Student', permissions: ['view_classes', 'submit_assignments'], userCount: 120 }
    ]
  }, 300)
})
</script>
