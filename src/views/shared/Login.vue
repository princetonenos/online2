<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="material-icons text-classroom-primary text-4xl">school</span>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Classroom Pro</h1>
        <p class="text-white text-opacity-90">Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-classroom classroom-shadow-lg p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- User Type Selection -->
          <div>
            <label class="block text-sm font-medium text-classroom-gray-900 mb-3">I am a:</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                type="button"
                @click="form.role = 'student'"
                class="p-4 border-2 rounded-classroom text-center transition-all duration-200"
                :class="form.role === 'student' 
                  ? 'border-classroom-primary bg-classroom-primary bg-opacity-5 text-classroom-primary' 
                  : 'border-classroom-gray-200 hover:border-classroom-gray-300 text-classroom-gray-700'"
              >
                <span class="material-icons text-2xl mb-2 block">school</span>
                <span class="text-sm font-medium">Student</span>
              </button>
              
              <button
                type="button"
                @click="form.role = 'teacher'"
                class="p-4 border-2 rounded-classroom text-center transition-all duration-200"
                :class="form.role === 'teacher' 
                  ? 'border-classroom-primary bg-classroom-primary bg-opacity-5 text-classroom-primary' 
                  : 'border-classroom-gray-200 hover:border-classroom-gray-300 text-classroom-gray-700'"
              >
                <span class="material-icons text-2xl mb-2 block">person</span>
                <span class="text-sm font-medium">Teacher</span>
              </button>
              
              <button
                type="button"
                @click="form.role = 'admin'"
                class="p-4 border-2 rounded-classroom text-center transition-all duration-200"
                :class="form.role === 'admin' 
                  ? 'border-classroom-primary bg-classroom-primary bg-opacity-5 text-classroom-primary' 
                  : 'border-classroom-gray-200 hover:border-classroom-gray-300 text-classroom-gray-700'"
              >
                <span class="material-icons text-2xl mb-2 block">admin_panel_settings</span>
                <span class="text-sm font-medium">Admin</span>
              </button>
            </div>
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
              placeholder="Enter your email"
              class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
              :class="{ 'border-red-500': errors.email }"
            >
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-classroom-gray-900 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Enter your password"
              class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
              :class="{ 'border-red-500': errors.password }"
            >
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center space-x-2">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary focus-classroom"
              >
              <span class="text-sm text-classroom-gray-700">Remember me</span>
            </label>
            <button type="button" class="text-sm text-classroom-primary hover:text-classroom-primary-dark transition-colors">
              Forgot password?
            </button>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-classroom-primary hover:bg-classroom-primary-dark text-white py-3 px-4 rounded-classroom transition-colors font-medium focus-classroom flex items-center justify-center space-x-2"
            :class="{ 'opacity-50 cursor-not-allowed': loading }"
          >
            <span v-if="loading" class="material-icons animate-spin">refresh</span>
            <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
          </button>

          <!-- Demo Accounts -->
          <div class="border-t border-classroom-gray-200 pt-6">
            <p class="text-sm text-classroom-gray-600 text-center mb-4">Demo Accounts:</p>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                @click="fillDemoCredentials('student')"
                class="p-2 bg-classroom-gray-100 hover:bg-classroom-gray-200 rounded-classroom transition-colors text-classroom-gray-700"
              >
                Student
              </button>
              <button
                type="button"
                @click="fillDemoCredentials('teacher')"
                class="p-2 bg-classroom-gray-100 hover:bg-classroom-gray-200 rounded-classroom transition-colors text-classroom-gray-700"
              >
                Teacher
              </button>
              <button
                type="button"
                @click="fillDemoCredentials('admin')"
                class="p-2 bg-classroom-gray-100 hover:bg-classroom-gray-200 rounded-classroom transition-colors text-classroom-gray-700"
              >
                Admin
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-white text-opacity-80 text-sm">
          Don't have an account? 
          <button class="text-white font-medium hover:underline transition-colors">
            Contact administrator
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'

const router = useRouter()
const usersStore = useUsersStore()

const loading = ref(false)

const form = reactive({
  role: 'student',
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: '',
  role: ''
})

// Demo credentials for each role
const demoCredentials = {
  student: {
    email: 'alex.rodriguez@student.edu',
    password: 'student123',
    role: 'student'
  },
  teacher: {
    email: 'sarah.johnson@school.edu',
    password: 'teacher123',
    role: 'teacher'
  },
  admin: {
    email: 'admin@school.edu',
    password: 'admin123',
    role: 'admin'
  }
}

const validateForm = () => {
  let isValid = true

  // Reset errors
  errors.email = ''
  errors.password = ''
  errors.role = ''

  // Email validation
  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid'
    isValid = false
  }

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  // Role validation
  if (!form.role) {
    errors.role = 'Please select your role'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Find user in the store
    const user = usersStore.users.find(u => 
      u.email === form.email && 
      u.role === form.role
    )

    if (!user) {
      showToast('Invalid credentials. Please check your email and role.')
      return
    }

    // Set current user in store
    usersStore.setCurrentUser(user)

    // Save to localStorage if remember me is checked
    if (form.rememberMe) {
      localStorage.setItem('mock:currentUser', JSON.stringify(user))
    }

    showToast(`Welcome back, ${user.name}!`)

    // Redirect based on role
    switch (user.role) {
      case 'admin':
        router.push({ name: 'AdminDashboard' })
        break
      case 'teacher':
        router.push({ name: 'TeacherDashboard' })
        break
      case 'student':
      default:
        router.push({ name: 'StudentDashboard' })
        break
    }
  } catch (error) {
    console.error('Login error:', error)
    showToast('An error occurred during login. Please try again.')
  } finally {
    loading.value = false
  }
}

const fillDemoCredentials = (role) => {
  const credentials = demoCredentials[role]
  form.role = credentials.role
  form.email = credentials.email
  form.password = credentials.password
}

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  } else {
    alert(message) // Fallback
  }
}

onMounted(() => {
  // Check if user is already logged in
  const savedUser = localStorage.getItem('mock:currentUser')
  if (savedUser) {
    const user = JSON.parse(savedUser)
    usersStore.setCurrentUser(user)
    
    // Redirect based on role
    switch (user.role) {
      case 'admin':
        router.push('/admin')
        break
      case 'teacher':
        router.push('/teacher')
        break
      case 'student':
      default:
        router.push('/student')
        break
    }
  }
})
</script>
