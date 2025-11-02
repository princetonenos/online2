<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Enrollments</h1>
      <router-link 
        to="/admin/dashboard"
        class="btn-outline flex items-center space-x-2"
      >
        <span class="material-icons">arrow_back</span>
        <span>Back to Dashboard</span>
      </router-link>
    </div>

    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <p class="text-classroom-gray-600">Enrollments management interface - Coming soon</p>
      <p class="text-sm text-classroom-gray-500 mt-2">Manage student enrollments and class assignments across the platform.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const enrollments = ref([])

onMounted(() => {
  setTimeout(() => {
    enrollments.value = [
      { id: 1, studentName: 'Alex Rodriguez', className: 'Advanced Mathematics', status: 'enrolled' },
      { id: 2, studentName: 'Maria Garcia', className: 'Physics Fundamentals', status: 'pending' },
      { id: 3, studentName: 'James Wilson', className: 'Chemistry Basics', status: 'enrolled' }
    ]
  }, 300)
})
</script>
