<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Manage Classes</h1>
      <p class="text-classroom-gray-600">Manage all classes across the institution</p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <button 
        @click="openCreateClass"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">add</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Create Class</h3>
            <p class="text-sm text-classroom-gray-500">Start a new class</p>
          </div>
        </div>
      </button>

      <button 
        @click="openBulkImport"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-secondary">file_upload</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Bulk Import</h3>
            <p class="text-sm text-classroom-gray-500">Import multiple classes</p>
          </div>
        </div>
      </button>

      <button 
        @click="exportClasses"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">file_download</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Export All</h3>
            <p class="text-sm text-classroom-gray-500">Export class data</p>
          </div>
        </div>
      </button>

      <button 
        @click="openTemplates"
        class="p-4 bg-white rounded-classroom classroom-shadow border border-classroom-gray-200 hover:border-classroom-primary transition-colors text-left group focus-classroom"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">description</span>
          </div>
          <div>
            <h3 class="font-medium text-classroom-gray-900">Templates</h3>
            <p class="text-sm text-classroom-gray-500">Use class templates</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-classroom classroom-shadow p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <div class="relative">
            <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-classroom-gray-400">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search classes..."
              class="w-full pl-10 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
            >
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="draft">Draft</option>
          </select>

          <select
            v-model="filterSubject"
            class="px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
          >
            <option value="">All Subjects</option>
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

    <!-- Bulk Actions -->
    <div v-if="selectedClasses.length > 0" class="bg-classroom-primary bg-opacity-10 rounded-classroom p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-classroom-primary font-medium">
            {{ selectedClasses.length }} class{{ selectedClasses.length !== 1 ? 'es' : '' }} selected
          </span>
          <div class="flex items-center space-x-2">
            <button 
              @click="bulkArchive"
              class="btn-outline text-sm"
            >
              Archive
            </button>
            <button 
              @click="bulkDelete"
              class="btn-outline text-sm text-red-600 hover:border-red-600"
            >
              Delete
            </button>
            <button 
              @click="bulkExport"
              class="btn-outline text-sm"
            >
              Export
            </button>
          </div>
        </div>
        <button 
          @click="clearSelection"
          class="text-classroom-gray-500 hover:text-classroom-gray-700"
        >
          Clear selection
        </button>
      </div>
    </div>

    <!-- Classes Table -->
    <div class="bg-white rounded-classroom classroom-shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-classroom-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900 w-8">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary"
                >
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Class</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Teacher</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Students</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Assignments</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Created</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-classroom-gray-200">
            <tr 
              v-for="classItem in filteredClasses"
              :key="classItem.id"
              class="hover:bg-classroom-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <input
                  type="checkbox"
                  :checked="selectedClasses.includes(classItem.id)"
                  @change="toggleClassSelection(classItem.id)"
                  class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary"
                >
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-10 h-10 rounded-classroom flex items-center justify-center text-white font-medium"
                    :style="{ backgroundColor: classItem.color }"
                  >
                    {{ classItem.name.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="font-medium text-classroom-gray-900">{{ classItem.name }}</h3>
                    <p class="text-sm text-classroom-gray-500">{{ classItem.section }}</p>
                    <p class="text-xs text-classroom-gray-400">{{ classItem.code }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-classroom-gray-900">
                <div class="flex items-center space-x-2">
                  <img 
                    v-if="classItem.teacher?.avatar"
                    :src="classItem.teacher.avatar"
                    :alt="classItem.teacher.name"
                    class="w-6 h-6 rounded-full"
                  >
                  <span>{{ classItem.teacher?.name || 'No teacher' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-classroom-gray-900">
                {{ classItem.studentsCount }}
              </td>
              <td class="px-4 py-3 text-sm text-classroom-gray-900">
                {{ classItem.assignmentsCount }}
              </td>
              <td class="px-4 py-3">
                <span class="chip text-xs" :class="getStatusClass(classItem.status)">
                  {{ getStatusLabel(classItem.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-classroom-gray-500">
                {{ formatDate(classItem.createdAt) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="viewClass(classItem)"
                    class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors"
                    title="View Class"
                  >
                    <span class="material-icons text-classroom-gray-600 text-lg">visibility</span>
                  </button>
                  <button 
                    @click="editClass(classItem)"
                    class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors"
                    title="Edit Class"
                  >
                    <span class="material-icons text-classroom-gray-600 text-lg">edit</span>
                  </button>
                  <div class="relative">
                    <button 
                      @click="toggleClassOptions(classItem.id)"
                      class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors"
                      title="More Options"
                    >
                      <span class="material-icons text-classroom-gray-600 text-lg">more_vert</span>
                    </button>

                    <!-- Options Dropdown -->
                    <div 
                      v-if="activeClassId === classItem.id"
                      class="absolute right-0 top-full mt-1 bg-white rounded-classroom classroom-shadow-lg border border-classroom-gray-200 py-1 z-10 w-48"
                    >
                      <button 
                        @click="duplicateClass(classItem)"
                        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
                      >
                        <span class="material-icons text-classroom-gray-600 text-lg">content_copy</span>
                        <span>Duplicate</span>
                      </button>
                      <button 
                        @click="archiveClass(classItem)"
                        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
                      >
                        <span class="material-icons text-classroom-gray-600 text-lg">archive</span>
                        <span>Archive</span>
                      </button>
                      <button 
                        @click="exportClass(classItem)"
                        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
                      >
                        <span class="material-icons text-classroom-gray-600 text-lg">download</span>
                        <span>Export</span>
                      </button>
                      <div class="border-t border-classroom-gray-100 my-1"></div>
                      <button 
                        @click="deleteClass(classItem)"
                        class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2 text-red-600"
                      >
                        <span class="material-icons text-lg">delete</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredClasses.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-classroom-gray-400 text-4xl">school</span>
        </div>
        <h3 class="text-xl font-medium text-classroom-gray-900 mb-2">No classes found</h3>
        <p class="text-classroom-gray-600 mb-6">
          {{ searchQuery || filterStatus || filterSubject || filterGrade ? 'Try adjusting your search filters' : 'Get started by creating your first class' }}
        </p>
        <button @click="openCreateClass" class="btn-primary">
          Create Class
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="filteredClasses.length > 0" class="px-6 py-4 border-t border-classroom-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-classroom-gray-500">
            Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredClasses.length) }} to 
            {{ Math.min(currentPage * itemsPerPage, filteredClasses.length) }} of 
            {{ filteredClasses.length }} classes
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="material-icons text-classroom-gray-600">chevron_left</span>
            </button>
            <span class="text-sm text-classroom-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="material-icons text-classroom-gray-600">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Total Classes</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ classes.length }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">school</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Active Classes</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ activeClassesCount }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-secondary">check_circle</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Total Students</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ totalStudents }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-support">people</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-classroom classroom-shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-classroom-gray-500">Avg. Class Size</p>
            <p class="text-2xl font-medium text-classroom-gray-900">{{ averageClassSize }}</p>
          </div>
          <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-classroom-primary">groups</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Class Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Create New Class</h2>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Class Name *</label>
              <input
                v-model="newClass.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Algebra 1"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Section *</label>
              <input
                v-model="newClass.section"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mathematics Department"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                v-model="newClass.subject"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500"
              >
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="language">Language Arts</option>
                <option value="social">Social Studies</option>
                <option value="arts">Arts</option>
                <option value="technology">Technology</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <select
                v-model="newClass.gradeLevel"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500"
              >
                <option value="elementary">Elementary</option>
                <option value="middle">Middle School</option>
                <option value="high">High School</option>
                <option value="college">College</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Teacher Name</label>
              <input
                v-model="newClass.teacher"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Class Color</label>
              <input
                v-model="newClass.color"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-classroom cursor-pointer"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showCreateModal = false"
              class="px-6 py-2 border border-gray-300 rounded-classroom hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="createClass"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-classroom"
            >
              Create Class
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Import Modal -->
    <div v-if="showBulkImportModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Bulk Import Classes</h2>
          <button @click="showBulkImportModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-classroom p-4">
            <div class="flex items-start space-x-3">
              <span class="material-icons text-blue-600">info</span>
              <div class="flex-1">
                <h3 class="font-medium text-blue-900 mb-1">Import Instructions</h3>
                <p class="text-sm text-blue-800">Upload a CSV file with the following columns:</p>
                <p class="text-sm text-blue-800 mt-1">Class Name, Section, Color, Teacher Name, Subject, Grade Level</p>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button
              @click="downloadTemplate"
              class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-classroom hover:bg-gray-50"
            >
              <span class="material-icons text-sm">download</span>
              <span>Download Template</span>
            </button>
          </div>

          <div class="border-2 border-dashed border-gray-300 rounded-classroom p-8 text-center">
            <input
              type="file"
              accept=".csv"
              @change="handleFileUpload"
              class="hidden"
              id="file-upload"
            />
            <label for="file-upload" class="cursor-pointer">
              <span class="material-icons text-5xl text-gray-400 mb-4">cloud_upload</span>
              <p class="text-gray-700 font-medium mb-1">
                {{ importFile ? importFile.name : 'Click to upload CSV file' }}
              </p>
              <p class="text-sm text-gray-500">or drag and drop</p>
            </label>
          </div>

          <div v-if="importing" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span>Importing classes...</span>
              <span>{{ importProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: importProgress + '%' }"
              ></div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showBulkImportModal = false"
              class="px-6 py-2 border border-gray-300 rounded-classroom hover:bg-gray-50"
              :disabled="importing"
            >
              Cancel
            </button>
            <button
              @click="processImport"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-classroom disabled:bg-gray-400"
              :disabled="!importFile || importing"
            >
              {{ importing ? 'Importing...' : 'Import Classes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates Modal -->
    <div v-if="showTemplatesModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Class Templates</h2>
          <button @click="showTemplatesModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="template in templates"
            :key="template.id"
            class="border-2 border-gray-200 rounded-classroom p-6 hover:border-blue-500 transition-colors cursor-pointer"
            @click="useTemplate(template)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="w-12 h-12 rounded-classroom flex items-center justify-center"
                :class="{
                  'bg-blue-100': template.subject === 'math',
                  'bg-green-100': template.subject === 'science',
                  'bg-yellow-100': template.subject === 'language',
                  'bg-purple-100': template.subject === 'arts'
                }"
              >
                <span class="material-icons"
                  :class="{
                    'text-blue-600': template.subject === 'math',
                    'text-green-600': template.subject === 'science',
                    'text-yellow-600': template.subject === 'language',
                    'text-purple-600': template.subject === 'arts'
                  }"
                >
                  {{ template.subject === 'math' ? 'calculate' : template.subject === 'science' ? 'science' : template.subject === 'language' ? 'menu_book' : 'palette' }}
                </span>
              </div>
              <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Template</span>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">{{ template.name }}</h3>
            <p class="text-sm text-gray-600">{{ template.description }}</p>
            <button class="mt-4 w-full py-2 border border-blue-600 text-blue-600 rounded-classroom hover:bg-blue-50 transition-colors">
              Use Template
            </button>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="showTemplatesModal = false"
            class="px-6 py-2 border border-gray-300 rounded-classroom hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { exportToCSV } from '@/utils/exportHelpers'
import { useAuditLogStore } from '@/stores/auditLog'

const router = useRouter()
const auditStore = useAuditLogStore()

// Reactive data
const searchQuery = ref('')
const filterStatus = ref('')
const filterSubject = ref('')
const filterGrade = ref('')
const selectedClasses = ref([])
const activeClassId = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modal states
const showCreateModal = ref(false)
const showBulkImportModal = ref(false)
const showTemplatesModal = ref(false)

// Form data
const newClass = ref({
  name: '',
  section: '',
  subject: 'math',
  gradeLevel: 'high',
  teacher: '',
  color: '#4f46e5'
})

const importFile = ref(null)
const importProgress = ref(0)
const importing = ref(false)

// Mock data for classes
const classes = ref([
  {
    id: '1',
    name: 'Algebra 1 - Period 3',
    section: 'Mathematics Department',
    code: 'ABCD123',
    color: '#4f46e5',
    status: 'active',
    teacher: { name: 'Dr. Sarah Johnson', avatar: '/avatars/teacher1.jpg' },
    studentsCount: 25,
    assignmentsCount: 12,
    createdAt: new Date('2024-01-15'),
    subject: 'math',
    gradeLevel: 'high'
  },
  {
    id: '2',
    name: 'Biology - Cell Structure',
    section: 'Science Department',
    code: 'EFGH456',
    color: '#10b981',
    status: 'active',
    teacher: { name: 'Mr. David Wilson', avatar: '/avatars/teacher2.jpg' },
    studentsCount: 22,
    assignmentsCount: 8,
    createdAt: new Date('2024-02-10'),
    subject: 'science',
    gradeLevel: 'high'
  },
  {
    id: '3',
    name: 'Creative Writing',
    section: 'Language Arts',
    code: 'IJKL789',
    color: '#f59e0b',
    status: 'active',
    teacher: { name: 'Ms. Emily Chen', avatar: '/avatars/teacher3.jpg' },
    studentsCount: 18,
    assignmentsCount: 6,
    createdAt: new Date('2024-01-20'),
    subject: 'language',
    gradeLevel: 'middle'
  },
  {
    id: '4',
    name: 'World History',
    section: 'Social Studies',
    code: 'MNOP012',
    color: '#ef4444',
    status: 'archived',
    teacher: { name: 'Dr. Robert Brown', avatar: '/avatars/teacher4.jpg' },
    studentsCount: 30,
    assignmentsCount: 15,
    createdAt: new Date('2023-12-05'),
    subject: 'social',
    gradeLevel: 'high'
  },
  {
    id: '5',
    name: 'Digital Art Fundamentals',
    section: 'Arts Department',
    code: 'QRST345',
    color: '#8b5cf6',
    status: 'active',
    teacher: { name: 'Ms. Lisa Garcia', avatar: '/avatars/teacher5.jpg' },
    studentsCount: 16,
    assignmentsCount: 10,
    createdAt: new Date('2024-03-01'),
    subject: 'arts',
    gradeLevel: 'high'
  },
  {
    id: '6',
    name: 'Programming Basics',
    section: 'Technology',
    code: 'UVWX678',
    color: '#06b6d4',
    status: 'draft',
    teacher: { name: 'Mr. Kevin Lee', avatar: '/avatars/teacher6.jpg' },
    studentsCount: 0,
    assignmentsCount: 0,
    createdAt: new Date('2024-03-15'),
    subject: 'technology',
    gradeLevel: 'college'
  },
  {
    id: '7',
    name: 'Elementary Math',
    section: 'Grade 3',
    code: 'YZAB901',
    color: '#84cc16',
    status: 'active',
    teacher: { name: 'Mrs. Amanda White', avatar: '/avatars/teacher7.jpg' },
    studentsCount: 20,
    assignmentsCount: 5,
    createdAt: new Date('2024-02-20'),
    subject: 'math',
    gradeLevel: 'elementary'
  },
  {
    id: '8',
    name: 'Chemistry Lab',
    section: 'Science Department',
    code: 'CDEF234',
    color: '#f97316',
    status: 'active',
    teacher: { name: 'Dr. Michael Taylor', avatar: '/avatars/teacher8.jpg' },
    studentsCount: 24,
    assignmentsCount: 9,
    createdAt: new Date('2024-01-25'),
    subject: 'science',
    gradeLevel: 'high'
  }
])

// Computed properties
const filteredClasses = computed(() => {
  let filtered = classes.value.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         classItem.section.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         classItem.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || classItem.status === filterStatus.value
    const matchesSubject = !filterSubject.value || classItem.subject === filterSubject.value
    const matchesGrade = !filterGrade.value || classItem.gradeLevel === filterGrade.value
    
    return matchesSearch && matchesStatus && matchesSubject && matchesGrade
  })

  // Apply pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filtered.slice(startIndex, endIndex)
})

const allSelected = computed(() => {
  return filteredClasses.value.length > 0 && 
         filteredClasses.value.every(classItem => selectedClasses.value.includes(classItem.id))
})

const totalPages = computed(() => {
  return Math.ceil(classes.value.length / itemsPerPage.value)
})

const activeClassesCount = computed(() => {
  return classes.value.filter(classItem => classItem.status === 'active').length
})

const totalStudents = computed(() => {
  return classes.value.reduce((total, classItem) => total + classItem.studentsCount, 0)
})

const averageClassSize = computed(() => {
  const activeClasses = classes.value.filter(classItem => classItem.status === 'active')
  if (activeClasses.length === 0) return 0
  return Math.round(totalStudents.value / activeClasses.length)
})

// Methods
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const toggleClassSelection = (classId) => {
  const index = selectedClasses.value.indexOf(classId)
  if (index > -1) {
    selectedClasses.value.splice(index, 1)
  } else {
    selectedClasses.value.push(classId)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedClasses.value = []
  } else {
    selectedClasses.value = filteredClasses.value.map(classItem => classItem.id)
  }
}

const clearSelection = () => {
  selectedClasses.value = []
}

const toggleClassOptions = (classId) => {
  activeClassId.value = activeClassId.value === classId ? null : classId
}

const openCreateClass = () => {
  showCreateModal.value = true
  newClass.value = {
    name: '',
    section: '',
    subject: 'math',
    gradeLevel: 'high',
    teacher: '',
    color: '#4f46e5'
  }
}

const createClass = () => {
  if (!newClass.value.name || !newClass.value.section) {
    showToast('Please fill in all required fields')
    return
  }

  const classCode = generateClassCode()
  const classData = {
    id: Date.now().toString(),
    name: newClass.value.name,
    section: newClass.value.section,
    code: classCode,
    color: newClass.value.color,
    status: 'active',
    teacher: { name: newClass.value.teacher || 'No teacher assigned' },
    studentsCount: 0,
    assignmentsCount: 0,
    createdAt: new Date(),
    subject: newClass.value.subject,
    gradeLevel: newClass.value.gradeLevel
  }

  classes.value.unshift(classData)
  auditStore.logClassCreated(classData.name)
  showCreateModal.value = false
  showToast('Class created successfully!')
}

const generateClassCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

const openBulkImport = () => {
  showBulkImportModal.value = true
  importFile.value = null
  importProgress.value = 0
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
    showToast('Please upload a CSV file')
    return
  }

  importFile.value = file
}

const processImport = () => {
  if (!importFile.value) {
    showToast('Please select a file to import')
    return
  }

  importing.value = true
  importProgress.value = 0

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const csv = e.target.result
      const lines = csv.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())

      let imported = 0
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue

        const values = lines[i].split(',').map(v => v.trim())
        const classData = {
          id: Date.now().toString() + i,
          name: values[0] || `Class ${i}`,
          section: values[1] || 'General',
          code: generateClassCode(),
          color: values[2] || '#4f46e5',
          status: 'active',
          teacher: { name: values[3] || 'No teacher' },
          studentsCount: 0,
          assignmentsCount: 0,
          createdAt: new Date(),
          subject: values[4] || 'general',
          gradeLevel: values[5] || 'high'
        }

        classes.value.unshift(classData)
        imported++
        importProgress.value = Math.round((i / lines.length) * 100)
      }

      setTimeout(() => {
        importing.value = false
        showBulkImportModal.value = false
        auditStore.logBulkImport('classes', imported)
        showToast(`Successfully imported ${imported} classes`)
      }, 500)
    } catch (error) {
      importing.value = false
      showToast('Error importing file. Please check the format.')
      console.error('Import error:', error)
    }
  }

  reader.readAsText(importFile.value)
}

