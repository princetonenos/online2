<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Class Header -->
    <div class="bg-white rounded-classroom classroom-shadow p-6 mb-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h1 class="text-2xl font-medium text-classroom-gray-900 mb-2">{{ classItem?.title }}</h1>
          <p class="text-classroom-gray-600 mb-4">{{ classItem?.description }}</p>
          
          <div class="flex items-center space-x-6 text-sm">
            <div class="flex items-center space-x-2">
              <span class="material-icons text-classroom-gray-400 text-base">schedule</span>
              <span class="text-classroom-gray-900">{{ formatDateTime(classItem?.startAt) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="material-icons text-classroom-gray-400 text-base">trending_up</span>
              <span class="chip text-xs" :class="getLevelClass(classItem?.level)">
                {{ getLevelLabel(classItem?.level) }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="material-icons text-classroom-gray-400 text-base">circle</span>
              <span class="chip text-xs" :class="getStatusClass(classItem?.status)">
                {{ getStatusLabel(classItem?.status) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            v-if="classItem?.status === 'scheduled'"
            @click="startSession"
            class="btn-primary flex items-center space-x-2"
          >
            <span class="material-icons text-lg">play_arrow</span>
            <span>Start Session</span>
          </button>
          
          <button 
            v-if="classItem?.status === 'ongoing'"
            @click="joinSession"
            class="btn-primary flex items-center space-x-2"
          >
            <span class="material-icons text-lg">video_call</span>
            <span>Join Session</span>
          </button>
          
          <button class="btn-outline flex items-center space-x-2">
            <span class="material-icons text-lg">edit</span>
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-classroom-gray-200 mb-6">
      <nav class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="activeTab === tab.id 
            ? 'border-classroom-primary text-classroom-primary' 
            : 'border-transparent text-classroom-gray-500 hover:text-classroom-gray-700 hover:border-classroom-gray-300'"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="bg-white rounded-classroom classroom-shadow p-6">
        <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Class Overview</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Resources -->
          <div>
            <h3 class="font-medium text-classroom-gray-900 mb-3">Resources</h3>
            <div class="space-y-2">
              <div 
                v-for="resource in classItem?.resources || []"
                :key="resource.id"
                class="flex items-center space-x-3 p-3 border border-classroom-gray-200 rounded-classroom hover:border-classroom-primary transition-colors"
              >
                <span class="material-icons text-classroom-gray-400">
                  {{ resource.type === 'link' ? 'link' : 'description' }}
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-classroom-gray-900 truncate">{{ resource.title }}</p>
                  <p class="text-xs text-classroom-gray-500 truncate">{{ resource.url }}</p>
                </div>
              </div>
              
              <div v-if="!classItem?.resources?.length" class="text-center py-8 text-classroom-gray-500">
                <span class="material-icons text-4xl mb-2 opacity-50">attach_file</span>
                <p>No resources added</p>
              </div>
            </div>
          </div>

          <!-- Upcoming Sessions -->
          <div>
            <h3 class="font-medium text-classroom-gray-900 mb-3">Recent Sessions</h3>
            <div class="space-y-2">
              <div 
                v-for="session in classItem?.sessions?.slice(0, 3) || []"
                :key="session.sessionId"
                class="p-3 border border-classroom-gray-200 rounded-classroom"
              >
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-medium text-classroom-gray-900">
                    {{ formatDate(session.startedAt) }}
                  </p>
                  <span class="chip text-xs chip-primary">Completed</span>
                </div>
                <p class="text-xs text-classroom-gray-500">
                  {{ formatDuration(session.startedAt, session.endedAt) }}
                </p>
              </div>
              
              <div v-if="!classItem?.sessions?.length" class="text-center py-8 text-classroom-gray-500">
                <span class="material-icons text-4xl mb-2 opacity-50">history</span>
                <p>No sessions yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sessions Tab -->
      <div v-if="activeTab === 'sessions'" class="bg-white rounded-classroom classroom-shadow p-6">
        <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Session History</h2>
        
        <div class="space-y-4">
          <div 
            v-for="session in classItem?.sessions || []"
            :key="session.sessionId"
            class="border border-classroom-gray-200 rounded-classroom p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-classroom-gray-900">
                Session on {{ formatDate(session.startedAt) }}
              </h3>
              <span class="chip text-xs chip-primary">Completed</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p class="text-classroom-gray-500">Duration</p>
                <p class="text-classroom-gray-900">{{ formatDuration(session.startedAt, session.endedAt) }}</p>
              </div>
              <div>
                <p class="text-classroom-gray-500">Resources</p>
                <p class="text-classroom-gray-900">{{ session.resources?.length || 0 }}</p>
              </div>
              <div>
                <p class="text-classroom-gray-500">Notes</p>
                <p class="text-classroom-gray-900">{{ session.notes ? 'Available' : 'None' }}</p>
              </div>
            </div>
            
            <div class="mt-3 flex items-center space-x-2">
              <button class="btn-outline text-sm px-3 py-1">View Details</button>
              <button class="btn-outline text-sm px-3 py-1">Attendance</button>
            </div>
          </div>
          
          <div v-if="!classItem?.sessions?.length" class="text-center py-12 text-classroom-gray-500">
            <span class="material-icons text-4xl mb-2 opacity-50">history</span>
            <p>No sessions recorded yet</p>
            <p class="text-sm">Start a session to begin tracking</p>
          </div>
        </div>
      </div>

      <!-- Assignments Tab -->
      <div v-if="activeTab === 'assignments'" class="bg-white rounded-classroom classroom-shadow p-6">
        <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Class Assignments</h2>
        <p class="text-classroom-gray-500">Assignment management would be implemented here</p>
      </div>

      <!-- Resources Tab -->
      <div v-if="activeTab === 'resources'" class="bg-white rounded-classroom classroom-shadow p-6">
        <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Class Resources</h2>
        <p class="text-classroom-gray-500">Resource management would be implemented here</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClassesStore } from '../../store/classes'

const route = useRoute()
const router = useRouter()
const classesStore = useClassesStore()

const classItem = ref(null)
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'sessions', name: 'Sessions' },
  { id: 'assignments', name: 'Assignments' },
  { id: 'resources', name: 'Resources' }
]

const loadClass = async () => {
  const classId = route.params.id
  await classesStore.loadClasses()
  classItem.value = classesStore.getClassById(classId)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const formatDuration = (start, end) => {
  if (!start || !end) return ''
  const startTime = new Date(start)
  const endTime = new Date(end)
  const duration = (endTime - startTime) / (1000 * 60) // minutes
  return `${Math.round(duration)} minutes`
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

const startSession = async () => {
  try {
    const session = await classesStore.startSession(classItem.value.id)
    showToast('Session started successfully!')
    router.push(`/teacher/classes/${classItem.value.id}/live`)
  } catch (error) {
    console.error('Error starting session:', error)
    showToast('Error starting session')
  }
}

const joinSession = () => {
  router.push(`/teacher/classes/${classItem.value.id}/live`)
}

onMounted(() => {
  loadClass()
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
