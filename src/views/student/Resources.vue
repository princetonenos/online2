<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Learning Resources
          </h1>
          <p class="text-gray-600 mt-2">Access study materials, reference guides, and helpful tools</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search resources..."
              class="bg-white border border-gray-300 rounded-classroom pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              v-model="searchQuery"
            >
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span class="material-icons text-gray-400 text-sm">search</span>
            </div>
          </div>
          <button 
            @click="$router.back()"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-classroom transition-colors flex items-center space-x-2"
          >
            <span class="material-icons text-sm">arrow_back</span>
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Access -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <button 
        @click="filterByType('video')"
        class="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-xl border border-red-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">ondemand_video</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Video Lessons</h3>
            <p class="text-sm text-gray-600">{{ getResourceCount('video') }} resources</p>
          </div>
        </div>
      </button>

      <button 
        @click="filterByType('document')"
        class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">description</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Documents</h3>
            <p class="text-sm text-gray-600">{{ getResourceCount('document') }} resources</p>
          </div>
        </div>
      </button>

      <button 
        @click="filterByType('quiz')"
        class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">quiz</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Practice Quizzes</h3>
            <p class="text-sm text-gray-600">{{ getResourceCount('quiz') }} resources</p>
          </div>
        </div>
      </button>

      <button 
        @click="filterByType('link')"
        class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 hover:shadow-2xl transition-all duration-300 text-left group transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-classroom flex items-center justify-center text-white">
            <span class="material-icons text-lg">link</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">External Links</h3>
            <p class="text-sm text-gray-600">{{ getResourceCount('link') }} resources</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
      <!-- Left Column: Categories & Filters -->
      <div class="xl:col-span-1 space-y-6">
        <!-- Categories -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Subjects</h2>
          <div class="space-y-2">
            <button 
              v-for="subject in subjects"
              :key="subject.id"
              @click="filterBySubject(subject.name)"
              class="w-full flex items-center justify-between p-3 rounded-classroom hover:bg-gray-50 transition-colors text-left"
              :class="{ 'bg-blue-50 border border-blue-200': activeSubject === subject.name }"
            >
              <div class="flex items-center space-x-3">
                <div 
                  class="w-8 h-8 rounded-classroom flex items-center justify-center text-white text-sm font-medium"
                  :class="subject.color"
                >
                  {{ subject.icon }}
                </div>
                <span class="text-sm font-medium text-gray-900">{{ subject.name }}</span>
              </div>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ subject.count }}</span>
            </button>
          </div>
        </div>

        <!-- Resource Types -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Resource Types</h2>
          <div class="space-y-3">
            <label 
              v-for="type in resourceTypes"
              :key="type.value"
              class="flex items-center space-x-3 p-2 rounded-classroom hover:bg-gray-50 cursor-pointer"
            >
              <input 
                type="checkbox" 
                :value="type.value"
                v-model="selectedTypes"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              >
              <div class="flex items-center space-x-2">
                <span class="material-icons text-sm" :class="type.color">{{ type.icon }}</span>
                <span class="text-sm text-gray-900">{{ type.label }}</span>
              </div>
              <span class="text-xs text-gray-500 ml-auto">{{ type.count }}</span>
            </label>
          </div>
        </div>

        <!-- Recent Downloads -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Recent Downloads</h2>
          <div class="space-y-3">
            <div 
              v-for="download in recentDownloads"
              :key="download.id"
              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-classroom"
            >
              <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-600 text-sm">{{ download.icon }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900 truncate">{{ download.name }}</div>
                <div class="text-xs text-gray-500">{{ download.time }}</div>
              </div>
            </div>
          </div>

          <div v-if="recentDownloads.length === 0" class="text-center py-4 text-gray-500">
            <span class="material-icons text-4xl opacity-50 mb-2">download</span>
            <p class="text-sm">No recent downloads</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Resources List -->
      <div class="xl:col-span-3">
        <!-- Resources Header -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Available Resources</h2>
              <p class="text-gray-600 mt-1">{{ filteredResources.length }} resources found</p>
            </div>
            <div class="flex items-center space-x-4">
              <select 
                v-model="sortBy"
                class="bg-white border border-gray-300 rounded-classroom px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="popular">Most Popular</option>
              </select>
              <button 
                @click="clearFilters"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Resources Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="resource in filteredResources"
            :key="resource.id"
            class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div class="flex items-start justify-between mb-4">
              <div 
                class="w-12 h-12 rounded-classroom flex items-center justify-center text-white"
                :class="getResourceTypeColor(resource.type)"
              >
                <span class="material-icons text-lg">{{ getResourceTypeIcon(resource.type) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-medium px-2 py-1 rounded-full" :class="getSubjectBadgeColor(resource.subject)">
                  {{ resource.subject }}
                </span>
              </div>
            </div>

            <h3 class="font-bold text-gray-900 text-lg mb-2">{{ resource.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ resource.description }}</p>

            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span class="flex items-center space-x-1">
                <span class="material-icons text-sm">schedule</span>
                <span>{{ resource.duration }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <span class="material-icons text-sm">visibility</span>
                <span>{{ resource.views }}</span>
              </span>
            </div>

            <div class="flex items-center justify-between">
              <button 
                @click="downloadResource(resource)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2 text-sm"
              >
                <span class="material-icons text-sm">download</span>
                <span>Download</span>
              </button>
              <button 
                @click="previewResource(resource)"
                class="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1 text-sm"
              >
                <span class="material-icons text-sm">preview</span>
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredResources.length === 0" class="text-center py-12">
          <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-gray-400 text-3xl">search_off</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">No Resources Found</h3>
          <p class="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
          <button 
            @click="clearFilters"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Featured Resources -->
    <div class="mt-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured Resources</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="featured in featuredResources"
          :key="featured.id"
          class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl border border-purple-100 p-6"
        >
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-purple-100 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-purple-600 text-lg">star</span>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ featured.title }}</h3>
              <p class="text-sm text-gray-600">{{ featured.subject }}</p>
            </div>
          </div>
          <p class="text-gray-600 text-sm mb-4">{{ featured.description }}</p>
          <button 
            @click="downloadResource(featured)"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
          >
            <span class="material-icons text-sm">download</span>
            <span>Download Featured Resource</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const activeSubject = ref('')
const selectedTypes = ref([])
const sortBy = ref('newest')

// Mock data for resources
const resources = ref([
  {
    id: 1,
    title: 'Algebra Fundamentals Guide',
    description: 'Comprehensive guide covering basic to advanced algebra concepts with practice problems.',
    type: 'document',
    subject: 'Mathematics',
    duration: '45 min',
    views: 1247,
    size: '2.4 MB',
    downloadCount: 892,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Chemical Reactions Video Series',
    description: 'Video lessons explaining different types of chemical reactions with demonstrations.',
    type: 'video',
    subject: 'Science',
    duration: '2h 15m',
    views: 2156,
    size: '145 MB',
    downloadCount: 567,
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    title: 'Literature Analysis Workbook',
    description: 'Interactive workbook for analyzing literary texts and writing critical essays.',
    type: 'document',
    subject: 'English',
    duration: '1h 30m',
    views: 987,
    size: '3.1 MB',
    downloadCount: 423,
    createdAt: '2024-01-08'
  },
  {
    id: 4,
    title: 'World History Timeline Quiz',
    description: 'Interactive quiz covering major events in world history from ancient to modern times.',
    type: 'quiz',
    subject: 'History',
    duration: '25 min',
    views: 1567,
    size: '1.2 MB',
    downloadCount: 789,
    createdAt: '2024-01-05'
  },
  {
    id: 5,
    title: 'Physics Problem Solving Techniques',
    description: 'Step-by-step guide to solving complex physics problems with worked examples.',
    type: 'document',
    subject: 'Science',
    duration: '1h 15m',
    views: 1345,
    size: '2.8 MB',
    downloadCount: 654,
    createdAt: '2024-01-03'
  },
  {
    id: 6,
    title: 'Grammar Rules Reference',
    description: 'Quick reference guide for English grammar rules and common usage.',
    type: 'link',
    subject: 'English',
    duration: '30 min',
    views: 876,
    size: '0.8 MB',
    downloadCount: 321,
    createdAt: '2024-01-01'
  }
])

const subjects = ref([
  { id: 1, name: 'Mathematics', count: 12, icon: '🧮', color: 'bg-blue-500' },
  { id: 2, name: 'Science', count: 8, icon: '🔬', color: 'bg-green-500' },
  { id: 3, name: 'English', count: 6, icon: '📚', color: 'bg-purple-500' },
  { id: 4, name: 'History', count: 5, icon: '📜', color: 'bg-orange-500' },
  { id: 5, name: 'Geography', count: 3, icon: '🌍', color: 'bg-red-500' }
])

const resourceTypes = ref([
  { value: 'video', label: 'Video Lessons', icon: 'ondemand_video', color: 'text-red-500', count: 8 },
  { value: 'document', label: 'Documents', icon: 'description', color: 'text-blue-500', count: 15 },
  { value: 'quiz', label: 'Practice Quizzes', icon: 'quiz', color: 'text-green-500', count: 12 },
  { value: 'link', label: 'External Links', icon: 'link', color: 'text-purple-500', count: 6 }
])

const recentDownloads = ref([
  { id: 1, name: 'Algebra Study Guide.pdf', icon: 'description', time: '2 hours ago' },
  { id: 2, name: 'Chemistry Lab Manual.docx', icon: 'description', time: '1 day ago' },
  { id: 3, name: 'History Timeline Quiz', icon: 'quiz', time: '2 days ago' }
])

const featuredResources = ref([
  {
    id: 1,
    title: 'Final Exam Preparation Kit',
    description: 'Complete study package with practice tests, review guides, and study schedules.',
    subject: 'All Subjects',
    type: 'document'
  },
  {
    id: 2,
    title: 'Interactive Learning Modules',
    description: 'Engaging interactive modules for complex topics across multiple subjects.',
    subject: 'Science & Math',
    type: 'video'
  },
  {
    id: 3,
    title: 'Study Skills Handbook',
    description: 'Essential guide to effective study techniques and time management strategies.',
    subject: 'General',
    type: 'document'
  }
])

// Computed properties
const filteredResources = computed(() => {
  let filtered = resources.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(resource => 
      resource.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by subject
  if (activeSubject.value) {
    filtered = filtered.filter(resource => resource.subject === activeSubject.value)
  }

  // Filter by types
  if (selectedTypes.value.length > 0) {
    filtered = filtered.filter(resource => selectedTypes.value.includes(resource.type))
  }

  // Sort resources
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'name':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'popular':
      filtered.sort((a, b) => b.views - a.views)
      break
  }

  return filtered
})

// Helper functions
const getResourceCount = (type) => {
  return resources.value.filter(resource => resource.type === type).length
}

const getResourceTypeColor = (type) => {
  const colors = {
    video: 'bg-red-500',
    document: 'bg-blue-500',
    quiz: 'bg-green-500',
    link: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getResourceTypeIcon = (type) => {
  const icons = {
    video: 'ondemand_video',
    document: 'description',
    quiz: 'quiz',
    link: 'link'
  }
  return icons[type] || 'help'
}

const getSubjectBadgeColor = (subject) => {
  const colors = {
    Mathematics: 'bg-blue-100 text-blue-800',
    Science: 'bg-green-100 text-green-800',
    English: 'bg-purple-100 text-purple-800',
    History: 'bg-orange-100 text-orange-800',
    Geography: 'bg-red-100 text-red-800'
  }
  return colors[subject] || 'bg-gray-100 text-gray-800'
}

// Actions
const filterByType = (type) => {
  selectedTypes.value = [type]
}

const filterBySubject = (subject) => {
  activeSubject.value = activeSubject.value === subject ? '' : subject
}

const clearFilters = () => {
  searchQuery.value = ''
  activeSubject.value = ''
  selectedTypes.value = []
  sortBy.value = 'newest'
}

const downloadResource = (resource) => {
  showToast(`Downloading ${resource.title}...`)
  // Simulate download
  setTimeout(() => {
    showToast(`${resource.title} downloaded successfully!`)
    
    // Add to recent downloads
    recentDownloads.value.unshift({
      id: Date.now(),
      name: `${resource.title}.${resource.type === 'video' ? 'mp4' : 'pdf'}`,
      icon: getResourceTypeIcon(resource.type),
      time: 'Just now'
    })
  }, 1500)
}

const previewResource = (resource) => {
  showToast(`Opening preview for ${resource.title}...`)
  // In a real app, this would open a modal or new tab with the resource preview
}

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  } else {
    alert(message)
  }
}

onMounted(() => {
  // Initialize resources data
  console.log('Resources module initialized')
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
