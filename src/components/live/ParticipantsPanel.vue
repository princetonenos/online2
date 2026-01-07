<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-full">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold text-gray-900">Meeting Participants ({{ participants.length }})</h3>
      <button class="text-gray-400 hover:text-gray-600"><span class="material-symbols-rounded">more_horiz</span></button>
    </div>
    <div class="space-y-2 overflow-y-auto max-h-[42vh] pr-1">
      <div v-for="p in participants" :key="p.id" class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
        <div class="flex items-center gap-3 min-w-0">
          <img :src="p.avatarUrl || '/avatars/user-default.jpg'" class="w-8 h-8 rounded-full object-cover" alt="" />
          <div class="truncate">
            <div class="text-sm text-gray-900 truncate">{{ p.name }}</div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-gray-500">
          <span class="material-symbols-rounded text-[18px]" :class="p.audio ? 'text-green-500' : 'text-red-400'">{{ p.audio ? 'mic' : 'mic_off' }}</span>
          <span class="material-symbols-rounded text-[18px]" :class="p.video ? 'text-green-500' : 'text-red-400'">{{ p.video ? 'videocam' : 'videocam_off' }}</span>
          <span v-if="p.handRaised" class="material-symbols-rounded text-[18px] text-yellow-500">front_hand</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ participants: { type: Array, default: () => [] } })
</script>
