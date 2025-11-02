<template>
  <button @click="$emit('click')" class="bg-white rounded shadow p-3 flex flex-col items-start gap-2 hover:shadow-md">
    <div class="text-2xl text-gray-700">
      <slot name="icon">{{ icon }}</slot>
    </div>
    <div class="text-sm font-medium">{{ title }}</div>
    <div class="text-xs text-gray-500">{{ subtitle }}</div>
  </button>
</template>

<script setup>
defineProps({ icon: { type: String, default: 'plus' }, title: String, subtitle: String })
</script>

<style scoped></style>
