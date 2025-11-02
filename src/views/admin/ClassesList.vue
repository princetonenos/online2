<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Classes</h1>
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
              placeholder="Search classes..."
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
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Class</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Teacher</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Students</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">School</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="classItem in filteredClasses"
              :key="classItem.id"
              class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-classroom-primary">class</span>
                  </div>
                  <div>
                    <p class="font-medium text-classroom-gray-900">{{ classItem.name }}</p>
                    <p class="text-sm text-classroom-gray-500">{{ classItem.code }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <img :src="classItem.teacherAvatar" :alt="classItem.teacherName" class="w-6 h-6 rounded-full">
                  <span class="text-classroom-gray-900">{{ classItem.teacherName }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-classroom-gray-900">{{ classItem.studentCount }}</td>
              <td class="px-4 py-3 text-classroom-gray-900">{{ classItem.school }}</td>
              <td class="px-4 py-3">
                <span class="chip" :class="classItem.status === 'active' ? 'chip-success' : 'chip-warning'">
                  {{ classItem.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <router-link 
                    :to="`/admin/classes/${classItem.id}`"
                    class="btn-outline text-xs px-2 py-1"
                  >
                    View
                  </router-link>
                  <button 
                    @click="toggleClassStatus(classItem)"
                    class="btn-outline text-xs px-2 py-1"
                    :class="classItem.status === 'active' ? 'text-red-600' : 'text-green-600'"
                  >
                    {{ classItem.status === 'active' ? 'Archive' : 'Activate' }}
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
const classes = ref([])

const filteredClasses = computed(() => {
  if (!searchQuery.value) return classes.value
  
  const query = searchQuery.value.toLowerCase()
  return classes.value.filter(classItem => 
    classItem.name.toLowerCase().includes(query) ||
    classItem.code.toLowerCase().includes(query) ||
    classItem.teacherName.toLowerCase().includes(query)
  )
})

const toggleClassStatus = (classItem) => {
  classItem.status = classItem.status === 'active' ? 'archived' : 'active'
  showToast(`Class ${classItem.status === 'active' ? 'activated' : 'archived'}`)
}

onMounted(() => {
  setTimeout(() => {
    classes.value = [
      {
        id: 1,
        name: 'Advanced Mathematics',
        code: 'MATH101',
        teacherName: 'Sarah Johnson',
        teacherAvatar: '/avatars/teacher1.jpg',
        studentCount: 32,
        school: 'Main Campus',
        status: 'active'
      },
      {
        id: 2,
        name: 'Physics Fundamentals',
        code: 'PHYS101',
        teacherName: 'Michael Brown',
        teacherAvatar: '/avatars/teacher2.jpg',
        studentCount: 28,
        school: 'Main Campus',
        status: 'active'
      },
      {
        id: 3,
        name: 'Chemistry Basics',
        code: 'CHEM101',
        teacherName: 'Emily Davis',
        teacherAvatar: '/avatars/teacher3.jpg',
        studentCount: 25,
        school: 'North Campus',
        status: 'archived'
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
