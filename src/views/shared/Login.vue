<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Floating Background Icons -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Book Icons -->
      <div class="absolute top-10 left-5 md:left-10 text-blue-200 opacity-30 animate-float-slow">
        <span class="material-icons text-4xl md:text-6xl">menu_book</span>
      </div>
      <div class="absolute top-20 right-8 md:right-16 text-green-200 opacity-25 animate-float-medium">
        <span class="material-icons text-3xl md:text-5xl">auto_stories</span>
      </div>
      <div class="absolute bottom-32 left-8 md:left-20 text-purple-200 opacity-20 animate-float-fast">
        <span class="material-icons text-2xl md:text-4xl">book</span>
      </div>
      
      <!-- Pen Icons -->
      <div class="absolute top-40 left-20 md:left-32 text-red-200 opacity-25 animate-float-slow">
        <span class="material-icons text-3xl md:text-5xl">edit</span>
      </div>
      <div class="absolute bottom-40 right-20 md:right-32 text-yellow-200 opacity-30 animate-float-medium">
        <span class="material-icons text-4xl md:text-6xl">create</span>
      </div>
      
      <!-- Board Icons -->
      <div class="absolute top-60 right-10 md:right-24 text-indigo-200 opacity-20 animate-float-fast">
        <span class="material-icons text-5xl md:text-7xl">dashboard</span>
      </div>
      <div class="absolute bottom-20 left-16 md:left-40 text-teal-200 opacity-25 animate-float-slow">
        <span class="material-icons text-4xl md:text-6xl">assignment</span>
      </div>
      
      <!-- Teacher Icons -->
      <div class="absolute top-32 right-32 md:right-48 text-pink-200 opacity-30 animate-float-medium">
        <span class="material-icons text-4xl md:text-6xl">school</span>
      </div>
      <div class="absolute bottom-60 left-32 md:left-48 text-orange-200 opacity-20 animate-float-fast">
        <span class="material-icons text-3xl md:text-5xl">person</span>
      </div>
      <div class="absolute top-48 left-48 md:left-64 text-cyan-200 opacity-25 animate-float-slow">
        <span class="material-icons text-5xl md:text-7xl">groups</span>
      </div>
    </div>

    <!-- Login Form -->
    <div class="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 z-10 border border-white/50 transform transition-all duration-300 hover:shadow-3xl max-h-[95vh] overflow-y-auto">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-3 shadow-lg transform transition-transform hover:scale-110 duration-300">
          <span class="material-icons text-white text-3xl">school</span>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
          Welcome Back
        </h1>
        <p class="text-gray-600 text-xs">Sign in to continue your learning journey</p>
        
        <!-- Security Badge -->
        <div class="mt-3 inline-flex items-center space-x-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
          <span class="material-icons text-green-600 text-xs">verified_user</span>
          <span class="text-green-700 text-xs font-medium">Secure Login</span>
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <!-- Email Input -->
        <div class="space-y-1.5">
          <label class="block text-xs font-medium text-gray-700">Email Address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-icons text-gray-400 text-base">email</span>
            </div>
            <input 
              v-model="form.email" 
              type="email" 
              required 
              autocomplete="email"
              placeholder="Enter your email"
              class="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm"
              :class="{'border-red-300 focus:ring-red-500 focus:border-red-500': error}"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-medium text-gray-700">Password</label>
            <!-- Password Strength Indicator -->
            <div v-if="form.password" class="flex items-center space-x-0.5">
              <div 
                v-for="i in 3" 
                :key="i"
                class="w-5 h-1 rounded-full transition-colors duration-200"
                :class="passwordStrength >= i ? (passwordStrength === 1 ? 'bg-red-500' : passwordStrength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-300'"
              ></div>
            </div>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-icons text-gray-400 text-base">lock</span>
            </div>
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'"
              required 
              autocomplete="current-password"
              placeholder="Enter your password"
              @input="checkPasswordStrength"
              class="w-full pl-9 pr-11 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm"
              :class="{'border-red-300 focus:ring-red-500 focus:border-red-500': error}"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span class="material-icons text-base">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember" 
              type="checkbox" 
              v-model="remember" 
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <label for="remember" class="ml-2 text-sm text-gray-700 cursor-pointer select-none hover:text-gray-900">Remember me for 30 days</label>
          </div>

          <button 
            type="button"
            @click="showForgotPasswordModal = true"
            class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors underline-offset-2 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <!-- Login Attempts Warning -->
        <div v-if="loginAttempts > 0" class="p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
          <span class="material-icons text-yellow-600 text-base flex-shrink-0 mt-0.5">warning</span>
          <div class="text-xs text-yellow-800">
            <p class="font-medium">{{ loginAttempts }} failed attempt{{ loginAttempts > 1 ? 's' : '' }}</p>
            <p class="mt-0.5">{{ remainingAttempts }} remaining before lockout</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <span class="material-icons text-red-500 text-base flex-shrink-0 mt-0.5">error</span>
          <p class="text-xs text-red-700 flex-1">{{ error }}</p>
        </div>

        <!-- Submit Button -->
        <button
          :disabled="loading || isLocked"
          class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
          type="submit"
        >
          <span v-if="loading" class="material-icons animate-spin text-lg">autorenew</span>
          <span v-else-if="isLocked" class="material-icons text-lg">lock</span>
          <span class="text-base">{{ loading ? 'Signing in...' : isLocked ? 'Account Locked' : 'Sign In Securely' }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-5">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="px-3 bg-white text-gray-500">Quick Access</span>
        </div>
      </div>

      <!-- Quick Sign-In Buttons -->
      <div class="grid grid-cols-3 gap-2">
        <button 
          @click="quick('admin')" 
          class="px-3 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium text-xs shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <span class="material-icons text-xs block mb-0.5">admin_panel_settings</span>
          Admin
        </button>
        <button 
          @click="quick('teacher')" 
          class="px-3 py-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-xs shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <span class="material-icons text-xs block mb-0.5">school</span>
          Teacher
        </button>
        <button 
          @click="quick('student')" 
          class="px-3 py-2.5 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium text-xs shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <span class="material-icons text-xs block mb-0.5">person</span>
          Student
        </button>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 classroom-shadow">
        <div class="text-center mb-6">
          <div class="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span class="material-icons text-blue-600 text-2xl">lock_reset</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
          <p class="text-gray-600">Enter your email address and we'll notify the system administrator to restore your account access.</p>
        </div>

        <form @submit.prevent="handlePasswordReset" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="material-icons text-gray-400 text-lg">email</span>
              </div>
              <input 
                v-model="resetEmail"
                type="email" 
                required 
                placeholder="Enter your registered email"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                :class="{'border-red-300 focus:ring-red-500 focus:border-red-500': resetError}"
              />
            </div>
          </div>

          <div v-if="resetError" class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
            <span class="material-icons text-red-500 text-lg flex-shrink-0 mt-0.5">error</span>
            <p class="text-sm text-red-700 flex-1">{{ resetError }}</p>
          </div>

          <div v-if="resetSuccess" class="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div class="flex items-center space-x-3">
              <span class="material-icons text-green-500 text-lg">check_circle</span>
              <div>
                <p class="text-sm font-medium text-green-800">Request Submitted Successfully</p>
                <p class="text-sm text-green-700 mt-1">The system administrator has been notified and will contact you shortly to restore your account access.</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="closeForgotPasswordModal"
              class="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              :disabled="resetLoading"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="resetLoading"
              class="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span v-if="resetLoading" class="material-icons animate-spin text-lg">autorenew</span>
              <span>{{ resetLoading ? 'Submitting...' : 'Submit Request' }}</span>
            </button>
          </div>
        </form>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div class="flex items-start space-x-3">
            <span class="material-icons text-blue-500 text-lg flex-shrink-0 mt-0.5">info</span>
            <div class="text-sm text-blue-700">
              <p class="font-medium">What happens next?</p>
              <p class="mt-1">The system administrator will review your request and contact you via email to verify your identity and restore your account access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../store/auth'

const router = useRouter()
const auth = useAuth()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const remember = ref(true)
const showPassword = ref(false)
const loginAttempts = ref(0)
const passwordStrength = ref(0)
const isLocked = ref(false)
const maxAttempts = 5

const remainingAttempts = computed(() => maxAttempts - loginAttempts.value)

// Check password strength
function checkPasswordStrength() {
  const password = form.value.password
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++
  
  passwordStrength.value = Math.min(strength, 3)
}

// Forgot password modal state
const showForgotPasswordModal = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)
const resetError = ref('')
const resetSuccess = ref(false)

