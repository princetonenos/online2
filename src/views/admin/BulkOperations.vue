<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bulk Operations
          </h1>
          <p class="text-gray-600 mt-2">Manage large-scale data imports, exports, and batch operations</p>
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
        <!-- Left Column: Import Operations -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Data Import Section -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-blue-600 text-sm">upload</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Data Import</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- User Import -->
              <div class="bg-blue-50 rounded-classroom p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-blue-100 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-blue-600 text-lg">group_add</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">User Import</h3>
                    <p class="text-sm text-gray-600">Bulk import users from CSV</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Supported formats:</span>
                    <span class="font-medium">CSV, Excel</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Required fields:</span>
                    <span class="font-medium">Name, Email, Role</span>
                  </div>
                  <button 
                    @click="openUserImport"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                  >
                    <span class="material-icons text-sm">upload_file</span>
                    <span>Upload CSV</span>
                  </button>
                </div>
              </div>

              <!-- Class Import -->
              <div class="bg-green-50 rounded-classroom p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-green-100 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-green-600 text-lg">school</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Class Import</h3>
                    <p class="text-sm text-gray-600">Bulk import classes and enrollments</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Supported formats:</span>
                    <span class="font-medium">CSV, Excel</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Required fields:</span>
                    <span class="font-medium">Title, Subject, Teacher</span>
                  </div>
                  <button 
                    @click="openClassImport"
                    class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                  >
                    <span class="material-icons text-sm">upload_file</span>
                    <span>Upload CSV</span>
                  </button>
                </div>
              </div>

              <!-- Assignment Import -->
              <div class="bg-purple-50 rounded-classroom p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-purple-100 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-purple-600 text-lg">assignment</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Assignment Import</h3>
                    <p class="text-sm text-gray-600">Bulk import assignments</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Supported formats:</span>
                    <span class="font-medium">CSV, Excel</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Required fields:</span>
                    <span class="font-medium">Title, Class, Due Date</span>
                  </div>
                  <button 
                    @click="openAssignmentImport"
                    class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                  >
                    <span class="material-icons text-sm">upload_file</span>
                    <span>Upload CSV</span>
                  </button>
                </div>
              </div>

              <!-- Grade Import -->
              <div class="bg-orange-50 rounded-classroom p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-orange-100 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-orange-600 text-lg">grade</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Grade Import</h3>
                    <p class="text-sm text-gray-600">Bulk import student grades</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Supported formats:</span>
                    <span class="font-medium">CSV, Excel</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Required fields:</span>
                    <span class="font-medium">Student, Assignment, Grade</span>
                  </div>
                  <button 
                    @click="openGradeImport"
                    class="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                  >
                    <span class="material-icons text-sm">upload_file</span>
                    <span>Upload CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Export Section -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-green-600 text-sm">download</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Data Export</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- User Export -->
              <div class="border border-gray-200 rounded-classroom p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold text-gray-900">User Data</h3>
                  <span class="material-icons text-gray-400 text-lg">group</span>
                </div>
                <p class="text-sm text-gray-600 mb-3">Export all user data including profiles and roles</p>
                <button 
                  @click="exportUserData"
                  class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                >
                  <span class="material-icons text-sm">download</span>
                  <span>Export CSV</span>
                </button>
              </div>

              <!-- Class Export -->
              <div class="border border-gray-200 rounded-classroom p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold text-gray-900">Class Data</h3>
                  <span class="material-icons text-gray-400 text-lg">school</span>
                </div>
                <p class="text-sm text-gray-600 mb-3">Export class information and enrollments</p>
                <button 
                  @click="exportClassData"
                  class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                >
                  <span class="material-icons text-sm">download</span>
                  <span>Export CSV</span>
                </button>
              </div>

              <!-- Assignment Export -->
              <div class="border border-gray-200 rounded-classroom p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold text-gray-900">Assignment Data</h3>
                  <span class="material-icons text-gray-400 text-lg">assignment</span>
                </div>
                <p class="text-sm text-gray-600 mb-3">Export assignments and submission data</p>
                <button 
                  @click="exportAssignmentData"
                  class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                >
                  <span class="material-icons text-sm">download</span>
                  <span>Export CSV</span>
                </button>
              </div>

              <!-- Grade Export -->
              <div class="border border-gray-200 rounded-classroom p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold text-gray-900">Grade Data</h3>
                  <span class="material-icons text-gray-400 text-lg">grade</span>
                </div>
                <p class="text-sm text-gray-600 mb-3">Export complete gradebook data</p>
                <button 
                  @click="exportGradeData"
                  class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                >
                  <span class="material-icons text-sm">download</span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Tools & Templates -->
        <div class="space-y-6">
          <!-- Quick Tools -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-purple-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-purple-600 text-sm">build</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Quick Tools</h2>
            </div>

            <div class="space-y-4">
              <button 
                @click="openTemplateManager"
                class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-blue-600 text-lg">content_copy</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900">Template Manager</div>
                    <div class="text-sm text-gray-600">Manage import/export templates</div>
                  </div>
                </div>
                <span class="material-icons text-gray-400 text-lg">chevron_right</span>
              </button>

              <button 
                @click="openDataValidator"
                class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-green-600 text-lg">check_circle</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900">Data Validator</div>
                    <div class="text-sm text-gray-600">Validate import data before processing</div>
                  </div>
                </div>
                <span class="material-icons text-gray-400 text-lg">chevron_right</span>
              </button>

              <button 
                @click="openBatchProcessor"
                class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-orange-600 text-lg">play_arrow</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900">Batch Processor</div>
                    <div class="text-sm text-gray-600">Run bulk operations in background</div>
                  </div>
                </div>
                <span class="material-icons text-gray-400 text-lg">chevron_right</span>
              </button>
            </div>
          </div>

          <!-- Recent Operations -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Recent Operations</h2>
              <button 
                @click="clearHistory"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            </div>

            <div class="space-y-4">
              <div 
                v-for="operation in recentOperations"
                :key="operation.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-classroom"
              >
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-8 h-8 rounded-classroom flex items-center justify-center"
                    :class="getOperationColor(operation.type)"
                  >
                    <span class="material-icons text-sm text-white">{{ getOperationIcon(operation.type) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ operation.name }}</div>
                    <div class="text-xs text-gray-500">{{ operation.time }}</div>
                  </div>
                </div>
                <div 
                  class="text-xs font-medium px-2 py-1 rounded-full"
                  :class="getStatusClass(operation.status)"
                >
                  {{ operation.status }}
                </div>
              </div>

              <div v-if="recentOperations.length === 0" class="text-center py-4 text-gray-500">
                <span class="material-icons text-4xl opacity-50 mb-2">inbox</span>
                <p>No recent operations</p>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">System Status</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Queue Status</span>
                <span class="text-sm font-medium text-green-600">Idle</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Memory Usage</span>
                <span class="text-sm font-medium text-gray-900">45%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Active Processes</span>
                <span class="text-sm font-medium text-gray-900">0</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Last Backup</span>
                <span class="text-sm font-medium text-gray-900">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Manager Modal -->
    <div v-if="showTemplateManager" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">Template Manager</h2>
            <button @click="closeTemplateManager" class="text-gray-400 hover:text-gray-600">
              <span class="material-icons">close</span>
            </button>
          </div>
          <p class="text-gray-600 mt-2">Download CSV templates for bulk imports</p>
        </div>
        
        <div class="p-6 space-y-4">
          <div 
            v-for="template in templates"
            :key="template.id"
            class="border border-gray-200 rounded-classroom p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-gray-900">{{ template.name }}</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Fields: {{ template.fields.join(', ') }}
                </p>
              </div>
              <button 
                @click="downloadTemplate(template)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2"
              >
                <span class="material-icons text-sm">download</span>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Validator Modal -->
    <div v-if="showDataValidator" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">Data Validator</h2>
            <button @click="closeDataValidator" class="text-gray-400 hover:text-gray-600">
              <span class="material-icons">close</span>
            </button>
          </div>
          <p class="text-gray-600 mt-2">Validate your CSV file before importing</p>
        </div>
        
        <div class="p-6 space-y-6">
          <div class="border-2 border-dashed border-gray-300 rounded-classroom p-8 text-center">
            <span class="material-icons text-6xl text-gray-400 mb-4">upload_file</span>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ validationFile ? validationFile.name : 'Select a file to validate' }}
            </h3>
            <button 
              @click="selectFileForValidation"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors"
            >
              Choose File
            </button>
          </div>

          <div v-if="validationResults" class="space-y-4">
            <div class="border rounded-classroom p-4" :class="validationResults.status === 'valid' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
              <div class="flex items-center space-x-2 mb-2">
                <span class="material-icons" :class="validationResults.status === 'valid' ? 'text-green-600' : 'text-red-600'">
                  {{ validationResults.status === 'valid' ? 'check_circle' : 'error' }}
                </span>
                <h4 class="font-semibold" :class="validationResults.status === 'valid' ? 'text-green-900' : 'text-red-900'">
                  {{ validationResults.status === 'valid' ? 'Validation Passed' : 'Validation Failed' }}
                </h4>
              </div>
              <p class="text-sm text-gray-700">Total rows: {{ validationResults.totalRows }}</p>
            </div>

            <div v-if="validationResults.errors.length > 0" class="bg-red-50 border border-red-200 rounded-classroom p-4">
              <h4 class="font-semibold text-red-900 mb-2">Errors ({{ validationResults.errors.length }})</h4>
              <ul class="list-disc list-inside space-y-1 text-sm text-red-800">
                <li v-for="(error, index) in validationResults.errors" :key="index">{{ error }}</li>
              </ul>
            </div>

            <div v-if="validationResults.warnings.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-classroom p-4">
              <h4 class="font-semibold text-yellow-900 mb-2">Warnings ({{ validationResults.warnings.length }})</h4>
              <ul class="list-disc list-inside space-y-1 text-sm text-yellow-800">
                <li v-for="(warning, index) in validationResults.warnings.slice(0, 10)" :key="index">{{ warning }}</li>
                <li v-if="validationResults.warnings.length > 10" class="font-medium">
                  ... and {{ validationResults.warnings.length - 10 }} more warnings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Batch Processor Modal -->
    <div v-if="showBatchProcessor" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">Batch Processor</h2>
            <button @click="closeBatchProcessor" class="text-gray-400 hover:text-gray-600">
              <span class="material-icons">close</span>
            </button>
          </div>
          <p class="text-gray-600 mt-2">Create and manage background batch jobs</p>
        </div>
        
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="createBatchJob('user-sync')"
              class="bg-blue-50 border-2 border-blue-200 rounded-classroom p-4 hover:bg-blue-100 transition-colors text-left"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-blue-600 text-2xl">sync</span>
                <div>
                  <h4 class="font-semibold text-gray-900">User Sync</h4>
                  <p class="text-sm text-gray-600">Sync all user data</p>
                </div>
              </div>
            </button>

            <button 
              @click="createBatchJob('grade-calculation')"
              class="bg-green-50 border-2 border-green-200 rounded-classroom p-4 hover:bg-green-100 transition-colors text-left"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-green-600 text-2xl">calculate</span>
                <div>
                  <h4 class="font-semibold text-gray-900">Grade Calculation</h4>
                  <p class="text-sm text-gray-600">Recalculate all grades</p>
                </div>
              </div>
            </button>

            <button 
              @click="createBatchJob('data-cleanup')"
              class="bg-purple-50 border-2 border-purple-200 rounded-classroom p-4 hover:bg-purple-100 transition-colors text-left"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-purple-600 text-2xl">cleaning_services</span>
                <div>
                  <h4 class="font-semibold text-gray-900">Data Cleanup</h4>
                  <p class="text-sm text-gray-600">Remove old records</p>
                </div>
              </div>
            </button>

            <button 
              @click="createBatchJob('report-generation')"
              class="bg-orange-50 border-2 border-orange-200 rounded-classroom p-4 hover:bg-orange-100 transition-colors text-left"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-orange-600 text-2xl">assessment</span>
                <div>
                  <h4 class="font-semibold text-gray-900">Report Generation</h4>
                  <p class="text-sm text-gray-600">Generate all reports</p>
                </div>
              </div>
            </button>
          </div>

          <div class="border-t pt-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Active Jobs</h3>
              <button 
                @click="clearCompletedJobs"
                class="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Completed
              </button>
            </div>

            <div class="space-y-3">
              <div 
                v-for="job in batchJobs"
                :key="job.id"
                class="border border-gray-200 rounded-classroom p-4"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <span class="material-icons text-gray-600">{{ job.status === 'completed' ? 'check_circle' : job.status === 'cancelled' ? 'cancel' : 'schedule' }}</span>
                    <div>
                      <h4 class="font-medium text-gray-900">{{ job.name }}</h4>
                      <p class="text-xs text-gray-500">{{ new Date(job.createdAt).toLocaleString() }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium" :class="{
                      'text-green-600': job.status === 'completed',
                      'text-red-600': job.status === 'cancelled',
                      'text-blue-600': job.status === 'pending'
                    }">
                      {{ job.status === 'pending' ? Math.round(job.progress) + '%' : job.status }}
                    </span>
                    <button 
                      v-if="job.status === 'pending'"
                      @click="cancelBatchJob(job.id)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <span class="material-icons text-sm">close</span>
                    </button>
                  </div>
                </div>
                <div v-if="job.status === 'pending'" class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: job.progress + '%' }"></div>
                </div>
              </div>

              <div v-if="batchJobs.length === 0" class="text-center py-8 text-gray-500">
                <span class="material-icons text-4xl opacity-50 mb-2">inbox</span>
                <p>No active batch jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { importFromCSV, exportToCSV, readFileAsText } from '@/utils/exportHelpers'
