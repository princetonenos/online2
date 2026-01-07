<template>
  <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-all duration-300 animate-hover-lift animate-press">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
      </div>
      <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <span class="text-blue-600 text-lg">📊</span>
      </div>
    </div>
    <div class="mt-4 flex items-center space-x-2">
      <span class="text-sm text-gray-500">Last updated: just now</span>
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
