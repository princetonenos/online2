<template>
  <main data-testid="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <p>Manage schools, users, and system-wide reports from this centralized dashboard.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <!-- Summary Cards -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-2">Schools</h2>
        <p class="text-3xl font-bold text-blue-600">12</p>
        <p class="text-sm text-gray-600 mt-2">Active schools in the system</p>
        <button 
          @click="$router.push({ name: 'AdminSchools' })"
          class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Manage Schools
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-2">Users</h2>
        <p class="text-3xl font-bold text-green-600">1,247</p>
        <p class="text-sm text-gray-600 mt-2">Total users registered</p>
        <button 
          @click="$router.push({ name: 'AdminUsers' })"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Manage Users
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-2">Reports</h2>
        <p class="text-3xl font-bold text-purple-600">24</p>
        <p class="text-sm text-gray-600 mt-2">Reports generated this month</p>
        <button 
          @click="$router.push({ name: 'AdminReports' })"
          class="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          View Reports
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button class="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <h3 class="font-semibold">Add New School</h3>
          <p class="text-sm text-gray-600 mt-1">Register a new educational institution</p>
        </button>
        <button class="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <h3 class="font-semibold">Bulk Import Users</h3>
          <p class="text-sm text-gray-600 mt-1">Upload CSV file for multiple users</p>
        </button>
        <button class="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <h3 class="font-semibold">System Settings</h3>
          <p class="text-sm text-gray-600 mt-1">Configure platform-wide settings</p>
        </button>
        <button class="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <h3 class="font-semibold">Generate Report</h3>
          <p class="text-sm text-gray-600 mt-1">Create custom analytics report</p>
        </button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      // Mock data for dashboard
      stats: {
        schools: 12,
        users: 1247,
        reports: 24
      }
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