import { useAuditLogStore } from '@/stores/auditLog'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

const router = useRouter()
const auditStore = useAuditLogStore()

const loading = ref(false)
const error = ref(null)
const showTemplateManager = ref(false)
const showDataValidator = ref(false)
const showBatchProcessor = ref(false)

const templates = ref([
  { id: 'user', name: 'User Import Template', type: 'users', fields: ['name', 'email', 'role', 'school'] },
  { id: 'class', name: 'Class Import Template', type: 'classes', fields: ['title', 'subject', 'teacher', 'section', 'room'] },
  { id: 'assignment', name: 'Assignment Import Template', type: 'assignments', fields: ['title', 'class', 'dueDate', 'points', 'type'] },
  { id: 'grade', name: 'Grade Import Template', type: 'grades', fields: ['student', 'assignment', 'grade'] }
])

const validationFile = ref(null)
const validationResults = ref(null)
const batchJobs = ref([])

const recentOperations = ref(
  JSON.parse(localStorage.getItem('mock:bulkOperations') || '[]').slice(0, 10) || [
    {
      id: 1,
      name: 'User Import',
      type: 'import',
      status: 'Completed',
      time: '2 hours ago'
    },
    {
      id: 2,
      name: 'Grade Export',
      type: 'export',
      status: 'Completed',
      time: '1 day ago'
    },
    {
      id: 3,
      name: 'Class Import',
      type: 'import',
      status: 'Failed',
      time: '3 days ago'
    }
  ]
)

