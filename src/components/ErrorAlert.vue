<template>
  <transition name="fade">
    <div
      v-if="error"
      class="rounded-classroom border-l-4 p-4 mb-4"
      :class="[
        type === 'error' ? 'bg-red-50 border-red-500' : '',
        type === 'warning' ? 'bg-yellow-50 border-yellow-500' : '',
        type === 'info' ? 'bg-blue-50 border-blue-500' : '',
        type === 'success' ? 'bg-green-50 border-green-500' : ''
      ]"
      role="alert"
    >
      <div class="flex items-start">
        <span 
          class="material-icons mr-3"
          :class="[
            type === 'error' ? 'text-red-500' : '',
            type === 'warning' ? 'text-yellow-500' : '',
            type === 'info' ? 'text-blue-500' : '',
            type === 'success' ? 'text-green-500' : ''
          ]"
        >
          {{ getIcon }}
        </span>
        <div class="flex-1">
          <h3 
            v-if="title"
            class="font-medium mb-1"
            :class="[
              type === 'error' ? 'text-red-800' : '',
              type === 'warning' ? 'text-yellow-800' : '',
              type === 'info' ? 'text-blue-800' : '',
              type === 'success' ? 'text-green-800' : ''
            ]"
          >
            {{ title }}
          </h3>
          <p 
            class="text-sm"
            :class="[
              type === 'error' ? 'text-red-700' : '',
              type === 'warning' ? 'text-yellow-700' : '',
              type === 'info' ? 'text-blue-700' : '',
              type === 'success' ? 'text-green-700' : ''
            ]"
          >
            {{ error }}
          </p>
          <button
            v-if="retry"
            @click="$emit('retry')"
            class="mt-2 text-sm font-medium underline"
            :class="[
              type === 'error' ? 'text-red-800 hover:text-red-900' : '',
              type === 'warning' ? 'text-yellow-800 hover:text-yellow-900' : '',
              type === 'info' ? 'text-blue-800 hover:text-blue-900' : '',
              type === 'success' ? 'text-green-800 hover:text-green-900' : ''
            ]"
          >
            Try Again
          </button>
        </div>
        <button
          v-if="dismissible"
          @click="$emit('dismiss')"
          class="ml-3"
          :class="[
            type === 'error' ? 'text-red-500 hover:text-red-700' : '',
            type === 'warning' ? 'text-yellow-500 hover:text-yellow-700' : '',
            type === 'info' ? 'text-blue-500 hover:text-blue-700' : '',
            type === 'success' ? 'text-green-500 hover:text-green-700' : ''
          ]"
        >
          <span class="material-icons text-lg">close</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  error: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info', 'success'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  retry: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss', 'retry'])

const getIcon = computed(() => {
  switch (props.type) {
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    case 'success':
      return 'check_circle'
    default:
      return 'info'
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
