<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Welcome section -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">
        Teacher Dashboard
      </h1>
      <p class="text-classroom-gray-600">Manage your classes, lessons, and student progress</p>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Active Classes</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ activeClasses }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">school</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Students</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ totalStudents }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-secondary">people</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Avg. Completion</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ averageCompletion }}%</p>
          </div>
          <div class="w-12 h-12 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">trending_up</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Avg. Score</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ averageScore }}%</p>
          </div>
          <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">grade</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's timetable -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-classroom classroom-shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-medium text-classroom-gray-900">Today's Timetable</h2>
            <button @click="startLiveClass" class="btn-primary flex items-center space-x-2">
              <span class="material-icons text-lg">video_call</span>
              <span>Start Live Class</span>
            </button>
          </div>

          <div class="space-y-3">
            <div 
              v-for="session in todaysSessions"
              :key="session.id"
              class="flex items-center justify-between p-4 border border-classroom-gray-200 rounded-classroom hover:border-classroom-primary transition-colors"
            >
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-classroom-primary">schedule</span>
                </div>
                <div>
                  <h3 class="font-medium text-classroom-gray-900">{{ session.courseName }}</h3>
                  <p class="text-sm text-classroom-gray-500">{{ session.time }}</p>
                </div>
              </div>
              <button 
                @click="joinSession(session)"
                class="btn-outline flex items-center space-x-2"
              >
                <span class="material-icons text-lg">play_arrow</span>
                <span>Join</span>
              </button>
            </div>

            <div v-if="todaysSessions.length === 0" class="text-center py-8 text-classroom-gray-500">
              <span class="material-icons text-4xl mb-2 opacity-50">event_busy</span>
              <p>No classes scheduled for today</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="space-y-4">
        <div class="bg-white rounded-classroom classroom-shadow p-4">
          <h3 class="font-medium text-classroom-gray-900 mb-3">Quick Actions</h3>
          <div class="space-y-2">
            <button @click="openClasses" class="w-full btn-outline flex items-center space-x-2 justify-start">
              <span class="material-icons text-lg">school</span>
              <span>My Classes</span>
            </button>
            <button @click="openCreateClass" class="w-full btn-outline flex items-center space-x-2 justify-start">
              <span class="material-icons text-lg">add_circle</span>
              <span>Create Class</span>
            </button>
            <button @click="openCalendar" class="w-full btn-outline flex items-center space-x-2 justify-start">
              <span class="material-icons text-lg">calendar_today</span>
              <span>View Calendar</span>
            </button>
            <button @click="openAssignments" class="w-full btn-outline flex items-center space-x-2 justify-start">
              <span class="material-icons text-lg">assignment</span>
              <span>Assignments</span>
            </button>
            <button @click="openReports" class="w-full btn-outline flex items-center space-x-2 justify-start">
              <span class="material-icons text-lg">assessment</span>
              <span>Reports</span>
            </button>
          </div>
        </div>

        <!-- Low performers -->
        <div class="bg-white rounded-classroom classroom-shadow p-4">
          <h3 class="font-medium text-classroom-gray-900 mb-3">Low Performers</h3>
          <div class="space-y-2">
            <div 
              v-for="student in lowPerformers"
              :key="student.id"
              class="flex items-center justify-between p-2 hover:bg-classroom-gray-50 rounded-classroom"
            >
              <div class="flex items-center space-x-2">
                <img :src="student.avatar" :alt="student.name" class="w-8 h-8 rounded-full">
                <span class="text-sm text-classroom-gray-900">{{ student.name }}</span>
              </div>
              <span class="chip bg-red-100 text-red-800 text-xs">{{ student.score }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Class roster -->
    <div class="bg-white rounded-classroom classroom-shadow">
      <div class="p-4 border-b border-classroom-gray-100">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-medium text-classroom-gray-900">Class Roster</h2>
          <div class="flex items-center space-x-2">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search students..."
                class="pl-8 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors text-sm"
              >
              <span class="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-classroom-gray-400 text-sm">
                search
              </span>
            </div>
            <select
              v-model="selectedClass"
              class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors text-sm"
            >
              <option value="">All Classes</option>
              <option v-for="course in teacherCourses" :key="course.id" :value="course.id">
                {{ course.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-classroom-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Student</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Class</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Completion</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Avg. Score</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Last Active</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="student in filteredStudents"
              :key="student.id"
              class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <img :src="student.avatar" :alt="student.name" class="w-8 h-8 rounded-full">
                  <span class="text-sm text-classroom-gray-900">{{ student.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-classroom-gray-900">{{ student.className }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <div class="w-16 bg-classroom-gray-200 rounded-full h-2">
                    <div 
                      class="bg-classroom-primary h-2 rounded-full transition-all"
                      :style="{ width: student.completion + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm text-classroom-gray-600">{{ student.completion }}%</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-classroom-gray-900">{{ student.avgScore }}%</td>
              <td class="px-4 py-3 text-sm text-classroom-gray-500">{{ student.lastActive }}</td>
              <td class="px-4 py-3">
                <button 
                  @click="messageStudent(student)"
                  class="btn-outline text-xs px-2 py-1"
                >
                  Message
                </button>
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
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()

const searchQuery = ref('')
const selectedClass = ref('')

// Mock data for teacher dashboard
const activeClasses = ref(3)
const totalStudents = ref(42)
const averageCompletion = ref(78)
const averageScore = ref(85)

const todaysSessions = ref([
  {
    id: 1,
    courseName: 'Advanced Mathematics',
    time: '10:00 AM - 11:30 AM',
    courseId: 'math101'
  },
  {
    id: 2,
    courseName: 'Physics Fundamentals',
    time: '2:00 PM - 3:30 PM',
    courseId: 'physics101'
  }
])

const lowPerformers = ref([
  { id: 1, name: 'Alex Johnson', avatar: '/avatars/student1.jpg', score: 45 },
  { id: 2, name: 'Sarah Miller', avatar: '/avatars/student2.jpg', score: 52 },
  { id: 3, name: 'Tom Wilson', avatar: '/avatars/student3.jpg', score: 48 }
])

const students = ref([
  { id: 1, name: 'Alex Johnson', avatar: '/avatars/student1.jpg', className: 'Advanced Mathematics', completion: 65, avgScore: 45, lastActive: '2 hours ago' },
  { id: 2, name: 'Sarah Miller', avatar: '/avatars/student2.jpg', className: 'Physics Fundamentals', completion: 78, avgScore: 52, lastActive: '1 hour ago' },
  { id: 3, name: 'Tom Wilson', avatar: '/avatars/student3.jpg', className: 'Advanced Mathematics', completion: 45, avgScore: 48, lastActive: '5 hours ago' },
  { id: 4, name: 'Emma Davis', avatar: '/avatars/student4.jpg', className: 'Physics Fundamentals', completion: 92, avgScore: 88, lastActive: '30 minutes ago' }
])

const teacherCourses = computed(() => {
  const currentUser = usersStore.currentUser
  if (!currentUser) return []
  return coursesStore.getCoursesForUser(currentUser.id)
})

const filteredStudents = computed(() => {
  let filtered = students.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(student => 
      student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (selectedClass.value) {
    filtered = filtered.filter(student => 
      teacherCourses.value.find(course => course.id === selectedClass.value)?.name === student.className
    )
  }
  
  return filtered
})

const startLiveClass = () => {
  showToast('Starting live class session...')
  // In a real app, this would integrate with a video conferencing API
}

const joinSession = (session) => {
  showToast(`Joining ${session.courseName} session`)
  router.push(`/course/${session.courseId}/live`)
}

const openLessonBuilder = () => {
  showToast('Opening lesson builder...')
  router.push('/lesson-builder')
}

const openAttendance = () => {
  showToast('Opening attendance manager...')
  router.push('/attendance')
}

const openGradebook = () => {
  showToast('Opening gradebook...')
  router.push('/grades')
}

const openClasses = () => {
  router.push('/teacher/classes')
}

const openCreateClass = () => {
  router.push('/teacher/create-class')
}

const openCalendar = () => {
  router.push('/teacher/calendar')
}

const openAssignments = () => {
  router.push('/teacher/assignments')
}

const openReports = () => {
  router.push('/teacher/reports')
}

const messageStudent = (student) => {
  showToast(`Opening chat with ${student.name}`)
  // In a real app, this would open a messaging interface
}

onMounted(() => {
  // Load teacher-specific data
  coursesStore.loadCourses()
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