// Create file input handler
const createFileInput = (accept = '.csv,.xlsx') => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = accept
  return input
}

// Add operation to history
const addOperationToHistory = (name, type, status) => {
  const operation = {
    id: Date.now(),
    name,
    type,
    status,
    time: 'Just now'
  }
  recentOperations.value.unshift(operation)
  recentOperations.value = recentOperations.value.slice(0, 10)
  localStorage.setItem('mock:bulkOperations', JSON.stringify(recentOperations.value))
}

// Operation handlers
const openUserImport = async () => {
  const input = createFileInput()
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    loading.value = true
    error.value = null

    try {
      const content = await readFileAsText(file)
      const users = importFromCSV(content)

      // Validate required fields
      const requiredFields = ['name', 'email', 'role']
      for (const user of users) {
        for (const field of requiredFields) {
          if (!user[field]) {
            throw new Error(`Missing required field: ${field}`)
          }
        }
        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
          throw new Error(`Invalid email format: ${user.email}`)
        }
      }

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('mock:users') || '[]')
      
      // Add new users
      const newUsers = users.map(user => ({
        id: Date.now() + Math.random(),
        name: user.name || user.Name,
        email: user.email || user.Email,
        role: (user.role || user.Role || 'student').toLowerCase(),
        school: user.school || user.School || 'Main Campus',
        status: 'active',
        avatar: '/avatars/default.jpg',
        createdAt: new Date().toISOString()
      }))

      localStorage.setItem('mock:users', JSON.stringify([...existingUsers, ...newUsers]))

      // Log the action
      auditStore.logDataImport('users', newUsers.length, 'success')
      addOperationToHistory('User Import', 'import', 'Completed')

      showToast(`Successfully imported ${newUsers.length} users!`)
    } catch (err) {
      error.value = err.message || 'Failed to import users'
      auditStore.logDataImport('users', 0, 'failed')
      addOperationToHistory('User Import', 'import', 'Failed')
    } finally {
      loading.value = false
    }
  }

  input.click()
}

