<template>
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-medium text-classroom-gray-900">Admin Dashboard</h1>
      <p class="text-classroom-gray-600">System administration and management</p>
    </div>
    <div class="flex items-center space-x-4">
      <div class="text-right">
        <p class="text-sm text-classroom-gray-500">Welcome back,</p>
        <p class="font-medium text-classroom-gray-900">{{ currentUser?.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUsersStore } from '../../store/users'

const usersStore = useUsersStore()
const currentUser = computed(() => usersStore.currentUser)
</script>
