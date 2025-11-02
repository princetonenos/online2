<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-medium text-classroom-gray-900">{{ classData.name }}</h1>
        <p class="text-classroom-gray-600">{{ classData.code }} • {{ classData.school }}</p>
      </div>
      <router-link 
        to="/admin/classes"
        class="btn-outline flex items-center space-x-2"
      >
        <span class="material-icons">arrow_back</span>
        <span>Back to Classes</span>
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left column - Class info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Class information -->
        <div class="bg-white rounded-classroom classroom-shadow p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Class Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-classroom-gray-500">Teacher</label>
              <p class="text-classroom-gray-900">{{ classData.teacherName }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-classroom-gray-500">Student Count</label>
              <p class="text-classroom-gray-900">{{ classData.studentCount }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-classroom-gray-500">Status</label>
              <span class="chip" :class="classData.status === 'active' ? 'chip-success' : 'chip-warning'">
                {{ classData.status }}
              </span>
            </div>
            <div>
              <label class="text-sm font-medium text-classroom-gray-500">Created</label>
              <p class="text-classroom-gray-900">{{ classData.createdAt }}</p>
            </div>
          </div>
        </div>

        <!-- Students list -->
        <div class="bg-white rounded-classroom classroom-shadow p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Students ({{ students.length }})</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-classroom-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Student</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Email</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="student in students"
                  :key="student.id"
                  class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
                >
                  <td class="px-4 py-3">
                    <div class="flex items-center space-x-3">
                      <img :src="student.avatar" :alt="student.name" class="w-8 h-8 rounded-full">
                      <span class="text-classroom-gray-900">{{ student.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-classroom-gray-900">{{ student.email }}</td>
                  <td class="px-4 py-3">
                    <span class="chip" :class="student.status === 'active' ? 'chip-success' : 'chip-warning'">
                      {{ student.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right column - Actions and stats -->
      <div class="space-y-6">
        <!-- Quick actions -->
        <div class="bg-white rounded-classroom classroom-shadow p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Quick Actions</h2>
          <div class="space-y-2">
            <button class="w-full btn-outline text-left flex items-center space-x-2">
              <span class="material-icons">edit</span>
              <span>Edit Class</span>
            </button>
            <button class="w-full btn-outline text-left flex items-center space-x-2">
              <span class="material-icons">group_add</span>
              <span>Add Students</span>
            </button>
            <button 
              @click="toggleClassStatus"
              class="w-full btn-outline text-left flex items-center space-x-2"
              :class="classData.status === 'active' ? 'text-red-600' : 'text-green-600'"
            >
              <span class="material-icons">{{ classData.status === 'active' ? 'archive' : 'unarchive' }}</span>
              <span>{{ classData.status === 'active' ? 'Archive Class' : 'Activate Class' }}</span>
            </button>
          </div>
        </div>

        <!-- Class statistics -->
        <div class="bg-white rounded-classroom classroom-shadow p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Statistics</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-classroom-gray-600">Assignments</span>
              <span class="font-medium">{{ classData.assignmentCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-classroom-gray-600">Average Grade</span>
              <span class="font-medium">{{ classData.averageGrade }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-classroom-gray-600">Completion Rate</span>
              <span class="font-medium">{{ classData.completionRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const classData = ref({})
const students = ref([])

const toggleClassStatus = () => {
  classData.value.status = classData.value.status === 'active' ? 'archived' : 'active'
  showToast(`Class ${classData.value.status === 'active' ? 'activated' : 'archived'}`)
}

onMounted(() => {
  const classId = route.params.id
  // Load class data based on ID
  setTimeout(() => {
    classData.value = {
      id: classId,
      name: 'Advanced Mathematics',
      code: 'MATH101',
      teacherName: 'Sarah Johnson',
      studentCount: 32,
      school: 'Main Campus',
      status: 'active',
      createdAt: '2024-01-15',
      assignmentCount: 12,
      averageGrade: 85,
      completionRate: 92
    }

    students.value = [
      {
        id: 1,
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@student.edu',
        avatar: '/avatars/student1.jpg',
        status: 'active'
      },
      {
        id: 2,
        name: 'Maria Garcia',
        email: 'maria.garcia@student.edu',
        avatar: '/avatars/student2.jpg',
        status: 'active'
      },
      {
        id: 3,
        name: 'James Wilson',
        email: 'james.wilson@student.edu',
        avatar: '/avatars/student3.jpg',
        status: 'active'
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
