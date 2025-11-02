<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900">Assignments Moderation</h1>
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
              placeholder="Search assignments..."
              class="w-full pl-10 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
            >
            <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-classroom-gray-400">
              search
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <select 
              v-model="filterStatus"
              class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
            >
              <option value="">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-classroom-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Assignment</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Teacher</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Class</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Due Date</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="assignment in filteredAssignments"
              :key="assignment.id"
              class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-classroom-primary">assignment</span>
                  </div>
                  <div>
                    <p class="font-medium text-classroom-gray-900">{{ assignment.title }}</p>
                    <p class="text-sm text-classroom-gray-500">{{ assignment.type }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-classroom-gray-900">{{ assignment.teacherName }}</td>
              <td class="px-4 py-3 text-classroom-gray-900">{{ assignment.className }}</td>
              <td class="px-4 py-3 text-classroom-gray-900">{{ assignment.dueDate }}</td>
              <td class="px-4 py-3">
                <span class="chip" :class="getStatusClass(assignment.status)">
                  {{ assignment.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="reviewAssignment(assignment)"
                    class="btn-outline text-xs px-2 py-1"
                  >
                    Review
                  </button>
                  <button 
                    v-if="assignment.status === 'pending'"
                    @click="approveAssignment(assignment)"
                    class="btn-outline text-xs px-2 py-1 text-green-600"
                  >
                    Approve
                  </button>
                  <button 
                    v-if="assignment.status === 'pending'"
                    @click="rejectAssignment(assignment)"
                    class="btn-outline text-xs px-2 py-1 text-red-600"
                  >
                    Reject
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
const filterStatus = ref('')
const assignments = ref([])

const filteredAssignments = computed(() => {
  let filtered = assignments.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(assignment => 
      assignment.title.toLowerCase().includes(query) ||
      assignment.teacherName.toLowerCase().includes(query) ||
      assignment.className.toLowerCase().includes(query)
    )
  }
  
  if (filterStatus.value) {
    filtered = filtered.filter(assignment => assignment.status === filterStatus.value)
  }
  
  return filtered
})

const getStatusClass = (status) => {
  switch (status) {
    case 'approved': return 'chip-success'
    case 'rejected': return 'chip-warning'
    case 'pending': return 'chip-secondary'
    default: return 'chip-gray'
  }
}

const reviewAssignment = (assignment) => {
  showToast(`Reviewing assignment: ${assignment.title}`)
}

const approveAssignment = (assignment) => {
  assignment.status = 'approved'
  showToast(`Assignment "${assignment.title}" approved`)
}

const rejectAssignment = (assignment) => {
  assignment.status = 'rejected'
  showToast(`Assignment "${assignment.title}" rejected`)
}

onMounted(() => {
  setTimeout(() => {
    assignments.value = [
      {
        id: 1,
        title: 'Advanced Calculus Problems',
        type: 'Assignment',
        teacherName: 'Sarah Johnson',
        className: 'Advanced Mathematics',
        dueDate: '2024-12-15',
        status: 'pending'
      },
      {
        id: 2,
        title: 'Physics Lab Report',
        type: 'Lab Report',
        teacherName: 'Michael Brown',
        className: 'Physics Fundamentals',
        dueDate: '2024-12-10',
        status: 'approved'
      },
      {
        id: 3,
        title: 'Chemistry Quiz',
        type: 'Quiz',
        teacherName: 'Emily Davis',
        className: 'Chemistry Basics',
        dueDate: '2024-12-05',
        status: 'rejected'
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
