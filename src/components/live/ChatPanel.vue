<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-full">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold text-gray-900">Chats</h3>
      <button class="text-gray-400 hover:text-gray-600"><span class="material-symbols-rounded">more_horiz</span></button>
    </div>
    <div class="space-y-3 overflow-y-auto max-h-[38vh] pr-1">
      <div v-for="m in messages" :key="m.id" class="flex items-start gap-3">
        <img :src="m.user?.avatar || '/avatars/user-default.jpg'" class="w-8 h-8 rounded-full" alt="" />
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span class="font-medium text-gray-900">{{ m.user?.name || 'User' }}</span>
            <span>{{ m.time }}</span>
          </div>
          <div class="text-sm text-gray-800">{{ m.text }}</div>
        </div>
      </div>
    </div>
    <form class="mt-3 flex gap-2" @submit.prevent="send">
      <input v-model="draft" class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Write a message"/>
      <button class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">Send</button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({ messages: { type: Array, default: () => [] } })
const emit = defineEmits(['send-message'])
const draft = ref('')
function send(){ if(!draft.value.trim()) return; emit('send-message', draft.value.trim()); draft.value='' }
</script>
