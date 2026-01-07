<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Assignment Management
          </h1>
          <p class="text-gray-600 mt-2">Create, manage, and grade assignments for your classes</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search assignments..."
              class="bg-white border border-gray-300 rounded-classroom pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-icons text-gray-400 text-sm">search</span>
            </div>
          </div>
          <button 
            @click="showCreateModal = true"
            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2"
          >
            <span class="material-icons text-sm">add</span>
            <span>Create Assignment</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Assignment Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Assignments</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ assignments.length }}</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">trending_up</span>
              +2 this week
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-xl">assignment</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Submissions</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalSubmissions }}</p>
            <p class="text-blue-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">check_circle</span>
              {{ submissionRate }}% completion
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-xl">task_alt</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Average Grade</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">87%</p>
            <p class="text-orange-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">insights</span>
              +3% improvement
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-purple-600 text-xl">grade</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Pending Grading</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ pendingGrading }}</p>
            <p class="text-red-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">schedule</span>
              {{ overdueAssignments }} overdue
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-xl">pending</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Assignments List -->
      <div class="xl:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900">All Assignments</h2>
                <p class="text-gray-600 mt-1">Manage and track assignment progress</p>
              </div>
              <div class="flex items-center space-x-3">
                <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2">
                  <span class="material-icons text-sm">filter_list</span>
                  <span>Filter</span>
                </button>
                <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2">
                  <span class="material-icons text-sm">sort</span>
                  <span>Sort</span>
                </button>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignment</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submissions</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="assignment in assignments" 
                  :key="assignment.id" 
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom flex items-center justify-center text-white font-semibold text-sm mr-3">
                        <span class="material-icons text-sm">assignment</span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ assignment.title }}</div>
                        <div class="text-xs text-gray-500">{{ assignment.description || 'No description' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ getClassTitle(assignment.classId) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(assignment.dueAt) }}</div>
                    <div 
                      :class="getDueDateStatus(assignment.dueAt).class"
                      class="text-xs mt-1"
                    >
                      {{ getDueDateStatus(assignment.dueAt).text }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          class="bg-green-500 h-2 rounded-full" 
                          :style="{ width: getSubmissionProgress(assignment) + '%' }"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-600">
                        {{ assignment.submissions?.length || 0 }}/{{ getTotalStudents(assignment.classId) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getAssignmentStatus(assignment).class" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <span class="material-icons text-xs mr-1">{{ getAssignmentStatus(assignment).icon }}</span>
                      {{ getAssignmentStatus(assignment).text }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button 
                        @click="viewAssignment(assignment)"
                        class="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <span class="material-icons text-sm">visibility</span>
                        <span>View</span>
                      </button>
                      <button 
                        @click="gradeAssignment(assignment)"
                        class="text-green-600 hover:text-green-900 flex items-center space-x-1"
                      >
                        <span class="material-icons text-sm">grade</span>
                        <span>Grade</span>
                      </button>
                      <button 
                        @click="editAssignment(assignment)"
                        class="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                      >
                        <span class="material-icons text-sm">edit</span>
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="assignments.length === 0" class="text-center py-12">
              <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-gray-400 text-3xl">assignment</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No assignments created</h3>
              <p class="text-gray-500 mb-4">Get started by creating your first assignment</p>
              <button 
                @click="showCreateModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Analytics -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button 
              @click="showCreateModal = true"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">add</span>
                <div class="text-left">
                  <div class="font-semibold">Create Assignment</div>
                  <div class="text-blue-100 text-xs">Add new assignment</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>

            <button class="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">download</span>
                <div class="text-left">
                  <div class="font-semibold">Export Grades</div>
                  <div class="text-green-100 text-xs">Download grade reports</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>

            <button 
              @click="sendReminders"
              :disabled="isSendingReminders"
              class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">{{ isSendingReminders ? 'hourglass_empty' : 'email' }}</span>
                <div class="text-left">
                  <div class="font-semibold">{{ isSendingReminders ? 'Sending...' : 'Send Reminders' }}</div>
                  <div class="text-orange-100 text-xs">{{ isSendingReminders ? 'Please wait' : 'Notify students' }}</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Recent Submissions -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Submissions</h3>
          <div class="space-y-3">
            <div 
              v-for="submission in recentSubmissions" 
              :key="submission.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors cursor-pointer"
              @click="gradeSubmission(submission.assignmentId, submission.userId)"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-sm">person</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ getStudentName(submission.userId) }}</div>
                  <div class="text-xs text-gray-500">{{ getAssignmentTitle(submission.assignmentId) }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-500">{{ formatDate(submission.submittedAt) }}</div>
                <div v-if="submission.grade != null" class="text-sm font-semibold text-green-600">
                  {{ submission.grade }}%
                </div>
                <div v-else class="text-sm font-semibold text-orange-600">
                  Pending
                </div>
              </div>
            </div>
            <div v-if="recentSubmissions.length === 0" class="text-center py-4 text-gray-500 text-sm">
              No recent submissions
            </div>
          </div>
        </div>

        <!-- Assignment Types -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Assignment Types</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50 rounded-classroom p-3 text-center">
              <span class="material-icons text-blue-600 text-lg">article</span>
              <div class="text-sm font-medium text-gray-900 mt-1">Homework</div>
              <div class="text-xs text-gray-600">{{ homeworkCount }}</div>
            </div>
            <div class="bg-green-50 rounded-classroom p-3 text-center">
              <span class="material-icons text-green-600 text-lg">quiz</span>
              <div class="text-sm font-medium text-gray-900 mt-1">Quiz</div>
              <div class="text-xs text-gray-600">{{ quizCount }}</div>
            </div>
            <div class="bg-purple-50 rounded-classroom p-3 text-center">
              <span class="material-icons text-purple-600 text-lg">science</span>
              <div class="text-sm font-medium text-gray-900 mt-1">Project</div>
              <div class="text-xs text-gray-600">{{ projectCount }}</div>
            </div>
            <div class="bg-orange-50 rounded-classroom p-3 text-center">
              <span class="material-icons text-orange-600 text-lg">description</span>
              <div class="text-sm font-medium text-gray-900 mt-1">Essay</div>
              <div class="text-xs text-gray-600">{{ essayCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Assignment Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">Create New Assignment</h3>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>
        </div>

        <form @submit.prevent="createAssignment" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
            <input 
              v-model="newAssignment.title"
              required 
              placeholder="Enter assignment title"
              class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              v-model="newAssignment.description"
              rows="3"
              placeholder="Enter assignment description"
              class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Assign to Class</label>
              <select 
                v-model="newAssignment.classId"
                required
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Select a class</option>
                <option v-for="cls in myClasses" :value="cls.id" :key="cls.id">{{ cls.title }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input 
                v-model="newAssignment.dueAt"
                required 
                type="datetime-local"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Assignment Type</label>
              <select 
                v-model="newAssignment.type"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="homework">Homework</option>
                <option value="quiz">Quiz</option>
                <option value="project">Project</option>
                <option value="essay">Essay</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Points</label>
              <input 
                v-model="newAssignment.maxPoints"
                type="number"
                min="1"
                max="100"
                placeholder="100"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="showCreateModal = false"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTeacherClassesStore } from '../../stores/teacherClasses'

const store = useTeacherClassesStore()
const showCreateModal = ref(false)
const isSendingReminders = ref(false)
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || '{}')

// Initialize store
onMounted(() => {
  store.fetchAll()
})

// Assignments data
const assignments = ref(JSON.parse(localStorage.getItem('mock:assignments') || '[]'))

// New assignment form
const newAssignment = reactive({
  title: '',
  description: '',
  classId: '',
  dueAt: '',
  type: 'homework',
  maxPoints: 100,
  submissions: []
})

// Get teacher's classes
const myClasses = computed(() => {
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  return classes.filter(c => c.teacherId === currentUser.id)
})

// Computed properties for statistics
const totalSubmissions = computed(() => {
  return assignments.value.reduce((total, assignment) => {
    return total + (assignment.submissions?.length || 0)
  }, 0)
})

const submissionRate = computed(() => {
  const totalStudents = myClasses.value.reduce((total, cls) => {
    return total + (cls.students?.length || 0)
  }, 0)
  const totalPossibleSubmissions = assignments.value.length * totalStudents
  return totalPossibleSubmissions > 0 ? Math.round((totalSubmissions.value / totalPossibleSubmissions) * 100) : 0
})

const pendingGrading = computed(() => {
  return assignments.value.reduce((total, assignment) => {
    const ungraded = assignment.submissions?.filter(s => s.grade == null) || []
    return total + ungraded.length
  }, 0)
})

const overdueAssignments = computed(() => {
  const now = new Date()
  return assignments.value.filter(assignment => {
    return new Date(assignment.dueAt) < now && (assignment.submissions?.length || 0) < getTotalStudents(assignment.classId)
  }).length
})

const recentSubmissions = computed(() => {
  const allSubmissions = []
  assignments.value.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        allSubmissions.push({
          ...submission,
          assignmentId: assignment.id
        })
      })
    }
  })
  return allSubmissions
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5)
})

