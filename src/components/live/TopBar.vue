<template>
  <header class="w-full bg-gray-800 text-white border-b border-gray-700 px-3 sm:px-4 py-2 flex items-center justify-between" aria-label="Meeting header">
    <div class="flex items-center gap-2 sm:gap-3 min-w-0">
      <span class="material-icons text-blue-400" aria-hidden>videocam</span>
      <h1 class="truncate font-semibold text-sm sm:text-base">{{ meetingTitle }}</h1>
      <span v-if="isRecording" class="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px]" aria-label="Recording">
        <span class="material-icons text-[14px]" aria-hidden>fiber_manual_record</span>
        Recording
      </span>
    </div>
    <div class="flex items-center gap-3 text-xs sm:text-sm">
      <div class="text-gray-300" aria-label="Elapsed time">{{ elapsed }}</div>
      <div class="flex items-center gap-1 text-gray-300" aria-label="Participants count">
        <span class="material-icons text-[16px]" aria-hidden>people</span>
        <span>{{ participantsCount }}</span>
      </div>
    </div>
  </header>
</template>
<script setup>
const props = defineProps({
  meetingTitle: { type: String, default: 'Live Class' },
  elapsed: { type: String, default: '00:00' },
  participantsCount: { type: Number, default: 1 },
  isRecording: { type: Boolean, default: false }
})
</script>
