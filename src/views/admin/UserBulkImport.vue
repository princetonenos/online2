<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bulk User Import
          </h1>
          <p class="text-gray-600 mt-2">Import multiple users at once using CSV files or manual entry</p>
        </div>
        <div class="flex items-center space-x-4">
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

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Import Methods -->
        <div class="lg:col-span-2 space-y-6">
          <!-- CSV Upload Section -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-blue-600 text-sm">upload_file</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">CSV File Import</h2>
            </div>

            <!-- File Upload Area -->
            <div 
              @drop="handleFileDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50"
              :class="{ 'border-blue-400 bg-blue-50': isDragging }"
            >
              <input 
                type="file" 
                ref="fileInput"
                @change="handleFileSelect"
                accept=".csv,.xlsx,.xls"
                class="hidden"
              />
              
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-blue-600 text-2xl">cloud_upload</span>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Upload CSV File</h3>
              <p class="text-gray-600 mb-4">Drag & drop your file here or click to browse</p>
              
              <button 
                @click="triggerFileInput"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-classroom transition-colors flex items-center space-x-2 mx-auto"
              >
                <span class="material-icons text-sm">folder_open</span>
                <span>Browse Files</span>
              </button>
              
              <p class="text-xs text-gray-500 mt-4">Supported formats: CSV, Excel (.xlsx, .xls)</p>
            </div>

            <!-- File Info -->
            <div v-if="selectedFile" class="mt-6 p-4 bg-green-50 rounded-classroom border border-green-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-green-600 text-lg">description</span>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ selectedFile.name }}</div>
                    <div class="text-sm text-gray-600">{{ formatFileSize(selectedFile.size) }}</div>
                  </div>
                </div>
                <button 
                  @click="removeFile"
                  class="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <span class="material-icons text-lg">close</span>
                </button>
              </div>
            </div>

            <!-- CSV Template -->
            <div class="mt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">CSV Template</h3>
              <div class="bg-gray-50 rounded-classroom p-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium text-gray-900">Required columns:</span>
                  <button 
                    @click="downloadTemplate"
                    class="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                  >
                    <span class="material-icons text-sm">download</span>
                    <span>Download Template</span>
                  </button>
                </div>
                <div class="bg-white rounded-classroom p-3 border">
                  <code class="text-sm text-gray-700">
                    name,email,role,grade_level,subject<br>
                    John Doe,john@example.com,teacher,High School,Mathematics<br>
                    Jane Smith,jane@example.com,student,Grade 10,<br>
                    Admin User,admin@example.com,admin,,
                  </code>
                </div>
                <div class="mt-3 text-sm text-gray-600">
                  <p><strong>Role options:</strong> teacher, student, admin</p>
                  <p><strong>Grade level:</strong> Optional for teachers/admins</p>
                  <p><strong>Subject:</strong> Optional for students</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Import Settings -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-purple-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-purple-600 text-sm">settings</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Import Settings</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- User Settings -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">User Settings</h3>
                
                <div class="space-y-3">
                  <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer">
                    <div class="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        v-model="settings.sendWelcomeEmail"
                        class="w-4 h-4 text-blue-600 rounded"
                      >
                      <div>
                        <div class="font-medium text-gray-900">Send Welcome Email</div>
                        <div class="text-sm text-gray-500">Send account creation notification</div>
                      </div>
                    </div>
                  </label>

                  <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer">
                    <div class="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        v-model="settings.generatePasswords"
                        class="w-4 h-4 text-blue-600 rounded"
                      >
                      <div>
                        <div class="font-medium text-gray-900">Generate Passwords</div>
                        <div class="text-sm text-gray-500">Auto-generate secure passwords</div>
                      </div>
                    </div>
                  </label>

                  <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer">
                    <div class="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        v-model="settings.requirePasswordChange"
                        class="w-4 h-4 text-blue-600 rounded"
                      >
                      <div>
                        <div class="font-medium text-gray-900">Require Password Change</div>
                        <div class="text-sm text-gray-500">Force password change on first login</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Import Options -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Import Options</h3>
                
                <div class="space-y-3">
                  <div class="p-4 bg-gray-50 rounded-classroom">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Duplicate Handling</label>
                    <select 
                      v-model="settings.duplicateHandling"
                      class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="skip">Skip duplicates</option>
                      <option value="update">Update existing users</option>
                      <option value="create">Create new accounts</option>
                    </select>
                  </div>

                  <div class="p-4 bg-gray-50 rounded-classroom">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default Status</label>
                    <select 
                      v-model="settings.defaultStatus"
                      class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending Approval</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div class="p-4 bg-gray-50 rounded-classroom">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Notification Method</label>
                    <select 
                      v-model="settings.notificationMethod"
                      class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="email">Email Only</option>
                      <option value="sms">SMS Only</option>
                      <option value="both">Email and SMS</option>
                      <option value="none">No Notification</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Validation Options -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Validation Options</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="settings.validateEmails"
                    class="w-4 h-4 text-blue-600 rounded"
                  >
                  <div>
                    <div class="font-medium text-gray-900">Validate Email Format</div>
                    <div class="text-sm text-gray-500">Check for valid email addresses</div>
                  </div>
                </label>

                <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="settings.checkDuplicates"
                    class="w-4 h-4 text-blue-600 rounded"
                  >
                  <div>
                    <div class="font-medium text-gray-900">Check for Duplicates</div>
                    <div class="text-sm text-gray-500">Identify duplicate entries</div>
                  </div>
                </label>

                <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="settings.requireRole"
                    class="w-4 h-4 text-blue-600 rounded"
                  >
                  <div>
                    <div class="font-medium text-gray-900">Require Role</div>
                    <div class="text-sm text-gray-500">Role must be specified</div>
                  </div>
                </label>

                <label class="flex items-center space-x-3 p-4 bg-gray-50 rounded-classroom cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="settings.previewBeforeImport"
                    class="w-4 h-4 text-blue-600 rounded"
                  >
                  <div>
                    <div class="font-medium text-gray-900">Preview Before Import</div>
                    <div class="text-sm text-gray-500">Review data before processing</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Preview & Actions -->
        <div class="space-y-6">
          <!-- Import Preview -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Import Preview</h2>
            
            <div class="space-y-4">
              <div class="text-center py-8 text-gray-500" v-if="!previewData.length">
                <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-gray-400 text-2xl">visibility</span>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Preview Available</h3>
                <p class="text-gray-500">Upload a CSV file to see preview data</p>
              </div>

              <div v-else class="space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Total Records</span>
                  <span class="font-medium text-gray-900">{{ previewData.length }}</span>
                </div>
                
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Valid Records</span>
                  <span class="font-medium text-green-600">{{ validRecords }}</span>
                </div>
                
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Issues Found</span>
                  <span class="font-medium text-red-600">{{ issuesFound }}</span>
                </div>

                <!-- Sample Data -->
                <div class="mt-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Sample Data</h4>
                  <div class="bg-gray-50 rounded-classroom p-3 max-h-40 overflow-y-auto">
                    <div 
                      v-for="(record, index) in previewData.slice(0, 3)"
                      :key="index"
                      class="text-sm text-gray-700 border-b border-gray-200 py-1 last:border-0"
                    >
                      {{ record.name }} ({{ record.email }}) - {{ record.role }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            
            <div class="space-y-3">
              <button 
                @click="validateData"
                :disabled="!selectedFile"
                class="w-full flex items-center justify-between p-4 bg-blue-50 rounded-classroom hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-blue-600 text-lg">check_circle</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900">Validate Data</div>
                    <div class="text-sm text-gray-600">Check for errors and issues</div>
                  </div>
                </div>
                <span class="material-icons text-gray-400 text-lg">chevron_right</span>
              </button>

              <button 
                @click="startImport"
                :disabled="!selectedFile || importInProgress"
                class="w-full flex items-center justify-between p-4 bg-green-50 rounded-classroom hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center space-x-3">
                  <span v-if="importInProgress" class="material-icons text-green-600 text-lg animate-spin">refresh</span>
                  <span v-else class="material-icons text-green-600 text-lg">play_arrow</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900">{{ importInProgress ? 'Importing...' : 'Start Import' }}</div>
                    <div class="text-sm text-gray-600">Process the uploaded file</div>
                  </div>
                </div>
                <span class="material-icons text-gray-400 text-lg">chevron_right</span>
              </button>

              <button 
                @click="clearAll"
                class="w-full flex items-center justify-between p-4 bg-red-50 rounded-classroom hover:bg-red-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-red-600 text-lg">clear</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900">Clear All</div>
                    <div class="text-sm text-gray-600">Reset form and data</div>
                  </div>
                </div>
                <span class="material-icons text-gray-400 text-lg">chevron_right</span>
              </button>
            </div>
          </div>

          <!-- Import Statistics -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Import Statistics</h2>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Total Imports</span>
                <span class="text-sm font-medium text-gray-900">24</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Successful</span>
                <span class="text-sm font-medium text-green-600">22</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Failed</span>
                <span class="text-sm font-medium text-red-600">2</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Last Import</span>
                <span class="text-sm font-medium text-gray-900">2 days ago</span>
              </div>
            </div>
          </div>

          <!-- Recent Imports -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">Recent Imports</h2>
              <button class="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="importItem in recentImports"
                :key="importItem.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-classroom"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ importItem.fileName }}</div>
                  <div class="text-xs text-gray-500">{{ importItem.date }}</div>
                </div>
                <div class="text-right">
                  <div class="text-xs font-medium" :class="getStatusClass(importItem.status)">
                    {{ importItem.status }}
                  </div>
                  <div class="text-xs text-gray-500">{{ importItem.records }} records</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const importInProgress = ref(false)
