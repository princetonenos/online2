<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Your Classes</h1>
      <p class="text-classroom-gray-600">All the classes you're enrolled in</p>
    </div>

    <!-- Classes grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="course in enrolledClasses"
        :key="course.id"
        class="bg-white rounded-classroom classroom-shadow p-6 hover:shadow-classroom transition-shadow cursor-pointer group"
        @click="navigateToClass(course.id)"
      >
        <div class="w-full h-40 bg-gradient-to-br from-classroom-primary to-classroom-secondary rounded-classroom mb-4 flex items-center justify-center">
          <span class="material-icons text-white text-5xl">school</span>
        </div>
        <h3 class="font-medium text-classroom-gray-900 mb-2 group-hover:text-classroom-primary transition-colors">
          {{ course.name }}
        </h3>
        <p class="text-sm text-classroom-gray-600 mb-3">{{ course.teacherName }}</p>
        
        <div class="space-y-2 text-sm text-classroom-gray-500">
          <div class="flex items-center space-x-2">
            <span class="material-icons text-xs">person</span>
            <span>{{ course.enrolledStudents }} students</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="material-icons text-xs">code</span>
            <span class="font-mono">{{ course.code }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="material-icons text-xs">schedule</span>
            <span>{{ course.schedule || 'Mon, Wed, Fri' }}</span>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="flex space-x-2 mt-4 pt-4 border-t border-classroom-gray-100">
          <button 
            @click.stop="navigateToStream(course.id)"
            class="flex-1 text-xs bg-classroom-primary bg-opacity-10 text-classroom-primary hover:bg-opacity-20 py-2 px-3 rounded-classroom transition-colors flex items-center justify-center space-x-1"
          >
            <span class="material-icons text-sm">stream</span>
            <span>Stream</span>
          </button>
          <button 
            @click.stop="navigateToClasswork(course.id)"
            class="flex-1 text-xs bg-classroom-secondary bg-opacity-10 text-classroom-secondary hover:bg-opacity-20 py-2 px-3 rounded-classroom transition-colors flex items-center justify-center space-x-1"
          >
            <span class="material-icons text-sm">assignment</span>
            <span>Work</span>
          </button>
        </div>
      </div>

      <!-- Join class card -->
      <div 
        class="bg-white rounded-classroom classroom-shadow p-6 border-2 border-dashed border-classroom-gray-200 hover:border-classroom-primary transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
        @click="router.push('/student/join')"
      >
        <div class="w-16 h-16 bg-classroom-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
          <span class="material-icons text-classroom-primary text-2xl">group_add</span>
        </div>
        <h3 class="font-medium text-classroom-gray-900 mb-2">Join a Class</h3>
        <p class="text-sm text-classroom-gray-600">Enter a class code to join a new class</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="enrolledClasses.length === 0" class="text-center py-16">
      <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-icons text-classroom-gray-400 text-4xl">school</span>
      </div>
      <h3 class="text-xl font-medium text-classroom-gray-900 mb-2">No classes yet</h3>
      <p class="text-classroom-gray-600 mb-6">Get started by joining your first class</p>
      <button 
        @click="router.push('/student/join')"
        class="btn-primary"
      >
        Join your first class
      </button>
    </div>

    <!-- Upcoming assignments -->
    <div class="mt-12" v-if="upcomingAssignments.length > 0">
      <h2 class="text-2xl font-medium text-classroom-gray-900 mb-6">Upcoming Assignments</h2>
      
      <div class="bg-white rounded-classroom classroom-shadow overflow-hidden">
        <div class="divide-y divide-classroom-gray-100">
          <div
            v-for="assignment in upcomingAssignments"
            :key="assignment.id"
            class="p-4 hover:bg-classroom-gray-50 transition-colors cursor-pointer"
            @click="navigateToAssignment(assignment)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-classroom-gray-900 mb-1">
                  {{ assignment.title }}
                </h3>
                <p class="text-sm text-classroom-gray-600 mb-2">
                  {{ getCourseName(assignment.courseId) }}
                </p>
                <div class="flex items-center space-x-4 text-xs text-classroom-gray-500">
                  <span class="flex items-center space-x-1">
                    <span class="material-icons text-sm">schedule</span>
                    <span>{{ formatDueDate(assignment.dueDate) }}</span>
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'
import { useAssignmentsStore } from '../../store/assignments'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

const currentUser = computed(() => usersStore.currentUser)
const enrolledClasses = computed(() => {
  if (!currentUser.value) return []
  return coursesStore.getCoursesForUser(currentUser.value.id)
})

const upcomingAssignments = computed(() => {
  const assignments = assignmentsStore.assignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate)
    const now = new Date()
    return dueDate > now && dueDate < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
  })
  
  return assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5)
})

const getCourseName = (courseId) => {
  const course = coursesStore.getCourseById(courseId)
  return course?.name || 'Unknown Course'
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `In ${diffDays} days`
  
  return date.toLocaleDateString()
}

const getPointsClass = (points) => {
  if (points >= 100) return 'chip-primary'
  if (points >= 50) return 'chip-secondary'
  return 'chip-gray'
}

const navigateToClass = (classId) => {
  router.push(`/student/classes/${classId}`)
}

const navigateToStream = (classId) => {
  router.push(`/course/${classId}/stream`)
}

const navigateToClasswork = (classId) => {
  router.push(`/course/${classId}/classwork`)
}

const navigateToAssignment = (assignment) => {
  router.push(`/student/classwork/${assignment.id}`)
}
</script>