const downloadTemplate = () => {
  const template = [
    ['Class Name', 'Section', 'Color', 'Teacher Name', 'Subject', 'Grade Level'],
    ['Algebra 1', 'Mathematics', '#4f46e5', 'Dr. Smith', 'math', 'high'],
    ['Biology 101', 'Science', '#10b981', 'Ms. Johnson', 'science', 'high']
  ]

  exportToCSV(template.map(row => ({
    'Class Name': row[0],
    'Section': row[1],
    'Color': row[2],
    'Teacher Name': row[3],
    'Subject': row[4],
    'Grade Level': row[5]
  })), 'class_import_template.csv')
  
  showToast('Template downloaded successfully')
}

const exportClasses = () => {
  const exportData = classes.value.map(c => ({
    'Class Name': c.name,
    'Section': c.section,
    'Code': c.code,
    'Teacher': c.teacher?.name || '',
    'Students': c.studentsCount,
    'Assignments': c.assignmentsCount,
    'Status': c.status,
    'Subject': c.subject,
    'Grade Level': c.gradeLevel,
    'Created': formatDate(c.createdAt)
  }))

  exportToCSV(exportData, 'all_classes.csv')
  auditStore.logDataExported('classes', classes.value.length)
  showToast(`Exported ${classes.value.length} classes successfully`)
}

