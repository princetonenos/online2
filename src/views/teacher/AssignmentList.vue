<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Assignments</h1>
      <button 
        @click="createAssignment"
        class="btn-primary flex items-center space-x-2"
      >
        <span class="material-icons text-lg">add</span>
        <span>Create Assignment</span>
      </button>
    </div>

    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <div class="text-center py-12 text-classroom-gray-500">
        <span class="material-icons text-4xl mb-2 opacity-50">assignment</span>
        <p>Assignment management would be implemented here</p>
        <p class="text-sm">Create, filter, and manage assignments across all classes</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const createAssignment = () => {
  router.push('/teacher/assignments/create')
}
</script>
