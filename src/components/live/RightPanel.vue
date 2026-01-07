<template>
  <aside v-if="open" class="fixed inset-0 z-40 flex lg:static lg:z-auto" aria-label="Right side panel">
    <!-- overlay -->
    <div class="flex-1 bg-black/40 lg:hidden" @click="$emit('close')" aria-hidden="true"></div>
    <div class="w-[90%] sm:w-2/3 lg:w-80 bg-gray-900 text-white border-l border-gray-700 flex flex-col">
      <div class="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <div class="flex items-center gap-2" role="tablist">
          <button :class="tab==='participants' ? 'tab-active' : 'tab'" role="tab" @click="$emit('switch-tab','participants')">Participants</button>
          <button :class="tab==='chat' ? 'tab-active' : 'tab'" role="tab" @click="$emit('switch-tab','chat')">Chat</button>
        </div>
        <button class="text-gray-300 hover:text-white" @click="$emit('close')" aria-label="Close panel">
          <span class="material-icons">close</span>
        </button>
      </div>

      <!-- Participants -->
      <div v-if="tab==='participants'" class="flex-1 overflow-y-auto p-3 space-y-2" role="list">
        <div v-for="p in participants" :key="p.id" class="flex items-center gap-3 p-2 rounded hover:bg-gray-800" role="listitem">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold">{{ p.name?.charAt(0) }}</div>
          <div class="flex-1 min-w-0">
            <div class="truncate text-sm">{{ p.name }}</div>
          </div>
          <button class="text-gray-300 hover:text-white" @click="$emit('mute', p.id)" :aria-label="`Toggle mute ${p.name}`">
            <span class="material-icons text-[18px]">{{ p.muted ? 'mic_off' : 'mic' }}</span>
          </button>
          <span v-if="p.handRaised" class="material-icons text-yellow-400 text-[18px]" aria-hidden>front_hand</span>
        </div>
      </div>

      <!-- Chat -->
      <div v-else class="flex-1 flex flex-col">
        <div class="flex-1 overflow-y-auto p-3 space-y-2">
          <div v-for="m in chatMessages" :key="m.id" class="text-sm">
            <span class="text-gray-300 font-medium">{{ m.user.name }}:</span>
            <span class="text-gray-100"> {{ m.text }}</span>
          </div>
        </div>
        <form class="p-3 border-t border-gray-700 flex gap-2" @submit.prevent="send">
          <input v-model="draft" :placeholder="inputPlaceholder" class="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Message input" />
          <button class="bg-blue-600 hover:bg-blue-700 rounded px-3 text-sm" aria-label="Send message">Send</button>
        </form>
      </div>
    </div>
  </aside>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  open: { type: Boolean, default: false },
  tab: { type: String, default: 'participants' },
  participants: { type: Array, default: () => [] },
  chatMessages: { type: Array, default: () => [] },
  inputPlaceholder: { type: String, default: 'Type a message…' }
})
const emit = defineEmits(['close','switch-tab','mute','send-message'])
const draft = ref('')
function send(){ if(!draft.value.trim()) return; emit('send-message', draft.value.trim()); draft.value=''}
</script>
<style scoped>
.tab{ @apply px-2 py-1 rounded text-gray-300 hover:text-white hover:bg-gray-800; }
.tab-active{ @apply px-2 py-1 rounded bg-gray-700 text-white; }
</style>