const targetByRole = {
  admin: 'AdminDashboard',
  teacher: 'TeacherDashboard',
  student: 'StudentDashboard'
}

function routeExists(name) {
  try { return router.hasRoute(name) } catch (e) { return false }
}

async function submit() {
  if (isLocked.value) {
    error.value = 'Account is locked due to too many failed attempts. Please contact support.'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    // call store login which returns user object { role, id, name, ... }
    const user = await auth.login({ email: form.value.email, password: form.value.password })
    if (!user) throw new Error('Login failed')

    console.log('Login successful - User:', user, 'Role:', user.role)
    
    // Reset login attempts on successful login
    loginAttempts.value = 0
    localStorage.removeItem('loginAttempts')
    localStorage.removeItem('lockoutTime')
    
    // decide target route safely
    const targetName = targetByRole[user.role] || null
    console.log('Target route:', targetName, 'Route exists:', routeExists(targetName))
    
    if (targetName && routeExists(targetName)) {
      console.log('Navigating to:', targetName)
      await router.push({ name: targetName })
      return
    }

    // fallback behavior if route missing
    if (routeExists('Dashboard')) {
      console.log('Fallback to Dashboard')
      await router.push({ name: 'Dashboard' })
      return
    }

    error.value = `Signed in as ${user.role} but target route missing. Contact admin.`
  } catch (err) {
    console.error('Login error:', err)
    
    // Increment login attempts
    loginAttempts.value++
    localStorage.setItem('loginAttempts', loginAttempts.value.toString())
    
    // Lock account after max attempts
    if (loginAttempts.value >= maxAttempts) {
      isLocked.value = true
      const lockoutTime = Date.now() + (15 * 60 * 1000) // 15 minutes lockout
      localStorage.setItem('lockoutTime', lockoutTime.toString())
      error.value = 'Too many failed attempts. Account locked for 15 minutes.'
    } else {
      // show friendly messages
      if (err?.code === 'ETIMEDOUT') {
        error.value = 'Network timeout. Please check your connection and try again.'
       } else if (err?.response?.status === 401) {
        error.value = `Invalid email or password. ${remainingAttempts.value} attempt${remainingAttempts.value !== 1 ? 's' : ''} remaining.`
      } else {
        error.value = err.message || 'Failed to sign in. Please try again.'
      }
    }
  } finally {
    loading.value = false
  }
}

