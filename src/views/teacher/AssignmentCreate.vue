<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Assignment
          </h1>
          <p class="text-gray-600 mt-2">Design and publish a new assignment for your students</p>
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
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <span class="text-sm font-medium text-gray-900">Basic Info</span>
              </div>
              <div class="w-12 h-0.5 bg-gray-300"></div>
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <span class="text-sm font-medium text-gray-500">Details</span>
              </div>
              <div class="w-12 h-0.5 bg-gray-300"></div>
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <span class="text-sm font-medium text-gray-500">Settings</span>
              </div>
            </div>
            <div class="text-sm text-gray-500">Step 1 of 3</div>
          </div>
        </div>

        <form @submit.prevent="createAssignment" class="p-6 space-y-8">
          <!-- Basic Information Section -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-blue-600 text-sm">info</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Basic Information</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Assignment Title -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="e.g., Quadratic Equations Homework"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @input="validateField('title')"
                >
                <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
              </div>

              <!-- Class Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  v-model="form.classId"
                  required
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                  @change="validateField('classId')"
                >
                  <option value="">Select class</option>
                  <option v-for="cls in myClasses" :key="cls.id" :value="cls.id">
                    {{ cls.title }}
                  </option>
                </select>
                <p v-if="errors.classId" class="text-red-500 text-xs mt-1">{{ errors.classId }}</p>
              </div>

              <!-- Assignment Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  v-model="form.type"
                  required
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                  @change="validateField('type')"
                >
                  <option value="">Select type</option>
                  <option value="homework">Homework</option>
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="project">Project</option>
                  <option value="essay">Essay</option>
                  <option value="presentation">Presentation</option>
                  <option value="lab">Lab Report</option>
                  <option value="discussion">Discussion</option>
                  <option value="other">Other</option>
                </select>
                <p v-if="errors.type" class="text-red-500 text-xs mt-1">{{ errors.type }}</p>
              </div>

              <!-- Points -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Points *
                </label>
                <input
                  v-model="form.points"
                  type="number"
                  min="0"
                  max="1000"
                  required
                  placeholder="e.g., 100"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @input="validateField('points')"
                >
                <p v-if="errors.points" class="text-red-500 text-xs mt-1">{{ errors.points }}</p>
              </div>

              <!-- Due Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  v-model="form.dueDate"
                  type="datetime-local"
                  required
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @change="validateField('dueDate')"
                >
                <p v-if="errors.dueDate" class="text-red-500 text-xs mt-1">{{ errors.dueDate }}</p>
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  placeholder="Provide clear instructions for this assignment..."
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                ></textarea>
                <div class="flex justify-between items-center mt-1">
                  <p class="text-xs text-gray-500">{{ form.description.length }}/2000 characters</p>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <span class="material-icons text-sm">format_bold</span>
                    <span class="material-icons text-sm">format_italic</span>
                    <span class="material-icons text-sm">format_list_bulleted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Assignment Details Section -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-purple-600 text-sm">description</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Assignment Details</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Topic -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <input
                  v-model="form.topic"
                  type="text"
                  placeholder="e.g., Quadratic Equations"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
              </div>

              <!-- Time Estimate -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Time (minutes)
                </label>
                <input
                  v-model="form.timeEstimate"
                  type="number"
                  min="0"
                  max="480"
                  placeholder="e.g., 60"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
              </div>

              <!-- Submission Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Submission Type *
                </label>
                <select
                  v-model="form.submissionType"
                  required
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                >
                  <option value="file">File Upload</option>
                  <option value="text">Text Entry</option>
                  <option value="both">File or Text</option>
                  <option value="none">No Submission</option>
                </select>
              </div>

              <!-- Allowed File Types -->
              <div v-if="form.submissionType === 'file' || form.submissionType === 'both'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Allowed File Types
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2 p-2 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input v-model="form.allowedFileTypes" type="checkbox" value="pdf" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">PDF</span>
                  </label>
                  <label class="flex items-center space-x-2 p-2 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input v-model="form.allowedFileTypes" type="checkbox" value="doc" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">DOC/DOCX</span>
                  </label>
                  <label class="flex items-center space-x-2 p-2 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input v-model="form.allowedFileTypes" type="checkbox" value="image" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">Images</span>
                  </label>
                  <label class="flex items-center space-x-2 p-2 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input v-model="form.allowedFileTypes" type="checkbox" value="any" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">Any File</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Grading & Settings Section -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-green-600 text-sm">grade</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Grading & Settings</h2>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <!-- Rubric -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Grading Rubric (Optional)
                </label>
                <textarea
                  v-model="form.rubric"
                  rows="3"
                  placeholder="Describe how this assignment will be graded..."
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                ></textarea>
              </div>

              <!-- Settings -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">Settings</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input
                      v-model="form.settings.allowLateSubmissions"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <div>
                      <span class="text-sm font-medium text-gray-900">Allow late submissions</span>
                      <p class="text-xs text-gray-500 mt-1">Students can submit after the due date</p>
                    </div>
                  </label>
                  
                  <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input
                      v-model="form.settings.sendNotifications"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <div>
                      <span class="text-sm font-medium text-gray-900">Send notifications</span>
                      <p class="text-xs text-gray-500 mt-1">Notify students when assignment is published</p>
                    </div>
                  </label>
                  
                  <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input
                      v-model="form.settings.includeInGradebook"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <div>
                      <span class="text-sm font-medium text-gray-900">Include in gradebook</span>
                      <p class="text-xs text-gray-500 mt-1">Add this assignment to student grade calculations</p>
                    </div>
                  </label>
                  
                  <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer">
                    <input
                      v-model="form.settings.allowResubmissions"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <div>
                      <span class="text-sm font-medium text-gray-900">Allow resubmissions</span>
                      <p class="text-xs text-gray-500 mt-1">Students can submit multiple times</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Attachments Section -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-orange-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-orange-600 text-sm">attach_file</span>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Attachments</h2>
              </div>
              <button 
                type="button"
                @click="addAttachment"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2"
              >
                <span class="material-icons text-sm">add</span>
                <span>Add Attachment</span>
              </button>
            </div>

            <div class="space-y-4">
              <div 
                v-for="(attachment, index) in form.attachments"
                :key="index"
                class="bg-gray-50 rounded-classroom p-4 border border-gray-200"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-sm font-medium text-gray-900">Attachment {{ index + 1 }}</h3>
                  <button
                    type="button"
                    @click="removeAttachment(index)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove attachment"
                  >
                    <span class="material-icons text-lg">delete</span>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      v-model="attachment.type"
                      class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                    >
                      <option value="file">File</option>
                      <option value="link">Link</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      v-model="attachment.title"
                      type="text"
                      placeholder="Attachment title"
                      class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ getAttachmentPlaceholder(attachment.type) }}
                    </label>
                    <input
                      v-model="attachment.url"
                      type="text"
                      :placeholder="getAttachmentPlaceholder(attachment.type)"
                      class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                  </div>
                </div>
              </div>

              <div v-if="form.attachments.length === 0" class="text-center py-8 text-gray-500 bg-gray-50 rounded-classroom border-2 border-dashed border-gray-300">
                <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-gray-400 text-2xl">attach_file</span>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No attachments added</h3>
                <p class="text-gray-500">Add files or links that students will need for this assignment</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="$router.back()"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div class="flex items-center space-x-4">
              <button
                type="button"
                @click="saveAsDraft"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="material-icons text-sm animate-spin">refresh</span>
                <span>{{ loading ? 'Creating...' : 'Publish Assignment' }}</span>
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

