<template>
  <div class="flex items-start space-x-3 p-3 bg-classroom-gray-50 rounded-classroom">
    <div class="w-8 h-8 bg-classroom-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
      <span class="material-icons text-classroom-primary text-sm">notifications</span>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-classroom-gray-900">
        <span class="font-medium">{{ entry.user }}</span>
        {{ entry.action }}
      </p>
      <p class="text-xs text-classroom-gray-500 mt-1">{{ entry.timestamp }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  entry: {
    type: Object,
    required: true,
    default: () => ({
      user: 'System',
      action: 'performed an action',
      timestamp: 'Just now'
    })
  }
})
</script>
