<template>
  <div 
    class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-4 cursor-pointer hover:scale-105 transition-transform duration-300"
    :class="cardClass"
    @click="handleClick"
    data-testid="stats-card"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-gray-400 mt-1">{{ subtitle }}</p>
      </div>
      <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center" :class="iconBgClass">
        <span class="material-icons text-lg" :class="iconColorClass">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  route: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'default' // default, success, warning, danger, info
  }
})

const typeClasses = {
  default: {
    card: 'from-white to-blue-50 border-blue-100',
    icon: 'bg-blue-100 text-blue-600'
  },
  success: {
    card: 'from-white to-green-50 border-green-100',
    icon: 'bg-green-100 text-green-600'
  },
  warning: {
    card: 'from-white to-yellow-50 border-yellow-100',
    icon: 'bg-yellow-100 text-yellow-600'
  },
  danger: {
    card: 'from-white to-red-50 border-red-100',
    icon: 'bg-red-100 text-red-600'
  },
  info: {
    card: 'from-white to-purple-50 border-purple-100',
    icon: 'bg-purple-100 text-purple-600'
  }
}

const cardClass = computed(() => {
  const base = 'bg-gradient-to-br rounded-2xl shadow-xl border p-4 cursor-pointer hover:scale-105 transition-transform duration-300'
  return `${base} ${typeClasses[props.type].card}`
})

const iconBgClass = computed(() => typeClasses[props.type].icon.split(' ')[0])
const iconColorClass = computed(() => typeClasses[props.type].icon.split(' ')[1])

const handleClick = () => {
  if (props.route) {
    router.push(props.route)
  }
}
</script>

<style scoped>
/* Additional styling if needed */
</style>
