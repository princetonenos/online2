<template>
  <div 
    class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
    @click="handleClick"
    data-testid="class-card"
  >
    <div class="w-full h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom mb-4 flex items-center justify-center">
      <span class="material-icons text-white text-3xl">school</span>
    </div>
    <h3 class="font-bold text-gray-900 mb-2 text-lg">{{ classItem.name }}</h3>
    <p class="text-gray-600 mb-3">{{ classItem.teacherName }}</p>
    <div class="flex items-center justify-between text-sm text-gray-500">
      <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{{ classItem.section }}</span>
      <span>{{ classItem.enrolledStudents }} students</span>
    </div>
    <div v-if="upcomingAssignmentsCount > 0" class="mt-3 pt-3 border-t border-gray-200">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Upcoming assignments:</span>
        <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">{{ upcomingAssignmentsCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAssignmentsStore } from '../../store/assignments'

const router = useRouter()
const assignmentsStore = useAssignmentsStore()

const props = defineProps({
  classItem: {
    type: Object,
    required: true
  }
})

const upcomingAssignmentsCount = computed(() => {
  const now = new Date()
  const assignments = assignmentsStore.assignments.filter(assignment => 
    assignment.courseId === props.classItem.id && 
    new Date(assignment.dueDate) > now &&
    assignment.submissionStatus !== 'submitted'
  )
  return assignments.length
})

const handleClick = () => {
  router.push(`/student/classes/${props.classItem.id}`)
}
</script>

<style scoped>
/* Additional styling if needed */
</style>
