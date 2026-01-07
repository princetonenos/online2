<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics & Reports
          </h1>
          <p class="text-gray-600 mt-2">Comprehensive insights into class performance and student progress</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select class="bg-white border border-gray-300 rounded-classroom px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Semester</option>
              <option>Custom Range</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <span class="material-icons text-sm">expand_more</span>
            </div>
          </div>
          <button class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2">
            <span class="material-icons text-sm">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Class Average</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">87%</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">trending_up</span>
              +2.5% from last week
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-xl">school</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Assignments</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">24</p>
            <p class="text-blue-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">assignment</span>
              3 new this week
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-xl">assignment</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Submissions</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">89%</p>
            <p class="text-orange-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">schedule</span>
              5 pending review
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-purple-600 text-xl">task_alt</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Active Students</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">32</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">group</span>
              94% attendance rate
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-xl">people</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Analytics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Performance Chart -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Performance Trends</h2>
          <button class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
            <span>View Details</span>
            <span class="material-icons text-sm">chevron_right</span>
          </button>
        </div>
        <div class="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-classroom flex items-center justify-center">
          <div class="text-center text-gray-500">
            <span class="material-icons text-4xl mb-2">bar_chart</span>
            <p>Performance chart visualization</p>
            <p class="text-sm">(Interactive chart would appear here)</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">92%</p>
            <p class="text-sm text-gray-600">Math</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-600">85%</p>
            <p class="text-sm text-gray-600">Science</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-purple-600">78%</p>
            <p class="text-sm text-gray-600">History</p>
          </div>
        </div>
      </div>

      <!-- Assignment Completion -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Assignment Completion</h2>
          <button class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
            <span>View All</span>
            <span class="material-icons text-sm">chevron_right</span>
          </button>
        </div>
        <div class="space-y-4">
          <div v-for="assignment in assignments" :key="assignment.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ assignment.title }}</h3>
              <p class="text-sm text-gray-600">{{ assignment.dueDate }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">{{ assignment.submitted }}/{{ assignment.totalStudents }}</p>
              <div class="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div class="bg-green-500 h-2 rounded-full" :style="{ width: (assignment.submitted / assignment.totalStudents) * 100 + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Performance Table -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Class Performance Overview</h2>
            <p class="text-gray-600 mt-1">Track student progress and assignment completion</p>
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
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Score</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="assignment in assignments" :key="assignment.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center mr-3">
                    <span class="material-icons text-blue-600 text-sm">assignment</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ assignment.title }}</div>
                    <div class="text-xs text-gray-500">{{ assignment.subject }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ assignment.dueDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ assignment.submitted }}/{{ assignment.totalStudents }}</div>
                <div class="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div class="bg-green-500 h-1.5 rounded-full" :style="{ width: (assignment.submitted / assignment.totalStudents) * 100 + '%' }"></div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">{{ assignment.averageScore }}%</div>
                <div class="text-xs text-gray-500">{{ assignment.gradeTrend }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="assignment.statusClass" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ assignment.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                <button class="text-gray-600 hover:text-gray-900">Export</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quick Actions & Reports -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div class="flex items-center justify-between mb-4">
          <span class="material-icons text-2xl">assessment</span>
          <span class="material-icons text-xl">arrow_forward</span>
        </div>
        <h3 class="font-bold text-lg mb-2">Progress Reports</h3>
        <p class="text-blue-100 text-sm">Generate detailed student progress reports with analytics</p>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div class="flex items-center justify-between mb-4">
          <span class="material-icons text-2xl">download</span>
          <span class="material-icons text-xl">arrow_forward</span>
        </div>
        <h3 class="font-bold text-lg mb-2">Export Gradebook</h3>
        <p class="text-green-100 text-sm">Download complete grades in multiple formats</p>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div class="flex items-center justify-between mb-4">
          <span class="material-icons text-2xl">groups</span>
          <span class="material-icons text-xl">arrow_forward</span>
        </div>
        <h3 class="font-bold text-lg mb-2">Attendance Summary</h3>
        <p class="text-orange-100 text-sm">View comprehensive attendance statistics</p>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div class="flex items-center justify-between mb-4">
          <span class="material-icons text-2xl">analytics</span>
          <span class="material-icons text-xl">arrow_forward</span>
        </div>
        <h3 class="font-bold text-lg mb-2">Custom Analytics</h3>
        <p class="text-purple-100 text-sm">Create custom reports and data visualizations</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const assignments = ref([
  {
    id: 1,
    title: 'Introduction to Algebra',
    subject: 'Mathematics',
    dueDate: '2025-11-15',
    submitted: 28,
    totalStudents: 32,
    averageScore: 85,
    gradeTrend: '+3% from average',
    status: 'Completed',
    statusClass: 'bg-green-100 text-green-800'
  },
  {
    id: 2,
    title: 'History Research Paper',
    subject: 'Social Studies',
    dueDate: '2025-11-20',
    submitted: 25,
    totalStudents: 32,
    averageScore: 78,
    gradeTrend: '-2% from average',
    status: 'In Progress',
    statusClass: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 3,
    title: 'Science Lab Report',
    subject: 'Physics',
    dueDate: '2025-11-25',
    submitted: 18,
    totalStudents: 32,
    averageScore: 92,
    gradeTrend: '+7% from average',
    status: 'Grading',
    statusClass: 'bg-blue-100 text-blue-800'
  },
  {
    id: 4,
    title: 'Literature Analysis',
    subject: 'English',
    dueDate: '2025-11-18',
    submitted: 30,
    totalStudents: 32,
    averageScore: 88,
    gradeTrend: '+4% from average',
    status: 'Completed',
    statusClass: 'bg-green-100 text-green-800'
  },
  {
    id: 5,
    title: 'Chemistry Experiment',
    subject: 'Science',
    dueDate: '2025-11-22',
    submitted: 22,
    totalStudents: 32,
    averageScore: 81,
    gradeTrend: '+1% from average',
    status: 'Reviewing',
    statusClass: 'bg-orange-100 text-orange-800'
  }
])
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
