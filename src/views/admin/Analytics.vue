<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            System Analytics
          </h1>
          <p class="text-gray-600 mt-2">Comprehensive usage statistics and performance metrics</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select class="bg-white border border-gray-300 rounded-classroom pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <span class="material-icons text-gray-400 text-sm">arrow_drop_down</span>
            </div>
          </div>
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

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Active Users</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.activeUsers }}</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">trending_up</span>
              +12% this week
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-xl">people</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">System Uptime</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.uptime }}%</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">check_circle</span>
              No issues
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-xl">cloud_done</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Avg. Response Time</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.avgResponseTime }}ms</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">speed</span>
              -5ms improvement
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-purple-600 text-xl">timer</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Storage Used</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.storageUsed }}GB</p>
            <p class="text-orange-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">storage</span>
              65% of capacity
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-xl">database</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Analytics Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
      <!-- Usage Trends -->
      <div class="xl:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Platform Usage Trends</h2>
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
              <h3 class="text-lg font-medium text-gray-900 mb-2">Usage Analytics</h3>
              <p class="text-gray-500 mb-4">Chart.js or Recharts integration ready</p>
              <div class="flex justify-center space-x-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Teachers</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Students</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>Admins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Distribution -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">User Distribution</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-sm">school</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Teachers</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ userDistribution.teachers }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-blue-500 h-2 rounded-full" :style="{ width: userDistribution.teachers + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-green-600 text-sm">person</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Students</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ userDistribution.students }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-green-500 h-2 rounded-full" :style="{ width: userDistribution.students + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-purple-600 text-sm">admin_panel_settings</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Admins</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ userDistribution.admins }}%</div>
                <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-purple-500 h-2 rounded-full" :style="{ width: userDistribution.admins + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Performance -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">System Performance</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">CPU Usage</span>
              <span class="text-sm font-semibold text-gray-900">{{ systemPerformance.cpu }}%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Memory Usage</span>
              <span class="text-sm font-semibold text-gray-900">{{ systemPerformance.memory }}%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Disk I/O</span>
              <span class="text-sm font-semibold text-gray-900">{{ systemPerformance.diskIO }}MB/s</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Network</span>
              <span class="text-sm font-semibold text-gray-900">{{ systemPerformance.network }}Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Analytics Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Feature Usage -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Feature Usage</h2>
        <div class="space-y-4">
          <div 
            v-for="feature in featureUsage"
            :key="feature.name"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom flex items-center justify-center text-white font-semibold text-sm">
                {{ feature.icon }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ feature.name }}</div>
                <div class="text-xs text-gray-500">{{ feature.description }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-900">{{ feature.usage }}%</div>
              <div class="text-xs text-gray-500">Active usage</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Logs -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Recent Errors</h2>
        <div class="space-y-4">
          <div 
            v-for="error in recentErrors"
            :key="error.id"
            class="flex items-start justify-between p-4 bg-gray-50 rounded-classroom hover:bg-red-50 transition-colors"
          >
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-red-100 rounded-classroom flex items-center justify-center flex-shrink-0 mt-1">
                <span class="material-icons text-red-600 text-sm">error</span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ error.message }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ error.location }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ error.time }}</div>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-xs font-medium" :class="error.severityClass">{{ error.severity }}</div>
              <button class="text-xs text-blue-600 hover:text-blue-800 mt-1">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Platform Activity -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Platform Activity Timeline</h2>
      <div class="space-y-4">
        <div 
          v-for="activity in platformActivity"
          :key="activity.id"
          class="flex items-start space-x-4 p-4 bg-gray-50 rounded-classroom hover:bg-green-50 transition-colors"
        >
          <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center flex-shrink-0 mt-1">
            <span class="material-icons text-green-600 text-sm">{{ activity.icon }}</span>
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

// Mock data for analytics
const stats = ref({
  activeUsers: 1247,
  uptime: 99.8,
  avgResponseTime: 145,
  storageUsed: 245
})

const userDistribution = ref({
  teachers: 15,
  students: 80,
  admins: 5
})

const systemPerformance = ref({
  cpu: 45,
  memory: 62,
  diskIO: 120,
  network: 85
})

const featureUsage = ref([
  {
    name: 'Class Management',
    description: 'Create and manage classes',
    usage: 92,
    icon: '🏫'
  },
  {
    name: 'Assignments',
    description: 'Create and grade assignments',
    usage: 87,
    icon: '📝'
  },
  {
    name: 'Live Classes',
    description: 'Virtual classroom sessions',
    usage: 78,
    icon: '🎥'
  },
  {
    name: 'Analytics',
    description: 'View performance metrics',
    usage: 65,
    icon: '📊'
  },
  {
    name: 'Grading',
    description: 'Student assessment tools',
    usage: 81,
    icon: '📋'
  }
])

const recentErrors = ref([
  {
    id: 1,
    message: 'Database connection timeout',
    location: 'User authentication service',
    time: '2 hours ago',
    severity: 'High',
    severityClass: 'text-red-600'
  },
  {
    id: 2,
    message: 'File upload size limit exceeded',
    location: 'Assignment submission',
    time: '5 hours ago',
    severity: 'Medium',
    severityClass: 'text-orange-600'
  },
  {
    id: 3,
    message: 'Email service unavailable',
    location: 'Notification system',
    time: '1 day ago',
    severity: 'Low',
    severityClass: 'text-yellow-600'
  }
])

const platformActivity = ref([
  {
    id: 1,
    icon: 'person_add',
    title: 'New User Registration',
    description: '25 new students and 3 teachers joined the platform',
    time: '2 hours ago',
    status: 'Completed',
    statusClass: 'text-green-600'
  },
  {
    id: 2,
    icon: 'school',
    title: 'Class Creation Spike',
    description: '15 new classes created in the last 4 hours',
    time: '4 hours ago',
    status: 'Active',
    statusClass: 'text-blue-600'
  },
  {
    id: 3,
    icon: 'assignment',
    title: 'Assignment Submission Peak',
    description: 'Over 200 assignments submitted in the last hour',
    time: '6 hours ago',
    status: 'Completed',
    statusClass: 'text-green-600'
  },
  {
    id: 4,
    icon: 'backup',
    title: 'System Backup',
    description: 'Nightly backup completed successfully',
    time: '12 hours ago',
    status: 'Completed',
    statusClass: 'text-green-600'
  }
])

// Computed properties for enhanced analytics
const activeClasses = computed(() => {
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  return classes.filter(c => c.status === 'active').length
})

const totalAssignments = computed(() => {
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  return assignments.length
})

const averageEngagement = computed(() => {
  // Mock calculation - in real app, this would come from analytics
  return 72
})

onMounted(() => {
  // Initialize analytics data
  loadAnalyticsData()
})

const loadAnalyticsData = () => {
  // In a real application, this would fetch data from an analytics API
  // For now, we'll use the mock data above
  console.log('Loading analytics data...')
}

// Export functionality
const exportAnalyticsData = () => {
  showToast('Exporting analytics data...')
  // This would generate and download a CSV/PDF report
}

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