const openClassImport = async () => {
  const input = createFileInput()
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    loading.value = true
    error.value = null

    try {
      const content = await readFileAsText(file)
      const classes = importFromCSV(content)

      // Validate required fields
      const requiredFields = ['title', 'subject', 'teacher']
      for (const classData of classes) {
        for (const field of requiredFields) {
          if (!classData[field] && !classData[field.charAt(0).toUpperCase() + field.slice(1)]) {
            throw new Error(`Missing required field: ${field}`)
          }
        }
      }

      // Get existing classes
      const existingClasses = JSON.parse(localStorage.getItem('mock:classes') || '[]')
      
      // Add new classes
      const newClasses = classes.map(cls => ({
        id: Date.now() + Math.random(),
        title: cls.title || cls.Title,
        subject: cls.subject || cls.Subject,
        teacherName: cls.teacher || cls.Teacher,
        section: cls.section || cls.Section || 'Section A',
        description: cls.description || cls.Description || '',
        room: cls.room || cls.Room || 'TBA',
        schedule: cls.schedule || cls.Schedule || 'TBA',
        color: cls.color || cls.Color || 'blue',
        enrolledStudents: 0,
        createdAt: new Date().toISOString()
      }))

      localStorage.setItem('mock:classes', JSON.stringify([...existingClasses, ...newClasses]))

      // Log the action
      auditStore.logDataImport('classes', newClasses.length, 'success')
      addOperationToHistory('Class Import', 'import', 'Completed')

      showToast(`Successfully imported ${newClasses.length} classes!`)
    } catch (err) {
      error.value = err.message || 'Failed to import classes'
      auditStore.logDataImport('classes', 0, 'failed')
      addOperationToHistory('Class Import', 'import', 'Failed')
    } finally {
      loading.value = false
    }
  }

  input.click()
}

