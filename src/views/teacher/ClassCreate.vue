<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Class
          </h1>
          <p class="text-gray-600 mt-2">Set up a new class with all the necessary details and settings</p>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            @click="$router.back()"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-classroom transition-colors flex items-center space-x-2"
          >
            <span class="material-icons text-sm">arrow_back</span>
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <!-- Progress Steps -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <div 
                v-for="(step, index) in steps"
                :key="step.id"
                class="flex items-center"
              >
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                  :class="getStepClass(step.id)"
                >
                  <span v-if="step.id < currentStep" class="material-icons text-sm">check</span>
                  <span v-else>{{ step.id }}</span>
                </div>
                <span 
                  class="ml-2 text-sm font-medium transition-colors"
                  :class="getStepTextClass(step.id)"
                >
                  {{ step.name }}
                </span>
                <div 
                  v-if="index < steps.length - 1"
                  class="w-12 h-0.5 mx-4 transition-colors"
                  :class="getStepLineClass(step.id)"
                ></div>
              </div>
            </div>
            <div class="text-sm text-gray-500">Step {{ currentStep }} of {{ steps.length }}</div>
          </div>
        </div>

        <form @submit.prevent="createClass" class="p-6 space-y-8">
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-blue-600 text-sm">info</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Basic Information</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Class Title -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Class Title *
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="e.g., Advanced Mathematics"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @input="validateField('title')"
                >
                <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
              </div>

              <!-- Subject -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  v-model="form.subject"
                  required
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                  @change="validateField('subject')"
                >
                  <option value="">Select subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Foreign Language">Foreign Language</option>
                </select>
                <p v-if="errors.subject" class="text-red-500 text-xs mt-1">{{ errors.subject }}</p>
              </div>

              <!-- Grade Level -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  v-model="form.gradeLevel"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                >
                  <option value="">Any grade</option>
                  <option value="Elementary">Elementary</option>
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                  <option value="Adult Education">Adult Education</option>
                </select>
              </div>

              <!-- Level -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  v-model="form.level"
                  required
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                  @change="validateField('level')"
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <p v-if="errors.level" class="text-red-500 text-xs mt-1">{{ errors.level }}</p>
              </div>

              <!-- Capacity -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Capacity (Optional)
                </label>
                <input
                  v-model="form.capacity"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g., 30"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                <p class="text-xs text-gray-500 mt-1">Maximum 100 students</p>
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Describe what students will learn in this class..."
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                ></textarea>
                <div class="flex justify-between items-center mt-1">
                  <p class="text-xs text-gray-500">{{ form.description.length }}/500 characters</p>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <span class="material-icons text-sm">format_bold</span>
                    <span class="material-icons text-sm">format_italic</span>
                    <span class="material-icons text-sm">format_list_bulleted</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step Navigation -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="$router.back()"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="nextStep"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!isStep1Valid"
              >
                <span>Next</span>
                <span class="material-icons text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <!-- Step 2: Schedule & Settings -->
          <div v-if="currentStep === 2" class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-purple-600 text-sm">schedule</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Schedule & Settings</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Start Date/Time -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  v-model="form.startAt"
                  type="datetime-local"
                  required
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @change="validateField('startAt')"
                >
                <p v-if="errors.startAt" class="text-red-500 text-xs mt-1">{{ errors.startAt }}</p>
              </div>

              <!-- Duration -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  v-model="form.durationMinutes"
                  type="number"
                  min="15"
                  max="480"
                  required
                  placeholder="e.g., 90"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @input="validateField('durationMinutes')"
                >
                <p v-if="errors.durationMinutes" class="text-red-500 text-xs mt-1">{{ errors.durationMinutes }}</p>
                <p class="text-xs text-gray-500 mt-1">15-480 minutes</p>
              </div>

              <!-- Recurring Class -->
              <div class="md:col-span-2">
                <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                  <input
                    v-model="form.isRecurring"
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <div>
                    <span class="text-sm font-medium text-gray-900">This is a recurring class</span>
                    <p class="text-xs text-gray-500 mt-1">Schedule multiple sessions automatically</p>
                  </div>
                </label>
              </div>

              <!-- Recurrence Settings -->
              <div v-if="form.isRecurring" class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    v-model="form.recurrence.frequency"
                    class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Occurrences</label>
                  <input
                    v-model="form.recurrence.occurrences"
                    type="number"
                    min="1"
                    max="52"
                    placeholder="e.g., 12"
                    class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    v-model="form.recurrence.endDate"
                    type="date"
                    class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                </div>
              </div>

              <!-- Class Settings -->
              <div class="md:col-span-2 space-y-4">
                <h3 class="text-lg font-medium text-gray-900">Class Settings</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input
                      v-model="form.settings.allowStudentPosts"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <div>
                      <span class="text-sm font-medium text-gray-900">Allow student posts</span>
                      <p class="text-xs text-gray-500 mt-1">Students can post in class stream</p>
                    </div>
                  </label>
                  
                  <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input
                      v-model="form.settings.allowStudentComments"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <div>
                      <span class="text-sm font-medium text-gray-900">Allow student comments</span>
                      <p class="text-xs text-gray-500 mt-1">Students can comment on posts</p>
                    </div>
                  </label>
                  
                  <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input
                      v-model="form.settings.showDeletedItems"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <div>
                      <span class="text-sm font-medium text-gray-900">Show deleted items</span>
                      <p class="text-xs text-gray-500 mt-1">Show deleted items in class stream</p>
                    </div>
                  </label>
                  
                  <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input
                      v-model="form.settings.autoEnrollStudents"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <div>
                      <span class="text-sm font-medium text-gray-900">Auto-enroll students</span>
                      <p class="text-xs text-gray-500 mt-1">Automatically enroll new students</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Step Navigation -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="prevStep"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <span class="material-icons text-sm">arrow_back</span>
                <span>Previous</span>
              </button>
              <button
                type="button"
                @click="nextStep"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!isStep2Valid"
              >
                <span>Next</span>
                <span class="material-icons text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <!-- Step 3: Resources & Materials -->
          <div v-if="currentStep === 3" class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-orange-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-orange-600 text-sm">attach_file</span>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Resources & Materials</h2>
              </div>
              <button 
                type="button"
                @click="addResource"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2"
              >
                <span class="material-icons text-sm">add</span>
                <span>Add Resource</span>
              </button>
            </div>

            <div class="space-y-4">
              <div 
                v-for="(resource, index) in form.resources"
                :key="index"
                class="bg-gray-50 rounded-classroom p-4 border border-gray-200"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-sm font-medium text-gray-900">Resource {{ index + 1 }}</h3>
                  <button
                    type="button"
                    @click="removeResource(index)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove resource"
                  >
                    <span class="material-icons text-lg">delete</span>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      v-model="resource.type"
                      class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                    >
                      <option value="link">Link</option>
                      <option value="file">File</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      v-model="resource.title"
                      type="text"
                      placeholder="Resource title"
                      class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ getResourcePlaceholder(resource.type) }}
                    </label>
                    <input
                      v-model="resource.url"
                      type="text"
                      :placeholder="getResourcePlaceholder(resource.type)"
                      class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                  </div>
                </div>
              </div>

              <div v-if="form.resources.length === 0" class="text-center py-8 text-gray-500 bg-gray-50 rounded-classroom border-2 border-dashed border-gray-300">
                <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-gray-400 text-2xl">attach_file</span>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No resources added</h3>
                <p class="text-gray-500">Add links or files that students will need for this class</p>
              </div>
            </div>

            <!-- Step Navigation -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="prevStep"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <span class="material-icons text-sm">arrow_back</span>
                <span>Previous</span>
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="material-icons text-sm animate-spin">refresh</span>
                <span>{{ loading ? 'Creating...' : 'Create Class' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const currentStep = ref(1)

const steps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Schedule' },
  { id: 3, name: 'Resources' }
]

const form = reactive({
  title: '',
  subject: '',
  gradeLevel: '',
  description: '',
  level: '',
  capacity: null,
  startAt: '',
  durationMinutes: 90,
  isRecurring: false,
  recurrence: {
    frequency: 'weekly',
    occurrences: 12,
    endDate: ''
  },
  settings: {
    allowStudentPosts: true,
    allowStudentComments: true,
    showDeletedItems: false,
    autoEnrollStudents: true
  },
  resources: []
})

const errors = reactive({
  title: '',
  subject: '',
  level: '',
  startAt: '',
  durationMinutes: ''
})

const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || '{}')