// Check if account is locked on component mount
function checkLockout() {
  const attempts = localStorage.getItem('loginAttempts')
  const lockoutTime = localStorage.getItem('lockoutTime')
  
  if (attempts) {
    loginAttempts.value = parseInt(attempts)
  }
  
  if (lockoutTime) {
    const now = Date.now()
    const lockout = parseInt(lockoutTime)
    
    if (now < lockout) {
      isLocked.value = true
      const remainingTime = Math.ceil((lockout - now) / 60000)
      error.value = `Account locked. Try again in ${remainingTime} minute${remainingTime !== 1 ? 's' : ''}.`
      
      // Auto-unlock after time expires
      setTimeout(() => {
        isLocked.value = false
        loginAttempts.value = 0
        error.value = ''
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('lockoutTime')
      }, lockout - now)
    } else {
      // Lockout period expired, clear it
      localStorage.removeItem('loginAttempts')
      localStorage.removeItem('lockoutTime')
      loginAttempts.value = 0
    }
  }
}

// Forgot password functionality
function closeForgotPasswordModal() {
  showForgotPasswordModal.value = false
  resetEmail.value = ''
  resetError.value = ''
  resetSuccess.value = false
}

async function handlePasswordReset() {
  resetLoading.value = true
  resetError.value = ''
  resetSuccess.value = false

  try {
    if (!resetEmail.value) {
      throw new Error('Please enter your email address')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail.value)) {
      throw new Error('Please enter a valid email address')
    }

    // Submit password reset request
    const resetRequest = await auth.requestPasswordReset(resetEmail.value)
    
    console.log('Password reset request submitted:', resetRequest)
    
    // Show success message
    resetSuccess.value = true
    
    // Auto-close modal after 3 seconds
    setTimeout(() => {
      closeForgotPasswordModal()
    }, 3000)
    
  } catch (err) {
    console.error('Password reset error:', err)
    resetError.value = err.message || 'Failed to submit password reset request'
  } finally {
    resetLoading.value = false
  }
}

function openForgot() {
  showForgotPasswordModal.value = true
}

// quick role sign-in for dev/testing
async function quick(role) {
  if (isLocked.value) {
    error.value = 'Account is locked. Please wait before trying again.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const user = await auth.quickSignIn(role)
    const target = targetByRole[user.role]
    
    console.log('Quick login - Role:', role, 'User:', user, 'Target route:', target)
    
    // Reset login attempts on successful login
    loginAttempts.value = 0
    localStorage.removeItem('loginAttempts')
    localStorage.removeItem('lockoutTime')
    
    if (target && routeExists(target)) {
      console.log('Navigating to:', target)
      await router.push({ name: target })
    } else {
      console.log('Target route not found, falling back to Dashboard')
      await router.push({ name: 'Dashboard' })
    }
  } catch (e) {
    console.error('Quick sign-in error:', e)
    error.value = 'Quick sign-in failed: ' + e.message
  } finally {
    loading.value = false
  }
}

// Check lockout status on mount
onMounted(() => {
  checkLockout()
})
</script>

<style scoped>
/* Enhanced shadow */
.shadow-3xl {
  box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
}

/* Floating animation styles */
@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes float-medium {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-3deg); }
}

@keyframes float-fast {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 6s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 4s ease-in-out infinite;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .animate-float-slow,
  .animate-float-medium,
  .animate-float-fast {
    animation-duration: 12s;
  }
}
</style>