const openAssignmentImport = async () => {
  const input = createFileInput()
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    loading.value = true
    error.value = null

    try {
      const content = await readFileAsText(file)
      const assignments = importFromCSV(content)

      // Validate required fields
      const requiredFields = ['title', 'class', 'dueDate']
      for (const assignment of assignments) {
        for (const field of requiredFields) {
          if (!assignment[field] && !assignment[field.charAt(0).toUpperCase() + field.slice(1)]) {
            throw new Error(`Missing required field: ${field}`)
          }
        }
      }

      // Get existing assignments
      const existingAssignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
      
      // Add new assignments
      const newAssignments = assignments.map(asgn => ({
        id: Date.now() + Math.random(),
        title: asgn.title || asgn.Title,
        description: asgn.description || asgn.Description || '',
        courseId: asgn.class || asgn.Class,
        dueDate: asgn.dueDate || asgn.DueDate || asgn['Due Date'],
        points: parseInt(asgn.points || asgn.Points || 100),
        type: asgn.type || asgn.Type || 'assignment',
        submissionStatus: 'pending',
        createdAt: new Date().toISOString()
      }))

      localStorage.setItem('mock:assignments', JSON.stringify([...existingAssignments, ...newAssignments]))

      // Log the action
      auditStore.logDataImport('assignments', newAssignments.length, 'success')
      addOperationToHistory('Assignment Import', 'import', 'Completed')

      showToast(`Successfully imported ${newAssignments.length} assignments!`)
    } catch (err) {
      error.value = err.message || 'Failed to import assignments'
      auditStore.logDataImport('assignments', 0, 'failed')
      addOperationToHistory('Assignment Import', 'import', 'Failed')
    } finally {
      loading.value = false
    }
  }

  input.click()
}

