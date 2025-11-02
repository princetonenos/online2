<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-medium text-classroom-gray-900">Create Assignment</h1>
          <p class="text-classroom-gray-600 mt-1">Create a new assignment for your students</p>
        </div>
        <button 
          @click="$router.back()"
          class="btn-outline flex items-center space-x-2"
        >
          <span class="material-icons text-lg">arrow_back</span>
          <span>Back</span>
        </button>
      </div>

      <form @submit.prevent="createAssignment" class="space-y-6">
        <!-- Basic Information -->
        <div class="border border-classroom-gray-200 rounded-classroom p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Basic Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Title -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Assignment Title *
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="e.g., Quadratic Equations Homework"
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                @input="validateField('title')"
              >
              <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
            </div>

            <!-- Course Selection -->
            <div>
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Course *
              </label>
              <select
                v-model="form.courseId"
                required
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                @change="validateField('courseId')"
              >
                <option value="">Select course</option>
                <option v-for="course in teacherCourses" :key="course.id" :value="course.id">
                  {{ course.name }} - {{ course.section }}
                </option>
              </select>
              <p v-if="errors.courseId" class="text-red-500 text-xs mt-1">{{ errors.courseId }}</p>
            </div>

            <!-- Assignment Type -->
            <div>
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Type *
              </label>
              <select
                v-model="form.type"
                required
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
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
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Points *
              </label>
              <input
                v-model="form.points"
                type="number"
                min="0"
                max="1000"
                required
                placeholder="e.g., 100"
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                @input="validateField('points')"
              >
              <p v-if="errors.points" class="text-red-500 text-xs mt-1">{{ errors.points }}</p>
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Due Date *
              </label>
              <input
                v-model="form.dueDate"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                @change="validateField('dueDate')"
              >
              <p v-if="errors.dueDate" class="text-red-500 text-xs mt-1">{{ errors.dueDate }}</p>
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Instructions
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Provide clear instructions for this assignment..."
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors resize-none focus-classroom"
              ></textarea>
              <p class="text-xs text-classroom-gray-500 mt-1">{{ form.description.length }}/2000 characters</p>
            </div>
          </div>
        </div>

        <!-- Assignment Details -->
        <div class="border border-classroom-gray-200 rounded-classroom p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Assignment Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Topic -->
            <div>
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Topic
              </label>
              <input
                v-model="form.topic"
                type="text"
                placeholder="e.g., Quadratic Equations"
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
              >
            </div>

            <!-- Time Estimate -->
            <div>
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Estimated Time (minutes)
              </label>
              <input
                v-model="form.timeEstimate"
                type="number"
                min="0"
                max="480"
                placeholder="e.g., 60"
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
              >
            </div>

            <!-- Submission Type -->
            <div>
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Submission Type *
              </label>
              <select
                v-model="form.submissionType"
                required
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
              >
                <option value="file">File Upload</option>
                <option value="text">Text Entry</option>
                <option value="both">File or Text</option>
                <option value="none">No Submission</option>
              </select>
            </div>

            <!-- Allowed File Types -->
            <div v-if="form.submissionType === 'file' || form.submissionType === 'both'">
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Allowed File Types
              </label>
              <div class="flex flex-wrap gap-2">
                <label class="flex items-center space-x-1">
                  <input v-model="form.allowedFileTypes" type="checkbox" value="pdf" class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary">
                  <span class="text-sm">PDF</span>
                </label>
                <label class="flex items-center space-x-1">
                  <input v-model="form.allowedFileTypes" type="checkbox" value="doc" class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary">
                  <span class="text-sm">DOC/DOCX</span>
                </label>
                <label class="flex items-center space-x-1">
                  <input v-model="form.allowedFileTypes" type="checkbox" value="image" class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary">
                  <span class="text-sm">Images</span>
                </label>
                <label class="flex items-center space-x-1">
                  <input v-model="form.allowedFileTypes" type="checkbox" value="any" class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary">
                  <span class="text-sm">Any File</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Grading & Settings -->
        <div class="border border-classroom-gray-200 rounded-classroom p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Grading & Settings</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Rubric -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                Grading Rubric (Optional)
              </label>
              <textarea
                v-model="form.rubric"
                rows="3"
                placeholder="Describe how this assignment will be graded..."
                class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors resize-none focus-classroom"
              ></textarea>
            </div>

            <!-- Settings -->
            <div class="md:col-span-2 space-y-3">
              <h3 class="text-md font-medium text-classroom-gray-900">Settings</h3>
              
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="form.settings.allowLateSubmissions"
                    type="checkbox"
                    class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary focus-classroom"
                  >
                  <span class="text-sm text-classroom-gray-900">Allow late submissions</span>
                </label>
                
                <label class="flex items-center space-x-2">
                  <input
                    v-model="form.settings.sendNotifications"
                    type="checkbox"
                    class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary focus-classroom"
                  >
                  <span class="text-sm text-classroom-gray-900">Send notifications to students</span>
                </label>
                
                <label class="flex items-center space-x-2">
                  <input
                    v-model="form.settings.includeInGradebook"
                    type="checkbox"
                    class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary focus-classroom"
                  >
                  <span class="text-sm text-classroom-gray-900">Include in gradebook</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Attachments -->
        <div class="border border-classroom-gray-200 rounded-classroom p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-classroom-gray-900">Attachments</h2>
            <button 
              type="button"
              @click="addAttachment"
              class="btn-outline flex items-center space-x-2 text-sm"
            >
              <span class="material-icons text-lg">attach_file</span>
              <span>Add Attachment</span>
            </button>
          </div>

          <div class="space-y-4">
            <div 
              v-for="(attachment, index) in form.attachments"
              :key="index"
              class="flex items-start space-x-4 p-4 border border-classroom-gray-200 rounded-classroom"
            >
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">Type</label>
                  <select
                    v-model="attachment.type"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  >
                    <option value="file">File</option>
                    <option value="link">Link</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">Title</label>
                  <input
                    v-model="attachment.title"
                    type="text"
                    placeholder="Attachment title"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  >
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
                    {{ getAttachmentPlaceholder(attachment.type) }}
                  </label>
                  <input
                    v-model="attachment.url"
                    type="text"
                    :placeholder="getAttachmentPlaceholder(attachment.type)"
                    class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
                  >
                </div>
              </div>

              <button
                type="button"
                @click="removeAttachment(index)"
                class="p-2 text-classroom-gray-400 hover:text-red-500 transition-colors focus-classroom"
                aria-label="Remove attachment"
              >
                <span class="material-icons">delete</span>
              </button>
            </div>

            <div v-if="form.attachments.length === 0" class="text-center py-8 text-classroom-gray-500">
              <span class="material-icons text-4xl mb-2 opacity-50">attach_file</span>
              <p>No attachments added yet</p>
              <p class="text-sm">Add files or links that students will need for this assignment</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-4 pt-6">
          <button
            type="button"
            @click="$router.back()"
            class="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary flex items-center space-x-2"
            :class="{ 'opacity-50 cursor-not-allowed': loading }"
          >
            <span v-if="loading" class="material-icons animate-spin">refresh</span>
            <span>{{ loading ? 'Creating...' : 'Create Assignment' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAssignmentsStore } from '../../store/assignments'
import { useCoursesStore } from '../../store/courses'
import { useUsersStore } from '../../store/users'

const router = useRouter()
const assignmentsStore = useAssignmentsStore()
const coursesStore = useCoursesStore()
const usersStore = useUsersStore()

const loading = ref(false)

const form = reactive({
  title: '',
  courseId: '',
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
    includeInGradebook: true
  }
})

