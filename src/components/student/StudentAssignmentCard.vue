<template>
  <div 
    class="bg-gradient-to-br from-white to-orange-50 rounded-classroom p-4 hover:shadow-md transition-all duration-300 cursor-pointer border border-orange-100"
    :class="cardClass"
    @click="handleClick"
    data-testid="assignment-card"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="font-bold text-gray-900 mb-2">{{ assignment.title }}</h3>
        <p class="text-gray-600 mb-3">{{ getCourseName(assignment.courseId) }}</p>
        <div class="flex items-center space-x-4 text-sm">
          <span class="flex items-center space-x-1 text-gray-500">
            <span class="material-icons text-sm">schedule</span>
            <span>{{ formatDueDate(assignment.dueDate) }}</span>
          </span>
          <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {{ assignment.points }} points
          </span>
          <span v-if="assignment.submissionStatus === 'submitted'" class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            Submitted
          </span>
          <span v-else class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
            Pending
          </span>
        </div>
      </div>
      <span class="material-icons text-gray-400">chevron_right</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '../../store/courses'

const router = useRouter()
const coursesStore = useCoursesStore()

const props = defineProps({
  assignment: {
    type: Object,
    required: true
  }
})

const cardClass = computed(() => {
  if (props.assignment.submissionStatus === 'submitted') {
    return 'from-white to-green-50 border-green-100'
  }
  
  const dueDate = new Date(props.assignment.dueDate)
  const now = new Date()
  const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60)
  
  if (hoursUntilDue < 24) {
    return 'from-white to-red-50 border-red-100'
  } else if (hoursUntilDue < 72) {
    return 'from-white to-orange-50 border-orange-100'
  } else {
    return 'from-white to-blue-50 border-blue-100'
  }
})

const getCourseName = (courseId) => {
  const course = coursesStore.getCourseById(courseId)
  return course?.name || 'Unknown Course'
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = Math.abs(date - now)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Tomorrow'
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`
  } else {
    return date.toLocaleDateString()
  }
}

const handleClick = () => {
  router.push(`/student/classwork/${props.assignment.id}`)
}
</script>

<style scoped>
/* Additional styling if needed */
</style>