const openGradeImport = async () => {
  const input = createFileInput()
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    loading.value = true
    error.value = null

    try {
      const content = await readFileAsText(file)
      const grades = importFromCSV(content)

      // Validate required fields
      const requiredFields = ['student', 'assignment', 'grade']
      for (const gradeData of grades) {
        for (const field of requiredFields) {
          if (!gradeData[field] && !gradeData[field.charAt(0).toUpperCase() + field.slice(1)]) {
            throw new Error(`Missing required field: ${field}`)
          }
        }
      }

      // Get existing assignments and update grades
      const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
      
      let updatedCount = 0
      for (const gradeData of grades) {
        const assignmentId = gradeData.assignment || gradeData.Assignment
        const studentEmail = gradeData.student || gradeData.Student
        const gradeValue = parseFloat(gradeData.grade || gradeData.Grade)

        // Find and update assignment grade
        const assignment = assignments.find(a => a.id == assignmentId || a.title === assignmentId)
        if (assignment) {
          assignment.grade = gradeValue
          assignment.submissionStatus = 'graded'
          updatedCount++
        }
      }

      localStorage.setItem('mock:assignments', JSON.stringify(assignments))

      // Log the action
      auditStore.logDataImport('grades', updatedCount, 'success')
      addOperationToHistory('Grade Import', 'import', 'Completed')

      showToast(`Successfully imported ${updatedCount} grades!`)
    } catch (err) {
      error.value = err.message || 'Failed to import grades'
      auditStore.logDataImport('grades', 0, 'failed')
      addOperationToHistory('Grade Import', 'import', 'Failed')
    } finally {
      loading.value = false
    }
  }

  input.click()
}

const exportUserData = () => {
  try {
    const users = JSON.parse(localStorage.getItem('mock:users') || '[]')
    
    if (users.length === 0) {
      showToast('No users to export')
      return
    }

    const exportData = users.map(user => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      School: user.school || 'Main Campus',
      Status: user.status || 'active',
      'Created At': user.createdAt || ''
    }))

    exportToCSV(exportData, 'users_export.csv')
    auditStore.logDataExport('users', users.length)
    addOperationToHistory('User Export', 'export', 'Completed')
    showToast(`Successfully exported ${users.length} users!`)
  } catch (err) {
    error.value = 'Failed to export users'
    addOperationToHistory('User Export', 'export', 'Failed')
  }
}

const exportClassData = () => {
  try {
    const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
    
    if (classes.length === 0) {
      showToast('No classes to export')
      return
    }

    const exportData = classes.map(cls => ({
      Title: cls.title || cls.name,
      Subject: cls.subject,
      Teacher: cls.teacherName,
      Section: cls.section || '',
      Room: cls.room || '',
      Schedule: cls.schedule || '',
      Students: cls.enrolledStudents || 0,
      'Created At': cls.createdAt || ''
    }))

    exportToCSV(exportData, 'classes_export.csv')
    auditStore.logDataExport('classes', classes.length)
    addOperationToHistory('Class Export', 'export', 'Completed')
    showToast(`Successfully exported ${classes.length} classes!`)
  } catch (err) {
    error.value = 'Failed to export classes'
    addOperationToHistory('Class Export', 'export', 'Failed')
  }
}

