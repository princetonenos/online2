Course not found
The course you're looking for doesn't exist or you don't have access.<template>
  <div v-if="loading" class="p-6">
    <div class="skeleton h-32 w-full mb-6 rounded-classroom"></div>
    <div class="skeleton h-12 w-full mb-8 rounded-classroom"></div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="skeleton h-64 w-full rounded-classroom"></div>
      </div>
      <div class="space-y-4">
        <div class="skeleton h-32 w-full rounded-classroom"></div>
        <div class="skeleton h-48 w-full rounded-classroom"></div>
      </div>
    </div>
  </div>

  <div v-else-if="course" class="min-h-screen bg-classroom-gray-50">
    <!-- Course header banner -->
    <div 
      class="h-32 relative"
      :style="{ backgroundColor: course.color }"
    >
      <div class="absolute inset-0 bg-black bg-opacity-10"></div>
      <div class="relative h-full flex items-center px-6">
        <div class="text-white">
          <h1 class="text-2xl font-medium mb-1">{{ course.name }}</h1>
          <p class="text-white text-opacity-90">{{ course.section }}</p>
        </div>
        <div class="ml-auto flex items-center space-x-3">
          <button 
            @click="copyClassCode"
            class="btn-outline bg-white bg-opacity-10 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-20"
          >
            <span class="material-icons text-sm mr-1">content_copy</span>
            {{ course.code }}
          </button>
          <button 
            class="btn-outline bg-white bg-opacity-10 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-20"
          >
            <span class="material-icons text-sm mr-1">people</span>
            People
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation tabs -->
    <div class="bg-white border-b border-classroom-gray-200">
      <div class="px-6">
        <nav class="flex space-x-8">
          <router-link
            v-for="tab in tabs"
            :key="tab.name"
            :to="`/course/${course.id}/${tab.path}`"
            class="py-4 px-1 border-b-2 border-transparent text-classroom-gray-500 hover:text-classroom-gray-700 hover:border-classroom-gray-300 transition-colors font-medium text-sm"
            :class="{
              'border-classroom-primary text-classroom-primary': $route.path.includes(tab.path)
            }"
          >
            {{ tab.name }}
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Main content area -->
    <div class="p-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main content -->
          <div class="lg:col-span-2">
            <router-view />
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- About card -->
            <div class="bg-white rounded-classroom classroom-shadow p-4">
              <h3 class="font-medium text-classroom-gray-900 mb-3">About</h3>
              <div class="space-y-3 text-sm">
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-classroom-gray-400 text-lg">meeting_room</span>
                  <span class="text-classroom-gray-600">{{ course.room }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-classroom-gray-400 text-lg">class</span>
                  <span class="text-classroom-gray-600">{{ course.section }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-classroom-gray-400 text-lg">subject</span>
                  <span class="text-classroom-gray-600">{{ course.subject }}</span>
                </div>
              </div>
            </div>

            <!-- Upcoming work -->
            <div class="bg-white rounded-classroom classroom-shadow">
              <div class="p-4 border-b border-classroom-gray-100">
                <h3 class="font-medium text-classroom-gray-900">Upcoming</h3>
              </div>
              <div class="divide-y divide-classroom-gray-100">
                <div 
                  v-for="assignment in upcomingAssignments"
                  :key="assignment.id"
                  class="p-4 hover:bg-classroom-gray-50 transition-colors cursor-pointer"
                  @click="navigateToAssignment(assignment)"
                >
                  <h4 class="font-medium text-classroom-gray-900 text-sm mb-1">
                    {{ assignment.title }}
                  </h4>
                  <p class="text-xs text-classroom-gray-500 mb-2">
                    Due {{ formatDueDate(assignment) }}
                  </p>
                  <div class="flex items-center justify-between">
                    <span class="chip text-xs" :class="getPointsClass(assignment.maxPoints || assignment.points || 100)">
                      {{ assignment.maxPoints || assignment.points || 100 }} points
                    </span>
                    <span class="material-icons text-classroom-gray-400 text-sm">chevron_right</span>
                  </div>
                </div>
                <div 
                  v-if="upcomingAssignments.length === 0"
                  class="p-4 text-center text-classroom-gray-500 text-sm"
                >
                  No upcoming work
                </div>
              </div>
            </div>

            <!-- Class calendar -->
            <div class="bg-white rounded-classroom classroom-shadow">
              <div class="p-4 border-b border-classroom-gray-100">
                <h3 class="font-medium text-classroom-gray-900">Class calendar</h3>
              </div>
              <div class="p-4">
                <div class="text-center text-classroom-gray-500 text-sm">
                  <span class="material-icons text-4xl mb-2 opacity-50">calendar_today</span>
                  <p>Calendar view would appear here</p>
                </div>
              </div>
            </div>

            <!-- Class materials -->
            <div class="bg-white rounded-classroom classroom-shadow">
              <div class="p-4 border-b border-classroom-gray-100">
                <h3 class="font-medium text-classroom-gray-900">Class materials</h3>
              </div>
              <div class="p-4">
                <button class="w-full btn-outline text-sm flex items-center justify-center space-x-2">
                  <span class="material-icons text-lg">folder_open</span>
                  <span>View all materials</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-6 text-center">
    <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <span class="material-icons text-classroom-gray-400 text-4xl">error_outline</span>
    </div>
    <h2 class="text-xl font-medium text-classroom-gray-900 mb-2">Course not found</h2>
    <p class="text-classroom-gray-600 mb-6">The course you're looking for doesn't exist or you don't have access.</p>
    <button @click="$router.push('/')" class="btn-primary">
      Back to Dashboard
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const courseData = ref(null)

const tabs = [
  { name: 'Stream', path: 'stream' },
  { name: 'Classwork', path: 'classwork' },
  { name: 'People', path: 'people' },
  { name: 'Grades', path: 'grades' }
]

// Load course from localStorage
function loadCourse() {
  const allClasses = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  const foundClass = allClasses.find(c => c.id === route.params.id)
  
  if (foundClass) {
    // Map class data to course format
    courseData.value = {
      id: foundClass.id,
      name: foundClass.title,
      section: foundClass.level || 'General',
      code: foundClass.code || 'N/A',
      subject: foundClass.subject || 'General',
      room: 'Online',
      color: getClassColor(foundClass.subject),
      ...foundClass
    }
  } else {
    courseData.value = null
  }
}

function getClassColor(subject) {
  const colors = {
    'Mathematics': '#1976D2',
    'Science': '#388E3C',
    'English': '#D32F2F',
    'History': '#F57C00',
    'Art': '#7B1FA2',
    'Music': '#C2185B',
    'Physical Education': '#0097A7'
  }
  return colors[subject] || '#5C6BC0'
}

const course = computed(() => courseData.value)

const upcomingAssignments = computed(() => {
  if (!course.value) return []
  
  const allAssignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  const assignments = allAssignments.filter(assignment => 
    assignment.classId === course.value.id && 
    new Date(assignment.dueAt || assignment.dueDate) > new Date()
  )
  
  return assignments
    .sort((a, b) => new Date(a.dueAt || a.dueDate) - new Date(b.dueAt || b.dueDate))
    .slice(0, 3)
})

const formatDueDate = (assignment) => {
  const dueDate = assignment.dueAt || assignment.dueDate
  if (!dueDate) return 'No due date'
  
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'tomorrow'
  if (diffDays < 7) return `in ${diffDays} days`
  
  return date.toLocaleDateString()
}

const getPointsClass = (points) => {
  if (points >= 100) return 'chip-primary'
  if (points >= 50) return 'chip-secondary'
  return 'chip-gray'
}

const copyClassCode = () => {
  if (course.value?.code) {
    navigator.clipboard.writeText(course.value.code)
      .then(() => {
        showToast('Class code copied to clipboard')
      })
      .catch(() => {
        showToast('Failed to copy class code')
      })
  }
}

const navigateToAssignment = (assignment) => {
  router.push(`/course/${assignment.classId || assignment.courseId}/assignments/${assignment.id}`)
}

const loadCourseData = async () => {
  loading.value = true
  try {
    // Small delay to simulate loading
    await new Promise(resolve => setTimeout(resolve, 300))
    loadCourse()
  } catch (error) {
    console.error('Error loading course data:', error)
    showToast('Error loading course information')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCourseData()
})

watch(() => route.params.id, () => {
  loadCourseData()
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