const homeworkCount = computed(() => assignments.value.filter(a => a.type === 'homework').length)
const quizCount = computed(() => assignments.value.filter(a => a.type === 'quiz').length)
const projectCount = computed(() => assignments.value.filter(a => a.type === 'project').length)
const essayCount = computed(() => assignments.value.filter(a => a.type === 'essay').length)

// Helper functions
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString([], { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    })
  } catch {
    return iso
  }
}

function getClassTitle(id) {
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  const cls = classes.find(x => x.id === id)
  return cls ? cls.title : '—'
}

function getStudentName(id) {
  const students = JSON.parse(localStorage.getItem('mock:students') || '[]')
  const student = students.find(x => x.id === id)
  return student ? student.name : id
}

function getAssignmentTitle(id) {
  const assignment = assignments.value.find(x => x.id === id)
  return assignment ? assignment.title : 'Unknown Assignment'
}

function getTotalStudents(classId) {
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  const cls = classes.find(x => x.id === classId)
  return cls && cls.students ? cls.students.length : 0
}

function getSubmissionProgress(assignment) {
  const totalStudents = getTotalStudents(assignment.classId)
  const submissions = assignment.submissions?.length || 0
  return totalStudents > 0 ? Math.round((submissions / totalStudents) * 100) : 0
}

