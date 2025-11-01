<template>
  <div class="p-6 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Join a Class</h1>
      <p class="text-classroom-gray-600">Enter the class code provided by your teacher</p>
    </div>

    <!-- Join Form -->
    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <form @submit.prevent="joinClass" class="space-y-6">
        <div>
          <label for="classCode" class="block text-sm font-medium text-classroom-gray-900 mb-2">
            Class Code
          </label>
          <input
            id="classCode"
            v-model="classCode"
            type="text"
            required
            placeholder="Enter class code (e.g., abc-def-123)"
            class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
            :class="{ 'border-red-500': error }"
          >
          <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
          <p class="text-sm text-classroom-gray-500 mt-1">
            Ask your teacher for the class code, then enter it here.
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-classroom-primary hover:bg-classroom-primary-dark text-white py-3 px-4 rounded-classroom transition-colors font-medium focus-classroom flex items-center justify-center space-x-2"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          <span v-if="loading" class="material-icons animate-spin">refresh</span>
          <span>{{ loading ? 'Joining...' : 'Join Class' }}</span>
        </button>
      </form>
    </div>

    <!-- Demo classes -->
    <div class="mt-8">
      <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">Available Demo Classes</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="demoClass in demoClasses"
          :key="demoClass.code"
          class="bg-white rounded-classroom classroom-shadow p-4 border border-classroom-gray-200 hover:border-classroom-primary transition-colors cursor-pointer"
          @click="classCode = demoClass.code"
        >
          <h3 class="font-medium text-classroom-gray-900 mb-1">{{ demoClass.name }}</h3>
          <p class="text-sm text-classroom-gray-600 mb-2">{{ demoClass.teacher }}</p>
          <div class="flex items-center justify-between text-xs text-classroom-gray-500">
            <span>Code: {{ demoClass.code }}</span>
            <span>{{ demoClass.students }} students</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '../../store/courses'
import { useUsersStore } from '../../store/users'

const router = useRouter()
const coursesStore = useCoursesStore()
const usersStore = useUsersStore()

const classCode = ref('')
const loading = ref(false)
const error = ref('')

const demoClasses = [
  { code: 'math-101', name: 'Mathematics 101', teacher: 'Dr. Johnson', students: 24 },
  { code: 'science-202', name: 'Science Fundamentals', teacher: 'Ms. Davis', students: 18 },
  { code: 'history-301', name: 'World History', teacher: 'Mr. Thompson', students: 22 },
  { code: 'english-102', name: 'English Literature', teacher: 'Mrs. Wilson', students: 20 }
]

const joinClass = async () => {
  if (!classCode.value.trim()) {
    error.value = 'Please enter a class code'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Find course by code
    const course = coursesStore.courses.find(c => c.code === classCode.value.trim().toLowerCase())
    
    if (!course) {
      error.value = 'Class not found. Please check the code and try again.'
      return
    }

    // Add user to course (in a real app, this would be an API call)
    const currentUser = usersStore.currentUser
    if (currentUser && !course.enrolledStudents.includes(currentUser.id)) {
      course.enrolledStudents.push(currentUser.id)
      coursesStore.saveToStorage()
    }

    showToast(`Successfully joined ${course.name}!`)
    router.push('/student/dashboard')
  } catch (err) {
    console.error('Error joining class:', err)
    error.value = 'An error occurred while joining the class. Please try again.'
  } finally {
    loading.value = false
  }
}

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