const errors = reactive({
  title: '',
  courseId: '',
  type: '',
  points: '',
  dueDate: ''
})

const teacherCourses = computed(() => {
  const currentUser = usersStore.currentUser
  if (!currentUser) return []
  return coursesStore.getCoursesForUser(currentUser.id)
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
    case 'courseId':
      errors.courseId = form.courseId ? '' : 'Course selection is required'
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
  validateField('courseId')
  validateField('type')
  validateField('points')
  validateField('dueDate')

  if (errors.title || errors.courseId || errors.type || errors.points || errors.dueDate) {
    showToast('Please fix the validation errors before creating the assignment')
    return
  }

  loading.value = true
  try {
    const currentUser = usersStore.currentUser
    const assignmentData = {
      ...form,
      teacherId: currentUser.id,
      attachments: form.attachments.filter(a => a.title && a.url),
      status: 'published',
      createdAt: new Date().toISOString(),
      submissions: []
    }

    const newAssignment = await assignmentsStore.createAssignment(assignmentData)
    showToast('Assignment created successfully!')
    router.push('/teacher/assignments')
  } catch (error) {
    console.error('Error creating assignment:', error)
    showToast('Error creating assignment. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Set default due date to 7 days from now at 11:59 PM
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(23, 59, 0, 0)
  form.dueDate = nextWeek.toISOString().slice(0, 16)
  
  // Load courses
  coursesStore.loadCourses()
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