const previewData = ref([])

const settings = ref({
  sendWelcomeEmail: true,
  generatePasswords: true,
  requirePasswordChange: true,
  duplicateHandling: 'skip',
  defaultStatus: 'active',
  notificationMethod: 'email',
  validateEmails: true,
  checkDuplicates: true,
  requireRole: true,
  previewBeforeImport: true
})

const recentImports = ref([
  {
    id: 1,
    fileName: 'students_spring_2024.csv',
    date: '2 days ago',
    status: 'Completed',
    records: 45
  },
  {
    id: 2,
    fileName: 'teachers_import.xlsx',
    date: '1 week ago',
    status: 'Completed',
    records: 12
  },
  {
    id: 3,
    fileName: 'admin_users.csv',
    date: '2 weeks ago',
    status: 'Failed',
    records: 0
  }
])

// Computed properties
const validRecords = computed(() => {
  return previewData.value.filter(record => 
    record.name && record.email && record.role
  ).length
})

const issuesFound = computed(() => {
  return previewData.value.length - validRecords.value
})

// File handling
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    processFile(file)
  }
}

const handleFileDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  const file = event.dataTransfer.files[0]
  if (file && (file.type === 'text/csv' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    selectedFile.value = file
    processFile(file)
  } else {
    showToast('Please upload a CSV or Excel file')
  }
}

