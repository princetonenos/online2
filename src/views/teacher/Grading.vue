<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Grading Center
          </h1>
          <p class="text-gray-600 mt-2">Review and grade student submissions with detailed feedback</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search submissions..."
              class="bg-white border border-gray-300 rounded-classroom pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-icons text-gray-400 text-sm">search</span>
            </div>
          </div>
          <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2">
            <span class="material-icons text-sm">filter_list</span>
            <span>Filter</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Grading Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Pending Grading</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ toGrade.length }}</p>
            <p class="text-red-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">schedule</span>
              Needs attention
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-xl">pending</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Graded Today</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ gradedToday }}</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">check_circle</span>
              Great progress
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
              <span class="material-icons text-sm mr-1">trending_up</span>
              +2.5% improvement
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
            <p class="text-gray-600 text-sm font-medium">Overdue</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ overdueSubmissions }}</p>
            <p class="text-red-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">warning</span>
              Past deadline
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-xl">error</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Submissions List -->
      <div class="xl:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Submissions Pending Grading</h2>
                <p class="text-gray-600 mt-1">Review and provide feedback for student work</p>
              </div>
              <div class="flex items-center space-x-3">
                <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2">
                  <span class="material-icons text-sm">sort</span>
                  <span>Sort</span>
                </button>
                <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2">
                  <span class="material-icons text-sm">refresh</span>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          <div class="divide-y divide-gray-200">
            <div 
              v-for="entry in toGrade" 
              :key="entry.key"
              class="p-6 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom flex items-center justify-center text-white font-semibold text-sm">
                    {{ getStudentName(entry.sub.userId).charAt(0) }}
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ entry.assignment.title }}</h3>
                    <p class="text-sm text-gray-600">{{ getStudentName(entry.sub.userId) }} • {{ getClassTitle(entry.assignment.classId) }}</p>
                    <p class="text-xs text-gray-500 mt-1">Submitted: {{ formatDate(entry.sub.submittedAt) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    :class="getSubmissionStatus(entry).class"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    <span class="material-icons text-xs mr-1">{{ getSubmissionStatus(entry).icon }}</span>
                    {{ getSubmissionStatus(entry).text }}
                  </span>
                </div>
              </div>

              <!-- Grading Interface -->
              <div class="bg-gray-50 rounded-classroom p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Grade (0-100)</label>
                    <div class="flex items-center space-x-3">
                      <input 
                        v-model.number="entry.value"
                        type="number" 
                        min="0" 
                        max="100"
                        placeholder="Enter grade"
                        class="flex-1 p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                      <div class="text-2xl font-bold text-gray-900 min-w-16 text-center">
                        {{ entry.value || '--' }}%
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Letter Grade</label>
                    <div class="flex space-x-2">
                      <button 
                        v-for="grade in letterGrades"
                        :key="grade.value"
                        @click="entry.value = grade.value"
                        :class="entry.value === grade.value ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'"
                        class="flex-1 py-2 rounded-classroom text-sm font-medium transition-colors"
                      >
                        {{ grade.letter }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                  <textarea 
                    v-model="entry.feedback"
                    rows="3"
                    placeholder="Provide constructive feedback for the student..."
                    class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  ></textarea>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <button 
                      @click="saveGrade(entry)"
                      class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2"
                    >
                      <span class="material-icons text-sm">save</span>
                      <span>Save Grade</span>
                    </button>
                    <button 
                      @click="skipGrade(entry)"
                      class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-classroom transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                  <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <span class="material-icons text-sm">schedule</span>
                    <span>{{ getTimeSinceSubmission(entry.sub.submittedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="toGrade.length === 0" class="text-center py-12">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-gray-400 text-3xl">celebration</span>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p class="text-gray-500 mb-4">No submissions pending grading</p>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors">
              Check for New Submissions
            </button>
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
              @click="exportGrades"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">download</span>
                <div class="text-left">
                  <div class="font-semibold">Export Grades</div>
                  <div class="text-blue-100 text-xs">Download grade reports</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>

            <button 
              @click="viewAllAssignments"
              class="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">assignment</span>
                <div class="text-left">
                  <div class="font-semibold">View All Assignments</div>
                  <div class="text-green-100 text-xs">Manage assignments</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>

            <button 
              @click="sendFeedbackToStudents"
              class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">email</span>
                <div class="text-left">
                  <div class="font-semibold">Send Feedback</div>
                  <div class="text-orange-100 text-xs">Notify students</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Recent Grading Activity -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Grading Activity</h3>
          <div class="space-y-3">
            <div 
              v-for="activity in recentGradingActivity" 
              :key="activity.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-classroom"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-sm">grade</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ activity.studentName }}</div>
                  <div class="text-xs text-gray-500">{{ activity.assignmentTitle }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-green-600">{{ activity.grade }}%</div>
                <div class="text-xs text-gray-500">{{ activity.time }}</div>
              </div>
            </div>
            <div v-if="recentGradingActivity.length === 0" class="text-center py-4 text-gray-500 text-sm">
              No recent grading activity
            </div>
          </div>
        </div>

        <!-- Grading Distribution -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Grade Distribution</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">A (90-100)</span>
              <span class="text-sm font-semibold text-green-600">35%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">B (80-89)</span>
              <span class="text-sm font-semibold text-blue-600">42%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">C (70-79)</span>
              <span class="text-sm font-semibold text-yellow-600">18%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">D/F (0-69)</span>
              <span class="text-sm font-semibold text-red-600">5%</span>
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

const router = useRouter()

// Data initialization
const assignments = ref(JSON.parse(localStorage.getItem('mock:assignments') || '[]'))
const students = ref(JSON.parse(localStorage.getItem('mock:students') || '[]'))
const classes = ref(JSON.parse(localStorage.getItem('mock:classes') || '[]'))

// Letter grades for quick selection
const letterGrades = [
  { letter: 'A+', value: 97 },
  { letter: 'A', value: 93 },
  { letter: 'A-', value: 90 },
  { letter: 'B+', value: 87 },
  { letter: 'B', value: 83 },
  { letter: 'B-', value: 80 },
  { letter: 'C+', value: 77 },
  { letter: 'C', value: 73 },
  { letter: 'C-', value: 70 },
  { letter: 'D', value: 65 },
  { letter: 'F', value: 55 }
]

// Prepare list of ungraded submissions with enhanced structure
const toGrade = ref([])

function initializeToGrade() {
  toGrade.value = []
  for (const a of assignments.value) {
    if (a.submissions && a.submissions.length) {
      for (const sub of a.submissions) {
        if (sub.grade == null) {
          toGrade.value.push({ 
            key: a.id + ':' + sub.userId, 
            assignment: a, 
            sub, 
            value: null,
            feedback: ''
          })
        }
      }
    }
  }
}

// Initialize on component mount
onMounted(() => {
  initializeToGrade()
})

// Computed properties
const gradedToday = computed(() => {
  const today = new Date().toDateString()
  let count = 0
  assignments.value.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        if (submission.grade != null && new Date(submission.gradedAt).toDateString() === today) {
          count++
        }
      })
    }
  })
  return count
})

const overdueSubmissions = computed(() => {
  const now = new Date()
  return toGrade.value.filter(entry => {
    const dueDate = new Date(entry.assignment.dueAt)
    return dueDate < now
  }).length
})

const recentGradingActivity = computed(() => {
  const activities = []
  assignments.value.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        if (submission.grade != null && submission.gradedAt) {
          activities.push({
            id: assignment.id + ':' + submission.userId,
            studentName: getStudentName(submission.userId),
            assignmentTitle: assignment.title,
            grade: submission.grade,
            time: formatTimeAgo(submission.gradedAt)
          })
        }
      })
    }
  })
  return activities.sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt)).slice(0, 5)
})

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

