<template>
  <component :is="isVisible ? 'div' : 'div'" class="w-full h-full">
    <VideoTile v-if="isVisible" v-bind="$attrs" :participant="participant" />
    <div v-else class="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
      <div class="text-center p-4">
        <div class="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xl font-semibold bg-gray-700">
          {{ initials }}
        </div>
        <div class="text-gray-300 text-xs truncate max-w-[140px]">{{ participant?.name }}</div>
      </div>
    </div>
  </component>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import VideoTile from './VideoTile.vue'

const props = defineProps({ participant: { type: Object, required: true } })
const root = ref(null)
const isVisible = ref(false)
let observer

const initials = computed(() => {
  const name = props.participant?.name || 'User'
  const parts = name.split(' ')
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.substring(0,2).toUpperCase()
})

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { isVisible.value = true; observer?.disconnect() } })
  }, { root: null, rootMargin: '200px', threshold: 0.01 })
  observer.observe(root.value || (root.value = document.currentScript?.parentElement))
})

onUnmounted(() => { observer?.disconnect() })
</script>
