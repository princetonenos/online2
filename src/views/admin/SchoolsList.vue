<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Schools</h1>
      <router-link 
        to="/admin/dashboard"
        class="btn-outline flex items-center space-x-2"
      >
        <span class="material-icons">arrow_back</span>
        <span>Back to Dashboard</span>
      </router-link>
    </div>

    <div class="bg-white rounded-classroom classroom-shadow">
      <div class="p-4 border-b border-classroom-gray-100">
        <div class="flex items-center space-x-4">
          <div class="relative flex-1 max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search schools..."
              class="w-full pl-10 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
            >
            <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-classroom-gray-400">
              search
            </span>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-classroom-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">School</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Location</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Students</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Teachers</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="school in filteredSchools"
              :key="school.id"
              class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-classroom-primary">school</span>
                  </div>
                  <div>
                    <p class="font-medium text-classroom-gray-900">{{ school.name }}</p>
                    <p class="text-sm text-classroom-gray-500">{{ school.code }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-classroom-gray-900">{{ school.location }}</td>
              <td class="px-4 py-3 text-classroom-gray-900">{{ school.studentCount }}</td>
              <td class="px-4 py-3 text-classroom-gray-900">{{ school.teacherCount }}</td>
              <td class="px-4 py-3">
                <span class="chip" :class="school.status === 'active' ? 'chip-success' : 'chip-warning'">
                  {{ school.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <button class="btn-outline text-xs px-2 py-1">
                    Edit
                  </button>
                  <button 
                    @click="toggleSchoolStatus(school)"
                    class="btn-outline text-xs px-2 py-1"
                    :class="school.status === 'active' ? 'text-red-600' : 'text-green-600'"
                  >
                    {{ school.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const schools = ref([])

const filteredSchools = computed(() => {
  if (!searchQuery.value) return schools.value
  
  const query = searchQuery.value.toLowerCase()
  return schools.value.filter(school => 
    school.name.toLowerCase().includes(query) ||
    school.code.toLowerCase().includes(query) ||
    school.location.toLowerCase().includes(query)
  )
})

const toggleSchoolStatus = (school) => {
  school.status = school.status === 'active' ? 'inactive' : 'active'
  showToast(`School ${school.status === 'active' ? 'activated' : 'deactivated'}`)
}

onMounted(() => {
  setTimeout(() => {
    schools.value = [
      {
        id: 1,
        name: 'Main Campus',
        code: 'MC001',
        location: 'Downtown',
        studentCount: 850,
        teacherCount: 45,
        status: 'active'
      },
      {
        id: 2,
        name: 'North Campus',
        code: 'NC002',
        location: 'North District',
        studentCount: 420,
        teacherCount: 22,
        status: 'active'
      },
      {
        id: 3,
        name: 'South Campus',
        code: 'SC003',
        location: 'South District',
        studentCount: 380,
        teacherCount: 18,
        status: 'inactive'
      }
    ]
  }, 300)
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
