<template>
  <main data-testid="teacher-reports">
    <h1>Teacher Reports</h1>
    <p>View and analyze class performance, assignment completion, and student progress.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <!-- Summary Cards -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-2">Class Average</h2>
        <p class="text-3xl font-bold text-blue-600">87%</p>
        <p class="text-sm text-gray-600 mt-2">Overall class performance</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-2">Assignments</h2>
        <p class="text-3xl font-bold text-green-600">24</p>
        <p class="text-sm text-gray-600 mt-2">Total assignments created</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-2">Submissions</h2>
        <p class="text-3xl font-bold text-purple-600">89%</p>
        <p class="text-sm text-gray-600 mt-2">Assignment completion rate</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-2">Students</h2>
        <p class="text-3xl font-bold text-orange-600">32</p>
        <p class="text-sm text-gray-600 mt-2">Active students</p>
      </div>
    </div>

    <!-- Class Performance -->
    <div class="mt-8 bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold">Class Performance Overview</h2>
        <p class="text-gray-600 mt-1">Track student progress and assignment completion</p>
      </div>
      
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">Assignment Completion</h3>
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
        
        <!-- Mock data table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="assignment in assignments" :key="assignment.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ assignment.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ assignment.dueDate }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ assignment.submitted }}/{{ assignment.totalStudents }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ assignment.averageScore }}%</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="assignment.statusClass" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ assignment.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Report Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button class="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <h3 class="font-semibold">Generate Progress Report</h3>
          <p class="text-sm text-gray-600 mt-1">Create detailed student progress reports</p>
        </button>
        <button class="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <h3 class="font-semibold">Export Gradebook</h3>
          <p class="text-sm text-gray-600 mt-1">Download grades in CSV format</p>
        </button>
        <button class="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <h3 class="font-semibold">Attendance Summary</h3>
          <p class="text-sm text-gray-600 mt-1">View class attendance statistics</p>
        </button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'TeacherReports',
  data() {
    return {
      assignments: [
        {
          id: 1,
          title: 'Introduction to Algebra',
          dueDate: '2025-11-15',
          submitted: 28,
          totalStudents: 32,
          averageScore: 85,
          status: 'Completed',
          statusClass: 'bg-green-100 text-green-800'
        },
        {
          id: 2,
          title: 'History Research Paper',
          dueDate: '2025-11-20',
          submitted: 25,
          totalStudents: 32,
          averageScore: 78,
          status: 'In Progress',
          statusClass: 'bg-yellow-100 text-yellow-800'
        },
        {
          id: 3,
          title: 'Science Lab Report',
          dueDate: '2025-11-25',
          submitted: 18,
          totalStudents: 32,
          averageScore: 92,
          status: 'Grading',
          statusClass: 'bg-blue-100 text-blue-800'
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
