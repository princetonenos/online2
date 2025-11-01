<template>
  <aside 
    class="fixed md:static top-16 left-0 bottom-0 z-30 bg-white border-r border-classroom-gray-200 w-64 transform transition-transform duration-300 ease-in-out custom-scrollbar overflow-y-auto"
    :class="{
      '-translate-x-full md:translate-x-0': !isOpen,
      'translate-x-0': isOpen
    }"
  >
    <div class="p-4">
      <!-- Create button -->
      <button 
        @click="openCreateModal"
        class="w-full btn-primary flex items-center justify-center space-x-2 mb-6"
      >
        <span class="material-icons text-lg">add</span>
        <span>Create</span>
      </button>

      <!-- Course list -->
      <div class="space-y-2">
        <h3 class="text-sm font-medium text-classroom-gray-500 uppercase px-2 mb-2">
          Classes
        </h3>
        
        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-2">
          <div v-for="n in 4" :key="n" class="flex items-center space-x-3 p-2">
            <div class="w-8 h-8 skeleton rounded-classroom"></div>
            <div class="flex-1">
              <div class="h-4 skeleton rounded mb-1"></div>
              <div class="h-3 skeleton rounded w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Course items -->
        <button
          v-for="course in userCourses"
          :key="course.id"
          @click="navigateToCourse(course.id)"
          class="w-full text-left p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors focus-classroom group"
          :class="{ 'bg-classroom-gray-100': currentCourseId === course.id }"
        >
          <div class="flex items-center space-x-3">
            <!-- Course color chip -->
            <div 
              class="w-8 h-8 rounded-classroom flex-shrink-0"
              :style="{ backgroundColor: course.color }"
            ></div>
            
            <!-- Course info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-classroom-gray-900 truncate">
                {{ course.name }}
              </p>
              <p class="text-xs text-classroom-gray-500 truncate">
                {{ course.section }}
              </p>
            </div>
          </div>
        </button>

        <!-- Join class button -->
        <button 
          @click="openJoinModal"
          class="w-full text-left p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors focus-classroom flex items-center space-x-3 text-classroom-gray-600"
        >
          <div class="w-8 h-8 rounded-classroom border-2 border-dashed border-classroom-gray-300 flex items-center justify-center flex-shrink-0">
            <span class="material-icons text-classroom-gray-400 text-sm">add</span>
          </div>
          <span class="text-sm">Join class</span>
        </button>
      </div>

      <!-- Calendar section -->
      <div class="mt-8">
        <h3 class="text-sm font-medium text-classroom-gray-500 uppercase px-2 mb-2">
          Calendar
        </h3>
        <div class="space-y-2">
          <button 
            v-for="event in upcomingEvents"
            :key="event.id"
            class="w-full text-left p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors focus-classroom"
          >
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: event.color }"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-classroom-gray-900 truncate">{{ event.title }}</p>
                <p class="text-xs text-classroom-gray-500">{{ event.time }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Archived classes section -->
      <div class="mt-8">
        <button 
          @click="toggleArchived"
          class="w-full text-left p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors focus-classroom flex items-center justify-between"
        >
          <span class="text-sm font-medium text-classroom-gray-500">Archived classes</span>
          <span class="material-icons text-classroom-gray-400 text-sm transform transition-transform" :class="{ 'rotate-180': showArchived }">
            expand_more
          </span>
        </button>

        <div v-if="showArchived" class="mt-2 space-y-2">
          <button
            v-for="course in archivedCourses"
            :key="course.id"
            class="w-full text-left p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors focus-classroom opacity-60"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-8 h-8 rounded-classroom flex-shrink-0"
                :style="{ backgroundColor: course.color }"
              ></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-classroom-gray-900 truncate">{{ course.name }}</p>
                <p class="text-xs text-classroom-gray-500 truncate">{{ course.section }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </aside>

  <!-- Backdrop for mobile -->
  <div 
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
    @click="closeDrawer"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsersStore } from '../store/users'
import { useCoursesStore } from '../store/courses'

const router = useRouter()
const route = useRoute()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()

const isOpen = ref(false)
const loading = ref(false)
const showArchived = ref(false)

// Mock upcoming events
const upcomingEvents = ref([
  {
    id: 1,
    title: 'Math Quiz',
    time: 'Tomorrow, 10:00 AM',
    color: '#20A464'
  },
  {
    id: 2,
    title: 'Project Due',
    time: 'Friday, 11:59 PM',
    color: '#F5BA14'
  },
  {
    id: 3,
    title: 'English Essay',
    time: 'Next Monday',
    color: '#4285F4'
  }
])

// Mock archived courses
const archivedCourses = ref([
  {
    id: 'archived1',
    name: 'Algebra I',
    section: 'Spring 2024',
    color: '#EA4335'
  },
  {
    id: 'archived2',
    name: 'Chemistry',
    section: 'Spring 2024',
    color: '#34A853'
  }
])

const currentUser = computed(() => usersStore.currentUser)
const userCourses = computed(() => {
  if (!currentUser.value) return []
  return coursesStore.getCoursesForUser(currentUser.value.id)
})

const currentCourseId = computed(() => {
  const match = route.path.match(/\/course\/([^\/]+)/)
  return match ? match[1] : null
})

const openCreateModal = () => {
  showToast('Create class functionality would open here')
}

const openJoinModal = () => {
  showToast('Join class modal would open here')
}

const navigateToCourse = (courseId) => {
  router.push(`/course/${courseId}/stream`)
  closeDrawer()
}

const toggleArchived = () => {
  showArchived.value = !showArchived.value
}

const closeDrawer = () => {
  isOpen.value = false
}

const openDrawer = () => {
  isOpen.value = true
}

// Listen for drawer toggle events
const handleToggleDrawer = () => {
  isOpen.value = !isOpen.value
}

onMounted(() => {
  window.addEventListener('toggle-drawer', handleToggleDrawer)
  // Load courses if not already loaded
  if (coursesStore.courses.length === 0) {
    loading.value = true
    coursesStore.loadCourses().finally(() => {
      loading.value = false
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('toggle-drawer', handleToggleDrawer)
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
