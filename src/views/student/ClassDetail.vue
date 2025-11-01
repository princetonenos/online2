<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Class Header -->
    <div class="bg-white rounded-classroom classroom-shadow p-6 mb-6">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">{{ currentClass?.name }}</h1>
          <p class="text-classroom-gray-600">{{ currentClass?.teacherName }}</p>
          <p class="text-sm text-classroom-gray-500">Section: {{ currentClass?.section }} • Code: {{ currentClass?.code }}</p>
        </div>
        <button 
          @click="joinLiveClass"
          class="btn-primary flex items-center space-x-2"
        >
          <span class="material-icons">video_call</span>
          <span>Join Live Class</span>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-classroom-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="activeTab === tab.id 
            ? 'border-classroom-primary text-classroom-primary' 
            : 'border-transparent text-classroom-gray-500 hover:text-classroom-gray-700 hover:border-classroom-gray-300'"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'stream'">
      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">Class Stream</h2>
        <div v-if="announcements.length === 0" class="text-center py-8 text-classroom-gray-500">
          <span class="material-icons text-4xl mb-2 opacity-50">campaign</span>
          <p>No announcements yet</p>
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="announcement in announcements"
            :key="announcement.id"
            class="p-4 border border-classroom-gray-200 rounded-classroom"
          >
            <div class="flex items-start space-x-3">
              <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-classroom-primary">campaign</span>
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-classroom-gray-900 mb-1">{{ announcement.title }}</h3>
                <p class="text-classroom-gray-600 mb-2">{{ announcement.content }}</p>
                <p class="text-xs text-classroom-gray-500">{{ formatTime(announcement.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'classwork'">
      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">Classwork</h2>
        <div v-if="assignments.length === 0" class="text-center py-8 text-classroom-gray-500">
          <span class="material-icons text-4xl mb-2 opacity-50">assignment</span>
          <p>No assignments yet</p>
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="assignment in assignments"
            :key="assignment.id"
            class="p-4 border border-classroom-gray-200 rounded-classroom hover:border-classroom-primary transition-colors cursor-pointer"
            @click="navigateToAssignment(assignment)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-classroom-gray-900 mb-1">{{ assignment.title }}</h3>
                <p class="text-sm text-classroom-gray-600 mb-2">{{ assignment.description }}</p>
                <div class="flex items-center space-x-4 text-xs text-classroom-gray-500">
                  <span class="flex items-center space-x-1">
                    <span class="material-icons text-sm">schedule</span>
                    <span>Due {{ formatDueDate(assignment.dueDate) }}</span>
                  </span>
                  <span class="chip" :class="getPointsClass(assignment.points)">
                    {{ assignment.points }} points
                  </span>
                  <span v-if="assignment.submissionStatus === 'submitted'" class="chip chip-primary">
                    Submitted
                  </span>
                  <span v-else class="chip chip-secondary">
                    Pending
                  </span>
                </div>
              </div>
              <span class="material-icons text-classroom-gray-400">chevron_right</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'people'">
      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">People</h2>
        <div class="space-y-4">
          <!-- Teacher -->
          <div class="flex items-center space-x-3 p-3 bg-classroom-primary bg-opacity-5 rounded-classroom">
            <div class="w-10 h-10 bg-classroom-primary rounded-full flex items-center justify-center">
              <span class="material-icons text-white text-sm">person</span>
            </div>
            <div>
              <h3 class="font-medium text-classroom-gray-900">{{ currentClass?.teacherName }}</h3>
              <p class="text-sm text-classroom-gray-600">Teacher</p>
            </div>
          </div>
          
          <!-- Students -->
          <div 
            v-for="student in students"
            :key="student.id"
            class="flex items-center space-x-3 p-3 border border-classroom-gray-200 rounded-classroom"
          >
            <div class="w-10 h-10 bg-classroom-gray-200 rounded-full flex items-center justify-center">
              <span class="material-icons text-classroom-gray-600 text-sm">person</span>
            </div>
            <div>
              <h3 class="font-medium text-classroom-gray-900">{{ student.name }}</h3>
              <p class="text-sm text-classroom-gray-600">Student</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'grades'">
      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">Grades</h2>
        <div v-if="gradedAssignments.length === 0" class="text-center py-8 text-classroom-gray-500">
          <span class="material-icons text-4xl mb-2 opacity-50">grade</span>
          <p>No graded assignments yet</p>
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="assignment in gradedAssignments"
            :key="assignment.id"
            class="p-4 border border-classroom-gray-200 rounded-classroom"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-classroom-gray-900 mb-1">{{ assignment.title }}</h3>
                <p class="text-sm text-classroom-gray-600">Submitted on {{ formatTime(assignment.submittedAt) }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-medium text-classroom-primary">{{ assignment.grade }}/{{ assignment.points }}</p>
                <p class="text-sm text-classroom-gray-600">{{ Math.round((assignment.grade / assignment.points) * 100) }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '../../store/courses'
import { useAssignmentsStore } from '../../store/assignments'
import { usePostsStore } from '../../store/posts'
import { useUsersStore } from '../../store/users'

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()
const postsStore = usePostsStore()
const usersStore = useUsersStore()

const activeTab = ref('stream')

const tabs = [
  { id: 'stream', name: 'Stream' },
  { id: 'classwork', name: 'Classwork' },
  { id: 'people', name: 'People' },
  { id: 'grades', name: 'Grades' }
]

const currentClass = computed(() => {
  return coursesStore.getCourseById(route.params.id)
})

const announcements = computed(() => {
  return postsStore.posts
    .filter(post => post.courseId === route.params.id && post.type === 'announcement')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const assignments = computed(() => {
  return assignmentsStore.assignments
    .filter(assignment => assignment.courseId === route.params.id)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
})

const gradedAssignments = computed(() => {
  return assignments.value.filter(assignment => assignment.submissionStatus === 'submitted' && assignment.grade)
})

const students = computed(() => {
  // Mock students - in real app this would come from course enrollment data
  return [
    { id: 1, name: 'Alex Johnson' },
    { id: 2, name: 'Maria Garcia' },
    { id: 3, name: 'David Smith' },
    { id: 4, name: 'Sarah Williams' }
  ]
})

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleDateString()
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  return date.toLocaleDateString()
}

const getPointsClass = (points) => {
  if (points >= 100) return 'chip-primary'
  if (points >= 50) return 'chip-secondary'
  return 'chip-gray'
}

const navigateToAssignment = (assignment) => {
  router.push(`/student/classwork/${assignment.id}`)
}

const joinLiveClass = () => {
  router.push(`/course/${route.params.id}/live`)
}

onMounted(async () => {
  try {
    await Promise.all([
      coursesStore.loadCourses(),
      assignmentsStore.loadAssignments(),
      postsStore.loadPosts()
    ])
  } catch (error) {
    console.error('Error loading class data:', error)
    showToast('Error loading class information')
  }
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
