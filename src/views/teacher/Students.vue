<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p class="text-gray-600 mt-2">Manage student enrollment, track progress, and monitor performance</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search students..."
              class="bg-white border border-gray-300 rounded-classroom pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-icons text-gray-400 text-sm">search</span>
            </div>
          </div>
          <button 
            @click="showEnrollModal = true"
            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2"
          >
            <span class="material-icons text-sm">person_add</span>
            <span>Enroll Student</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Student Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Students</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ students.length }}</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">trending_up</span>
              +3 this month
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-xl">people</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Active Students</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ activeStudents }}</p>
            <p class="text-blue-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">check_circle</span>
              94% attendance
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-xl">school</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Average Grade</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">87%</p>
            <p class="text-orange-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">insights</span>
              +2.5% improvement
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-purple-600 text-xl">grade</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Assignments Due</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">12</p>
            <p class="text-red-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">schedule</span>
              3 overdue
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-xl">assignment</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Student List -->
      <div class="xl:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Enrolled Students</h2>
                <p class="text-gray-600 mt-1">Manage and monitor student progress</p>
              </div>
              <div class="flex items-center space-x-3">
                <button 
                  @click="refresh"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2"
                >
                  <span class="material-icons text-sm">refresh</span>
                  <span>Refresh</span>
                </button>
                <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-classroom transition-colors flex items-center space-x-2">
                  <span class="material-icons text-sm">filter_list</span>
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-classroom flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {{ student.name.charAt(0) }}
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                        <div class="text-xs text-gray-500">{{ student.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ getStudentClass(student.id)?.title || 'Not assigned' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          class="bg-green-500 h-2 rounded-full" 
                          :style="{ width: student.progress + '%' }"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-600">{{ student.progress }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span class="material-icons text-xs mr-1">check_circle</span>
                      Active
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button 
                        @click="viewStudent(student)"
                        class="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <span class="material-icons text-sm">visibility</span>
                        <span>View</span>
                      </button>
                      <button 
                        @click="editStudent(student)"
                        class="text-green-600 hover:text-green-900 flex items-center space-x-1"
                      >
                        <span class="material-icons text-sm">edit</span>
                        <span>Edit</span>
                      </button>
                      <button 
                        @click="remove(student.id)"
                        class="text-red-600 hover:text-red-900 flex items-center space-x-1"
                      >
                        <span class="material-icons text-sm">delete</span>
                        <span>Remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="students.length === 0" class="text-center py-12">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-gray-400 text-3xl">people</span>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No students enrolled</h3>
            <p class="text-gray-500 mb-4">Get started by enrolling your first student</p>
            <button 
              @click="showEnrollModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors"
            >
              Enroll Student
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Statistics -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button 
              @click="showEnrollModal = true"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">person_add</span>
                <div class="text-left">
                  <div class="font-semibold">Enroll Student</div>
                  <div class="text-blue-100 text-xs">Add new student to class</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>

            <button class="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">groups</span>
                <div class="text-left">
                  <div class="font-semibold">Group Students</div>
                  <div class="text-green-100 text-xs">Create study groups</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>

            <button class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-4 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="material-icons text-xl">email</span>
                <div class="text-left">
                  <div class="font-semibold">Send Announcement</div>
                  <div class="text-orange-100 text-xs">Message all students</div>
                </div>
              </div>
              <span class="material-icons text-xl">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Class Distribution -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Class Distribution</h3>
          <div class="space-y-4">
            <div v-for="cls in myClasses" :key="cls.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-sm">class</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ cls.title }}</div>
                  <div class="text-xs text-gray-500">{{ getClassStudentCount(cls.id) }} students</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">{{ Math.round((getClassStudentCount(cls.id) / students.length) * 100) || 0 }}%</div>
                <div class="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    class="bg-blue-500 h-1.5 rounded-full" 
                    :style="{ width: Math.round((getClassStudentCount(cls.id) / students.length) * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enroll Student Modal -->
    <div v-if="showEnrollModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">Enroll New Student</h3>
            <button @click="showEnrollModal = false" class="text-gray-400 hover:text-gray-600">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>
        </div>

        <form @submit.prevent="enroll" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              v-model="form.name" 
              required 
              placeholder="Enter student's full name"
              class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              v-model="form.email" 
              required 
              type="email"
              placeholder="student@example.com"
              class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Assign to Class</label>
            <select 
              v-model="form.classId" 
              class="w-full p-3 border border-gray-300 rounded-classroom focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
            >
              <option value="">Select a class</option>
              <option v-for="cls in myClasses" :value="cls.id" :key="cls.id">{{ cls.title }}</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="clearForm"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Enroll Student
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

const store = useTeacherClassesStore()
const showEnrollModal = ref(false)
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || '{}')

// Initialize store
onMounted(() => {
  store.fetchAll()
})

const students = computed(() => store.getStudents())
const myClasses = computed(() => store.items.filter(c => c.teacherId === currentUser.id))

const activeStudents = computed(() => {
  return students.value.filter(s => s.progress > 0).length
})

const form = reactive({ 
  name: '', 
  email: '', 
  classId: myClasses.value[0]?.id || '' 
})

// Helper functions
const getStudentClass = (studentId) => {
  return myClasses.value.find(cls => cls.students && cls.students.includes(studentId))
}

const getClassStudentCount = (classId) => {
  const cls = myClasses.value.find(c => c.id === classId)
  return cls && cls.students ? cls.students.length : 0
}

// Student management functions
const enroll = () => {
  const id = 's' + Date.now()
  const student = { 
    id, 
    name: form.name, 
    email: form.email, 
    progress: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  }

  // Save to mock students
  const list = JSON.parse(localStorage.getItem('mock:students') || '[]')
  list.unshift(student)
  localStorage.setItem('mock:students', JSON.stringify(list))

  // Attach to class
  if (form.classId) {
    const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
    const cls = classes.find(x => x.id === form.classId)
    if (cls) {
      cls.students = cls.students || []
      cls.students.push(student.id)
      localStorage.setItem('mock:classes', JSON.stringify(classes))
    }
  }

  // Refresh store and close modal
  store.fetchAll()
  showEnrollModal.value = false
  clearForm()
  
  // Show success message
  if (window.showToast) {
    window.showToast('Student enrolled successfully!')
  }
}

const clearForm = () => {
  form.name = ''
  form.email = ''
  form.classId = myClasses.value[0]?.id || ''
  showEnrollModal.value = false
}

const remove = (id) => {
  if (!confirm('Are you sure you want to remove this student?')) return
  
  let list = JSON.parse(localStorage.getItem('mock:students') || '[]')
  list = list.filter(s => s.id !== id)
  localStorage.setItem('mock:students', JSON.stringify(list))
  
  // Remove from classes
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  classes.forEach(cls => {
    if (cls.students) {
      cls.students = cls.students.filter(sId => sId !== id)
    }
  })
  localStorage.setItem('mock:classes', JSON.stringify(classes))
  
  store.fetchAll()
  
  if (window.showToast) {
    window.showToast('Student removed successfully')
  }
}

const refresh = () => {
  store.fetchAll()
  if (window.showToast) {
    window.showToast('Student list refreshed')
  }
}

const viewStudent = (student) => {
  // Navigate to student detail view
  // This would typically use Vue Router
  console.log('View student:', student)
}

const editStudent = (student) => {
  // Open edit modal or navigate to edit view
  console.log('Edit student:', student)
}
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