const exportAssignmentData = () => {
  try {
    const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
    
    if (assignments.length === 0) {
      showToast('No assignments to export')
      return
    }

    const exportData = assignments.map(asgn => ({
      Title: asgn.title,
      Class: asgn.courseId,
      'Due Date': asgn.dueDate,
      Points: asgn.points || 100,
      Type: asgn.type || 'assignment',
      Status: asgn.submissionStatus || 'pending',
      'Created At': asgn.createdAt || ''
    }))

    exportToCSV(exportData, 'assignments_export.csv')
    auditStore.logDataExport('assignments', assignments.length)
    addOperationToHistory('Assignment Export', 'export', 'Completed')
    showToast(`Successfully exported ${assignments.length} assignments!`)
  } catch (err) {
    error.value = 'Failed to export assignments'
    addOperationToHistory('Assignment Export', 'export', 'Failed')
  }
}

const exportGradeData = () => {
  try {
    const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
    const gradedAssignments = assignments.filter(a => a.grade !== undefined)
    
    if (gradedAssignments.length === 0) {
      showToast('No grades to export')
      return
    }

    const exportData = gradedAssignments.map(asgn => ({
      Assignment: asgn.title,
      Class: asgn.courseId,
      Student: 'Current User', // In real app, this would be the student email
      Grade: asgn.grade,
      'Max Points': asgn.points || 100,
      Status: asgn.submissionStatus,
      'Graded At': asgn.gradedAt || new Date().toISOString()
    }))

    exportToCSV(exportData, 'grades_export.csv')
    auditStore.logDataExport('grades', gradedAssignments.length)
    addOperationToHistory('Grade Export', 'export', 'Completed')
    showToast(`Successfully exported ${gradedAssignments.length} grades!`)
  } catch (err) {
    error.value = 'Failed to export grades'
    addOperationToHistory('Grade Export', 'export', 'Failed')
  }
}

// Template Manager Functions
const openTemplateManager = () => {
  showTemplateManager.value = true
}

const closeTemplateManager = () => {
  showTemplateManager.value = false
}

const downloadTemplate = (template) => {
  const headers = template.fields
  const sampleData = getSampleData(template.type)
  
  const csvContent = [headers.join(','), ...sampleData.map(row => 
    headers.map(h => row[h] || '').join(',')
  )].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${template.id}_template.csv`
  a.click()
  window.URL.revokeObjectURL(url)
  
  showToast(`Downloaded ${template.name}`)
}

const getSampleData = (type) => {
  const samples = {
    users: [
      { name: 'John Doe', email: 'john@example.com', role: 'student', school: 'Main Campus' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'teacher', school: 'Main Campus' }
    ],
    classes: [
      { title: 'Mathematics 101', subject: 'Mathematics', teacher: 'John Teacher', section: 'Section A', room: 'Room 101' },
      { title: 'Physics 201', subject: 'Physics', teacher: 'Jane Professor', section: 'Section B', room: 'Room 202' }
    ],
    assignments: [
      { title: 'Homework 1', class: 'Mathematics 101', dueDate: '2024-12-31', points: '100', type: 'assignment' },
      { title: 'Quiz 1', class: 'Physics 201', dueDate: '2024-12-25', points: '50', type: 'quiz' }
    ],
    grades: [
      { student: 'john@example.com', assignment: 'Homework 1', grade: '95' },
      { student: 'jane@example.com', assignment: 'Quiz 1', grade: '88' }
    ]
  }
  return samples[type] || []
}

// Data Validator Functions
const openDataValidator = () => {
  showDataValidator.value = true
  validationResults.value = null
}

const closeDataValidator = () => {
  showDataValidator.value = false
  validationFile.value = null
  validationResults.value = null
}

const selectFileForValidation = () => {
  const input = createFileInput()
  input.onchange = async (e) => {
    validationFile.value = e.target.files[0]
    if (validationFile.value) {
      await validateFile()
    }
  }
  input.click()
}

const validateFile = async () => {
  if (!validationFile.value) return
  
  loading.value = true
  try {
    const content = await readFileAsText(validationFile.value)
    const data = importFromCSV(content)
    
    const errors = []
    const warnings = []
    
    // Check for common issues
    if (data.length === 0) {
      errors.push('File is empty or has no data rows')
    }
    
    // Check for duplicate emails if this looks like a user file
    if (data[0] && (data[0].email || data[0].Email)) {
      const emails = data.map(row => row.email || row.Email).filter(Boolean)
      const duplicates = emails.filter((email, index) => emails.indexOf(email) !== index)
      if (duplicates.length > 0) {
        warnings.push(`Found ${duplicates.length} duplicate email(s): ${duplicates.slice(0, 3).join(', ')}`)
      }
    }
    
    // Check for empty required fields
    data.forEach((row, index) => {
      const emptyFields = Object.entries(row).filter(([key, value]) => !value).map(([key]) => key)
      if (emptyFields.length > 0) {
        warnings.push(`Row ${index + 2}: Empty fields - ${emptyFields.join(', ')}`)
      }
    })
    
    validationResults.value = {
      totalRows: data.length,
      errors,
      warnings,
      status: errors.length === 0 ? 'valid' : 'invalid'
    }
    
    showToast(errors.length === 0 ? 'Validation passed!' : 'Validation found errors')
  } catch (err) {
    validationResults.value = {
      totalRows: 0,
      errors: [err.message],
      warnings: [],
      status: 'error'
    }
  } finally {
    loading.value = false
  }
}

// Batch Processor Functions
const openBatchProcessor = () => {
  showBatchProcessor.value = true
  loadBatchJobs()
}

const closeBatchProcessor = () => {
  showBatchProcessor.value = false
}

const loadBatchJobs = () => {
  batchJobs.value = JSON.parse(localStorage.getItem('mock:batchJobs') || '[]')
}

const createBatchJob = (type) => {
  const job = {
    id: Date.now(),
    type,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Processing`,
    status: 'pending',
    progress: 0,
    createdAt: new Date().toISOString()
  }
  
  batchJobs.value.unshift(job)
  localStorage.setItem('mock:batchJobs', JSON.stringify(batchJobs.value))
  
  // Simulate processing
  simulateJobProcessing(job.id)
  showToast(`Batch job created: ${job.name}`)
}

