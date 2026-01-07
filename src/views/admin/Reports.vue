<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p class="text-gray-600 mt-2">Generate and view comprehensive system reports</p>
        </div>
        <router-link 
          to="/admin/dashboard"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-classroom transition-colors flex items-center space-x-2"
        >
          <span class="material-icons text-sm">arrow_back</span>
          <span>Back</span>
        </router-link>
      </div>
    </div>

    <!-- Quick Report Generation -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="quickReport in quickReports"
        :key="quickReport.id"
        @click="generateQuickReport(quickReport)"
        class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-classroom flex items-center justify-center" :class="quickReport.bgColor">
            <span class="material-icons text-2xl" :class="quickReport.iconColor">{{ quickReport.icon }}</span>
          </div>
          <span class="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">Quick</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ quickReport.name }}</h3>
        <p class="text-sm text-gray-600">{{ quickReport.description }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Report Generator -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Custom Report Builder -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-blue-600 text-sm">build</span>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Custom Report Builder</h2>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                v-model="customReport.type"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select report type...</option>
                <option value="enrollment">Enrollment Report</option>
                <option value="attendance">Attendance Report</option>
                <option value="performance">Performance Report</option>
                <option value="user-activity">User Activity Report</option>
                <option value="assignment">Assignment Statistics</option>
                <option value="class-performance">Class Performance</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  v-model="customReport.startDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  v-model="customReport.endDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div class="flex space-x-4">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input v-model="customReport.format" type="radio" value="pdf" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                  <span class="text-sm text-gray-700">PDF</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input v-model="customReport.format" type="radio" value="csv" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                  <span class="text-sm text-gray-700">CSV</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input v-model="customReport.format" type="radio" value="excel" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                  <span class="text-sm text-gray-700">Excel</span>
                </label>
              </div>
            </div>

            <button 
              @click="generateCustomReport"
              :disabled="!customReport.type"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-classroom transition-colors flex items-center justify-center space-x-2"
            >
              <span class="material-icons text-sm">analytics</span>
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        <!-- Generated Reports -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-green-600 text-sm">description</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Generated Reports</h2>
            </div>
            <button 
              v-if="generatedReports.length > 0"
              @click="clearAllReports"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
          </div>

          <div class="space-y-3">
            <div 
              v-for="report in generatedReports"
              :key="report.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center space-x-3 flex-1">
                <div class="w-10 h-10 bg-blue-100 rounded-classroom flex items-center justify-center flex-shrink-0">
                  <span class="material-icons text-blue-600">{{ getReportIcon(report.type) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 truncate">{{ report.name }}</h4>
                  <p class="text-xs text-gray-500">{{ formatDate(report.generatedAt) }} • {{ report.format.toUpperCase() }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2 flex-shrink-0">
                <button 
                  @click="viewReport(report)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-classroom transition-colors"
                  title="View Report"
                >
                  <span class="material-icons text-sm">visibility</span>
                </button>
                <button 
                  @click="downloadReport(report)"
                  class="p-2 text-green-600 hover:bg-green-50 rounded-classroom transition-colors"
                  title="Download Report"
                >
                  <span class="material-icons text-sm">download</span>
                </button>
                <button 
                  @click="deleteReport(report.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-classroom transition-colors"
                  title="Delete Report"
                >
                  <span class="material-icons text-sm">delete</span>
                </button>
              </div>
            </div>

            <div v-if="generatedReports.length === 0" class="text-center py-12 text-gray-500">
              <span class="material-icons text-6xl opacity-30 mb-4">description</span>
              <p class="text-lg font-medium">No reports generated yet</p>
              <p class="text-sm mt-2">Use Quick Reports or Custom Report Builder to generate reports</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Report Stats -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Report Statistics</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Reports</span>
              <span class="text-lg font-bold text-gray-900">{{ generatedReports.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">This Month</span>
              <span class="text-lg font-bold text-blue-600">{{ reportStats.thisMonth }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Last Generated</span>
              <span class="text-sm font-medium text-gray-900">
                {{ generatedReports.length > 0 ? formatDate(generatedReports[0].generatedAt) : 'Never' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Scheduled Reports -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Scheduled Reports</h3>
            <button 
              @click="showScheduleModal = true"
              class="text-blue-600 hover:text-blue-800"
            >
              <span class="material-icons text-sm">add</span>
            </button>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="schedule in scheduledReports"
              :key="schedule.id"
              class="p-3 bg-gray-50 rounded-classroom"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900">{{ schedule.name }}</span>
                <button 
                  @click="deleteSchedule(schedule.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  <span class="material-icons text-sm">close</span>
                </button>
              </div>
              <div class="text-xs text-gray-500">{{ schedule.frequency }} • Next: {{ schedule.nextRun }}</div>
            </div>

            <div v-if="scheduledReports.length === 0" class="text-center py-4 text-gray-500 text-sm">
              No scheduled reports
            </div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Bulk Export</h3>
          <button 
            @click="exportAllReports"
            :disabled="generatedReports.length === 0"
            class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
          >
            <span class="material-icons text-sm">download</span>
            <span>Export All Reports</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Schedule Modal -->
    <div v-if="showScheduleModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Schedule Report</h2>
          <button @click="showScheduleModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
            <input
              v-model="newSchedule.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Monthly enrollment report"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
            <select
              v-model="newSchedule.frequency"
              class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div class="flex space-x-3">
            <button 
              @click="showScheduleModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-classroom hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="addSchedule"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-classroom transition-colors"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { exportToCSV } from '@/utils/exportHelpers'
import { useAuditLogStore } from '@/stores/auditLog'

const auditStore = useAuditLogStore()

const quickReports = [
  { id: 1, name: 'User Summary', description: 'Overview of all users', icon: 'people', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', type: 'user-summary' },
  { id: 2, name: 'Class Report', description: 'All classes & enrollment', icon: 'school', bgColor: 'bg-green-100', iconColor: 'text-green-600', type: 'class-report' },
  { id: 3, name: 'Activity Log', description: 'Recent system activity', icon: 'history', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', type: 'activity-log' },
  { id: 4, name: 'Performance', description: 'System performance metrics', icon: 'speed', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', type: 'performance' }
]

const customReport = ref({
  type: '',
  startDate: '',
  endDate: '',
  format: 'pdf'
})

const generatedReports = ref(JSON.parse(localStorage.getItem('gco:reports') || '[]'))
const scheduledReports = ref([
  { id: 1, name: 'Weekly Enrollment Report', frequency: 'Weekly', nextRun: 'Monday' },
  { id: 2, name: 'Monthly Performance Summary', frequency: 'Monthly', nextRun: '1st of next month' }
])

const showScheduleModal = ref(false)
const newSchedule = ref({
  name: '',
  frequency: 'weekly'
})

const reportStats = computed(() => ({
  thisMonth: generatedReports.value.filter(r => {
    const reportDate = new Date(r.generatedAt)
    const now = new Date()
    return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
  }).length
}))

const generateQuickReport = (quickReport) => {
  const report = {
    id: Date.now(),
    name: quickReport.name,
    type: quickReport.type,
    format: 'pdf',
    generatedAt: new Date().toISOString(),
    data: generateMockData(quickReport.type)
  }
  
  generatedReports.value.unshift(report)
  saveReports()
  auditStore.logReportGenerated(report.name, report.type)
  showToast(`${quickReport.name} generated successfully!`)
}

const generateCustomReport = () => {
  if (!customReport.value.type) return
  
  const report = {
    id: Date.now(),
    name: getReportName(customReport.value.type),
    type: customReport.value.type,
    format: customReport.value.format,
    startDate: customReport.value.startDate,
    endDate: customReport.value.endDate,
    generatedAt: new Date().toISOString(),
    data: generateMockData(customReport.value.type)
  }
  
  generatedReports.value.unshift(report)
  saveReports()
  auditStore.logReportGenerated(report.name, report.type)
  showToast(`Custom report generated successfully!`)
  
  // Reset form
  customReport.value = { type: '', startDate: '', endDate: '', format: 'pdf' }
}

const generateMockData = (type) => {
  // Generate actual data based on report type
  const users = JSON.parse(localStorage.getItem('mock:users') || '[]')
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  
  const data = {
    'user-summary': {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      students: users.filter(u => u.role === 'student').length,
      teachers: users.filter(u => u.role === 'teacher').length,
      admins: users.filter(u => u.role === 'admin').length,
      usersBySchool: {}
    },
    'class-report': {
      totalClasses: classes.length,
      totalEnrollment: classes.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0),
      averageClassSize: classes.length > 0 ? Math.round(classes.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0) / classes.length) : 0,
      classesBySubject: {}
    },
    'activity-log': {
      totalActivities: 150,
      logins: 89,
      assignmentsCreated: 23,
      classesCreated: 12,
      recentActivity: 'Last 24 hours'
    },
    'performance': {
      averageLoadTime: '1.2s',
      activeConnections: 45,
      databaseQueries: 1234,
      errorRate: '0.1%',
      uptime: '99.9%'
    }
  }
  
  return data[type] || {
    totalUsers: users.length,
    totalClasses: classes.length,
    totalAssignments: assignments.length
  }
}

const getReportName = (type) => {
  const names = {
    'enrollment': 'Enrollment Report',
    'attendance': 'Attendance Report',
    'performance': 'Performance Report',
    'user-activity': 'User Activity Report',
    'assignment': 'Assignment Statistics',
    'class-performance': 'Class Performance Report'
  }
  return names[type] || 'Custom Report'
}

const getReportIcon = (type) => {
  const icons = {
    'user-summary': 'people',
    'class-report': 'school',
    'activity-log': 'history',
    'performance': 'speed',
    'enrollment': 'person_add',
    'attendance': 'event_available',
    'user-activity': 'timeline',
    'assignment': 'assignment',
    'class-performance': 'trending_up'
  }
  return icons[type] || 'description'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewReport = (report) => {
  showToast(`Viewing ${report.name}...`)
  // In real app, this would open a report viewer
}

const downloadReport = (report) => {
  try {
    if (report.format === 'csv' || report.format === 'excel') {
      // Create proper CSV data
      const rows = [
        { field: 'Report Name', value: report.name },
        { field: 'Generated At', value: formatDate(report.generatedAt) },
        { field: 'Report Type', value: report.type },
        { field: '', value: '' }
      ]
      
      // Add data rows
      Object.entries(report.data).forEach(([key, value]) => {
        rows.push({
          field: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          value: typeof value === 'object' ? JSON.stringify(value) : value
        })
      })
      
      exportToCSV(rows, `${report.name.replace(/\s+/g, '_')}.csv`)
      showToast(`Downloaded ${report.name} as CSV`)
    } else if (report.format === 'pdf') {
      // For PDF, create a formatted text report
      const reportText = `
${report.name}
${'='.repeat(report.name.length)}

Generated: ${formatDate(report.generatedAt)}
Type: ${report.type}

Report Data:
${Object.entries(report.data).map(([key, value]) => 
  `  ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`
).join('\n')}
      `.trim()
      
      // Create a blob and download
      const blob = new Blob([reportText], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${report.name.replace(/\s+/g, '_')}.txt`
      a.click()
      window.URL.revokeObjectURL(url)
      showToast(`Downloaded ${report.name} as text file (PDF feature coming soon)`)
    }
    
    auditStore.logReportDownloaded(report.name)
  } catch (err) {
    console.error('Download error:', err)
    showToast('Failed to download report. Please try again.')
  }
}

const deleteReport = (id) => {
  if (confirm('Are you sure you want to delete this report?')) {
    generatedReports.value = generatedReports.value.filter(r => r.id !== id)
    saveReports()
    showToast('Report deleted')
  }
}

const clearAllReports = () => {
  if (confirm('Are you sure you want to delete all reports?')) {
    generatedReports.value = []
    saveReports()
    showToast('All reports cleared')
  }
}

const exportAllReports = () => {
  const exportData = generatedReports.value.map(report => ({
    Name: report.name,
    Type: report.type,
    Format: report.format,
    'Generated At': formatDate(report.generatedAt)
  }))
  exportToCSV(exportData, 'all_reports.csv')
  showToast(`Exported ${generatedReports.value.length} reports`)
}

const addSchedule = () => {
  if (!newSchedule.value.name) return
  
  const schedule = {
    id: Date.now(),
    name: newSchedule.value.name,
    frequency: newSchedule.value.frequency.charAt(0).toUpperCase() + newSchedule.value.frequency.slice(1),
    nextRun: 'Soon'
  }
  
  scheduledReports.value.push(schedule)
  showScheduleModal.value = false
  newSchedule.value = { name: '', frequency: 'weekly' }
  showToast('Report scheduled successfully!')
}

const deleteSchedule = (id) => {
  scheduledReports.value = scheduledReports.value.filter(s => s.id !== id)
  showToast('Schedule deleted')
}

const saveReports = () => {
  localStorage.setItem('gco:reports', JSON.stringify(generatedReports.value))
}

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  } else {
    alert(message)
  }
}

onMounted(() => {
  // Load reports from localStorage
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
