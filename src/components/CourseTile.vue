<template>
  <div 
    class="bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-all duration-200 cursor-pointer group overflow-hidden"
    @click="$emit('click')"
  >
    <!-- Course color accent bar -->
    <div 
      class="h-2 w-full"
      :style="{ backgroundColor: course.color }"
    ></div>
    
    <div class="p-4">
      <!-- Course header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-classroom-gray-900 text-lg mb-1 truncate">
            {{ course.name }}
          </h3>
          <p class="text-sm text-classroom-gray-600 truncate">
            {{ course.section }}
          </p>
        </div>
        
        <!-- More options button -->
        <button 
          @click.stop="toggleOptions"
          class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus-classroom"
          aria-label="Course options"
        >
          <span class="material-icons text-classroom-gray-600 text-lg">more_vert</span>
        </button>
      </div>

      <!-- Teacher info -->
      <div class="flex items-center space-x-2 mb-3">
        <img 
          v-if="primaryTeacher?.avatar"
          :src="primaryTeacher.avatar"
          :alt="primaryTeacher.name"
          class="w-6 h-6 rounded-full"
        >
        <span class="text-sm text-classroom-gray-600 truncate">
          {{ primaryTeacher?.name || 'Teacher' }}
        </span>
      </div>

      <!-- Course stats -->
      <div class="flex items-center justify-between text-xs text-classroom-gray-500">
        <div class="flex items-center space-x-4">
          <span class="flex items-center space-x-1">
            <span class="material-icons text-sm">people</span>
            <span>{{ course.students?.length || 0 }} students</span>
          </span>
          <span v-if="upcomingAssignmentsCount > 0" class="flex items-center space-x-1">
            <span class="material-icons text-sm">assignment</span>
            <span>{{ upcomingAssignmentsCount }} due</span>
          </span>
        </div>
        
        <!-- Classroom code -->
        <button 
          @click.stop="copyClassCode"
          class="chip chip-gray hover:bg-classroom-gray-200 transition-colors"
          :title="`Class code: ${course.code}`"
        >
          {{ course.code }}
        </button>
      </div>
    </div>

    <!-- Options dropdown -->
    <div 
      v-if="showOptions"
      class="absolute right-2 top-10 bg-white rounded-classroom classroom-shadow-lg border border-classroom-gray-200 py-1 z-10 w-48"
    >
      <!-- Quick navigation -->
      <button 
        @click.stop="navigateToSection('stream')"
        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
      >
        <span class="material-icons text-classroom-gray-600 text-lg">chat</span>
        <span>Stream</span>
      </button>
      <button 
        @click.stop="navigateToSection('classwork')"
        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
      >
        <span class="material-icons text-classroom-gray-600 text-lg">assignment</span>
        <span>Classwork</span>
      </button>
      <button 
        @click.stop="navigateToSection('people')"
        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
      >
        <span class="material-icons text-classroom-gray-600 text-lg">people</span>
        <span>People</span>
      </button>
      <button 
        @click.stop="navigateToSection('grades')"
        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
      >
        <span class="material-icons text-classroom-gray-600 text-lg">grade</span>
        <span>Grades</span>
      </button>
      <button 
        @click.stop="navigateToSection('live')"
        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
      >
        <span class="material-icons text-classroom-gray-600 text-lg">video_call</span>
        <span>Live Class</span>
      </button>
      
      <div class="border-t border-classroom-gray-100 my-1"></div>
      
      <button 
        @click.stop="copyClassCode"
        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
      >
        <span class="material-icons text-classroom-gray-600 text-lg">content_copy</span>
        <span>Copy class code</span>
      </button>
      <button 
        @click.stop="shareClass"
        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
      >
        <span class="material-icons text-classroom-gray-600 text-lg">share</span>
        <span>Share class</span>
      </button>
      <div class="border-t border-classroom-gray-100 my-1"></div>
      <button 
        @click.stop="archiveClass"
        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2 text-classroom-gray-500"
      >
        <span class="material-icons text-classroom-gray-600 text-lg">archive</span>
        <span>Archive</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../store/users'
import { useAssignmentsStore } from '../store/assignments'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const router = useRouter()

const usersStore = useUsersStore()
const assignmentsStore = useAssignmentsStore()

const showOptions = ref(false)

const primaryTeacher = computed(() => {
  if (!props.course.teachers || props.course.teachers.length === 0) return null
  const teacherId = props.course.teachers[0]
  return usersStore.getUserById(teacherId)
})

const upcomingAssignmentsCount = computed(() => {
  const now = new Date()
  const assignments = assignmentsStore.assignments.filter(assignment => 
    assignment.courseId === props.course.id && 
    new Date(assignment.dueDate) > now
  )
  return assignments.length
})

const toggleOptions = () => {
  showOptions.value = !showOptions.value
}

const copyClassCode = () => {
  navigator.clipboard.writeText(props.course.code)
    .then(() => {
      showToast('Class code copied to clipboard')
      showOptions.value = false
    })
    .catch(() => {
      showToast('Failed to copy class code')
    })
}

const shareClass = () => {
  showToast('Share functionality would open here')
  showOptions.value = false
}

const archiveClass = () => {
  showToast('Archive functionality would open here')
  showOptions.value = false
}

const navigateToSection = (section) => {
  router.push(`/course/${props.course.id}/${section}`)
  showOptions.value = false
}

// Close options when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative') && !event.target.closest('button[aria-label="Course options"]')) {
    showOptions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>

<style scoped>
.relative {
  position: relative;
}
</style>