// Computed properties for step validation
const isStep1Valid = computed(() => {
  return form.title.trim() && form.subject && form.level
})

const isStep2Valid = computed(() => {
  return form.startAt && form.durationMinutes >= 15 && form.durationMinutes <= 480
})

// Step navigation
const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Step styling
const getStepClass = (stepId) => {
  if (stepId < currentStep.value) {
    return 'bg-green-500 text-white'
  } else if (stepId === currentStep.value) {
    return 'bg-blue-600 text-white'
  } else {
    return 'bg-gray-200 text-gray-500'
  }
}

const getStepTextClass = (stepId) => {
  if (stepId <= currentStep.value) {
    return 'text-gray-900'
  } else {
    return 'text-gray-500'
  }
}

const getStepLineClass = (stepId) => {
  if (stepId < currentStep.value) {
    return 'bg-green-500'
  } else {
    return 'bg-gray-300'
  }
}

// Resource management
const addResource = () => {
  form.resources.push({
    type: 'link',
    title: '',
    url: ''
  })
}

const removeResource = (index) => {
  form.resources.splice(index, 1)
}

const getResourcePlaceholder = (type) => {
  const placeholders = {
    link: 'https://example.com',
    file: '/files/document.pdf',
    video: 'https://youtube.com/watch?v=...',
    document: 'https://docs.google.com/document/...'
  }
  return placeholders[type] || 'Enter resource URL or path'
}

