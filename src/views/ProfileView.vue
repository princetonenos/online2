<template>
  <div class="p-6 max-w-4xl mx-auto" data-testid="page-profile">
    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900 mb-6">Profile</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile picture and basic info -->
        <div class="lg:col-span-1">
          <div class="text-center">
            <div class="relative inline-block">
              <img 
                :src="currentUser?.avatar" 
                :alt="currentUser?.name"
                class="w-32 h-32 rounded-full mx-auto mb-4"
              >
              <button 
                class="absolute bottom-2 right-2 w-8 h-8 bg-classroom-primary rounded-full flex items-center justify-center text-white hover:bg-classroom-primary-dark transition-colors"
                aria-label="Change profile picture"
              >
                <span class="material-icons text-sm">photo_camera</span>
              </button>
            </div>
            <h2 class="text-xl font-medium text-classroom-gray-900">{{ currentUser?.name }}</h2>
            <p class="text-classroom-gray-600">{{ currentUser?.email }}</p>
            <span class="chip mt-2" :class="getRoleClass(currentUser?.role)">
              {{ currentUser?.role }}
            </span>
          </div>

          <!-- Quick stats -->
          <div class="mt-6 space-y-3">
            <div class="flex items-center justify-between p-3 bg-classroom-gray-50 rounded-classroom">
              <span class="text-sm text-classroom-gray-600">Classes</span>
              <span class="font-medium text-classroom-gray-900">{{ userStats.classes }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-classroom-gray-50 rounded-classroom">
              <span class="text-sm text-classroom-gray-600">Assignments</span>
              <span class="font-medium text-classroom-gray-900">{{ userStats.assignments }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-classroom-gray-50 rounded-classroom">
              <span class="text-sm text-classroom-gray-600">Joined</span>
              <span class="font-medium text-classroom-gray-900">{{ userStats.joinedDate }}</span>
            </div>
          </div>
        </div>

        <!-- Profile form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- Personal Information -->
            <div class="border border-classroom-gray-200 rounded-classroom p-6">
              <h3 class="text-lg font-medium text-classroom-gray-900 mb-4">Personal Information</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    v-model="profileForm.name"
                    type="text"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                    Role
                  </label>
                  <select
                    v-model="profileForm.role"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                    disabled
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                    Timezone
                  </label>
                  <select
                    v-model="profileForm.timezone"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                    <option value="UTC+8">China Standard Time (UTC+8)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Bio Section -->
            <div class="border border-classroom-gray-200 rounded-classroom p-6">
              <h3 class="text-lg font-medium text-classroom-gray-900 mb-4">About</h3>
              <div>
                <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                  Bio
                </label>
                <textarea
                  v-model="profileForm.bio"
                  rows="4"
                  placeholder="Tell us a bit about yourself..."
                  class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors resize-none"
                ></textarea>
                <p class="text-xs text-classroom-gray-500 mt-1">{{ profileForm.bio.length }}/500 characters</p>
              </div>
            </div>

            <!-- Student-specific fields -->
            <div v-if="isStudent" class="border border-classroom-gray-200 rounded-classroom p-6">
              <h3 class="text-lg font-medium text-classroom-gray-900 mb-4">Student Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                    Grade Level
                  </label>
                  <select
                    v-model="profileForm.gradeLevel"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                  >
                    <option value="">Select grade level</option>
                    <option value="elementary">Elementary</option>
                    <option value="middle-school">Middle School</option>
                    <option value="high-school">High School</option>
                    <option value="college">College</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                    Student ID
                  </label>
                  <input
                    v-model="profileForm.studentId"
                    type="text"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                  >
                </div>
              </div>
            </div>

            <!-- Teacher-specific fields -->
            <div v-if="isTeacher" class="border border-classroom-gray-200 rounded-classroom p-6">
              <h3 class="text-lg font-medium text-classroom-gray-900 mb-4">Teacher Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                    Department
                  </label>
                  <input
                    v-model="profileForm.department"
                    type="text"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                    Office Hours
                  </label>
                  <input
                    v-model="profileForm.officeHours"
                    type="text"
                    placeholder="e.g., Mon-Wed 2-4 PM"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                  >
                </div>
              </div>
            </div>

            <!-- Save button -->
            <div class="flex items-center justify-end space-x-4">
              <button type="button" class="btn-outline">Cancel</button>
              <button type="submit" class="btn-primary flex items-center space-x-2" :disabled="loading">
                <span v-if="loading" class="material-icons animate-spin">refresh</span>
                <span>{{ loading ? 'Saving...' : 'Save Changes' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUsersStore } from '../store/users'

const usersStore = useUsersStore()

const loading = ref(false)

const currentUser = computed(() => usersStore.currentUser)
const isStudent = computed(() => currentUser.value?.role === 'student')
const isTeacher = computed(() => currentUser.value?.role === 'teacher')
const isAdmin = computed(() => currentUser.value?.role === 'admin')

// Mock user stats
const userStats = ref({
  classes: isTeacher.value ? 3 : 5,
  assignments: isTeacher.value ? 12 : 8,
  joinedDate: 'Jan 2024'
})

// Profile form
const profileForm = reactive({
  name: '',
  email: '',
  role: '',
  timezone: 'UTC-5',
  bio: '',
  gradeLevel: '',
  studentId: '',
  department: '',
  officeHours: ''
})

const getRoleClass = (role) => {
  const roleClasses = {
    admin: 'chip-primary',
    teacher: 'chip-secondary',
    student: 'chip-gray'
  }
  return roleClasses[role] || 'chip-gray'
}

const saveProfile = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToast('Profile updated successfully!')
  } catch (error) {
    console.error('Error saving profile:', error)
    showToast('Error updating profile. Please try again.')
  } finally {
    loading.value = false
  }
}

// Initialize form with current user data
onMounted(() => {
  if (currentUser.value) {
    profileForm.name = currentUser.value.name || ''
    profileForm.email = currentUser.value.email || ''
    profileForm.role = currentUser.value.role || ''
    profileForm.bio = currentUser.value.bio || 'Passionate educator dedicated to student success.'
    
    if (isStudent.value) {
      profileForm.gradeLevel = 'high-school'
      profileForm.studentId = 'STU2024001'
    }
    
    if (isTeacher.value) {
      profileForm.department = 'Mathematics'
      profileForm.officeHours = 'Mon-Wed 2-4 PM'
    }
  }
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
