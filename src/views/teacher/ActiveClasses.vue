<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Classes
          </h1>
          <p class="text-gray-600 mt-2">Manage your active classes, track student engagement, and monitor class progress</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap justify-end">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search classes..."
              class="bg-white border border-gray-300 rounded-classroom pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-icons text-gray-400 text-sm">search</span>
            </div>
          </div>
          <select v-model="subjectFilter" class="bg-white border border-gray-300 rounded-classroom px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Subjects</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
            <option>History</option>
            <option>Art</option>
            <option>Music</option>
            <option>Physical Education</option>
          </select>
          <select v-model="levelFilter" class="bg-white border border-gray-300 rounded-classroom px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Levels</option>
            <option>Elementary</option>
            <option>Middle School</option>
            <option>High School</option>
            <option>College</option>
          </select>
          <select v-model="sortKey" class="bg-white border border-gray-300 rounded-classroom px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="createdAt">Newest</option>
            <option value="title">Title</option>
            <option value="subject">Subject</option>
          </select>
          <select v-model="sortDir" class="bg-white border border-gray-300 rounded-classroom px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          <button 
            @click="showCreateModal = true"
            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2"
          >
            <span class="material-icons text-sm">add</span>
            <span>Create Class</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Class Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Active Classes</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ classes.length }}</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">trending_up</span>
              +1 this week
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-xl">school</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Students</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalStudents }}</p>
            <p class="text-blue-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">group</span>
              94% attendance rate
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-xl">people</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Assignments</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalAssignments }}</p>
            <p class="text-orange-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">assignment</span>
              3 due this week
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-purple-600 text-xl">assignment</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Class Performance</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">87%</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">insights</span>
              +2.5% improvement
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-xl">trending_up</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Classes Grid -->
      <div class="xl:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Active Classes</h2>
                <p class="text-gray-600 mt-1">Manage and monitor your teaching classes</p>
              </div>
              <div class="flex items-center space-x-3">
                <button @click="resetFilters" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2">
                  <span class="material-icons text-sm">filter_list</span>
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="cls in visibleClasses" 
                :key="cls.id"
                class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                @click="viewClass(cls)"
              >
                <div class="p-6">
                  <!-- Class Header -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom flex items-center justify-center">
                        <span class="material-icons text-white text-lg">school</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-bold text-gray-900">{{ cls.title }}</h3>
                        <p class="text-sm text-gray-600">{{ cls.subject || 'General' }} • {{ cls.level || 'All Levels' }}</p>
                      </div>
                    </div>
                    <span :class="getClassStatus(cls).class" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getClassStatus(cls).text }}
                    </span>
                  </div>

                  <!-- Class Code -->
                  <div v-if="cls.code" class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-xs text-gray-600 mb-1">Class Code</div>
                        <div class="text-lg font-bold text-blue-600">{{ cls.code }}</div>
                      </div>
                      <button 
                        @click.stop="copyClassCode(cls.code)"
                        class="text-blue-600 hover:text-blue-700 p-2 transition-colors"
                        :title="'Copy code: ' + cls.code"
                      >
                        <span class="material-icons text-sm">content_copy</span>
                      </button>
                    </div>
                  </div>

                  <!-- Subjects Chips -->
                  <div v-if="(cls.settings && cls.settings.subjects && cls.settings.subjects.length)" class="mb-3">
                    <div class="text-xs text-gray-600 mb-1">Subjects</div>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="sub in cls.settings.subjects" :key="sub" class="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs">
                        {{ sub }}
                      </span>
                    </div>
                  </div>

                  <!-- Class Info -->
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-gray-900">{{ getClassStudentCount(cls.id) }}</div>
                      <div class="text-xs text-gray-600">Students</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-blue-600">{{ getClassAssignmentCount(cls.id) }}</div>
                      <div class="text-xs text-gray-600">Assignments</div>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="mb-4">
                    <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Class Progress</span>
                      <span>{{ getClassProgress(cls.id) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-green-500 h-2 rounded-full transition-all duration-500"
                        :style="{ width: getClassProgress(cls.id) + '%' }"
                      ></div>
                    </div>
                  </div>

                  <!-- Class Actions -->
                  <div class="flex items-start justify-between pt-4 border-t border-gray-200">
                    <div class="flex flex-wrap gap-2 max-w-[75%]">
                      <button 
                        @click.stop="startLiveNow(cls)"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-classroom text-xs font-medium transition-colors flex items-center space-x-1"
                        title="Start live class"
                      >
                        <span class="material-icons text-xs">video_call</span>
                        <span>Start</span>
                      </button>
                      <button 
                        @click.stop="viewClassDetails(cls)"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-classroom text-xs font-medium transition-colors flex items-center space-x-1"
                        title="View class"
                      >
                        <span class="material-icons text-xs">visibility</span>
                        <span>View</span>
                      </button>
                      <button 
                        @click.stop="showMaterialsUpload(cls)"
                        class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-classroom text-xs font-medium transition-colors flex items-center space-x-1"
                        title="Upload materials"
                      >
                        <span class="material-icons text-xs">upload_file</span>
                        <span>Materials</span>
                      </button>
                      <button 
                        @click.stop="openStudentsModal(cls)"
                        class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-classroom text-xs font-medium transition-colors flex items-center space-x-1"
                        title="Enroll students"
                      >
                        <span class="material-icons text-xs">group_add</span>
                        <span>Students</span>
                      </button>
                      <button 
                        @click.stop="openSubjectsModal(cls)"
                        class="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-classroom text-xs font-medium transition-colors flex items-center space-x-1"
                        title="Manage subjects"
                      >
                        <span class="material-icons text-xs">menu_book</span>
                        <span>Subjects</span>
                      </button>
                      <button 
                        @click.stop="openScheduleModal(cls)"
                        class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-classroom text-xs font-medium transition-colors flex items-center space-x-1"
                        title="Schedule session"
                      >
                        <span class="material-icons text-xs">schedule</span>
                        <span>Schedule</span>
                      </button>
                    </div>
                    <div class="flex items-center space-x-1">
                      <button 
                        @click.stop="editClass(cls)"
                        class="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                        title="Edit class"
                      >
                        <span class="material-icons text-sm">edit</span>
                      </button>
                      <button 
                        @click.stop="removeClass(cls.id)"
                        class="text-gray-400 hover:text-red-600 p-1 transition-colors"
                        title="Delete class"
                      >
                        <span class="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="visibleClasses.length === 0" class="text-center py-12">
              <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-gray-400 text-3xl">school</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No matching classes</h3>
              <p class="text-gray-500 mb-4">Try adjusting your filters or create a new class</p>
              <button 
                @click="showCreateModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors"
              >
                Create Class
              </button>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
              <p class="text-sm text-gray-600">Showing {{ startIndex + 1 }} - {{ endIndex }} of {{ filteredClasses.length }}</p>
              <div class="flex items-center gap-1">
                <button @click="prevPage" :disabled="page===1" class="px-3 py-2 border rounded-classroom disabled:opacity-40">
                  <span class="material-icons text-sm">chevron_left</span>
                </button>
                <button 
                  v-for="p in pageNumbers" :key="'p-'+p" @click="gotoPage(p)"
                  :class="['px-3 py-2 border rounded-classroom', p===page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white']"
                >{{ p }}</button>
                <button @click="nextPage" :disabled="page===totalPages" class="px-3 py-2 border rounded-classroom disabled:opacity-40">
                  <span class="material-icons text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Analytics -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button 
              @click="showCreateModal = true"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">add</span>
                <div class="text-left">
                  <div class="font-semibold">Create Class</div>
                  <div class="text-blue-100 text-xs">Start a new class</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>

            <button 
              @click="startLiveNow(visibleClasses[0])"
              :disabled="visibleClasses.length===0"
              class="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:opacity-50 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">video_call</span>
                <div class="text-left">
                  <div class="font-semibold">Start Live Class</div>
                  <div class="text-green-100 text-xs">Begin virtual teaching</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>

            <button class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">assignment</span>
                <div class="text-left">
                  <div class="font-semibold">Create Assignment</div>
                  <div class="text-orange-100 text-xs">Add new homework</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Upcoming Sessions -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Upcoming Sessions</h3>
          <div class="space-y-3">
            <div 
              v-for="s in upcomingSessions" 
              :key="s.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-green-600 text-sm">videocam</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ s.title }}</div>
                  <div class="text-xs text-gray-500">{{ s.classTitle }} • {{ formatDate(s.startTime) }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs" :class="isSessionLive(s) ? 'text-red-600 font-semibold' : 'text-gray-500'">{{ isSessionLive(s) ? 'Live now' : getTimeUntil(s.startTime) }}</div>
                <button 
                  @click="joinSession(s)"
                  class="mt-1 text-xs px-3 py-1 rounded-classroom border" :class="isSessionLive(s) ? 'border-red-600 text-red-600' : 'border-blue-600 text-blue-600'"
                >{{ isSessionLive(s) ? 'Join' : 'Details' }}</button>
              </div>
            </div>
            <div v-if="upcomingSessions.length === 0" class="text-center py-4 text-gray-500 text-sm">
              No sessions scheduled
            </div>
          </div>
        </div>

        <!-- Upcoming Classes -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Upcoming Classes</h3>
          <div class="space-y-3">
            <div 
              v-for="cls in upcomingClasses" 
              :key="cls.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors cursor-pointer"
              @click="viewClass(cls)"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-sm">schedule</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ cls.title }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(cls.startAt) }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-500">{{ getTimeUntil(cls.startAt) }}</div>
                <div class="text-xs font-semibold text-blue-600">Starts soon</div>
              </div>
            </div>
            <div v-if="upcomingClasses.length === 0" class="text-center py-4 text-gray-500 text-sm">
              No upcoming classes scheduled
            </div>
          </div>
        </div>

        <!-- Class Performance -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Class Performance</h3>
          <div class="space-y-4">
            <div 
              v-for="cls in classes" 
              :key="cls.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom flex items-center justify-center text-white font-semibold text-xs">
                  {{ cls.title.charAt(0) }}
                </div>
                <div class="text-sm font-medium text-gray-900 truncate">{{ cls.title }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ getClassAverageGrade(cls.id) }}%</div>
                <div class="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    class="bg-green-500 h-1.5 rounded-full" 
                    :style="{ width: getClassAverageGrade(cls.id) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Class Modal -->
    <div v-if="showEditModal && selectedClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">Edit Class</h3>
            <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>
        </div>

        <form @submit.prevent="updateClass" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Class Title</label>
            <input 
              v-model="selectedClass.title"
              required 
              placeholder="Enter class title"
              class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select 
                v-model="selectedClass.subject"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Select class</option>
                <option>PP1</option>
                <option>PP2</option>
                <option>Grade 1</option>
                <option>Grade 2</option>
                <option>Grade 3</option>
                <option>Grade 4</option>
                <option>Grade 5</option>
                <option>Grade 6</option>
                <option>Grade 7</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select 
                v-model="selectedClass.level"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Select level</option>
                <option value="Elementary">Elementary</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="College">College</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              v-model="selectedClass.description"
              rows="3"
              placeholder="Enter class description"
              class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input 
                v-model="selectedClass.startAt"
                required 
                type="datetime-local"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input 
                v-model="selectedClass.endAt"
                type="datetime-local"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4" v-if="selectedClass.code">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-gray-600 mb-1">Class Code</div>
                <div class="text-lg font-bold text-blue-600">{{ selectedClass.code }}</div>
              </div>
              <div class="text-xs text-gray-500">Cannot be edited</div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="showEditModal = false"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Update Class
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Materials Upload Modal -->
    <div v-if="showMaterialsModal && selectedClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Class Materials</h3>
              <p class="text-sm text-gray-600 mt-1">{{ selectedClass.title }}</p>
            </div>
            <button @click="showMaterialsModal = false" class="text-gray-400 hover:text-gray-600">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- Upload Form -->
          <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-dashed border-purple-300">
            <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="material-icons text-purple-600 mr-2">cloud_upload</span>
              Upload New Material
            </h4>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Material Title *</label>
                <input 
                  v-model="materialTitle"
                  required 
                  placeholder="e.g., Chapter 5 Notes, Practice Problems"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  v-model="materialDescription"
                  rows="2"
                  placeholder="Add optional description..."
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Select File *</label>
                <input 
                  type="file"
                  @change="handleFileSelect"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                  class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                >
                <p class="text-xs text-gray-500 mt-1">Supported: PDF, DOC, PPT, XLS, Images</p>
              </div>

              <button 
                @click="uploadMaterial"
                class="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span class="material-icons">upload</span>
                <span>Upload Material</span>
              </button>
            </div>
          </div>

          <!-- Materials List -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="material-icons text-blue-600 mr-2">folder_open</span>
              Uploaded Materials ({{ materials.length }})
            </h4>

            <div v-if="materials.length > 0" class="space-y-3">
              <div 
                v-for="material in materials" 
                :key="material.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div class="flex items-center space-x-4 flex-1">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom flex items-center justify-center flex-shrink-0">
                    <span class="material-icons text-white">description</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 truncate">{{ material.title }}</div>
                    <div class="text-sm text-gray-500 truncate">{{ material.fileName }} • {{ material.fileSize }}</div>
                    <div class="text-xs text-gray-400 mt-1">{{ formatDate(material.uploadedAt) }}</div>
                  </div>
                </div>
                <div class="flex items-center space-x-2 flex-shrink-0">
                  <button 
                    @click="deleteMaterial(material.id)"
                    class="text-red-500 hover:text-red-700 p-2 transition-colors"
                    title="Delete material"
                  >
                    <span class="material-icons text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-gray-500">
              <span class="material-icons text-5xl mb-3 opacity-30">folder_open</span>
              <p>No materials uploaded yet</p>
              <p class="text-sm mt-1">Upload your first material above</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enroll Students Modal -->
    <div v-if="showStudentsModal && selectedClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">Enroll Students - {{ selectedClass.title }}</h3>
          <button @click="showStudentsModal=false" class="text-gray-400 hover:text-gray-600"><span class="material-icons">close</span></button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Select from roster</label>
            <div class="flex items-center gap-2 mb-2">
              <input v-model="studentSearch" placeholder="Search students" class="w-full p-2 border rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <span class="text-xs text-gray-500">{{ filteredRoster.length }} found</span>
            </div>
            <div class="border rounded-classroom max-h-56 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label v-for="stu in filteredRoster" :key="stu.id" class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="selectedStudentIds" :value="stu.id" class="rounded"/>
                <span class="truncate">{{ stu.name || stu.fullName || stu.email }}</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Or paste IDs/emails</label>
            <textarea v-model="studentsInput" rows="4" class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button @click="showStudentsModal=false" class="px-4 py-2 border rounded-classroom">Cancel</button>
            <button @click="enrollStudents" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-classroom">Enroll</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Manage Subjects Modal -->
    <div v-if="showSubjectsModal && selectedClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">Manage Subjects - {{ selectedClass.title }}</h3>
          <button @click="showSubjectsModal=false" class="text-gray-400 hover:text-gray-600"><span class="material-icons">close</span></button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600">Enter subjects separated by commas (e.g., English, Math, Kiswahili)</p>
          <input v-model="subjectsInput" placeholder="English, Math, Kiswahili" class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-teal-500"/>
          <div class="flex justify-end gap-3">
            <button @click="showSubjectsModal=false" class="px-4 py-2 border rounded-classroom">Cancel</button>
            <button @click="saveSubjects" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-classroom">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Session Modal -->
    <div v-if="showScheduleModal && selectedClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">Schedule Session</h3>
            <button @click="showScheduleModal = false" class="text-gray-400 hover:text-gray-600">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>
        </div>

        <form @submit.prevent="createSession" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input v-model="sessionTitle" required placeholder="e.g., English - Grammar Basics" class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Scope</label>
              <select v-model="sessionScope" class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="WHOLE_CLASS">Whole Class</option>
                <option value="SUBJECT">Subject Only</option>
              </select>
            </div>
            <div v-if="sessionScope==='SUBJECT'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input v-model="sessionSubject" placeholder="e.g., English" class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input v-model="sessionStart" type="datetime-local" required class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input v-model="sessionEnd" type="datetime-local" class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="showScheduleModal=false" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-classroom">Create</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Class Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">Create New Class</h3>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>
        </div>

        <form @submit.prevent="createClass" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Class Title</label>
            <input 
              v-model="newClass.title"
              required 
              placeholder="Enter class title"
              class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select 
                v-model="newClass.subject"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Select class</option>
                <option>PP1</option>
                <option>PP2</option>
                <option>Grade 1</option>
                <option>Grade 2</option>
                <option>Grade 3</option>
                <option>Grade 4</option>
                <option>Grade 5</option>
                <option>Grade 6</option>
                <option>Grade 7</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select 
                v-model="newClass.level"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Select level</option>
                <option value="Elementary">Elementary</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="College">College</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              v-model="newClass.description"
              rows="3"
              placeholder="Enter class description"
              class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input 
                v-model="newClass.startAt"
                required 
                type="datetime-local"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input 
                v-model="newClass.endAt"
                type="datetime-local"
                class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="showCreateModal = false"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTeacherClassesStore } from '../../stores/teacherClasses'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUsersStore } from '../../store/users'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const store = useTeacherClassesStore()
