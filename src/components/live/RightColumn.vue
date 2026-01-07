<template>
  <div class="space-y-4">
    <ParticipantsPanel :participants="participants" />
    <ChatPanel :messages="messages" @send-message="$emit('send-message', $event)" />
  </div>
</template>
<script setup>
import ParticipantsPanel from './ParticipantsPanel.vue'
import ChatPanel from './ChatPanel.vue'
const props = defineProps({
  participants: { type: Array, default: () => [] },
  messages: { type: Array, default: () => [] }
})
</script>
