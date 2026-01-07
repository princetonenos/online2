<template>
  <div 
    class="bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-all duration-300 cursor-pointer animate-hover-lift animate-press"
    @click="$emit('click')"
  >
    <div class="p-4">
      <!-- Assignment header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-classroom-gray-900 text-lg mb-1">
            {{ assignment.title }}
          </h3>
          <p class="text-sm text-classroom-gray-600 line-clamp-2">
            {{ assignment.description }}
          </p>
        </div>
        
        <!-- Assignment type and points -->
        <div class="flex items-center space-x-2 ml-4">
          <span class="chip text-xs" :class="getAssignmentTypeClass(assignment.type)">
            {{ getAssignmentTypeLabel(assignment.type) }}
          </span>
          <span class="chip chip-primary text-xs">
            {{ assignment.points }} points
          </span>
        </div>
      </div>

      <!-- Due date and status -->
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center space-x-4 text-classroom-gray-500">
          <span class="flex items-center space-x-1">
            <span class="material-icons text-base">schedule</span>
            <span>{{ formatDueDate(assignment.dueDate) }}</span>
          </span>
          
          <!-- Student submission status -->
          <span 
            v-if="!isTeacher && submission"
            class="chip text-xs"
            :class="getSubmissionStatusClass(submission.status)"
          >
            {{ getSubmissionStatusLabel(submission.status) }}
          </span>
        </div>

        <!-- Teacher view: submission stats -->
        <div v-if="isTeacher" class="text-xs text-classroom-gray-500">
          {{ getSubmissionStats() }}
        </div>
      </div>

      <!-- Attachments -->
      <div v-if="assignment.attachments && assignment.attachments.length > 0" class="mt-3">
        <div class="flex items-center space-x-2">
          <span class="material-icons text-classroom-gray-400 text-sm">attach_file</span>
          <span class="text-xs text-classroom-gray-500">
            {{ assignment.attachments.length }} attachment{{ assignment.attachments.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUsersStore } from '../store/users'
import { useAssignmentsStore } from '../store/assignments'

const props = defineProps({
  assignment: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const usersStore = useUsersStore()
const assignmentsStore = useAssignmentsStore()

const currentUser = computed(() => usersStore.currentUser)
const isTeacher = computed(() => usersStore.isTeacher)

const submission = computed(() => {
  if (isTeacher.value) return null
  return assignmentsStore.getSubmissionByUser(props.assignment.id, currentUser.value.id)
})

const getAssignmentTypeClass = (type) => {
  const typeClasses = {
    assignment: 'chip-primary',
    quiz: 'chip-secondary',
    material: 'chip-gray',
    question: 'chip-secondary'
  }
  return typeClasses[type] || 'chip-gray'
}

const getAssignmentTypeLabel = (type) => {
  const typeLabels = {
    assignment: 'Assignment',
    quiz: 'Quiz',
    material: 'Material',
    question: 'Question'
  }
  return typeLabels[type] || 'Assignment'
}

const getSubmissionStatusClass = (status) => {
  const statusClasses = {
    assigned: 'chip-gray',
    submitted: 'chip-secondary',
    graded: 'chip-primary',
    missing: 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'chip-gray'
}

const getSubmissionStatusLabel = (status) => {
  const statusLabels = {
    assigned: 'Assigned',
    submitted: 'Turned in',
    graded: 'Graded',
    missing: 'Missing'
  }
  return statusLabels[status] || 'Assigned'
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays < 0) return 'Overdue'
  if (diffDays < 7) return `Due in ${diffDays} days`
  
  return `Due ${date.toLocaleDateString()}`
}

const getSubmissionStats = () => {
  const submissions = assignmentsStore.getSubmissionsByAssignment(props.assignment.id)
  const total = submissions.length
  const turnedIn = submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length
  const graded = submissions.filter(s => s.status === 'graded').length
  
  return `${turnedIn}/${total} turned in • ${graded} graded`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