function getDueDateStatus(dueDate) {
  const now = new Date()
  const due = new Date(dueDate)
  const diff = due - now
  
  if (diff < 0) {
    return { class: 'text-red-500', text: 'Overdue' }
  } else if (diff < 24 * 60 * 60 * 1000) {
    return { class: 'text-orange-500', text: 'Due today' }
  } else if (diff < 3 * 24 * 60 * 60 * 1000) {
    return { class: 'text-yellow-500', text: 'Due soon' }
  } else {
    return { class: 'text-green-500', text: 'On track' }
  }
}

function getAssignmentStatus(assignment) {
  const now = new Date()
  const due = new Date(assignment.dueAt)
  const progress = getSubmissionProgress(assignment)
  
  if (due < now && progress < 100) {
    return { class: 'bg-red-100 text-red-800', icon: 'warning', text: 'Overdue' }
  } else if (progress === 100) {
    return { class: 'bg-green-100 text-green-800', icon: 'check_circle', text: 'Completed' }
  } else if (progress > 0) {
    return { class: 'bg-blue-100 text-blue-800', icon: 'pending', text: 'In Progress' }
  } else {
    return { class: 'bg-gray-100 text-gray-800', icon: 'schedule', text: 'Not Started' }
  }
}

// Assignment management functions
function createAssignment() {
  const id = 'a' + Date.now()
  const assignment = {
    id,
    ...newAssignment,
    createdAt: new Date().toISOString(),
    submissions: []
  }
  
  const assignmentsList = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  assignmentsList.unshift(assignment)
  localStorage.setItem('mock:assignments', JSON.stringify(assignmentsList))
  
  assignments.value = assignmentsList
  showCreateModal.value = false
  resetNewAssignment()
  
  if (window.showToast) {
    window.showToast('Assignment created successfully!')
  }
}

