<template>
  <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
    <div v-for="p in participants" :key="p.id" class="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
      <div class="aspect-video">
        <LazyVideoTile :participant="p" :showControls="false" />
      </div>
    </div>
  </div>
</template>
<script setup>
import LazyVideoTile from './LazyVideoTile.vue'
const props = defineProps({ participants: { type: Array, default: () => [] } })
</script>