function formatTimeAgo(iso) {
  try {
    const now = new Date()
    const date = new Date(iso)
    const diff = now - date
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  } catch {
    return iso
  }
}

function getStudentName(id) { 
  const student = students.value.find(x => x.id === id)
  return student ? student.name : id 
}

function getClassTitle(id) {
  const cls = classes.value.find(x => x.id === id)
  return cls ? cls.title : 'Unknown Class'
}

function getSubmissionStatus(entry) {
  const now = new Date()
  const dueDate = new Date(entry.assignment.dueAt)
  
  if (dueDate < now) {
    return { class: 'bg-red-100 text-red-800', icon: 'warning', text: 'Overdue' }
  } else {
    return { class: 'bg-blue-100 text-blue-800', icon: 'schedule', text: 'On Time' }
  }
}

function getTimeSinceSubmission(iso) {
  try {
    const now = new Date()
    const submitted = new Date(iso)
    const diff = now - submitted
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h ago`
    if (hours > 0) return `${hours}h ago`
    return 'Recently'
  } catch {
    return 'Unknown'
  }
}

// Grading functions
function saveGrade(entry) {
  if (entry.value == null || entry.value < 0 || entry.value > 100) {
    alert('Please enter a valid grade between 0 and 100')
    return
  }
  
  const assignmentsList = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  const assignment = assignmentsList.find(x => x.id === entry.assignment.id)
  
  if (!assignment) {
    alert('Assignment not found')
    return
  }
  
  const submission = assignment.submissions.find(x => x.userId === entry.sub.userId)
  submission.grade = Number(entry.value)
  submission.gradedAt = new Date().toISOString()
  submission.feedback = entry.feedback || ''
  
  localStorage.setItem('mock:assignments', JSON.stringify(assignmentsList))
  
  // Remove from toGrade and update assignments reference
  toGrade.value = toGrade.value.filter(x => x.key !== entry.key)
  assignments.value = assignmentsList
  
  if (window.showToast) {
    window.showToast(`Grade saved for ${getStudentName(entry.sub.userId)}`)
  }
}

function skipGrade(entry) {
  toGrade.value = toGrade.value.filter(x => x.key !== entry.key)
  if (window.showToast) {
    window.showToast('Submission skipped')
  }
}

// Quick Action Functions
function exportGrades() {
  try {
    // Collect all graded submissions
    const gradedSubmissions = []
    
    assignments.value.forEach(assignment => {
      if (assignment.submissions) {
        assignment.submissions.forEach(submission => {
          if (submission.grade != null) {
            gradedSubmissions.push({
              'Assignment': assignment.title,
              'Class': getClassTitle(assignment.classId),
              'Student': getStudentName(submission.userId),
              'Grade': submission.grade + '%',
              'Status': submission.status || 'Graded',
              'Submitted': formatDate(submission.submittedAt),
              'Graded': submission.gradedAt ? formatDate(submission.gradedAt) : 'N/A',
              'Feedback': submission.feedback || 'No feedback'
            })
          }
        })
      }
    })
    
    if (gradedSubmissions.length === 0) {
      if (window.showToast) {
        window.showToast('No graded submissions to export')
      }
      return
    }
    
    // Convert to CSV
    const headers = Object.keys(gradedSubmissions[0])
    const csvContent = [
      headers.join(','),
      ...gradedSubmissions.map(row => 
        headers.map(header => {
          const value = row[header]
          // Escape commas and quotes in values
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
      )
    ].join('\n')
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `grades_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    
    if (window.showToast) {
      window.showToast(`Exported ${gradedSubmissions.length} grades successfully!`)
    }
  } catch (error) {
    console.error('Export error:', error)
    if (window.showToast) {
      window.showToast('Error exporting grades. Please try again.')
    }
  }
}

