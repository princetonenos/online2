<template>
  <Transition name="modal-backdrop">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Transition name="modal">
        <div class="bg-white rounded p-6 w-full max-w-lg animate-scale-in">
          <!-- Success state with code display -->
          <div v-if="showSuccess" class="text-center py-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-green-600 text-3xl">check_circle</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Class Created!</h3>
            <p class="text-gray-600 mb-6">Share this code with your students to join</p>
            
            <!-- Class code display -->
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <div class="text-sm text-gray-600 mb-2">Class Joining Code</div>
              <div class="text-4xl font-bold text-blue-600 tracking-wider mb-3">{{ createdClassCode }}</div>
              <button 
                @click="copyCode"
                class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                <span class="material-icons text-sm">content_copy</span>
                <span>{{ copied ? 'Copied!' : 'Copy Code' }}</span>
              </button>
            </div>
            
            <div class="flex justify-center gap-3">
              <button 
                @click="closeModal"
                class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                Close
              </button>
              <button 
                @click="createAnother"
                class="px-6 py-2 bg-classroom-primary hover:bg-green-700 text-white rounded transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>

          <!-- Create form -->
          <div v-else>
            <h3 class="text-lg font-medium mb-3">Create class</h3>
            <form @submit.prevent="create">
            <label class="block mb-3">
              <div class="text-sm mb-1">Title</div>
              <input v-model="form.title" class="w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-classroom-primary focus:border-transparent" required />
            </label>
            <label class="block mb-3">
              <div class="text-sm mb-1">Start date & time</div>
              <input v-model="form.startAt" type="datetime-local" class="w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-classroom-primary focus:border-transparent" />
            </label>
            <label class="block mb-3">
              <div class="text-sm mb-1">Duration (minutes)</div>
              <input v-model.number="form.duration" type="number" class="w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-classroom-primary focus:border-transparent" />
            </label>
            <label class="block mb-3">
              <div class="text-sm mb-1">Level</div>
              <select v-model="form.level" class="w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-classroom-primary focus:border-transparent">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>

              <div class="flex justify-end gap-2 mt-6">
                <button type="button" class="px-4 py-2 border rounded transition-all duration-200 hover:bg-classroom-gray-50 animate-press" @click="$emit('update:open', false)">Cancel</button>
                <button class="px-4 py-2 bg-classroom-primary text-white rounded transition-all duration-200 hover:bg-green-700 animate-press animate-ripple">Create</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, ref } from 'vue'
const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open','created'])

const form = reactive({ title: '', startAt: '', duration: 60, level: 'beginner' })
const showSuccess = ref(false)
const createdClassCode = ref('')
const copied = ref(false)

// Generate unique class joining code
function generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude ambiguous chars (0,O,1,I)
  const prefix = form.title ? form.title.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '') : 'CLS'
  const random = Array.from({length: 4}, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `${prefix || 'CLS'}-${random}`
}

function create(){
  const code = generateClassCode()
  const payload = {
    id: Date.now().toString(),
    title: form.title || 'Untitled',
    code: code, // Add joining code
    startAt: form.startAt || new Date().toISOString(),
    duration: Number(form.duration),
    level: form.level,
    status: 'scheduled',
    teacherId: JSON.parse(localStorage.getItem('mock:currentUser'))?.id || 't0',
    students: [], // Initialize students array
    createdAt: new Date().toISOString()
  }
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  classes.unshift(payload)
  localStorage.setItem('mock:classes', JSON.stringify(classes))
  
  // Show success modal with code
  createdClassCode.value = code
  showSuccess.value = true
  
  emit('created', payload)
}

function copyCode() {
  navigator.clipboard.writeText(createdClassCode.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }).catch(err => {
    console.error('Failed to copy:', err)
  })
}

function closeModal() {
  showSuccess.value = false
  createdClassCode.value = ''
  copied.value = false
  Object.assign(form, { title: '', startAt: '', duration: 60, level: 'beginner' })
  emit('update:open', false)
}

function createAnother() {
  showSuccess.value = false
  createdClassCode.value = ''
  copied.value = false
  Object.assign(form, { title: '', startAt: '', duration: 60, level: 'beginner' })
}
</script>

<style scoped></style>