const form = reactive({
  title: '',
  classId: '',
  type: '',
  points: 100,
  dueDate: '',
  description: '',
  topic: '',
  timeEstimate: null,
  submissionType: 'file',
  allowedFileTypes: ['pdf', 'doc'],
  rubric: '',
  attachments: [],
  settings: {
    allowLateSubmissions: true,
    sendNotifications: true,
    includeInGradebook: true,
    allowResubmissions: false
  }
})

const errors = reactive({
  title: '',
  classId: '',
  type: '',
  points: '',
  dueDate: ''
})

const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || '{}')

const myClasses = computed(() => {
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  return classes.filter(c => c.teacherId === currentUser.id)
})

// Attachment management
const addAttachment = () => {
  form.attachments.push({
    type: 'file',
    title: '',
    url: ''
  })
}

const removeAttachment = (index) => {
  form.attachments.splice(index, 1)
}

const getAttachmentPlaceholder = (type) => {
  const placeholders = {
    file: 'Upload file or enter file path',
    link: 'https://example.com/resource',
    video: 'https://youtube.com/watch?v=...',
    document: 'https://docs.google.com/document/...'
  }
  return placeholders[type] || 'Enter resource URL or path'
}

// Validation
const validateField = (field) => {
  switch (field) {
    case 'title':
      errors.title = form.title.trim() ? '' : 'Assignment title is required'
      break
    case 'classId':
      errors.classId = form.classId ? '' : 'Class selection is required'
      break
    case 'type':
      errors.type = form.type ? '' : 'Assignment type is required'
      break
    case 'points':
      if (!form.points) {
        errors.points = 'Points are required'
      } else if (form.points < 0 || form.points > 1000) {
        errors.points = 'Points must be between 0 and 1000'
      } else {
        errors.points = ''
      }
      break
    case 'dueDate':
      errors.dueDate = form.dueDate ? '' : 'Due date is required'
      break
  }
}

// Create assignment
const createAssignment = async () => {
  // Validate all required fields
  validateField('title')
  validateField('classId')
  validateField('type')
  validateField('points')
  validateField('dueDate')

  if (errors.title || errors.classId || errors.type || errors.points || errors.dueDate) {
    showToast('Please fix the validation errors before creating the assignment')
    return
  }

  loading.value = true
  try {
    const id = 'a' + Date.now()
    const assignmentData = {
      id,
      ...form,
      teacherId: currentUser.id,
      attachments: form.attachments.filter(a => a.title && a.url),
      status: 'published',
      createdAt: new Date().toISOString(),
      submissions: []
    }

    const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
    assignments.unshift(assignmentData)
    localStorage.setItem('mock:assignments', JSON.stringify(assignments))
    
    showToast('Assignment created successfully!')
    router.push('/teacher/assignments')
  } catch (error) {
    console.error('Error creating assignment:', error)
    showToast('Error creating assignment. Please try again.')
  } finally {
    loading.value = false
  }
}

const saveAsDraft = () => {
  // Similar to createAssignment but with status 'draft'
  showToast('Assignment saved as draft')
}

onMounted(() => {
  // Set default due date to 7 days from now at 11:59 PM
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(23, 59, 0, 0)
  form.dueDate = nextWeek.toISOString().slice(0, 16)
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
