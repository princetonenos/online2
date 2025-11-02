<template>
  <div class="p-6">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-medium text-classroom-gray-900">Edit User</h1>
        <router-link 
          to="/admin/users"
          class="btn-outline flex items-center space-x-2"
        >
          <span class="material-icons">arrow_back</span>
          <span>Back to Users</span>
        </router-link>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-classroom-gray-900 mb-2">
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Enter full name"
              class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
              :class="{ 'border-red-500': errors.name }"
            >
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-classroom-gray-900 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter email address"
              class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
              :class="{ 'border-red-500': errors.email }"
            >
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-classroom-gray-900 mb-2">
              Role
            </label>
            <select
              id="role"
              v-model="form.role"
              required
              class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
              :class="{ 'border-red-500': errors.role }"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <p v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</p>
          </div>

          <!-- School -->
          <div>
            <label for="school" class="block text-sm font-medium text-classroom-gray-900 mb-2">
              School
            </label>
            <input
              id="school"
              v-model="form.school"
              type="text"
              placeholder="Enter school name"
              class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
            >
          </div>

          <!-- Status -->
          <div>
            <label class="flex items-center space-x-2">
              <input
                v-model="form.status"
                type="checkbox"
                true-value="active"
                false-value="inactive"
                class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary"
              >
              <span class="text-sm text-classroom-gray-700">Active User</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-4 pt-6 border-t border-classroom-gray-200">
            <router-link 
              to="/admin/users"
              class="btn-outline"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary flex items-center space-x-2"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              <span v-if="loading" class="material-icons animate-spin">refresh</span>
              <span>{{ loading ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

const form = reactive({
  name: '',
  email: '',
  role: '',
  school: '',
  status: 'active'
})

const errors = reactive({
  name: '',
  email: '',
  role: ''
})

const validateForm = () => {
  let isValid = true

  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.role = ''

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  // Email validation
  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid'
    isValid = false
  }

  // Role validation
  if (!form.role) {
    errors.role = 'Role is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real app, this would update the store/API
    showToast(`User ${form.name} updated successfully`)
    
    // Redirect to users list
    router.push('/admin/users')
  } catch (error) {
    console.error('Error updating user:', error)
    showToast('Error updating user. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Load user data based on route param
  const userId = route.params.id
  // In a real app, this would fetch from store/API
  setTimeout(() => {
    // Mock user data
    Object.assign(form, {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      role: 'teacher',
      school: 'Main Campus',
      status: 'active'
    })
  }, 300)
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
