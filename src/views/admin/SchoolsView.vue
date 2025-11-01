<template>
  <div class="p-6 max-w-7xl mx-auto" data-testid="page-schools">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-medium text-classroom-gray-900">Schools</h1>
        <p class="text-classroom-gray-600">Manage schools and their settings</p>
      </div>
      <button class="btn-primary flex items-center space-x-2">
        <span class="material-icons text-lg">add</span>
        <span>Add School</span>
      </button>
    </div>

    <div class="bg-white rounded-classroom classroom-shadow overflow-hidden">
      <!-- Search and filters -->
      <div class="p-4 border-b border-classroom-gray-100">
        <div class="flex items-center space-x-4">
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input
                type="text"
                placeholder="Search schools..."
                class="w-full pl-10 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
              >
              <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-classroom-gray-400 text-lg">
                search
              </span>
            </div>
          </div>
          <select class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors">
            <option>All Regions</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia</option>
          </select>
        </div>
      </div>

      <!-- Schools table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-classroom-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">School Name</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Region</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Active Classes</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="school in schools"
              :key="school.id"
              class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-classroom-primary text-lg">school</span>
                  </div>
                  <div>
                    <p class="font-medium text-classroom-gray-900">{{ school.name }}</p>
                    <p class="text-sm text-classroom-gray-500">{{ school.code }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-classroom-gray-900">{{ school.region }}</td>
              <td class="px-4 py-3 text-sm text-classroom-gray-900">{{ school.activeClasses }}</td>
              <td class="px-4 py-3">
                <span class="chip text-xs" :class="school.status === 'active' ? 'chip-primary' : 'chip-gray'">
                  {{ school.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <button class="btn-outline text-xs px-2 py-1">View</button>
                  <button class="btn-outline text-xs px-2 py-1">Edit</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-classroom-gray-100 flex items-center justify-between">
        <p class="text-sm text-classroom-gray-500">Showing 1-5 of 12 schools</p>
        <div class="flex items-center space-x-2">
          <button class="btn-outline text-sm px-3 py-1">Previous</button>
          <button class="btn-outline text-sm px-3 py-1 bg-classroom-primary text-white">1</button>
          <button class="btn-outline text-sm px-3 py-1">2</button>
          <button class="btn-outline text-sm px-3 py-1">3</button>
          <button class="btn-outline text-sm px-3 py-1">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock data for schools
const schools = ref([
  {
    id: 1,
    name: 'Central High School',
    code: 'CHS001',
    region: 'North America',
    activeClasses: 24,
    status: 'active'
  },
  {
    id: 2,
    name: 'Westside Academy',
    code: 'WA002',
    region: 'North America',
    activeClasses: 18,
    status: 'active'
  },
  {
    id: 3,
    name: 'Eastwood College',
    code: 'EC003',
    region: 'Europe',
    activeClasses: 32,
    status: 'active'
  },
  {
    id: 4,
    name: 'Northridge Institute',
    code: 'NI004',
    region: 'Asia',
    activeClasses: 15,
    status: 'inactive'
  },
  {
    id: 5,
    name: 'Southgate University',
    code: 'SU005',
    region: 'Europe',
    activeClasses: 28,
    status: 'active'
  }
])
</script>
