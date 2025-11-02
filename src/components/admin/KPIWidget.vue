<template>
  <div class="bg-white rounded-classroom classroom-shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-classroom-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-classroom-gray-900 mt-1">{{ value }}</p>
      </div>
      <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
        <span class="material-icons text-classroom-primary">analytics</span>
      </div>
    </div>
    <div class="mt-4 flex items-center space-x-2">
      <span class="text-sm text-classroom-gray-500">Last updated: just now</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  }
})
</script>
