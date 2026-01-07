<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p class="text-gray-600 mt-2">Gain insights into student performance, engagement, and class progress</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select 
              v-model="timePeriod"
              @change="handleTimePeriodChange"
              class="bg-white border border-gray-300 rounded-classroom pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="semester">This semester</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <span class="material-icons text-gray-400 text-sm">arrow_drop_down</span>
            </div>
          </div>
          <button 
            @click="exportAnalytics"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2"
          >
            <span class="material-icons text-sm">download</span>
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Average Completion</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ avgCompletion }}%</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">trending_up</span>
              +5.2% this week
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-xl">task_alt</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Active Classes</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ activeCount }}</p>
            <p class="text-blue-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">school</span>
              {{ completedClasses }} completed
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-xl">groups</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Students</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ studentCount }}</p>
            <p class="text-orange-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">person_add</span>
              +3 new this week
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-purple-600 text-xl">people</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Avg. Grade</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ averageGrade }}%</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">insights</span>
              +2.1% improvement
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-xl">grade</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Analytics Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
      <!-- Engagement Chart -->
      <div class="xl:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Student Engagement</h2>
            <div class="flex items-center space-x-2">
              <button class="text-sm text-gray-600 hover:text-gray-900">Daily</button>
              <button class="text-sm text-gray-600 hover:text-gray-900">Weekly</button>
              <button class="text-sm text-blue-600 font-medium">Monthly</button>
            </div>
          </div>
          <div class="h-80 bg-gradient-to-br from-gray-50 to-blue-50 rounded-classroom flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-blue-600 text-2xl">bar_chart</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Engagement Analytics</h3>
              <p class="text-gray-500 mb-4">Chart.js or Recharts integration ready</p>
              <div class="flex justify-center space-x-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Assignments</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Participation</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>Attendance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Distribution -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Grade Distribution</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-green-600 text-sm">emoji_events</span>
                </div>
                <span class="text-sm font-medium text-gray-900">A (90-100)</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ gradeDistribution.A }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-green-500 h-2 rounded-full" :style="{ width: gradeDistribution.A + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-sm">thumb_up</span>
                </div>
                <span class="text-sm font-medium text-gray-900">B (80-89)</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ gradeDistribution.B }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-blue-500 h-2 rounded-full" :style="{ width: gradeDistribution.B + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-yellow-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-yellow-600 text-sm">warning</span>
                </div>
                <span class="text-sm font-medium text-gray-900">C (70-79)</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ gradeDistribution.C }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-yellow-500 h-2 rounded-full" :style="{ width: gradeDistribution.C + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-red-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-red-600 text-sm">error</span>
                </div>
                <span class="text-sm font-medium text-gray-900">D/F (0-69)</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ gradeDistribution.DF }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-red-500 h-2 rounded-full" :style="{ width: gradeDistribution.DF + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Assignment Completion -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Assignment Completion</h3>
          <div class="space-y-3">
            <div v-for="assignment in recentAssignments" :key="assignment.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-sm">assignment</span>
                </div>
                <div class="text-sm font-medium text-gray-900 truncate">{{ assignment.title }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ assignment.completion }}%</div>
                <div class="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    class="h-1.5 rounded-full transition-all duration-500"
                    :class="getCompletionColor(assignment.completion)"
                    :style="{ width: assignment.completion + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Analytics Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Class Performance -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Class Performance</h2>
        <div class="space-y-4">
          <div 
            v-for="cls in myClasses" 
            :key="cls.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom flex items-center justify-center text-white font-semibold text-sm">
                {{ cls.title.charAt(0) }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ cls.title }}</div>
                <div class="text-xs text-gray-500">{{ cls.students?.length || 0 }} students</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-900">{{ getClassAverageGrade(cls.id) }}%</div>
              <div class="text-xs text-gray-500">Average grade</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Progress -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Top Performing Students</h2>
        <div class="space-y-4">
          <div 
            v-for="student in topStudents" 
            :key="student.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-green-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-classroom flex items-center justify-center text-white font-semibold text-sm">
                {{ student.name.charAt(0) }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                <div class="text-xs text-gray-500">{{ student.className }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-green-600">{{ student.averageGrade }}%</div>
              <div class="text-xs text-gray-500">Average</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div class="space-y-4">
        <div 
          v-for="activity in recentActivity" 
          :key="activity.id"
          class="flex items-start space-x-4 p-4 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors"
        >
          <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center flex-shrink-0 mt-1">
            <span class="material-icons text-blue-600 text-sm">{{ activity.icon }}</span>
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-900">{{ activity.title }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ activity.description }}</div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-xs text-gray-500">{{ activity.time }}</div>
            <div class="text-xs font-medium mt-1" :class="activity.statusClass">{{ activity.status }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTeacherClassesStore } from '../../stores/teacherClasses'

const store = useTeacherClassesStore()
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || '{}')
const timePeriod = ref('30')

// Initialize store
onMounted(() => {
  store.fetchAll()
})

// Basic computed properties
const myClasses = computed(() => store.items.filter(c => c.teacherId === currentUser.id))
const studentCount = computed(() => store.getStudents().length)
const activeCount = computed(() => myClasses.value.filter(c => c.status === 'active' || c.status === 'scheduled').length)
const avgCompletion = computed(() => store.avgCompletion())

// Enhanced analytics computed properties
const completedClasses = computed(() => {
  return myClasses.value.filter(c => c.status === 'completed').length
})

const averageGrade = computed(() => {
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  let totalGrade = 0
  let gradedCount = 0
  
  assignments.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        if (submission.grade != null) {
          totalGrade += submission.grade
          gradedCount++
        }
      })
    }
  })
  
  return gradedCount > 0 ? Math.round(totalGrade / gradedCount) : 0
})