function resetNewAssignment() {
  Object.assign(newAssignment, {
    title: '',
    description: '',
    classId: '',
    dueAt: '',
    type: 'homework',
    maxPoints: 100,
    submissions: []
  })
}

function viewAssignment(assignment) {
  // Navigate to assignment detail view
  console.log('View assignment:', assignment)
}

function gradeAssignment(assignment) {
  // Navigate to grading interface
  console.log('Grade assignment:', assignment)
}

function editAssignment(assignment) {
  // Open edit modal or navigate to edit view
  console.log('Edit assignment:', assignment)
}

function gradeSubmission(assignmentId, userId) {
  const assignmentsList = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  const assignment = assignmentsList.find(x => x.id === assignmentId)
  if (!assignment) {
    alert('Assignment not found')
    return
  }
  
  const submission = assignment.submissions.find(s => s.userId === userId)
  const studentName = getStudentName(userId)
  const grade = prompt(`Enter grade for ${studentName} (0-100)`)
  
  if (grade != null) {
    const gradeValue = Number(grade)
    if (gradeValue >= 0 && gradeValue <= 100) {
      submission.grade = gradeValue
      localStorage.setItem('mock:assignments', JSON.stringify(assignmentsList))
      assignments.value = assignmentsList
      
      if (window.showToast) {
        window.showToast(`Grade saved for ${studentName}`)
      }
    } else {
      alert('Please enter a valid grade between 0 and 100')
    }
  }
}

// Send Reminders functionality
async function sendReminders() {
  if (assignments.value.length === 0) {
    if (window.showToast) {
      window.showToast('No assignments available to send reminders for.')
    }
    return
  }

  isSendingReminders.value = true

  try {
    // Find assignments that need reminders (incomplete submissions)
    const assignmentsNeedingReminders = assignments.value.filter(assignment => {
      const totalStudents = getTotalStudents(assignment.classId)
      const submissions = assignment.submissions?.length || 0
      return submissions < totalStudents
    })

    if (assignmentsNeedingReminders.length === 0) {
      if (window.showToast) {
        window.showToast('All students have submitted their assignments!')
      }
      isSendingReminders.value = false
      return
    }

    // Simulate sending reminders (in production, this would make API calls)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Count students who will receive reminders
    let totalReminders = 0
    assignmentsNeedingReminders.forEach(assignment => {
      const totalStudents = getTotalStudents(assignment.classId)
      const submissions = assignment.submissions?.length || 0
      totalReminders += (totalStudents - submissions)
    })

    // In a real implementation, you would call the backend API to send notifications
    // Example:
    // await fetch('/api/v1/notifications', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     type: 'SUBMISSION_REMINDER',
    //     title: 'Assignment Reminder',
    //     content: 'You have pending assignments to submit',
    //     userIds: studentsToNotify
    //   })
    // })

    // Store notification in localStorage for demo
    const notifications = JSON.parse(localStorage.getItem('teacher:notifications') || '[]')
    notifications.unshift({
      id: Date.now(),
      type: 'BULK_REMINDER_SENT',
      title: 'Reminder Sent',
      message: `Reminders sent to ${totalReminders} students for ${assignmentsNeedingReminders.length} assignment(s)`,
      timestamp: new Date().toISOString(),
      status: 'success'
    })
    localStorage.setItem('teacher:notifications', JSON.stringify(notifications))

    if (window.showToast) {
      window.showToast(`✅ Successfully sent reminders to ${totalReminders} students for ${assignmentsNeedingReminders.length} assignment(s)!`, 'success')
    }
  } catch (error) {
    console.error('Error sending reminders:', error)
    if (window.showToast) {
      window.showToast('Failed to send reminders. Please try again.', 'error')
    }
  } finally {
    isSendingReminders.value = false
  }
}
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
