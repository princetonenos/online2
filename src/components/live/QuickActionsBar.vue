<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
    <div class="grid grid-cols-6 gap-2 text-center">
      <button class="qa" @click="$emit('participants')"><span class="material-symbols-rounded">groups</span><span>Participants</span></button>
      <button class="qa" @click="$emit('record')"><span class="material-symbols-rounded">fiber_manual_record</span><span>Record</span></button>
      <button class="qa" @click="$emit('share')"><span class="material-symbols-rounded">screen_share</span><span>Share</span></button>
      <button class="qa" @click="$emit('image')"><span class="material-symbols-rounded">image</span><span>Image</span></button>
      <button class="qa" @click="$emit('link')"><span class="material-symbols-rounded">link</span><span>Link</span></button>
      <button class="qa" @click="$emit('more')"><span class="material-symbols-rounded">more_horiz</span><span>More</span></button>
    </div>
  </div>
</template>
<script setup>
</script>
<style scoped>
.qa{ @apply flex flex-col items-center gap-1 rounded-lg py-3 hover:bg-gray-50 text-gray-700; }
.qa .material-symbols-rounded{ @apply text-[20px] text-indigo-500; }
.qa span:last-child{ @apply text-xs; }
</style>