const router = useRouter()
const usersStore = useUsersStore()

// UI state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showMaterialsModal = ref(false)
const selectedClass = ref(null)

// Filters & sorting
const searchQuery = ref('')
const subjectFilter = ref('')
const levelFilter = ref('')
const sortKey = ref('createdAt')
const sortDir = ref('desc')

// Pagination
const page = ref(1)
const perPage = ref(6)

const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || '{}')

// Initialize store
onMounted(async () => {
  store.fetchAll()
  await usersStore.loadFromStorage?.()
  // If no classes yet, hydrate from mock JSON for a better OOTB experience
  if (!store.items || store.items.length === 0) {
    await loadFromMock()
  }
  // Try to load classes from backend if authenticated (non-blocking)
  loadFromBackend()
  // Load upcoming sessions (best-effort)
  loadSessionsFromBackend()
  loadSessionsFromLocal()
})

// Materials upload
const materials = ref([])
const materialFile = ref(null)
const materialTitle = ref('')
const materialDescription = ref('')

// Students & Subjects modals
const showStudentsModal = ref(false)
const showSubjectsModal = ref(false)
const studentsInput = ref('')
const subjectsInput = ref('')
const selectedStudentIds = ref([])
const studentSearch = ref('')
const rosterStudents = computed(() => usersStore.getStudents ? usersStore.getStudents : (usersStore.users||[]).filter(u=>u.role==='student'))
const filteredRoster = computed(() => {
  const q = studentSearch.value.trim().toLowerCase()
  if (!q) return rosterStudents.value
  return rosterStudents.value.filter(s => (s.name||s.fullName||'').toLowerCase().includes(q) || (s.email||'').toLowerCase().includes(q))
})