const gradeDistribution = computed(() => {
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  const distribution = { A: 0, B: 0, C: 0, DF: 0 }
  let totalGraded = 0
  
  assignments.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        if (submission.grade != null) {
          totalGraded++
          if (submission.grade >= 90) distribution.A++
          else if (submission.grade >= 80) distribution.B++
          else if (submission.grade >= 70) distribution.C++
          else distribution.DF++
        }
      })
    }
  })
  
  // Convert to percentages
  if (totalGraded > 0) {
    distribution.A = Math.round((distribution.A / totalGraded) * 100)
    distribution.B = Math.round((distribution.B / totalGraded) * 100)
    distribution.C = Math.round((distribution.C / totalGraded) * 100)
    distribution.DF = Math.round((distribution.DF / totalGraded) * 100)
  }
  
  return distribution
})

const recentAssignments = computed(() => {
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  return assignments.slice(0, 5).map(assignment => {
    const totalStudents = getClassStudentCount(assignment.classId)
    const submissions = assignment.submissions?.length || 0
    const completion = totalStudents > 0 ? Math.round((submissions / totalStudents) * 100) : 0
    
    return {
      ...assignment,
      completion
    }
  })
})

const topStudents = computed(() => {
  const students = JSON.parse(localStorage.getItem('mock:students') || '[]')
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  
  return students.slice(0, 5).map(student => {
    let totalGrade = 0
    let gradedCount = 0
    
    assignments.forEach(assignment => {
      if (assignment.submissions) {
        const submission = assignment.submissions.find(s => s.userId === student.id)
        if (submission && submission.grade != null) {
          totalGrade += submission.grade
          gradedCount++
        }
      }
    })
    
    const averageGrade = gradedCount > 0 ? Math.round(totalGrade / gradedCount) : 0
    const className = getStudentClassName(student.id)
    
    return {
      ...student,
      averageGrade,
      className
    }
  }).sort((a, b) => b.averageGrade - a.averageGrade)
})

const recentActivity = computed(() => {
  const activities = []
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  
  // Add recent submissions
  assignments.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        activities.push({
          id: `submission-${assignment.id}-${submission.userId}`,
          icon: 'assignment_turned_in',
          title: 'Assignment Submitted',
          description: `${getStudentName(submission.userId)} submitted "${assignment.title}"`,
          time: formatTimeAgo(submission.submittedAt),
          status: 'Submitted',
          statusClass: 'text-blue-600'
        })
      })
    }
  })
  
  // Add recent grades
  assignments.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        if (submission.gradedAt) {
          activities.push({
            id: `grade-${assignment.id}-${submission.userId}`,
            icon: 'grade',
            title: 'Assignment Graded',
            description: `${getStudentName(submission.userId)} received ${submission.grade}% on "${assignment.title}"`,
            time: formatTimeAgo(submission.gradedAt),
            status: 'Graded',
            statusClass: 'text-green-600'
          })
        }
      })
    }
  })
  
  return activities
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5)
})

