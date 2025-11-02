<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-medium text-classroom-gray-900">Create Class</h1>
          <p class="text-classroom-gray-600 mt-1">Set up a new class with all the necessary details</p>
        </div>
        <button 
          @click="$router.back()"
          class="btn-outline flex items-center space-x-2"
        >
          <span class="material-icons text-lg">arrow_back</span>
          <span>Back</span>
        </button>
      </div>

      <form @submit.prevent="createClass" class="space-y-6">
        <!-- Progress Steps -->
        <div class="flex items-center justify-between mb-8">
          <div 
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex items-center"
          >
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
              :class="getStepClass(step.id)"
            >
              {{ step.id }}
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

        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="border border-classroom-gray-200 rounded-classroom p-6">
            <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Basic Information</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Title -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                  Class Title *
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="e.g., Advanced Mathematics"
                  class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  @input="validateField('title')"
                >
                <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
              </div>

              <!-- Subject -->
              <div>
                <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                  Subject *
                </label>
                <select
                  v-model="form.subject"
                  required
                  class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  @change="validateField('subject')"
                >
                  <option value="">Select subject</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="english">English</option>
                  <option value="history">History</option>
                  <option value="art">Art</option>
                  <option value="music">Music</option>
                  <option value="physical-education">Physical Education</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="foreign-language">Foreign Language</option>
                </select>
                <p v-if="errors.subject" class="text-red-500 text-xs mt-1">{{ errors.subject }}</p>
              </div>

              <!-- Grade Level -->
              <div>
                <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                  Grade Level
                </label>
                <select
                  v-model="form.gradeLevel"
                  class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                >
                  <option value="">Any grade</option>
                  <option value="elementary">Elementary</option>
                  <option value="middle-school">Middle School</option>
                  <option value="high-school">High School</option>
                  <option value="college">College</option>
                  <option value="adult">Adult Education</option>
                </select>
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Describe what students will learn in this class..."
                  class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors resize-none focus-classroom"
                ></textarea>
                <p class="text-xs text-classroom-gray-500 mt-1">{{ form.description.length }}/500 characters</p>
              </div>

              <!-- Level -->
              <div>
                <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                  Level *
                </label>
                <select
                  v-model="form.level"
                  required
                  class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  @change="validateField('level')"
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <p v-if="errors.level" class="text-red-500 text-xs mt-1">{{ errors.level }}</p>
              </div>

              <!-- Capacity (Optional) -->
              <div>
                <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                  Capacity (Optional)
                </label>
                <input
                  v-model="form.capacity"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g., 30"
                  class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                >
                <p class="text-xs text-classroom-gray-500 mt-1">Maximum 100 students</p>
              </div>
            </div>
          </div>

          <!-- Step Navigation -->
          <div class="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              @click="$router.back()"
              class="btn-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="nextStep"
              class="btn-primary flex items-center space-x-2"
              :disabled="!isStep1Valid"
            >
              <span>Next</span>
              <span class="material-icons text-lg">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Schedule & Settings -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="border border-classroom-gray-200 rounded-classroom p-6">
            <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Schedule & Settings</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Start Date/Time -->
              <div>
                <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                  Start Date & Time *
                </label>
                <input
                  v-model="form.startAt"
                  type="datetime-local"
                  required
                  class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  @change="validateField('startAt')"
                >
                <p v-if="errors.startAt" class="text-red-500 text-xs mt-1">{{ errors.startAt }}</p>
              </div>

              <!-- Duration -->
              <div>
                <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  v-model="form.durationMinutes"
                  type="number"
                  min="15"
                  max="480"
                  required
                  placeholder="e.g., 90"
                  class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  @input="validateField('durationMinutes')"
                >
                <p v-if="errors.durationMinutes" class="text-red-500 text-xs mt-1">{{ errors.durationMinutes }}</p>
                <p class="text-xs text-classroom-gray-500 mt-1">15-480 minutes</p>
              </div>

              <!-- Recurring Class -->
              <div class="md:col-span-2">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="form.isRecurring"
                    type="checkbox"
                    class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary focus-classroom"
                  >
                  <span class="text-sm font-medium text-classroom-gray-900">This is a recurring class</span>
                </label>
              </div>

              <!-- Recurrence Settings -->
              <div v-if="form.isRecurring" class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">Frequency</label>
                  <select
                    v-model="form.recurrence.frequency"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">Occurrences</label>
                  <input
                    v-model="form.recurrence.occurrences"
                    type="number"
                    min="1"
                    max="52"
                    placeholder="e.g., 12"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">End Date</label>
                  <input
                    v-model="form.recurrence.endDate"
                    type="date"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  >
                </div>
              </div>

              <!-- Class Settings -->
              <div class="md:col-span-2 space-y-3">
                <h3 class="text-md font-medium text-classroom-gray-900">Class Settings</h3>
                
                <div class="space-y-2">
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="form.settings.allowStudentPosts"
                      type="checkbox"
                      class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary focus-classroom"
                    >
                    <span class="text-sm text-classroom-gray-900">Allow students to post in class stream</span>
                  </label>
                  
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="form.settings.allowStudentComments"
                      type="checkbox"
                      class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary focus-classroom"
                    >
                    <span class="text-sm text-classroom-gray-900">Allow students to comment on posts</span>
                  </label>
                  
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="form.settings.showDeletedItems"
                      type="checkbox"
                      class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary focus-classroom"
                    >
                    <span class="text-sm text-classroom-gray-900">Show deleted items in class stream</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Step Navigation -->
          <div class="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              @click="prevStep"
              class="btn-outline flex items-center space-x-2"
            >
              <span class="material-icons text-lg">arrow_back</span>
              <span>Previous</span>
            </button>
            <button
              type="button"
              @click="nextStep"
              class="btn-primary flex items-center space-x-2"
              :disabled="!isStep2Valid"
            >
              <span>Next</span>
              <span class="material-icons text-lg">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Resources & Materials -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="border border-classroom-gray-200 rounded-classroom p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium text-classroom-gray-900">Resources & Materials</h2>
              <button 
                type="button"
                @click="addResource"
                class="btn-outline flex items-center space-x-2 text-sm"
              >
                <span class="material-icons text-lg">add</span>
                <span>Add Resource</span>
              </button>
            </div>

            <div class="space-y-4">
              <div 
                v-for="(resource, index) in form.resources"
                :key="index"
                class="flex items-start space-x-4 p-4 border border-classroom-gray-200 rounded-classroom"
              >
                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-classroom-gray-900 mb-2">Type</label>
                    <select
                      v-model="resource.type"
                      class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                    >
                      <option value="link">Link</option>
                      <option value="file">File</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-classroom-gray-900 mb-2">Title</label>
                    <input
                      v-model="resource.title"
                      type="text"
                      placeholder="Resource title"
                      class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                    >
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                      {{ getResourcePlaceholder(resource.type) }}
                    </label>
                    <input
                      v-model="resource.url"
                      type="text"
                      :placeholder="getResourcePlaceholder(resource.type)"
                      class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                    >
                  </div>
                </div>

                <button
                  type="button"
                  @click="removeResource(index)"
                  class="p-2 text-classroom-gray-400 hover:text-red-500 transition-colors focus-classroom"
                  aria-label="Remove resource"
                >
                  <span class="material-icons">delete</span>
                </button>
              </div>

              <div v-if="form.resources.length === 0" class="text-center py-8 text-classroom-gray-500">
                <span class="material-icons text-4xl mb-2 opacity-50">attach_file</span>
                <p>No resources added yet</p>
                <p class="text-sm">Add links or files that students will need for this class</p>
              </div>
            </div>
          </div>

          <!-- Step Navigation -->
          <div class="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              @click="prevStep"
              class="btn-outline flex items-center space-x-2"
            >
              <span class="material-icons text-lg">arrow_back</span>
              <span>Previous</span>
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary flex items-center space-x-2"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              <span v-if="loading" class="material-icons animate-spin">refresh</span>
              <span>{{ loading ? 'Creating...' : 'Create Class' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClassesStore } from '../store/classes'
import { useUsersStore } from '../store/users'

const router = useRouter()
const classesStore = useClassesStore()
const usersStore = useUsersStore()

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
    showDeletedItems: false
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
    return 'bg-classroom-primary text-white'
  } else if (stepId === currentStep.value) {
    return 'bg-classroom-primary text-white'
  } else {
    return 'bg-classroom-gray-100 text-classroom-gray-500'
  }
}

