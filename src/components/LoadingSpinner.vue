<template>
  <div v-if="loading" class="flex items-center justify-center" :class="containerClass">
    <div class="text-center">
      <span 
        class="material-icons animate-spin"
        :class="[sizeClass, colorClass]"
      >
        {{ icon }}
      </span>
      <p v-if="message" class="mt-2 text-sm" :class="textColorClass">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  icon: {
    type: String,
    default: 'refresh'
  },
  containerClass: {
    type: String,
    default: 'p-8'
  }
})

const sizeClass = computed(() => {
  const sizes = {
    xs: 'text-base',
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-6xl'
  }
  return sizes[props.size]
})

const colorClass = computed(() => {
  if (props.color === 'primary') return 'text-classroom-primary'
  if (props.color === 'white') return 'text-white'
  if (props.color === 'gray') return 'text-classroom-gray-500'
  return props.color
})

const textColorClass = computed(() => {
  if (props.color === 'white') return 'text-white'
  return 'text-classroom-gray-600'
})
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