const removeFile = () => {
  selectedFile.value = null
  previewData.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const processFile = (file) => {
  // Simulate file processing and preview data
  showToast(`Processing ${file.name}...`)
  
  // Mock preview data
  setTimeout(() => {
    previewData.value = [
      { name: 'John Doe', email: 'john@example.com', role: 'teacher', grade_level: 'High School', subject: 'Mathematics' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'student', grade_level: 'Grade 10', subject: '' },
      { name: 'Admin User', email: 'admin@example.com', role: 'admin', grade_level: '', subject: '' },
      { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'teacher', grade_level: 'Middle School', subject: 'Science' }
    ]
    showToast('File processed successfully. Preview data loaded.')
  }, 1000)
}

// Actions
const validateData = () => {
  showToast('Validating data...')
  // Simulate validation
  setTimeout(() => {
    if (validRecords.value === previewData.value.length) {
      showToast('All records are valid!')
    } else {
      showToast(`Found ${issuesFound.value} issues that need attention.`)
    }
  }, 1500)
}

const startImport = async () => {
  importInProgress.value = true
  showToast('Starting bulk import process...')
  
  // Simulate import process
  setTimeout(() => {
    importInProgress.value = false
    showToast(`Successfully imported ${validRecords.value} users!`)
    
    // Add to recent imports
    recentImports.value.unshift({
      id: Date.now(),
      fileName: selectedFile.value.name,
      date: 'Just now',
      status: 'Completed',
      records: validRecords.value
    })
  }, 3000)
}

const clearAll = () => {
  selectedFile.value = null
  previewData.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  showToast('Form cleared')
}

const downloadTemplate = () => {
  showToast('Downloading CSV template...')
  // In a real app, this would download an actual CSV file
  const templateContent = `name,email,role,grade_level,subject\nJohn Doe,john@example.com,teacher,High School,Mathematics\nJane Smith,jane@example.com,student,Grade 10,\nAdmin User,admin@example.com,admin,,`
  const blob = new Blob([templateContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'user_import_template.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

// Helper functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getStatusClass = (status) => {
  const classes = {
    Completed: 'text-green-600',
    Processing: 'text-blue-600',
    Failed: 'text-red-600',
    Pending: 'text-yellow-600'
  }
  return classes[status] || 'text-gray-600'
}

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  } else {
    alert(message)
  }
}

// Event handlers for drag and drop
const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

onMounted(() => {
  // Add global event listeners for drag and drop
  document.addEventListener('dragenter', handleDragEnter)
  document.addEventListener('dragleave', handleDragLeave)
})
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