function viewAllAssignments() {
  router.push('/teacher/assignments')
  if (window.showToast) {
    window.showToast('Navigating to assignments...')
  }
}

function sendFeedbackToStudents() {
  // Count students with graded work
  let notifiedCount = 0
  const recentlyGraded = []
  
  assignments.value.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        if (submission.grade != null && submission.gradedAt) {
          const gradedDate = new Date(submission.gradedAt)
          const hoursSinceGraded = (new Date() - gradedDate) / (1000 * 60 * 60)
          
          // Only notify for grades in the last 24 hours
          if (hoursSinceGraded < 24) {
            notifiedCount++
            recentlyGraded.push({
              student: getStudentName(submission.userId),
              assignment: assignment.title,
              grade: submission.grade
            })
          }
        }
      })
    }
  })
  
  if (notifiedCount === 0) {
    if (window.showToast) {
      window.showToast('No recently graded submissions to notify about')
    }
    return
  }
  
  // Simulate sending notifications
  if (confirm(`Send grade notifications to ${notifiedCount} student(s)?`)) {
    // In a real app, this would trigger email/in-app notifications
    setTimeout(() => {
      if (window.showToast) {
        window.showToast(`✅ Feedback sent to ${notifiedCount} students!`)
      }
      
      // Log the notification
      console.log('Notifications sent:', recentlyGraded)
    }, 500)
  }
}
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
