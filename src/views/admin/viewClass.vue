<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="skeleton h-8 w-3/4"></div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n" class="skeleton h-24"></div>
      </div>
      <div class="skeleton h-64"></div>
    </div>

    <!-- Class Details -->
    <div v-else-if="classData" class="space-y-6">
      <!-- Header Section -->
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-4">
          <div 
            class="w-16 h-16 rounded-classroom flex items-center justify-center text-white font-medium text-xl"
            :style="{ backgroundColor: classData.color }"
          >
            {{ classData.name.charAt(0) }}
          </div>
          <div>
            <h1 class="text-3xl font-medium text-classroom-gray-900 mb-1">{{ classData.name }}</h1>
            <p class="text-classroom-gray-600 mb-2">{{ classData.section }}</p>
            <div class="flex items-center space-x-4 text-sm text-classroom-gray-500">
              <span class="flex items-center space-x-1">
                <span class="material-icons text-base">school</span>
                <span>{{ classData.teacher?.name || 'Teacher' }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <span class="material-icons text-base">calendar_today</span>
                <span>Created {{ formatDate(classData.createdAt) }}</span>
              </span>
              <span class="chip" :class="getStatusClass(classData.status)">
                {{ getStatusLabel(classData.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <button 
            @click="editClass"
            class="btn-outline flex items-center space-x-2"
          >
            <span class="material-icons text-lg">edit</span>
            <span>Edit</span>
          </button>
          <button 
            @click="toggleOptions"
            class="btn-outline flex items-center space-x-2"
          >
            <span class="material-icons text-lg">more_vert</span>
            <span>Actions</span>
          </button>

          <!-- Options Dropdown -->
          <div 
            v-if="showOptions"
            class="absolute right-6 top-20 bg-white rounded-classroom classroom-shadow-lg border border-classroom-gray-200 py-1 z-10 w-48"
          >
            <button 
              @click="archiveClass"
              class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
            >
              <span class="material-icons text-classroom-gray-600 text-lg">archive</span>
              <span>Archive Class</span>
            </button>
            <button 
              @click="duplicateClass"
              class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
            >
              <span class="material-icons text-classroom-gray-600 text-lg">content_copy</span>
              <span>Duplicate Class</span>
            </button>
            <button 
              @click="exportClassData"
              class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
            >
              <span class="material-icons text-classroom-gray-600 text-lg">download</span>
              <span>Export Data</span>
            </button>
            <div class="border-t border-classroom-gray-100 my-1"></div>
            <button 
              @click="deleteClass"
              class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2 text-red-600"
            >
              <span class="material-icons text-lg">delete</span>
              <span>Delete Class</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-classroom classroom-shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-classroom-gray-500">Students</p>
              <p class="text-2xl font-medium text-classroom-gray-900">{{ classData.students?.length || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-classroom-primary">people</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-classroom classroom-shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-classroom-gray-500">Assignments</p>
              <p class="text-2xl font-medium text-classroom-gray-900">{{ classData.assignmentsCount || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-classroom-secondary">assignment</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-classroom classroom-shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-classroom-gray-500">Active</p>
              <p class="text-2xl font-medium text-classroom-gray-900">{{ classData.activeStudents || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-classroom-support">check_circle</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-classroom classroom-shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-classroom-gray-500">Avg. Grade</p>
              <p class="text-2xl font-medium text-classroom-gray-900">{{ classData.averageGrade || 'N/A' }}</p>
            </div>
            <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-classroom-primary">grade</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Class Information Tabs -->
      <div class="bg-white rounded-classroom classroom-shadow">
        <!-- Tab Navigation -->
        <div class="border-b border-classroom-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="{
                'border-classroom-primary text-classroom-primary': activeTab === tab.id,
                'border-transparent text-classroom-gray-500 hover:text-classroom-gray-700 hover:border-classroom-gray-300': activeTab !== tab.id
              }"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Class Details -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-classroom-gray-900">Class Information</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-classroom-gray-500">Class Code:</span>
                    <span class="font-medium text-classroom-gray-900">{{ classData.code }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-classroom-gray-500">Subject:</span>
                    <span class="font-medium text-classroom-gray-900">{{ classData.subject || 'Not specified' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-classroom-gray-500">Room:</span>
                    <span class="font-medium text-classroom-gray-900">{{ classData.room || 'Not specified' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-classroom-gray-500">Schedule:</span>
                    <span class="font-medium text-classroom-gray-900">{{ classData.schedule || 'Not specified' }}</span>
                  </div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-classroom-gray-900">Recent Activity</h3>
                <div class="space-y-3">
                  <div 
                    v-for="activity in recentActivities"
                    :key="activity.id"
                    class="flex items-start space-x-3 p-3 bg-classroom-gray-50 rounded-classroom"
                  >
                    <span class="material-icons text-classroom-primary text-lg mt-0.5">notifications</span>
                    <div class="flex-1">
                      <p class="text-sm text-classroom-gray-900">{{ activity.message }}</p>
                      <p class="text-xs text-classroom-gray-500">{{ formatTime(activity.timestamp) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="border-t border-classroom-gray-200 pt-6">
              <h3 class="text-lg font-medium text-classroom-gray-900 mb-4">Quick Actions</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  @click="sendAnnouncement"
                  class="p-4 bg-classroom-gray-50 rounded-classroom hover:bg-classroom-gray-100 transition-colors text-center"
                >
                  <span class="material-icons text-classroom-primary text-2xl mb-2">campaign</span>
                  <p class="text-sm font-medium text-classroom-gray-900">Announcement</p>
                </button>
                <button 
                  @click="createAssignment"
                  class="p-4 bg-classroom-gray-50 rounded-classroom hover:bg-classroom-gray-100 transition-colors text-center"
                >
                  <span class="material-icons text-classroom-secondary text-2xl mb-2">assignment</span>
                  <p class="text-sm font-medium text-classroom-gray-900">Assignment</p>
                </button>
                <button 
                  @click="viewGrades"
                  class="p-4 bg-classroom-gray-50 rounded-classroom hover:bg-classroom-gray-100 transition-colors text-center"
                >
                  <span class="material-icons text-classroom-primary text-2xl mb-2">grade</span>
                  <p class="text-sm font-medium text-classroom-gray-900">Grades</p>
                </button>
                <button 
                  @click="manageStudents"
                  class="p-4 bg-classroom-gray-50 rounded-classroom hover:bg-classroom-gray-100 transition-colors text-center"
                >
                  <span class="material-icons text-classroom-support text-2xl mb-2">group_add</span>
                  <p class="text-sm font-medium text-classroom-gray-900">Students</p>
                </button>
              </div>
            </div>
          </div>

          <!-- Students Tab -->
          <div v-if="activeTab === 'students'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-classroom-gray-900">Students ({{ classData.students?.length || 0 }})</h3>
              <button 
                @click="addStudents"
                class="btn-primary flex items-center space-x-2"
              >
                <span class="material-icons text-lg">person_add</span>
                <span>Add Students</span>
              </button>
            </div>

            <div class="bg-classroom-gray-50 rounded-classroom p-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 max-w-md">
                  <div class="relative">
                    <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-classroom-gray-400">search</span>
                    <input
                      v-model="studentSearch"
                      type="text"
                      placeholder="Search students..."
                      class="w-full pl-10 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                    >
                  </div>
                </div>
                <select
                  v-model="studentFilter"
                  class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
                >
                  <option value="">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div class="overflow-hidden">
              <table class="w-full">
                <thead class="bg-classroom-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Student</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Email</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Last Active</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-classroom-gray-200">
                  <tr 
                    v-for="student in filteredStudents"
                    :key="student.id"
                    class="hover:bg-classroom-gray-50 transition-colors"
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center space-x-3">
                        <img 
                          :src="student.avatar" 
                          :alt="student.name"
                          class="w-8 h-8 rounded-full"
                        >
                        <span class="text-sm font-medium text-classroom-gray-900">{{ student.name }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-classroom-gray-900">{{ student.email }}</td>
                    <td class="px-4 py-3">
                      <span class="chip text-xs" :class="getStudentStatusClass(student.status)">
                        {{ getStudentStatusLabel(student.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-classroom-gray-500">{{ formatTime(student.lastActive) }}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center space-x-2">
                        <button 
                          @click="viewStudent(student)"
                          class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors"
                          title="View Student"
                        >
                          <span class="material-icons text-classroom-gray-600 text-lg">visibility</span>
                        </button>
                        <button 
                          @click="messageStudent(student)"
                          class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors"
                          title="Message Student"
                        >
                          <span class="material-icons text-classroom-gray-600 text-lg">mail</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Assignments Tab -->
          <div v-if="activeTab === 'assignments'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-classroom-gray-900">Assignments ({{ classData.assignments?.length || 0 }})</h3>
              <button 
                @click="createAssignment"
                class="btn-primary flex items-center space-x-2"
              >
                <span class="material-icons text-lg">add</span>
                <span>Create Assignment</span>
              </button>
            </div>

            <div class="space-y-4">
              <div 
                v-for="assignment in classData.assignments"
                :key="assignment.id"
                class="bg-classroom-gray-50 rounded-classroom p-4 hover:bg-classroom-gray-100 transition-colors cursor-pointer"
                @click="viewAssignment(assignment)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-classroom-gray-900">{{ assignment.title }}</h4>
                    <p class="text-sm text-classroom-gray-600 mb-2">{{ assignment.description }}</p>
                    <div class="flex items-center space-x-4 text-xs text-classroom-gray-500">
                      <span>Due: {{ formatDate(assignment.dueDate) }}</span>
                      <span>{{ assignment.points }} points</span>
                      <span>{{ assignment.submissionsCount }}/{{ classData.students?.length || 0 }} submitted</span>
                    </div>
                  </div>
                  <span class="material-icons text-classroom-gray-400">chevron_right</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'" class="space-y-6">
            <h3 class="text-lg font-medium text-classroom-gray-900">Class Analytics</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Grade Distribution -->
              <div class="bg-classroom-gray-50 rounded-classroom p-4">
                <h4 class="font-medium text-classroom-gray-900 mb-4">Grade Distribution</h4>
                <div class="space-y-2">
                  <div 
                    v-for="grade in gradeDistribution"
                    :key="grade.range"
                    class="flex items-center justify-between"
                  >
                    <span class="text-sm text-classroom-gray-600">{{ grade.range }}</span>
                    <div class="flex items-center space-x-2">
                      <div class="w-32 bg-classroom-gray-200 rounded-full h-2">
                        <div 
                          class="bg-classroom-primary h-2 rounded-full"
                          :style="{ width: `${grade.percentage}%` }"
                        ></div>
                      </div>
                      <span class="text-sm text-classroom-gray-900 w-8">{{ grade.count }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Engagement Metrics -->
              <div class="bg-classroom-gray-50 rounded-classroom p-4">
                <h4 class="font-medium text-classroom-gray-900 mb-4">Engagement Metrics</h4>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-classroom-gray-600">Assignment Completion</span>
                    <span class="text-sm font-medium text-classroom-gray-900">{{ engagementMetrics.assignmentCompletion }}%</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-classroom-gray-600">Average Participation</span>
                    <span class="text-sm font-medium text-classroom-gray-900">{{ engagementMetrics.averageParticipation }}%</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-classroom-gray-600">On-time Submissions</span>
                    <span class="text-sm font-medium text-classroom-gray-900">{{ engagementMetrics.onTimeSubmissions }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-icons text-classroom-gray-400 text-4xl">error_outline</span>
      </div>
      <h2 class="text-xl font-medium text-classroom-gray-900 mb-2">Class not found</h2>
      <p class="text-classroom-gray-600 mb-6">The class you're looking for doesn't exist or you don't have access.</p>
      <button @click="$router.back()" class="btn-primary">
        Go back
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const showOptions = ref(false)
const activeTab = ref('overview')
const studentSearch = ref('')
const studentFilter = ref('')

const classData = ref(null)

const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'students', name: 'Students' },
  { id: 'assignments', name: 'Assignments' },
  { id: 'analytics', name: 'Analytics' }
]

// Mock data for demonstration
const recentActivities = ref([
  { id: 1, message: 'New assignment "Final Exam" created', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 2, message: 'Student Sarah Johnson submitted assignment', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
  { id: 3, message: 'Class announcement posted', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) }
])

const gradeDistribution = ref([
  { range: '90-100%', count: 8, percentage: 40 },
  { range: '80-89%', count: 6, percentage: 30 },
  { range: '70-79%', count: 4, percentage: 20 },
  { range: '60-69%', count: 2, percentage: 10 }
])

const engagementMetrics = ref({
  assignmentCompletion: 85,
  averageParticipation: 78,
  onTimeSubmissions: 92
})

const filteredStudents = computed(() => {
  if (!classData.value?.students) return []
  
  return classData.value.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.value.toLowerCase()) ||
                         student.email.toLowerCase().includes(studentSearch.value.toLowerCase())
    const matchesFilter = !studentFilter.value || student.status === studentFilter.value
    
    return matchesSearch && matchesFilter
  })
})

const getStatusClass = (status) => {
  const statusClasses = {
    active: 'chip-primary',
    archived: 'chip-gray',
    draft: 'chip-secondary'
  }
  return statusClasses[status] || 'chip-gray'
}

const getStatusLabel = (status) => {
  const statusLabels = {
    active: 'Active',
    archived: 'Archived',
    draft: 'Draft'
  }
  return statusLabels[status] || status
}

const getStudentStatusClass = (status) => {
  const statusClasses = {
    active: 'chip-primary',
    inactive: 'chip-gray',
    pending: 'chip-secondary'
  }
  return statusClasses[status] || 'chip-gray'
}

const getStudentStatusLabel = (status) => {
  const statusLabels = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending'
  }
  return statusLabels[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffTime = now.getTime() - time.getTime()
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  
  if (diffHours === 0) return 'Just now'
  if (diffHours === 1) return '1 hour ago'
  if (diffHours < 24) return `${diffHours} hours ago`
  
  return time.toLocaleDateString()
}

const toggleOptions = () => {
  showOptions.value = !showOptions.value
}

const editClass = () => {
  showToast('Edit class functionality would open here')
  showOptions.value = false
}

const archiveClass = () => {
  showToast('Archive class functionality would open here')
  showOptions.value = false
}

const duplicateClass = () => {
  showToast('Duplicate class functionality would open here')
  showOptions.value = false
}

const exportClassData = () => {
  showToast('Exporting class data...')
  showOptions.value = false
}

const deleteClass = () => {
  if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
    showToast('Class deleted successfully')
    router.push('/admin/classes')
  }
  showOptions.value = false
}

const sendAnnouncement = () => {
  showToast('Send announcement functionality would open here')
}

const createAssignment = () => {
  showToast('Create assignment functionality would open here')
}

const viewGrades = () => {
  showToast('View grades functionality would open here')
}

const manageStudents = () => {
  showToast('Manage students functionality would open here')
}

const addStudents = () => {
  showToast('Add students functionality would open here')
}

const viewStudent = (student) => {
  showToast(`Viewing student: ${student.name}`)
}

const messageStudent = (student) => {
  showToast(`Messaging student: ${student.name}`)
}

const viewAssignment = (assignment) => {
  showToast(`Viewing assignment: ${assignment.title}`)
}

const loadClassData = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data
    classData.value = {
      id: route.params.id,
      name: 'Algebra 1 - Period 3',
      section: 'Mathematics Department',
      code: 'ABCD123',
      color: '#4f46e5',
      status: 'active',
      subject: 'Mathematics',
      room: 'Room 204',
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      createdAt: new Date('2024-01-15'),
      teacher: { name: 'Dr. Sarah Johnson' },
      studentsCount: 25,
      assignmentsCount: 12,
      activeStudents: 22,
      averageGrade: '87%',
      students: [
        { id: 1, name: 'John Smith', email: 'john.smith@student.edu', avatar: '/avatars/student1.jpg', status: 'active', lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { id: 2, name: 'Emily Davis', email: 'emily.davis@student.edu', avatar: '/avatars/student2.jpg', status: 'active', lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000) },
        { id: 3, name: 'Michael Brown', email: 'michael.brown@student.edu', avatar: '/avatars/student3.jpg', status: 'inactive', lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@student.edu', avatar: '/avatars/student4.jpg', status: 'active', lastActive: new Date(Date.now() - 30 * 60 * 1000) }
      ],
      assignments: [
        { id: 1, title: 'Linear Equations Practice', description: 'Practice problems for linear equations', dueDate: new Date('2024-12-15'), points: 100, submissionsCount: 20 },
        { id: 2, title: 'Quadratic Functions Quiz', description: 'Quiz on quadratic functions and graphs', dueDate: new Date('2024-12-10'), points: 50, submissionsCount: 18 },
        { id: 3, title: 'Final Exam Review', description: 'Comprehensive review for final exam', dueDate: new Date('2024-12-20'), points: 200, submissionsCount: 15 }
      ]
    }
  } catch (error) {
    console.error('Error loading class data:', error)
    showToast('Error loading class data')
  } finally {
    loading.value = false
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.flex.items-center.space-x-2')) {
    showOptions.value = false
  }
}

onMounted(() => {
  loadClassData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>

<style scoped>
.relative {
  position: relative;
}
</style>
