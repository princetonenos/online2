<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-medium text-classroom-gray-900">My Classes</h1>
        <p class="text-classroom-gray-600">Manage your scheduled classes and sessions</p>
      </div>
      <button 
        @click="$router.push('/teacher/create-class')"
        class="btn-primary flex items-center space-x-2"
      >
        <span class="material-icons text-lg">add</span>
        <span>Create Class</span>
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="bg-white rounded-classroom classroom-shadow p-6">
        <div class="skeleton h-6 w-3/4 mb-3"></div>
        <div class="skeleton h-4 w-full mb-2"></div>
        <div class="skeleton h-4 w-1/2"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div 
      v-else-if="classes.length === 0" 
      class="bg-white rounded-classroom classroom-shadow p-12 text-center"
    >
      <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-icons text-classroom-gray-400 text-4xl">school</span>
      </div>
      <h3 class="text-xl font-medium text-classroom-gray-900 mb-2">No classes yet</h3>
      <p class="text-classroom-gray-600 mb-6">Create your first class to get started with teaching</p>
      <button 
        @click="$router.push('/teacher/create-class')"
        class="btn-primary"
      >
        Create your first class
      </button>
    </div>

    <!-- Classes grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="classItem in classes"
        :key="classItem.id"
        class="bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-all duration-200"
      >
        <!-- Class header -->
        <div class="p-4 border-b border-classroom-gray-100">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-medium text-classroom-gray-900 text-lg mb-1">
                {{ classItem.title }}
              </h3>
              <p class="text-sm text-classroom-gray-500 line-clamp-2">
                {{ classItem.description }}
              </p>
            </div>
            <div class="flex items-center space-x-1 ml-2">
              <button 
                @click="openClassOptions(classItem)"
                class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors"
                aria-label="Class options"
              >
                <span class="material-icons text-classroom-gray-500 text-lg">more_vert</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Class details -->
        <div class="p-4 space-y-3">
          <!-- Schedule -->
          <div class="flex items-center space-x-2 text-sm">
            <span class="material-icons text-classroom-gray-400 text-base">schedule</span>
            <div>
              <p class="text-classroom-gray-900">
                {{ formatDateTime(classItem.startAt) }}
              </p>
              <p class="text-classroom-gray-500">
                {{ classItem.durationMinutes }} minutes
              </p>
            </div>
          </div>

          <!-- Level -->
          <div class="flex items-center space-x-2 text-sm">
            <span class="material-icons text-classroom-gray-400 text-base">trending_up</span>
            <span class="chip text-xs" :class="getLevelClass(classItem.level)">
              {{ getLevelLabel(classItem.level) }}
            </span>
          </div>

          <!-- Resources -->
          <div class="flex items-center space-x-2 text-sm">
            <span class="material-icons text-classroom-gray-400 text-base">attach_file</span>
            <span class="text-classroom-gray-500">
              {{ classItem.resources?.length || 0 }} resource{{ classItem.resources?.length !== 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Status -->
          <div class="flex items-center space-x-2 text-sm">
            <span class="material-icons text-classroom-gray-400 text-base">circle</span>
            <span class="chip text-xs" :class="getStatusClass(classItem.status)">
              {{ getStatusLabel(classItem.status) }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-4 border-t border-classroom-gray-100">
          <div class="flex items-center justify-between">
            <button 
              @click="viewClass(classItem)"
              class="btn-outline text-sm px-3 py-1"
            >
              View Details
            </button>
            
            <div class="flex items-center space-x-2">
              <button 
                v-if="classItem.status === 'scheduled'"
                @click="startSession(classItem)"
                class="btn-primary text-sm px-3 py-1 flex items-center space-x-1"
              >
                <span class="material-icons text-sm">play_arrow</span>
                <span>Start</span>
              </button>
              
              <button 
                v-if="classItem.status === 'ongoing'"
                @click="joinSession(classItem)"
                class="btn-primary text-sm px-3 py-1 flex items-center space-x-1"
              >
                <span class="material-icons text-sm">video_call</span>
                <span>Join</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClassesStore } from '../store/classes'
import { useUsersStore } from '../store/users'

const router = useRouter()
const classesStore = useClassesStore()
const usersStore = useUsersStore()

const loading = ref(false)
const classes = ref([])

const currentUser = ref(usersStore.currentUser)

const loadClasses = async () => {
  loading.value = true
  try {
    await classesStore.loadClasses()
    classes.value = classesStore.getClassesForTeacher(currentUser.value.id)
  } catch (error) {
    console.error('Error loading classes:', error)
    showToast('Error loading classes')
  } finally {
    loading.value = false
  }
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getLevelClass = (level) => {
  const levelClasses = {
    beginner: 'chip-secondary',
    intermediate: 'chip-primary',
    advanced: 'bg-purple-100 text-purple-800'
  }
  return levelClasses[level] || 'chip-gray'
}

const getLevelLabel = (level) => {
  const levelLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  }
  return levelLabels[level] || level
}

const getStatusClass = (status) => {
  const statusClasses = {
    scheduled: 'chip-gray',
    ongoing: 'chip-primary',
    completed: 'chip-secondary'
  }
  return statusClasses[status] || 'chip-gray'
}

const getStatusLabel = (status) => {
  const statusLabels = {
    scheduled: 'Scheduled',
    ongoing: 'Live',
    completed: 'Completed'
  }
  return statusLabels[status] || status
}

const viewClass = (classItem) => {
  router.push(`/teacher/classes/${classItem.id}`)
}

const startSession = async (classItem) => {
  try {
    const session = await classesStore.startSession(classItem.id)
    showToast('Session started successfully!')
    // Navigate to live session
    router.push(`/teacher/classes/${classItem.id}/live`)
  } catch (error) {
    console.error('Error starting session:', error)
    showToast('Error starting session')
  }
}

const joinSession = (classItem) => {
  router.push(`/teacher/classes/${classItem.id}/live`)
}

const openClassOptions = (classItem) => {
  showToast(`Options for ${classItem.title}`)
  // In a real app, this would open a context menu with edit/delete options
}

onMounted(() => {
  loadClasses()
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
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
