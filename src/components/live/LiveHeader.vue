<template>
  <header class="w-full px-4 py-3 flex items-center justify-between">
    <div class="min-w-0">
      <h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">{{ meetingTitle }}</h1>
      <p v-if="subtitle" class="text-xs text-gray-500 mt-0.5">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-2">
      <span v-if="live" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">
        <span class="material-symbols-rounded text-[14px]">fiber_manual_record</span>
        Live
      </span>
      <div class="text-xs text-gray-500">{{ timeText }}</div>
    </div>
  </header>
</template>
<script setup>
const props = defineProps({
  meetingTitle: { type: String, default: 'Live Class' },
  subtitle: { type: String, default: '' },
  timeText: { type: String, default: '00:00:00' },
  live: { type: Boolean, default: true }
})
</script>
