<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Back button -->
    <button 
      @click="router.back()"
      class="flex items-center space-x-2 text-classroom-primary hover:text-classroom-primary-dark transition-colors mb-6"
    >
      <span class="material-icons">arrow_back</span>
      <span>Back to classwork</span>
    </button>

    <!-- Assignment header -->
    <div class="bg-white rounded-classroom classroom-shadow p-6 mb-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">{{ assignment?.title }}</h1>
          <p class="text-classroom-gray-600 mb-4">{{ assignment?.description }}</p>
          
          <div class="flex items-center space-x-6 text-sm text-classroom-gray-500">
            <span class="flex items-center space-x-1">
              <span class="material-icons text-sm">school</span>
              <span>{{ course?.name }}</span>
            </span>
            <span class="flex items-center space-x-1">
              <span class="material-icons text-sm">schedule</span>
              <span>Due {{ formatDueDate(assignment?.dueDate) }}</span>
            </span>
            <span class="flex items-center space-x-1">
              <span class="material-icons text-sm">grade</span>
              <span>{{ assignment?.points }} points</span>
            </span>
          </div>
        </div>
        
        <div class="text-right">
          <div class="text-2xl font-bold text-classroom-primary mb-1" v-if="assignment?.grade">
            {{ assignment.grade }}/{{ assignment.points }}
          </div>
          <div class="text-sm text-classroom-gray-600" v-if="assignment?.grade">
            {{ Math.round((assignment.grade / assignment.points) * 100) }}%
          </div>
          <div v-else class="text-sm text-classroom-gray-600">
            Not graded
          </div>
        </div>
      </div>

      <!-- Submission status -->
      <div class="p-4 bg-classroom-primary bg-opacity-5 rounded-classroom" v-if="assignment?.submissionStatus === 'submitted'">
        <div class="flex items-center space-x-3">
          <span class="material-icons text-classroom-primary">check_circle</span>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Assignment Submitted</h3>
            <p class="text-sm text-classroom-gray-600">Submitted on {{ formatTime(assignment.submittedAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Assignment instructions -->
    <div class="bg-white rounded-classroom classroom-shadow p-6 mb-6">
      <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">Instructions</h2>
      <div class="prose max-w-none">
        <p>{{ assignment?.instructions || 'Complete the assignment as described by your teacher.' }}</p>
      </div>
    </div>

    <!-- Submission form -->
    <div class="bg-white rounded-classroom classroom-shadow p-6" v-if="assignment?.submissionStatus !== 'submitted'">
      <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">Submit Assignment</h2>
      
      <form @submit.prevent="submitAssignment" class="space-y-6">
        <!-- File upload -->
        <div>
          <label class="block text-sm font-medium text-classroom-gray-900 mb-2">
            Upload your work
          </label>
          <div 
            class="border-2 border-dashed border-classroom-gray-300 rounded-classroom p-6 text-center hover:border-classroom-primary transition-colors cursor-pointer"
            @click="triggerFileInput"
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
          >
            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              class="hidden"
              accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png"
            >
            
            <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center mx-auto mb-3">
              <span class="material-icons text-classroom-primary">cloud_upload</span>
            </div>
            
            <p class="text-classroom-gray-900 font-medium mb-1">Upload your file</p>
            <p class="text-classroom-gray-600 text-sm">
              Drag and drop or click to browse
            </p>
            <p class="text-classroom-gray-500 text-xs mt-2">
              PDF, DOC, DOCX, TXT, ZIP, JPG, PNG (Max 10MB)
            </p>
          </div>
          
          <!-- Selected file -->
          <div v-if="selectedFile" class="mt-3 p-3 bg-classroom-primary bg-opacity-5 rounded-classroom flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="material-icons text-classroom-primary">description</span>
              <div>
                <p class="font-medium text-classroom-gray-900">{{ selectedFile.name }}</p>
                <p class="text-sm text-classroom-gray-600">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <button 
              type="button"
              @click="removeFile"
              class="text-classroom-gray-400 hover:text-classroom-gray-600 transition-colors"
            >
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>

        <!-- Comments -->
        <div>
          <label for="comments" class="block text-sm font-medium text-classroom-gray-900 mb-2">
            Comments (optional)
          </label>
          <textarea
            id="comments"
            v-model="comments"
            rows="4"
            placeholder="Add any comments about your submission..."
            class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors focus-classroom"
          ></textarea>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="!selectedFile || loading"
          class="w-full bg-classroom-primary hover:bg-classroom-primary-dark text-white py-3 px-4 rounded-classroom transition-colors font-medium focus-classroom flex items-center justify-center space-x-2"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedFile || loading }"
        >
          <span v-if="loading" class="material-icons animate-spin">refresh</span>
          <span>{{ loading ? 'Submitting...' : 'Submit Assignment' }}</span>
        </button>
      </form>
    </div>

    <!-- Submitted work -->
    <div class="bg-white rounded-classroom classroom-shadow p-6" v-if="assignment?.submissionStatus === 'submitted'">
      <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">Your Submission</h2>
      
      <div class="space-y-4">
        <!-- Submitted file -->
        <div class="p-4 border border-classroom-gray-200 rounded-classroom">
          <div class="flex items-center space-x-3">
            <span class="material-icons text-classroom-primary">description</span>
            <div>
              <p class="font-medium text-classroom-gray-900">assignment_submission.pdf</p>
              <p class="text-sm text-classroom-gray-600">Submitted on {{ formatTime(assignment.submittedAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div v-if="assignment.comments" class="p-4 border border-classroom-gray-200 rounded-classroom">
          <h3 class="font-medium text-classroom-gray-900 mb-2">Your Comments</h3>
          <p class="text-classroom-gray-600">{{ assignment.comments }}</p>
        </div>

        <!-- Teacher feedback -->
        <div v-if="assignment.feedback" class="p-4 border border-classroom-primary border-opacity-20 bg-classroom-primary bg-opacity-5 rounded-classroom">
          <h3 class="font-medium text-classroom-gray-900 mb-2">Teacher Feedback</h3>
          <p class="text-classroom-gray-600">{{ assignment.feedback }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssignmentsStore } from '../../store/assignments'
import { useCoursesStore } from '../../store/courses'

const route = useRoute()
const router = useRouter()
const assignmentsStore = useAssignmentsStore()
const coursesStore = useCoursesStore()

const fileInput = ref(null)
const selectedFile = ref(null)
const comments = ref('')
const loading = ref(false)

const assignment = computed(() => {
  return assignmentsStore.getAssignmentById(route.params.assignmentId)
})

const course = computed(() => {
  if (!assignment.value) return null
  return coursesStore.getCourseById(assignment.value.courseId)
})

const formatDueDate = (dueDate) => {
  if (!dueDate) return ''
  const date = new Date(dueDate)
  return date.toLocaleDateString()
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString()
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB')
      return
    }
    selectedFile.value = file
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB')
      return
    }
    selectedFile.value = file
  }
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const submitAssignment = async () => {
  if (!selectedFile.value) {
    showToast('Please select a file to submit')
    return
  }

  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update assignment status
    if (assignment.value) {
      assignment.value.submissionStatus = 'submitted'
      assignment.value.submittedAt = new Date().toISOString()
      assignment.value.comments = comments.value
      assignmentsStore.saveToStorage()
    }

    showToast('Assignment submitted successfully!')
    router.push('/student/classwork')
  } catch (error) {
    console.error('Error submitting assignment:', error)
    showToast('Error submitting assignment. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      assignmentsStore.loadAssignments(),
      coursesStore.loadCourses()
    ])
  } catch (error) {
    console.error('Error loading assignment data:', error)
    showToast('Error loading assignment information')
  }
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
