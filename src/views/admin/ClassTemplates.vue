<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Class Templates</h1>
      <p class="text-classroom-gray-600">Create and manage reusable class templates for quick setup</p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button 
        @click="openCreateTemplate"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">add</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Create Template</h3>
            <p class="text-sm text-classroom-gray-500">Design a new class template</p>
          </div>
        </div>
      </button>

      <button 
        @click="importTemplate"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-secondary">file_upload</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Import Template</h3>
            <p class="text-sm text-classroom-gray-500">Import from existing class</p>
          </div>
        </div>
      </button>

      <button 
        @click="exportTemplates"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">file_download</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Export All</h3>
            <p class="text-sm text-classroom-gray-500">Export all templates</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-classroom classroom-shadow p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <div class="relative">
            <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-classroom-gray-400">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search templates..."
              class="w-full pl-10 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
            >
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <select
            v-model="filterCategory"
            class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
          >
            <option value="">All Categories</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="language">Language Arts</option>
            <option value="social">Social Studies</option>
            <option value="arts">Arts</option>
            <option value="technology">Technology</option>
          </select>
          
          <select
            v-model="filterGrade"
            class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
          >
            <option value="">All Grades</option>
            <option value="elementary">Elementary</option>
            <option value="middle">Middle School</option>
            <option value="high">High School</option>
            <option value="college">College</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Templates Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Template Card -->
      <div 
        v-for="template in filteredTemplates"
        :key="template.id"
        class="bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-all duration-200 group"
      >
        <!-- Template Header -->
        <div 
          class="h-3 w-full rounded-t-classroom"
          :style="{ backgroundColor: template.color }"
        ></div>
        
        <div class="p-4">
          <!-- Template Info -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-medium text-classroom-gray-900 text-lg mb-1">{{ template.name }}</h3>
              <p class="text-sm text-classroom-gray-600">{{ template.description }}</p>
            </div>
            
            <!-- Template Actions -->
            <div class="relative">
              <button 
                @click.stop="toggleTemplateOptions(template.id)"
                class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Template options"
              >
                <span class="material-icons text-classroom-gray-600 text-lg">more_vert</span>
              </button>

              <!-- Options Dropdown -->
              <div 
                v-if="activeTemplateId === template.id"
                class="absolute right-0 top-full mt-1 bg-white rounded-classroom classroom-shadow-lg border border-classroom-gray-200 py-1 z-10 w-48"
              >
                <button 
                  @click.stop="useTemplate(template)"
                  class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
                >
                  <span class="material-icons text-classroom-gray-600 text-lg">play_arrow</span>
                  <span>Use Template</span>
                </button>
                <button 
                  @click.stop="editTemplate(template)"
                  class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
                >
                  <span class="material-icons text-classroom-gray-600 text-lg">edit</span>
                  <span>Edit</span>
                </button>
                <button 
                  @click.stop="duplicateTemplate(template)"
                  class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
                >
                  <span class="material-icons text-classroom-gray-600 text-lg">content_copy</span>
                  <span>Duplicate</span>
                </button>
                <div class="border-t border-classroom-gray-100 my-1"></div>
                <button 
                  @click.stop="deleteTemplate(template)"
                  class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2 text-red-600"
                >
                  <span class="material-icons text-lg">delete</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Template Details -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-classroom-gray-500">Category:</span>
              <span class="font-medium text-classroom-gray-900">{{ getCategoryLabel(template.category) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-classroom-gray-500">Grade Level:</span>
              <span class="font-medium text-classroom-gray-900">{{ getGradeLabel(template.gradeLevel) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-classroom-gray-500">Assignments:</span>
              <span class="font-medium text-classroom-gray-900">{{ template.assignmentsCount }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-classroom-gray-500">Topics:</span>
              <span class="font-medium text-classroom-gray-900">{{ template.topicsCount }}</span>
            </div>
          </div>

          <!-- Template Preview -->
          <div class="bg-classroom-gray-50 rounded-classroom p-3 mb-4">
            <h4 class="text-sm font-medium text-classroom-gray-900 mb-2">Preview Content</h4>
            <div class="space-y-1 text-xs text-classroom-gray-600">
              <div v-for="item in template.previewContent" :key="item" class="flex items-center space-x-2">
                <span class="material-icons text-classroom-gray-400 text-sm">check_circle</span>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- Use Template Button -->
          <button 
            @click="useTemplate(template)"
            class="w-full btn-primary py-2 flex items-center justify-center space-x-2"
          >
            <span class="material-icons text-lg">play_arrow</span>
            <span>Use This Template</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTemplates.length === 0" class="text-center py-12">
      <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-icons text-classroom-gray-400 text-4xl">description</span>
      </div>
      <h3 class="text-xl font-medium text-classroom-gray-900 mb-2">No templates found</h3>
      <p class="text-classroom-gray-600 mb-6">
        {{ searchQuery || filterCategory || filterGrade ? 'Try adjusting your search filters' : 'Get started by creating your first class template' }}
      </p>
      <button @click="openCreateTemplate" class="btn-primary">
        Create Template
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Reactive data
const searchQuery = ref('')
const filterCategory = ref('')
const filterGrade = ref('')
const activeTemplateId = ref(null)

// Mock data for templates
const templates = ref([
  {
    id: '1',
    name: 'Algebra 1 - Full Course',
    description: 'Complete Algebra 1 curriculum with assignments and assessments',
    color: '#4f46e5',
    category: 'math',
    gradeLevel: 'high',
    assignmentsCount: 24,
    topicsCount: 8,
    previewContent: [
      'Linear Equations & Inequalities',
      'Quadratic Functions',
      'Systems of Equations',
      'Polynomial Operations'
    ]
  },
  {
    id: '2',
    name: 'Biology - Cell Structure',
    description: 'Comprehensive biology unit on cell structure and function',
    color: '#10b981',
    category: 'science',
    gradeLevel: 'high',
    assignmentsCount: 12,
    topicsCount: 5,
    previewContent: [
      'Cell Organelles',
      'Cell Membrane Transport',
      'Cellular Respiration',
      'Photosynthesis'
    ]
  },
  {
    id: '3',
    name: 'Creative Writing - Elementary',
    description: 'Engaging creative writing activities for elementary students',
    color: '#f59e0b',
    category: 'language',
    gradeLevel: 'elementary',
    assignmentsCount: 8,
    topicsCount: 4,
    previewContent: [
      'Story Elements',
      'Character Development',
      'Descriptive Writing',
      'Poetry Basics'
    ]
  },
  {
    id: '4',
    name: 'World History - Ancient Civilizations',
    description: 'Explore ancient civilizations and their impact',
    color: '#ef4444',
    category: 'social',
    gradeLevel: 'middle',
    assignmentsCount: 15,
    topicsCount: 6,
    previewContent: [
      'Mesopotamia',
      'Ancient Egypt',
      'Greek Civilization',
      'Roman Empire'
    ]
  },
  {
    id: '5',
    name: 'Digital Art Fundamentals',
    description: 'Introduction to digital art tools and techniques',
    color: '#8b5cf6',
    category: 'arts',
    gradeLevel: 'high',
    assignmentsCount: 10,
    topicsCount: 4,
    previewContent: [
      'Digital Drawing Basics',
      'Color Theory',
      'Composition',
      'Digital Painting'
    ]
  },
  {
    id: '6',
    name: 'Programming Basics - Python',
    description: 'Introduction to programming with Python',
    color: '#06b6d4',
    category: 'technology',
    gradeLevel: 'college',
    assignmentsCount: 18,
    topicsCount: 7,
    previewContent: [
      'Variables & Data Types',
      'Control Structures',
      'Functions',
      'Object-Oriented Programming'
    ]
  }
])

// Computed properties
const filteredTemplates = computed(() => {
  return templates.value.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !filterCategory.value || template.category === filterCategory.value
    const matchesGrade = !filterGrade.value || template.gradeLevel === filterGrade.value
    
    return matchesSearch && matchesCategory && matchesGrade
  })
})

// Methods
const getCategoryLabel = (category) => {
  const categories = {
    math: 'Mathematics',
    science: 'Science',
    language: 'Language Arts',
    social: 'Social Studies',
    arts: 'Arts',
    technology: 'Technology'
  }
  return categories[category] || category
}

const getGradeLabel = (grade) => {
  const grades = {
    elementary: 'Elementary',
    middle: 'Middle School',
    high: 'High School',
    college: 'College'
  }
  return grades[grade] || grade
}

const toggleTemplateOptions = (templateId) => {
  activeTemplateId.value = activeTemplateId.value === templateId ? null : templateId
}

const openCreateTemplate = () => {
  showToast('Create template modal would open here')
}

const importTemplate = () => {
  showToast('Import template functionality would open here')
}

const exportTemplates = () => {
  showToast('Exporting all templates...')
}

const useTemplate = (template) => {
  showToast(`Using template: ${template.name}`)
  activeTemplateId.value = null
}

const editTemplate = (template) => {
  showToast(`Editing template: ${template.name}`)
  activeTemplateId.value = null
}

const duplicateTemplate = (template) => {
  showToast(`Duplicating template: ${template.name}`)
  activeTemplateId.value = null
}

const deleteTemplate = (template) => {
  if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
    templates.value = templates.value.filter(t => t.id !== template.id)
    showToast('Template deleted successfully')
  }
  activeTemplateId.value = null
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative') && !event.target.closest('button[aria-label="Template options"]')) {
    activeTemplateId.value = null
  }
}

onMounted(() => {
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
