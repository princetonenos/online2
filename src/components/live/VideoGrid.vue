<template>
  <section class="w-full h-full" aria-label="Video area">
    <!-- Speaker / Stage view -->
    <div v-if="mode==='speaker' && stage" class="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 h-full">
      <div class="lg:col-span-2 h-full min-h-[240px]">
        <VideoTile :participant="stage" :isPinned="true" :showControls="false" class="w-full h-full" />
      </div>
      <div class="flex lg:flex-col overflow-auto gap-2 p-1">
        <VideoTile v-for="p in others" :key="p.id" :participant="p" class="min-w-[160px] h-36" @toggle-pin="$emit('toggle-pin', p.id)" />
      </div>
    </div>

    <!-- Gallery view -->
    <div v-else class="grid gap-2 sm:gap-3 h-full" :class="gridClass" role="list">
      <VideoTile v-for="p in participants" :key="p.id" :participant="p" role="listitem" @toggle-pin="$emit('toggle-pin', p.id)" />
    </div>
  </section>
</template>
<script setup>
import { computed } from 'vue'
import VideoTile from './VideoTile.vue'
const props = defineProps({
  participants: { type: Array, default: () => [] },
  mode: { type: String, default: 'gallery' },
  stageParticipantId: { type: [String, Number, null], default: null }
})
const stage = computed(()=> props.participants.find(p=> String(p.id)===String(props.stageParticipantId)) || props.participants[0])
const others = computed(()=> props.participants.filter(p=> p!==stage.value))
const gridClass = computed(()=>{
  const n = props.participants.length
  if (n<=1) return 'grid-cols-1'
  if (n<=4) return 'grid-cols-2'
  if (n<=9) return 'grid-cols-3'
  if (n<=16) return 'grid-cols-4'
  return 'grid-cols-5'
})
</script>
