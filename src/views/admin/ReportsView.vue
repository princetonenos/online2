<template>
  <div class="p-6 max-w-7xl mx-auto" data-testid="page-reports">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-medium text-classroom-gray-900">Reports & Analytics</h1>
        <p class="text-classroom-gray-600">System-wide analytics and performance reports</p>
      </div>
      <button class="btn-primary flex items-center space-x-2">
        <span class="material-icons text-lg">download</span>
        <span>Export Report</span>
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Total Users</p>
            <p class="text-2xl font-medium text-classroom-gray-900">1,248</p>
          </div>
          <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">people</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Active Classes</p>
            <p class="text-2xl font-medium text-classroom-gray-900">156</p>
          </div>
          <div class="w-12 h-12 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-secondary">school</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Assignments</p>
            <p class="text-2xl font-medium text-classroom-gray-900">892</p>
          </div>
          <div class="w-12 h-12 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">assignment</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Avg. Completion</p>
            <p class="text-2xl font-medium text-classroom-gray-900">78%</p>
          </div>
          <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">trending_up</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- User growth chart -->
      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <h3 class="text-lg font-medium text-classroom-gray-900 mb-4">User Growth</h3>
        <div class="h-64 bg-classroom-gray-50 rounded-classroom flex items-center justify-center">
          <div class="text-center text-classroom-gray-500">
            <span class="material-icons text-4xl mb-2 opacity-50">bar_chart</span>
            <p>User growth chart would appear here</p>
          </div>
        </div>
      </div>

      <!-- Class activity chart -->
      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <h3 class="text-lg font-medium text-classroom-gray-900 mb-4">Class Activity</h3>
        <div class="h-64 bg-classroom-gray-50 rounded-classroom flex items-center justify-center">
          <div class="text-center text-classroom-gray-500">
            <span class="material-icons text-4xl mb-2 opacity-50">show_chart</span>
            <p>Class activity chart would appear here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed reports -->
    <div class="bg-white rounded-classroom classroom-shadow overflow-hidden">
      <div class="p-4 border-b border-classroom-gray-100">
        <h3 class="font-medium text-classroom-gray-900">Recent Reports</h3>
      </div>
      <div class="divide-y divide-classroom-gray-100">
        <div 
          v-for="report in reports"
          :key="report.id"
          class="p-4 hover:bg-classroom-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-classroom-primary text-lg">description</span>
              </div>
              <div>
                <h4 class="font-medium text-classroom-gray-900">{{ report.title }}</h4>
                <p class="text-sm text-classroom-gray-500">{{ report.description }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-classroom-gray-500">{{ report.date }}</span>
              <button class="btn-outline text-xs px-2 py-1">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock data for reports
const reports = ref([
  {
    id: 1,
    title: 'Monthly User Activity Report',
    description: 'Detailed analysis of user engagement and activity patterns',
    date: 'Oct 2024'
  },
  {
    id: 2,
    title: 'Class Performance Overview',
    description: 'Performance metrics across all active classes',
    date: 'Oct 2024'
  },
  {
    id: 3,
    title: 'Assignment Completion Rates',
    description: 'Analysis of assignment submission and completion rates',
    date: 'Sep 2024'
  },
  {
    id: 4,
    title: 'System Usage Statistics',
    description: 'Platform usage patterns and feature adoption',
    date: 'Sep 2024'
  }
])
</script>
