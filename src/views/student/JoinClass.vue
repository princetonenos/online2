<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-white text-4xl">school</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Join a Class</h1>
        <p class="text-gray-600">Enter the class code provided by your teacher</p>
      </div>

      <!-- Success State -->
      <div v-if="joined && foundClass" class="bg-white rounded-2xl shadow-xl border border-green-200 p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-green-600 text-3xl">check_circle</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Successfully Joined!</h3>
        <p class="text-gray-600 mb-4">You've joined {{ foundClass.title }}</p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="text-sm text-gray-600 mb-1">Class Details</div>
          <div class="text-lg font-semibold text-blue-600">{{ foundClass.title }}</div>
          <div class="text-sm text-gray-500">{{ foundClass.subject || 'General' }} • {{ foundClass.level || 'All Levels' }}</div>
        </div>

        <div class="flex justify-center gap-3">
          <button 
            @click="goToClasses"
            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2"
          >
            <span class="material-icons text-sm">school</span>
            <span>View My Classes</span>
          </button>
          <button 
            @click="joinAnother"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
          >
            Join Another
          </button>
        </div>
      </div>

      <!-- Join Form -->
      <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form @submit.prevent="join">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Class Code
            </label>
            <input 
              v-model="code" 
              required 
              type="text"
              class="w-full p-4 text-lg border-2 border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase tracking-wider text-center font-bold"
              placeholder="e.g., MAT-X7K9"
              :class="{ 'border-red-500': message && messageType === 'err' }"
            />
            <p class="text-sm text-gray-500 mt-2 text-center">
              Enter the code exactly as provided by your teacher
            </p>
          </div>

          <!-- Error/Success Message -->
          <div v-if="message" class="mb-6 p-4 rounded-classroom" :class="messageType === 'ok' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
            <div class="flex items-center">
              <span class="material-icons text-sm mr-2" :class="messageType === 'ok' ? 'text-green-600' : 'text-red-600'">
                {{ messageType === 'ok' ? 'check_circle' : 'error' }}
              </span>
              <span class="text-sm font-medium" :class="messageType === 'ok' ? 'text-green-800' : 'text-red-800'">
                {{ message }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              type="submit" 
              :disabled="!code.trim() || joining"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center justify-center"
            >
              <span v-if="joining" class="material-icons animate-spin mr-2">refresh</span>
              <span>{{ joining ? 'Joining...' : 'Join Class' }}</span>
            </button>
            <button 
              type="button" 
              @click="cancel" 
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <!-- Help Section -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">Need Help?</h4>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-start">
              <span class="material-icons text-blue-500 text-sm mr-2 mt-0.5">info</span>
              <span>Class codes are typically 7-8 characters (e.g., MAT-X7K9)</span>
            </div>
            <div class="flex items-start">
              <span class="material-icons text-blue-500 text-sm mr-2 mt-0.5">info</span>
              <span>Make sure you're entering the code exactly as shared by your teacher</span>
            </div>
            <div class="flex items-start">
              <span class="material-icons text-blue-500 text-sm mr-2 mt-0.5">info</span>
              <span>Contact your teacher if you're having trouble joining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const router = useRouter()
const code = ref('')
const message = ref('')
const messageType = ref('')
const joining = ref(false)
const joined = ref(false)
const foundClass = ref(null)

function findClassByCode(c) {
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  // Try to match code field first, then id as fallback
  return classes.find(x => (x.code && String(x.code).toUpperCase() === String(c).toUpperCase()) || String(x.id) === String(c))
}

async function join() {
  if (!code.value.trim()) {
    messageType.value = 'err'
    message.value = 'Please enter a class code'
    return
  }

  joining.value = true
  message.value = ''

  const current = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
  if (!current || current.role !== 'student') {
    messageType.value = 'err'
    message.value = 'You must be signed in as a student to join a class'
    joining.value = false
    return
  }

  const rawCode = code.value.trim().toUpperCase()

  // Try backend first
  let backendJoined = false
  try {
    const token = localStorage.getItem('auth:token')
    if (token) {
      await axios.post(`${API_URL}/classes/join`, { code: rawCode }, { headers: { Authorization: `Bearer ${token}` } })
      backendJoined = true
      // Fetch classes for this student to find the joined class details
      try {
        const res = await axios.get(`${API_URL}/classes`, { headers: { Authorization: `Bearer ${token}` } })
        const items = res.data?.data || []
        const match = items.find(x => String(x.code).toUpperCase() === rawCode)
        if (match) {
          foundClass.value = { id: match.id, title: match.name || match.title || 'Class', subject: match.subject || '', level: match.section || '' }
        }
      } catch {}
    }
  } catch (e) {
    // ignore, we will fallback to local
  }

  if (!backendJoined && !foundClass.value) {
    // Local fallback
    await new Promise(resolve => setTimeout(resolve, 300))
    const cls = findClassByCode(rawCode)
    if (!cls) {
      messageType.value = 'err'
      message.value = 'Class not found. Please check the code and try again'
      joining.value = false
      return
    }

    cls.students = cls.students || []
    if (!cls.students.includes(current.id)) {
      cls.students.push(current.id)
      const all = JSON.parse(localStorage.getItem('mock:classes') || '[]').map(x => x.id === cls.id ? cls : x)
      localStorage.setItem('mock:classes', JSON.stringify(all))
    }
    foundClass.value = cls
  }

  messageType.value = 'ok'
  message.value = 'Successfully joined!'
  joined.value = true
  joining.value = false
}

function goToClasses() {
  // Dispatch custom event to trigger reload in ClassList
  window.dispatchEvent(new CustomEvent('classJoined'))
  // Navigate to classes
  router.push('/student/classes').catch(() => {
    // Fallback navigation
    router.push({ name: 'StudentClasses' })
  })
}

function joinAnother() {
  joined.value = false
  foundClass.value = null
  code.value = ''
  message.value = ''
  messageType.value = ''
}

function cancel() { 
  router.back() 
}
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
