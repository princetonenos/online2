<template>
  <div v-if="loading" class="space-y-6">
    <div class="skeleton h-8 w-3/4"></div>
    <div class="skeleton h-4 w-full"></div>
    <div class="skeleton h-4 w-2/3"></div>
    <div class="skeleton h-32 w-full"></div>
  </div>

  <div v-else-if="assignment" class="space-y-6">
    <!-- Assignment header -->
    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h1 class="text-2xl font-medium text-classroom-gray-900 mb-2">
            {{ assignment.title }}
          </h1>
          <div class="flex items-center space-x-4 text-sm text-classroom-gray-500">
            <span class="chip" :class="getAssignmentTypeClass(assignment.type)">
              {{ getAssignmentTypeLabel(assignment.type) }}
            </span>
            <span class="chip chip-primary">
              {{ assignment.points }} points
            </span>
            <span class="flex items-center space-x-1">
              <span class="material-icons text-base">schedule</span>
              <span>Due {{ formatDueDate(assignment.dueDate) }}</span>
            </span>
          </div>
        </div>
        
        <button 
          v-if="isTeacher"
          @click="editAssignment"
          class="btn-outline flex items-center space-x-2"
        >
          <span class="material-icons text-lg">edit</span>
          <span>Edit</span>
        </button>
      </div>

      <!-- Assignment instructions -->
      <div class="prose max-w-none">
        <h3 class="text-lg font-medium text-classroom-gray-900 mb-3">Instructions</h3>
        <div class="text-classroom-gray-700 whitespace-pre-line">
          {{ assignment.description }}
        </div>
      </div>

      <!-- Attachments -->
      <div v-if="assignment.attachments && assignment.attachments.length > 0" class="mt-6">
        <h3 class="text-lg font-medium text-classroom-gray-900 mb-3">Attachments</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AttachmentPreview
            v-for="attachment in assignment.attachments"
            :key="attachment.name"
            :attachment="attachment"
          />
        </div>
      </div>
    </div>

    <!-- Student work section -->
    <div v-if="!isTeacher" class="bg-white rounded-classroom classroom-shadow p-6">
      <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">Your work</h2>
      
      <div v-if="submission" class="space-y-4">
        <!-- Submission status -->
        <div class="flex items-center justify-between p-4 border border-classroom-gray-200 rounded-classroom">
          <div>
            <h3 class="font-medium text-classroom-gray-900">Status</h3>
            <p class="text-sm text-classroom-gray-500">
              {{ getSubmissionStatusLabel(submission.status) }}
            </p>
          </div>
          <span class="chip text-sm" :class="getSubmissionStatusClass(submission.status)">
            {{ getSubmissionStatusLabel(submission.status) }}
          </span>
        </div>

        <!-- Grade and feedback -->
        <div v-if="submission.grade" class="p-4 border border-classroom-gray-200 rounded-classroom">
          <h3 class="font-medium text-classroom-gray-900 mb-2">Grade & Feedback</h3>
          <div class="flex items-center space-x-4">
            <div class="text-2xl font-medium text-classroom-gray-900">
              {{ submission.grade }} / {{ assignment.points }}
            </div>
            <div v-if="submission.feedback" class="flex-1">
              <p class="text-sm text-classroom-gray-700">{{ submission.feedback }}</p>
            </div>
          </div>
        </div>

        <!-- Submitted files -->
        <div v-if="submission.files && submission.files.length > 0" class="space-y-3">
          <h3 class="font-medium text-classroom-gray-900">Submitted files</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AttachmentPreview
              v-for="file in submission.files"
              :key="file.name"
              :attachment="file"
            />
          </div>
        </div>
      </div>

      <!-- Submission form -->
      <div v-else class="space-y-4">
        <div class="border-2 border-dashed border-classroom-gray-300 rounded-classroom p-6 text-center">
          <input
            type="file"
            ref="fileInput"
            multiple
            @change="handleFileUpload"
            class="hidden"
          >
          <button
            @click="$refs.fileInput.click()"
            class="btn-primary mb-2"
          >
            <span class="material-icons text-lg mr-2">upload</span>
            Add or create
          </button>
          <p class="text-sm text-classroom-gray-500">Drag and drop files here or click to upload</p>
        </div>

        <div class="flex items-center justify-end space-x-3">
          <button @click="markAsDone" class="btn-outline">
            Mark as done
          </button>
          <button @click="submitAssignment" class="btn-primary" :disabled="!canSubmit">
            Turn in
          </button>
        </div>
      </div>
    </div>

    <!-- Teacher view: submissions -->
    <div v-else class="bg-white rounded-classroom classroom-shadow p-6">
      <h2 class="text-xl font-medium text-classroom-gray-900 mb-4">Student submissions</h2>
      
      <div class="space-y-4">
        <div 
          v-for="submission in submissions"
          :key="submission.id"
          class="flex items-center justify-between p-4 border border-classroom-gray-200 rounded-classroom hover:border-classroom-primary transition-colors cursor-pointer"
          @click="openSubmission(submission)"
        >
          <div class="flex items-center space-x-3">
            <img 
              :src="getStudent(submission.studentId)?.avatar" 
              :alt="getStudent(submission.studentId)?.name"
              class="w-10 h-10 rounded-full"
            >
            <div>
              <h3 class="font-medium text-classroom-gray-900">
                {{ getStudent(submission.studentId)?.name }}
              </h3>
              <p class="text-sm text-classroom-gray-500">
                {{ getSubmissionStatusLabel(submission.status) }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="chip text-sm" :class="getSubmissionStatusClass(submission.status)">
              {{ getSubmissionStatusLabel(submission.status) }}
            </span>
            <span v-if="submission.grade" class="text-classroom-gray-900 font-medium">
              {{ submission.grade }} / {{ assignment.points }}
            </span>
            <span class="material-icons text-classroom-gray-400">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <span class="material-icons text-classroom-gray-400 text-4xl">error_outline</span>
    </div>
    <h2 class="text-xl font-medium text-classroom-gray-900 mb-2">Assignment not found</h2>
    <p class="text-classroom-gray-600 mb-6">The assignment you're looking for doesn't exist.</p>
    <button @click="$router.back()" class="btn-primary">
      Go back
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../store/users'
import { useCoursesStore } from '../store/courses'
import { useAssignmentsStore } from '../store/assignments'
import AttachmentPreview from '../components/AttachmentPreview.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

const loading = ref(true)
const submissionFiles = ref([])

const assignmentId = computed(() => route.params.assignmentId)
const courseId = computed(() => route.params.id)
const currentUser = computed(() => usersStore.currentUser)
const isTeacher = computed(() => usersStore.isTeacher)

const assignment = computed(() => assignmentsStore.getAssignmentById(assignmentId.value))
const submissions = computed(() => assignmentsStore.getSubmissionsByAssignment(assignmentId.value))
const submission = computed(() => assignmentsStore.getSubmissionByUser(assignmentId.value, currentUser.value.id))

const canSubmit = computed(() => submissionFiles.value.length > 0)

const getAssignmentTypeClass = (type) => {
  const typeClasses = {
    assignment: 'chip-primary',
    quiz: 'chip-secondary',
    material: 'chip-gray',
    question: 'chip-secondary'
  }
  return typeClasses[type] || 'chip-gray'
}

const getAssignmentTypeLabel = (type) => {
  const typeLabels = {
    assignment: 'Assignment',
    quiz: 'Quiz',
    material: 'Material',
    question: 'Question'
  }
  return typeLabels[type] || 'Assignment'
}

const getSubmissionStatusClass = (status) => {
  const statusClasses = {
    assigned: 'chip-gray',
    submitted: 'chip-secondary',
    graded: 'chip-primary',
    missing: 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'chip-gray'
}

const getSubmissionStatusLabel = (status) => {
  const statusLabels = {
    assigned: 'Assigned',
    submitted: 'Turned in',
    graded: 'Graded',
    missing: 'Missing'
  }
  return statusLabels[status] || 'Assigned'
}

const getStudent = (studentId) => {
  return usersStore.getUserById(studentId)
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  return date.toLocaleDateString()
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    submissionFiles.value.push({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      file: file
    })
  })
  event.target.value = '' // Reset file input
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const submitAssignment = async () => {
  if (!canSubmit.value) return

  try {
    await assignmentsStore.submitAssignment(assignmentId.value, currentUser.value.id, {
      files: submissionFiles.value,
      status: 'submitted'
    })
    showToast('Assignment submitted successfully')
    submissionFiles.value = []
  } catch (error) {
    console.error('Error submitting assignment:', error)
    showToast('Error submitting assignment')
  }
}

const markAsDone = () => {
  showToast('Marked as done')
}

const editAssignment = () => {
  showToast('Edit assignment functionality would open here')
}

const openSubmission = (submission) => {
  showToast(`Opening submission from ${getStudent(submission.studentId)?.name}`)
}

const loadAssignment = async () => {
  loading.value = true
  try {
    await assignmentsStore.loadAssignments()
  } catch (error) {
    console.error('Error loading assignment:', error)
    showToast('Error loading assignment')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAssignment()
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
