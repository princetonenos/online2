<template>
  <div class="relative inline-block text-left" @keydown.escape.stop.prevent="open=false">
    <button type="button" class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-violet-500"
            :aria-expanded="open" :aria-haspopup="true" @click="toggle">
      <span class="material-symbols-rounded text-[18px]" v-if="type==='camera'">videocam</span>
      <span class="material-symbols-rounded text-[18px]" v-else>mic</span>
    </button>

    <div v-if="open" class="absolute z-20 mt-2 w-56 origin-top-right right-0 rounded-xl shadow-lg bg-white border border-gray-200 p-1">
      <div class="px-3 py-2 text-xs text-gray-500">Select {{ type === 'camera' ? 'camera' : 'microphone' }}</div>
      <ul role="listbox" class="max-h-60 overflow-auto">
        <li v-for="d in devices" :key="d.deviceId" role="option"
            :aria-selected="d.deviceId===selectedId"
            @click="choose(d.deviceId)"
            class="px-3 py-2 rounded-lg cursor-pointer text-sm flex items-center justify-between hover:bg-gray-50">
          <span class="truncate mr-2">{{ d.label || (type==='camera' ? 'Camera' : 'Microphone') }}</span>
          <span v-if="d.deviceId===selectedId" class="material-symbols-rounded text-[18px] text-violet-600">check</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({
  type: { type: String, required: true }, // 'camera' | 'microphone'
  devices: { type: Array, default: () => [] },
  selectedId: { type: String, default: null }
})
const emit = defineEmits(['select'])
const open = ref(false)
function toggle(){ open.value = !open.value }
function choose(id){ emit('select', id); open.value=false }
function onOutside(e){ if(!e.target.closest('.relative.inline-block')) open.value=false }
onMounted(()=> document.addEventListener('click', onOutside))
onBeforeUnmount(()=> document.removeEventListener('click', onOutside))
</script>