const simulateJobProcessing = (jobId) => {
  const interval = setInterval(() => {
    const job = batchJobs.value.find(j => j.id === jobId)
    if (!job) {
      clearInterval(interval)
      return
    }
    
    job.progress += Math.random() * 20
    if (job.progress >= 100) {
      job.progress = 100
      job.status = 'completed'
      clearInterval(interval)
      localStorage.setItem('mock:batchJobs', JSON.stringify(batchJobs.value))
      showToast(`Batch job completed: ${job.name}`)
    }
    
    localStorage.setItem('mock:batchJobs', JSON.stringify(batchJobs.value))
  }, 1000)
}

const cancelBatchJob = (jobId) => {
  const job = batchJobs.value.find(j => j.id === jobId)
  if (job) {
    job.status = 'cancelled'
    localStorage.setItem('mock:batchJobs', JSON.stringify(batchJobs.value))
    showToast('Batch job cancelled')
  }
}

const clearCompletedJobs = () => {
  batchJobs.value = batchJobs.value.filter(j => j.status !== 'completed')
  localStorage.setItem('mock:batchJobs', JSON.stringify(batchJobs.value))
  showToast('Completed jobs cleared')
}

const clearHistory = () => {
  if (confirm('Are you sure you want to clear the operation history?')) {
    recentOperations.value = []
    localStorage.setItem('mock:bulkOperations', JSON.stringify([]))
    showToast('Operation history cleared')
  }
}

// Helper functions
const getOperationColor = (type) => {
  const colors = {
    import: 'bg-blue-500',
    export: 'bg-green-500',
    process: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getOperationIcon = (type) => {
  const icons = {
    import: 'upload',
    export: 'download',
    process: 'play_arrow'
  }
  return icons[type] || 'help'
}

const getStatusClass = (status) => {
  const classes = {
    Completed: 'bg-green-100 text-green-800',
    Processing: 'bg-blue-100 text-blue-800',
    Failed: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}


const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  } else {
    alert(message)
  }
}

onMounted(() => {
  // Initialize any required data
})
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