// Optional: load classes from backend and merge into local store
async function loadFromBackend() {
  try {
    const token = localStorage.getItem('auth:token')
    if (!token) return
    const res = await axios.get(`${API_URL}/classes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const serverItems = res.data?.data || []
    serverItems.forEach(it => {
      const mapped = {
        id: it.id,
        title: it.name || it.title || 'Untitled',
        subject: it.subject || '',
        level: it.section || '',
        description: it.description || '',
        code: it.code,
        teacherId: currentUser.id,
        createdAt: it.createdAt || new Date().toISOString(),
        students: []
      }
      const existing = store.items.find(x => x.id === mapped.id)
      if (existing) {
        store.updateClass(mapped)
      } else {
        store.addClass(mapped)
      }
    })
  } catch (e) {
    // Silent fallback to local data
    console.warn('Failed to load classes from backend, using local data', e?.message || e)
  }
}

// Fallback: load mock classes JSON once when nothing exists
async function loadFromMock() {
  try {
    const resp = await fetch('/src/data/mock/classes.json')
    const data = await resp.json()
    if (Array.isArray(data) && data.length) {
      data.forEach((it) => {
        const mapped = {
          id: it.id || ('c' + Date.now()),
          title: it.title || it.name || 'Untitled',
          subject: it.subject || '',
          level: it.level || it.section || '',
          description: it.description || '',
          code: it.code || null,
          teacherId: it.teacherId || currentUser.id,
          startAt: it.startAt || new Date(Date.now() + 3600 * 1000).toISOString(),
          endAt: it.endAt || null,
          status: it.status || 'active',
          createdAt: it.createdAt || new Date().toISOString(),
          students: it.students || []
        }
        store.addClass(mapped)
      })
    }
  } catch (e) {
    console.warn('Failed to load mock classes', e?.message || e)
  }
}

// Classes data (raw + filtered)
const classes = computed(() => {
  const all = store.active()
  const own = all.filter(c => !c.teacherId || String(c.teacherId) === String(currentUser.id))
  return own.length ? own : all
})

// Sessions state
const showScheduleModal = ref(false)
const sessionTitle = ref('')
const sessionScope = ref('WHOLE_CLASS')
const sessionSubject = ref('')
const sessionStart = ref('')
const sessionEnd = ref('')
const sessions = ref([]) // flattened upcoming sessions across classes

const filteredClasses = computed(() => {
  let list = [...classes.value]
  // search
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(c =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.subject || '').toLowerCase().includes(q) ||
      (c.level || '').toLowerCase().includes(q)
    )
  }
  // subject filter
  if (subjectFilter.value) list = list.filter(c => c.subject === subjectFilter.value)
  // level filter
  if (levelFilter.value) list = list.filter(c => c.level === levelFilter.value)
  // sort
  const key = sortKey.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  list.sort((a, b) => {
    if (key === 'createdAt') return (new Date(a.createdAt) - new Date(b.createdAt)) * dir
    return String(a[key] || '').localeCompare(String(b[key] || '')) * dir
  })
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredClasses.value.length / perPage.value)))
const startIndex = computed(() => (page.value - 1) * perPage.value)
const endIndex = computed(() => Math.min(filteredClasses.value.length, startIndex.value + perPage.value))
const visibleClasses = computed(() => filteredClasses.value.slice(startIndex.value, endIndex.value))
const pageNumbers = computed(() => {
  const pages = totalPages.value
  const current = page.value
  const delta = 2
  const range = []
  for (let p = Math.max(1, current - delta); p <= Math.min(pages, current + delta); p++) {
    range.push(p)
  }
  if (!range.includes(1)) range.unshift(1)
  if (!range.includes(pages)) range.push(pages)
  return [...new Set(range)]
})

function nextPage() { if (page.value < totalPages.value) page.value++ }
function prevPage() { if (page.value > 1) page.value-- }
function gotoPage(p) { if (p >= 1 && p <= totalPages.value) page.value = p }
function resetFilters() {
  searchQuery.value = ''
  subjectFilter.value = ''
  levelFilter.value = ''
  sortKey.value = 'createdAt'
  sortDir.value = 'desc'
  page.value = 1
}

// Upcoming sessions computed
const upcomingSessions = computed(() => {
  const now = new Date()
  return sessions.value
    .filter(s => new Date(s.startTime) >= new Date(now.getTime() - 5*60*1000))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5)
})

function isSessionLive(s) {
  const now = new Date()
  const start = new Date(s.startTime)
  const end = s.endTime ? new Date(s.endTime) : null
  return start <= now && (!end || end >= now)
}

function joinSession(s) {
  router.push({ name: 'LiveClass', params: { id: s.classId }, query: { session: s.id } })
}

// Computed properties for statistics
const totalStudents = computed(() => {
  return classes.value.reduce((total, cls) => {
    return total + (cls.students?.length || 0)
  }, 0)
})

const totalAssignments = computed(() => {
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  return assignments.filter(a => classes.value.some(c => c.id === a.classId)).length
})

const upcomingClasses = computed(() => {
  const now = new Date()
  return classes.value
    .filter(cls => new Date(cls.startAt) > now)
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
    .slice(0, 3)
})

// Helper functions
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString([], { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    })
  } catch {
    return iso
  }
}

function getTimeUntil(date) {
  const now = new Date()
  const target = new Date(date)
  const diff = target - now
  
  if (diff < 0) return 'Past due'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

function getClassStudentCount(classId) {
  const cls = classes.value.find(c => c.id === classId)
  return cls && cls.students ? cls.students.length : 0
}

function getClassAssignmentCount(classId) {
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  return assignments.filter(a => a.classId === classId).length
}

function getClassProgress(classId) {
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  const classAssignments = assignments.filter(a => a.classId === classId)
  
  if (classAssignments.length === 0) return 0
  
  const totalSubmissions = classAssignments.reduce((total, assignment) => {
    return total + (assignment.submissions?.length || 0)
  }, 0)
  
  const totalStudents = getClassStudentCount(classId)
  const totalPossible = classAssignments.length * totalStudents
  
  return totalPossible > 0 ? Math.round((totalSubmissions / totalPossible) * 100) : 0
}

function getClassAverageGrade(classId) {
  const assignments = JSON.parse(localStorage.getItem('mock:assignments') || '[]')
  const classAssignments = assignments.filter(a => a.classId === classId)
  
  let totalGrade = 0
  let gradedSubmissions = 0
  
  classAssignments.forEach(assignment => {
    if (assignment.submissions) {
      assignment.submissions.forEach(submission => {
        if (submission.grade != null) {
          totalGrade += submission.grade
          gradedSubmissions++
        }
      })
    }
  })
  
  return gradedSubmissions > 0 ? Math.round(totalGrade / gradedSubmissions) : 0
}

function getClassStatus(cls) {
  const now = new Date()
  const start = new Date(cls.startAt)
  const end = cls.endAt ? new Date(cls.endAt) : null
  
  if (end && end < now) {
    return { class: 'bg-gray-100 text-gray-800', text: 'Completed' }
  } else if (start <= now && (!end || end >= now)) {
    return { class: 'bg-green-100 text-green-800', text: 'Active' }
  } else if (start > now) {
    return { class: 'bg-blue-100 text-blue-800', text: 'Upcoming' }
  } else {
    return { class: 'bg-gray-100 text-gray-800', text: 'Unknown' }
  }
}

// Generate unique class joining code
function generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude ambiguous chars (0,O,1,I)
  const prefix = newClass.subject ? newClass.subject.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '') : 'CLS'
  const random = Array.from({length: 4}, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `${prefix || 'CLS'}-${random}`
}

// New class form
const newClass = reactive({
  title: '',
  subject: '',
  level: '',
  description: '',
  startAt: '',
  endAt: '',
  status: 'active'
})

// Class management functions
function createClass() {
  const id = 'c' + Date.now()
  const code = generateClassCode()
  const cls = {
    id,
    ...newClass,
    code: code, // Add joining code
    teacherId: currentUser.id,
    createdAt: new Date().toISOString(),
    students: []
  }
  
  store.addClass(cls)
  showCreateModal.value = false
  resetNewClass()
  
  if (window.showToast) {
    window.showToast(`Class created successfully! Code: ${code}`)
  } else {
    alert(`Class created! Share this code with students: ${code}`)
  }
}

function resetNewClass() {
  Object.assign(newClass, {
    title: '',
    subject: '',
    level: '',
    description: '',
    startAt: '',
    endAt: '',
    status: 'active'
  })
}

function viewClass(cls) {
  // Navigate to course shell with stream view
  window.location.href = `/course/${cls.id}/stream`
}

function viewClassDetails(cls) {
  window.location.href = `/course/${cls.id}/stream`
}

async function startLiveNow(cls) {
  if (!cls) return
  const token = localStorage.getItem('auth:token')
  try {
    if (token) {
      const now = new Date().toISOString()
      const res = await axios.post(`${API_URL}/classes/${cls.id}/sessions`, {
        title: `Live: ${cls.title}`,
        description: 'Whole-class live session',
        startTime: now,
        resources: { scope: 'WHOLE_CLASS', live: true }
      }, { headers: { Authorization: `Bearer ${token}` } })
      const session = res.data?.data
      if (session?.id) {
        router.push({ name: 'LiveClass', params: { id: cls.id }, query: { session: session.id } })
        return
      }
    }
  } catch (e) {
    console.warn('Failed to create session, falling back to direct live room', e?.message || e)
  }
  // Fallback: open live without session id
  router.push({ name: 'LiveClass', params: { id: cls.id } })
}

function editClass(cls) {
  selectedClass.value = { ...cls }
  showEditModal.value = true
}

function updateClass() {
  if (!selectedClass.value) return
  // Update in store (fix signature bug)
  store.updateClass(selectedClass.value)
  showEditModal.value = false
  
  if (window.showToast) {
    window.showToast('Class updated successfully!')
  }
}

function showMaterialsUpload(cls) {
  selectedClass.value = cls
  loadClassMaterials(cls.id)
  showMaterialsModal.value = true
}

function loadClassMaterials(classId) {
  const allMaterials = JSON.parse(localStorage.getItem('class:materials') || '[]')
  materials.value = allMaterials.filter(m => m.classId === classId)
}

function handleFileSelect(event) {
  materialFile.value = event.target.files[0]
}

function uploadMaterial() {
  if (!materialFile.value || !materialTitle.value.trim()) {
    alert('Please provide a title and select a file')
    return
  }
  
  const newMaterial = {
    id: 'mat_' + Date.now(),
    classId: selectedClass.value.id,
    title: materialTitle.value.trim(),
    description: materialDescription.value.trim(),
    fileName: materialFile.value.name,
    fileSize: formatFileSize(materialFile.value.size),
    fileType: materialFile.value.type,
    uploadedBy: currentUser.id,
    uploadedAt: new Date().toISOString()
  }
  
  // Save to localStorage
  const allMaterials = JSON.parse(localStorage.getItem('class:materials') || '[]')
  allMaterials.push(newMaterial)
  localStorage.setItem('class:materials', JSON.stringify(allMaterials))
  
  // Reload materials
  loadClassMaterials(selectedClass.value.id)
  
  // Reset form
  materialTitle.value = ''
  materialDescription.value = ''
  materialFile.value = null
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
  
  if (window.showToast) {
    window.showToast('Material uploaded successfully!')
  }
}

// Scheduling helpers
function openScheduleModal(cls) {
  selectedClass.value = cls
  showScheduleModal.value = true
  sessionTitle.value = `Session: ${cls.title}`
  const dt = new Date()
  dt.setMinutes(dt.getMinutes() + 5)
  sessionStart.value = dt.toISOString().slice(0,16)
  sessionEnd.value = ''
  sessionScope.value = 'WHOLE_CLASS'
  sessionSubject.value = cls.subject || ''
}

async function createSession() {
  if (!selectedClass.value) return
  const token = localStorage.getItem('auth:token')
  const payload = {
    title: sessionTitle.value.trim() || `Session: ${selectedClass.value.title}`,
    startTime: new Date(sessionStart.value).toISOString(),
    endTime: sessionEnd.value ? new Date(sessionEnd.value).toISOString() : null,
    description: sessionScope.value==='SUBJECT' ? `${sessionSubject.value} session` : 'Whole-class session',
    resources: { scope: sessionScope.value, subject: sessionSubject.value || null }
  }
  try {
    if (token) {
      const res = await axios.post(`${API_URL}/classes/${selectedClass.value.id}/sessions`, payload, { headers: { Authorization: `Bearer ${token}` } })
      const s = res.data?.data
      if (s) addSessionLocal({ ...s, classTitle: selectedClass.value.title })
    } else {
      // Local fallback
      const localS = { id: 'sess_'+Date.now(), classId: selectedClass.value.id, classTitle: selectedClass.value.title, ...payload }
      addSessionLocal(localS)
    }
    showScheduleModal.value = false
    if (window.showToast) window.showToast('Session scheduled')
  } catch (e) {
    console.error(e)
    if (window.showToast) window.showToast('Failed to schedule session')
  }
}

function addSessionLocal(s) {
  sessions.value.push(s)
  const all = JSON.parse(localStorage.getItem('class:sessions') || '[]')
  all.push(s)
  localStorage.setItem('class:sessions', JSON.stringify(all))
}

function loadSessionsFromLocal() {
  const all = JSON.parse(localStorage.getItem('class:sessions') || '[]')
  // Keep only future/recent ones
  const now = new Date()
  sessions.value = all.filter(s => new Date(s.startTime) >= new Date(now.getTime() - 24*60*60*1000))
}

async function loadSessionsFromBackend() {
  const token = localStorage.getItem('auth:token')
  if (!token) return
  try {
    const cls = classes.value.slice(0, 10) // limit to avoid spamming
    const promises = cls.map(c => axios.get(`${API_URL}/classes/${c.id}/sessions`, { headers: { Authorization: `Bearer ${token}` } }))
    const results = await Promise.allSettled(promises)
    const merged = []
    results.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        const arr = r.value.data?.data || []
        arr.forEach(s => merged.push({ ...s, classId: cls[idx].id, classTitle: cls[idx].title }))
      }
    })
    // merge
    const allLocal = JSON.parse(localStorage.getItem('class:sessions') || '[]')
    const combined = [...allLocal, ...merged]
    // de-dup by id
    const map = new Map()
    combined.forEach(s => map.set(s.id, s))
    sessions.value = Array.from(map.values())
    localStorage.setItem('class:sessions', JSON.stringify(sessions.value))
  } catch (e) {
    console.warn('Failed to load sessions from backend', e?.message || e)
  }
}

function deleteMaterial(materialId) {
  if (!confirm('Are you sure you want to delete this material?')) return
  
  const allMaterials = JSON.parse(localStorage.getItem('class:materials') || '[]')
  const filtered = allMaterials.filter(m => m.id !== materialId)
  localStorage.setItem('class:materials', JSON.stringify(filtered))
  
  loadClassMaterials(selectedClass.value.id)
  
  if (window.showToast) {
    window.showToast('Material deleted successfully!')
  }
}

// Students & Subjects helpers
function openStudentsModal(cls){
  selectedClass.value = cls
  const emails = (cls.students || []).map(s => s.email || s.id || '').filter(Boolean)
  studentsInput.value = emails.join(', ')
  selectedStudentIds.value = (cls.students || []).map(s => s.id).filter(Boolean)
  showStudentsModal.value = true
}

async function enrollStudents(){
  if (!selectedClass.value) return
  const token = localStorage.getItem('auth:token')
  const raw = studentsInput.value || ''
  const typed = raw.split(/[\n,;\s]+/).map(s=>s.trim()).filter(Boolean)
  const fromPicker = [...selectedStudentIds.value]
  const items = Array.from(new Set([...typed]))

  // Heuristic: treat UUID-like values as IDs for backend call
  const uuidLike = [...fromPicker, ...items.filter(v=>/^[0-9a-fA-F-]{8,}$/.test(v))]
  try {
    if (token && uuidLike.length){
      await axios.post(`${API_URL}/classes/${selectedClass.value.id}/students`, { studentIds: uuidLike }, { headers: { Authorization: `Bearer ${token}` } })
    }
  } catch(e){ console.warn('Backend enroll failed, using local', e?.message||e) }

  // Local fallback: merge checked roster users + typed emails/ids
  const rosterMap = new Map(rosterStudents.value.map(s=>[s.id, s]))
  const addFromRoster = fromPicker.map(id => rosterMap.get(id)).filter(Boolean)
  const addFromTyped = items.map(v=>({ id: v.includes('@')? ('u_'+v) : v, email: v }))
  const combined = [...addFromRoster, ...addFromTyped]
  const cls = { ...selectedClass.value }
  cls.students = Array.from(new Map([...(cls.students||[]), ...combined].map(s=>[s.id||s.email, s])).values())
  selectedClass.value = cls
  store.updateClass(cls)
  showStudentsModal.value = false
  if (window.showToast) window.showToast('Students enrolled')
}

function openSubjectsModal(cls){
  selectedClass.value = cls
  const subs = (cls.settings && cls.settings.subjects) ? cls.settings.subjects.join(', ') : ''
  subjectsInput.value = subs
  showSubjectsModal.value = true
}

async function saveSubjects(){
  if (!selectedClass.value) return
  const arr = subjectsInput.value.split(',').map(s=>s.trim()).filter(Boolean)
  const token = localStorage.getItem('auth:token')
  try {
    if (token){
      await axios.put(`${API_URL}/classes/${selectedClass.value.id}/settings`, { settings: { subjects: arr } }, { headers: { Authorization: `Bearer ${token}` } })
    }
  } catch(e){ console.warn('Backend settings update failed, using local', e?.message||e) }

  const cls = { ...selectedClass.value, settings: { ...(selectedClass.value.settings||{}), subjects: arr } }
  selectedClass.value = cls
  store.updateClass(cls)
  showSubjectsModal.value = false
  if (window.showToast) window.showToast('Subjects updated')
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function removeClass(id) {
  if (!confirm('Are you sure you want to delete this class?')) return
  store.removeClass(id)
  
  if (window.showToast) {
    window.showToast('Class deleted successfully')
  }
}

function copyClassCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    if (window.showToast) {
      window.showToast(`Code copied: ${code}`)
    } else {
      alert(`Code copied: ${code}`)
    }
  }).catch(err => {
    console.error('Failed to copy:', err)
  })
}
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
