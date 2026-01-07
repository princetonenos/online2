<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center mb-4">
        <button 
          @click="goBack"
          class="flex items-center space-x-2 text-classroom-gray-600 hover:text-classroom-primary transition-colors mb-2"
        >
          <span class="material-icons">arrow_back</span>
          <span>Back</span>
        </button>
      </div>
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">People</h1>
      <p class="text-classroom-gray-600">Teachers and classmates in your courses</p>
    </div>

    <!-- Classes list -->
    <div class="space-y-6">
      <div 
        v-for="course in enrolledClasses"
        :key="course.id"
        class="bg-white rounded-classroom classroom-shadow overflow-hidden"
      >
        <div class="p-4 border-b border-classroom-gray-200">
          <h2 class="text-xl font-medium text-classroom-gray-900">{{ course.name }}</h2>
          <p class="text-classroom-gray-600">{{ course.teacherName }}</p>
        </div>
        
        <!-- Teachers -->
        <div class="p-4 border-b border-classroom-gray-200">
          <h3 class="font-medium text-classroom-gray-900 mb-3">Teachers</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-classroom-primary rounded-full flex items-center justify-center text-white font-medium">
                {{ getInitials(course.teacherName) }}
              </div>
              <div>
                <p class="font-medium text-classroom-gray-900">{{ course.teacherName }}</p>
                <p class="text-sm text-classroom-gray-600">Teacher</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Classmates -->
        <div class="p-4">
          <h3 class="font-medium text-classroom-gray-900 mb-3">Classmates</h3>
          <div v-if="getClassmates(course.id).length === 0" class="text-center py-4 text-classroom-gray-500">
            <p>No other students in this class yet</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="student in getClassmates(course.id)"
              :key="student.id"
              class="flex items-center space-x-3"
            >
              <div class="w-10 h-10 bg-classroom-gray-200 rounded-full flex items-center justify-center text-classroom-gray-600 font-medium">
                {{ getInitials(student.name) }}
              </div>
              <div>
                <p class="font-medium text-classroom-gray-900">{{ student.name }}</p>
                <p class="text-sm text-classroom-gray-600">Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="enrolledClasses.length === 0" class="text-center py-16">
      <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-icons text-classroom-gray-400 text-4xl">people</span>
      </div>
      <h3 class="text-xl font-medium text-classroom-gray-900 mb-2">No classes yet</h3>
      <p class="text-classroom-gray-600 mb-6">Join classes to see teachers and classmates</p>
      <button 
        @click="router.push('/student/classes/join')"
        class="bg-classroom-primary hover:bg-classroom-primary-dark text-white py-2 px-4 rounded-classroom transition-colors font-medium"
      >
        Join a Class
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()

const currentUser = computed(() => usersStore.currentUser)
const enrolledClasses = computed(() => {
  if (!currentUser.value) return []
  return coursesStore.getCoursesForUser(currentUser.value.id)
})

const getClassmates = (courseId) => {
  const course = coursesStore.getCourseById(courseId)
  if (!course || !course.students) return []
  
  // Filter out the current user from classmates
  return course.students.filter(student => student.id !== currentUser.value?.id)
}

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

onMounted(async () => {
  try {
    await coursesStore.loadCourses()
  } catch (error) {
    console.error('Error loading people data:', error)
    showToast('Error loading people information')
  }
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}

const goBack = () => {
  router.back()
}
</script>