const openTemplates = () => {
  showTemplatesModal.value = true
}

const templates = [
  { id: 1, name: 'Math Class Template', subject: 'math', description: 'Standard mathematics class setup' },
  { id: 2, name: 'Science Lab Template', subject: 'science', description: 'Laboratory science class' },
  { id: 3, name: 'Language Arts Template', subject: 'language', description: 'Reading and writing focused' },
  { id: 4, name: 'Arts & Creative Template', subject: 'arts', description: 'Creative arts class' }
]

const useTemplate = (template) => {
  newClass.value = {
    name: template.name.replace(' Template', ''),
    section: template.description,
    subject: template.subject,
    gradeLevel: 'high',
    teacher: '',
    color: ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6'][template.id - 1]
  }
  showTemplatesModal.value = false
  showCreateModal.value = true
  showToast(`Using template: ${template.name}`)
}

const viewClass = (classItem) => {
  router.push(`/admin/classes/${classItem.id}`)
}

const editClass = (classItem) => {
  showToast(`Editing class: ${classItem.name}`)
  activeClassId.value = null
}

const duplicateClass = (classItem) => {
  showToast(`Duplicating class: ${classItem.name}`)
  activeClassId.value = null
}

const archiveClass = (classItem) => {
  if (confirm(`Are you sure you want to archive the class "${classItem.name}"?`)) {
    classItem.status = 'archived'
    showToast('Class archived successfully')
  }
  activeClassId.value = null
}

const exportClass = (classItem) => {
  showToast(`Exporting class: ${classItem.name}`)
  activeClassId.value = null
}

const deleteClass = (classItem) => {
  if (confirm(`Are you sure you want to delete the class "${classItem.name}"? This action cannot be undone.`)) {
    classes.value = classes.value.filter(c => c.id !== classItem.id)
    showToast('Class deleted successfully')
  }
  activeClassId.value = null
}

const bulkArchive = () => {
  if (confirm(`Are you sure you want to archive ${selectedClasses.value.length} classes?`)) {
    classes.value.forEach(classItem => {
      if (selectedClasses.value.includes(classItem.id)) {
        classItem.status = 'archived'
      }
    })
    showToast('Classes archived successfully')
    clearSelection()
  }
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedClasses.value.length} classes? This action cannot be undone.`)) {
    classes.value = classes.value.filter(classItem => !selectedClasses.value.includes(classItem.id))
    showToast('Classes deleted successfully')
    clearSelection()
  }
}

const bulkExport = () => {
  showToast(`Exporting ${selectedClasses.value.length} classes...`)
  clearSelection()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative') && !event.target.closest('button[title="More Options"]')) {
    activeClassId.value = null
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