// Helper functions
function getClassStudentCount(classId) {
  const cls = myClasses.value.find(c => c.id === classId)
  return cls && cls.students ? cls.students.length : 0
}

function getClassAverageGrade(classId) {
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  const classAssignments = assignments.filter(a => a.classId === classId)
  
  let totalGrade = 0
  let gradedSubmissions = 0
  
  classAssignments.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        if (submission.grade != null) {
          totalGrade += submission.grade
          gradedSubmissions++
        }
      })
    }
  })
  
  return gradedSubmissions > 0 ? Math.round(totalGrade / gradedSubmissions) : 0
}

function getStudentName(id) {
  const students = JSON.parse(localStorage.getItem('mock:students') || '[]')
  const student = students.find(x => x.id === id)
  return student ? student.name : id
}

function getStudentClassName(studentId) {
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  const cls = classes.find(c => c.students && c.students.includes(studentId))
  return cls ? cls.title : 'Unknown Class'
}

function getCompletionColor(percentage) {
  if (percentage >= 90) return 'bg-green-500'
  if (percentage >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
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
    return 'Unknown'
  }
}

function handleTimePeriodChange() {
  if (window.showToast) {
    const labels = { '7': '7 days', '30': '30 days', '90': '90 days', 'semester': 'semester' }
    window.showToast(`Analytics updated for last ${labels[timePeriod.value]}`)
  }
}

function exportAnalytics() {
  try {
    const analyticsData = {
      'Overview': {
        'Time Period': timePeriod.value === 'semester' ? 'This Semester' : `Last ${timePeriod.value} days`,
        'Report Generated': new Date().toLocaleString(),
        'Total Classes': activeCount.value,
        'Total Students': studentCount.value,
        'Average Completion': avgCompletion.value + '%',
        'Average Grade': averageGrade.value + '%'
      },
      'Grade Distribution': {
        'A (90-100)': gradeDistribution.value.A + '%',
        'B (80-89)': gradeDistribution.value.B + '%',
        'C (70-79)': gradeDistribution.value.C + '%',
        'D/F (0-69)': gradeDistribution.value.DF + '%'
      }
    }
    
    // Class Performance
    const classData = []
    myClasses.value.forEach(cls => {
      classData.push({
        'Class': cls.title,
        'Students': cls.students?.length || 0,
        'Average Grade': getClassAverageGrade(cls.id) + '%',
        'Status': cls.status || 'active'
      })
    })
    
    // Top Students
    const studentData = []
    topStudents.value.forEach(student => {
      studentData.push({
        'Student': student.name,
        'Class': student.className,
        'Average Grade': student.averageGrade + '%'
      })
    })
    
    // Assignment Completion
    const assignmentData = []
    recentAssignments.value.forEach(assignment => {
      assignmentData.push({
        'Assignment': assignment.title,
        'Completion Rate': assignment.completion + '%',
        'Due Date': assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : 'N/A'
      })
    })
    
    // Combine all data
    let csvContent = '=== ANALYTICS OVERVIEW ===\n'
    csvContent += Object.entries(analyticsData.Overview).map(([key, value]) => `${key},${value}`).join('\n')
    csvContent += '\n\n=== GRADE DISTRIBUTION ===\n'
    csvContent += Object.entries(analyticsData['Grade Distribution']).map(([key, value]) => `${key},${value}`).join('\n')
    csvContent += '\n\n=== CLASS PERFORMANCE ===\n'
    csvContent += 'Class,Students,Average Grade,Status\n'
    csvContent += classData.map(row => `"${row.Class}",${row.Students},${row['Average Grade']},${row.Status}`).join('\n')
    csvContent += '\n\n=== TOP STUDENTS ===\n'
    csvContent += 'Student,Class,Average Grade\n'
    csvContent += studentData.map(row => `"${row.Student}","${row.Class}",${row['Average Grade']}`).join('\n')
    csvContent += '\n\n=== ASSIGNMENT COMPLETION ===\n'
    csvContent += 'Assignment,Completion Rate,Due Date\n'
    csvContent += assignmentData.map(row => `"${row.Assignment}",${row['Completion Rate']},${row['Due Date']}`).join('\n')
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    
    if (window.showToast) {
      window.showToast('Analytics report exported successfully!')
    }
  } catch (error) {
    console.error('Export error:', error)
    if (window.showToast) {
      window.showToast('Error exporting analytics. Please try again.')
    }
  }
}
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