// Validation
const validateField = (field) => {
  switch (field) {
    case 'title':
      errors.title = form.title.trim() ? '' : 'Class title is required'
      break
    case 'subject':
      errors.subject = form.subject ? '' : 'Subject is required'
      break
    case 'level':
      errors.level = form.level ? '' : 'Level is required'
      break
    case 'startAt':
      errors.startAt = form.startAt ? '' : 'Start date and time is required'
      break
    case 'durationMinutes':
      if (!form.durationMinutes) {
        errors.durationMinutes = 'Duration is required'
      } else if (form.durationMinutes < 15 || form.durationMinutes > 480) {
        errors.durationMinutes = 'Duration must be between 15 and 480 minutes'
      } else {
        errors.durationMinutes = ''
      }
      break
  }
}

// Create class
const createClass = async () => {
  // Validate all required fields
  validateField('title')
  validateField('subject')
  validateField('level')
  validateField('startAt')
  validateField('durationMinutes')

  if (errors.title || errors.subject || errors.level || errors.startAt || errors.durationMinutes) {
    showToast('Please fix the validation errors before creating the class')
    return
  }

  loading.value = true
  try {
    const id = 'c' + Date.now()
    const classData = {
      id,
      ...form,
      teacherId: currentUser.id,
      resources: form.resources.filter(r => r.title && r.url),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      students: []
    }

    // Save to localStorage using the teacher classes store pattern
    const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
    classes.unshift(classData)
    localStorage.setItem('mock:classes', JSON.stringify(classes))
    
    showToast('Class created successfully!')
    router.push('/teacher/classes')
  } catch (error) {
    console.error('Error creating class:', error)
    showToast('Error creating class. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Set default start date to tomorrow at 9 AM
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  form.startAt = tomorrow.toISOString().slice(0, 16)
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  } else {
    alert(message)
  }
}
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