const getStepTextClass = (stepId) => {
  if (stepId <= currentStep.value) {
    return 'text-classroom-gray-900'
  } else {
    return 'text-classroom-gray-500'
  }
}

const getStepLineClass = (stepId) => {
  if (stepId < currentStep.value) {
    return 'bg-classroom-primary'
  } else {
    return 'bg-classroom-gray-200'
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
    const currentUser = usersStore.currentUser
    const classData = {
      ...form,
      teacherId: currentUser.id,
      resources: form.resources.filter(r => r.title && r.url),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    }

    const newClass = await classesStore.createClass(classData)
    
    // Also create a corresponding course for the dashboard
    const courseData = {
      id: `course_${Date.now()}`,
      name: form.title,
      section: form.subject,
      description: form.description,
      room: 'Virtual Classroom',
      subject: form.subject,
      gradeLevel: form.gradeLevel,
      level: form.level,
      color: getRandomColor(),
      teachers: [currentUser.id],
      students: [],
      code: generateClassCode(form.subject),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Save course to localStorage for immediate dashboard update
    const savedCourses = localStorage.getItem('courses')
    const courses = savedCourses ? JSON.parse(savedCourses) : []
    courses.push(courseData)
    localStorage.setItem('courses', JSON.stringify(courses))
    
    showToast('Class created successfully!')
    router.push('/teacher/classes')
  } catch (error) {
    console.error('Error creating class:', error)
    showToast('Error creating class. Please try again.')
  } finally {
    loading.value = false
  }
}

const getRandomColor = () => {
  const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8E44AD', '#2ECC71', '#E74C3C', '#1ABC9C']
  return colors[Math.floor(Math.random() * colors.length)]
}

const generateClassCode = (subject) => {
  const prefix = subject.substring(0, 3).toUpperCase()
  const randomNum = Math.floor(Math.random() * 900) + 100
  return `${prefix}${randomNum}`
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
  }
}
</script>
