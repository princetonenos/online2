<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-medium text-classroom-gray-900 mb-2">Grades</h2>
        <p class="text-classroom-gray-600">{{ isTeacher ? 'View and manage student grades' : 'Your grades and feedback' }}</p>
      </div>
      <button 
        v-if="isTeacher"
        @click="exportGrades"
        class="btn-outline flex items-center space-x-2"
      >
        <span class="material-icons text-lg">download</span>
        <span>Export CSV</span>
      </button>
    </div>

    <!-- Student view -->
    <div v-if="!isTeacher" class="bg-white rounded-classroom classroom-shadow">
      <div class="p-4 border-b border-classroom-gray-100">
        <h3 class="font-medium text-classroom-gray-900">Your Grades</h3>
      </div>
      <div class="p-4">
        <div class="space-y-4">
          <div 
            v-for="assignment in assignments"
            :key="assignment.id"
            class="flex items-center justify-between p-3 border border-classroom-gray-200 rounded-classroom"
          >
            <div class="flex-1">
              <h4 class="font-medium text-classroom-gray-900">{{ assignment.title }}</h4>
              <p class="text-sm text-classroom-gray-500">Due {{ formatDate(assignment.dueDate) }}</p>
            </div>
            <div class="text-right">
              <div class="text-lg font-medium text-classroom-gray-900">
                {{ getGrade(assignment.id) }}
              </div>
              <div class="text-sm text-classroom-gray-500">
                / {{ assignment.points }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Teacher view -->
    <div v-else class="bg-white rounded-classroom classroom-shadow overflow-hidden">
      <div class="p-4 border-b border-classroom-gray-100">
        <h3 class="font-medium text-classroom-gray-900">Gradebook</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-classroom-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900 border-b border-classroom-gray-200">
                Student
              </th>
              <th 
                v-for="assignment in assignments"
                :key="assignment.id"
                class="px-4 py-3 text-center text-sm font-medium text-classroom-gray-900 border-b border-classroom-gray-200"
              >
                {{ assignment.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="student in students"
              :key="student.id"
              class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
            >
              <td class="px-4 py-3 text-sm text-classroom-gray-900">
                {{ student.name }}
              </td>
              <td 
                v-for="assignment in assignments"
                :key="assignment.id"
                class="px-4 py-3 text-center text-sm"
              >
                <span class="text-classroom-gray-900">
                  {{ getStudentGrade(assignment.id, student.id) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '../store/users'
import { useCoursesStore } from '../store/courses'
import { useAssignmentsStore } from '../store/assignments'

const route = useRoute()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

const courseId = computed(() => route.params.id)
const currentUser = computed(() => usersStore.currentUser)
const isTeacher = computed(() => usersStore.isTeacher)

const course = computed(() => coursesStore.getCourseById(courseId.value))
const assignments = computed(() => assignmentsStore.getAssignmentsByCourse(courseId.value))
const students = computed(() => {
  if (!course.value) return []
  return course.value.students.map(studentId => usersStore.getUserById(studentId)).filter(Boolean)
})

const getGrade = (assignmentId) => {
  const submission = assignmentsStore.getSubmissionByUser(assignmentId, currentUser.value.id)
  return submission?.grade || '-'
}

const getStudentGrade = (assignmentId, studentId) => {
  const submission = assignmentsStore.getSubmissionByUser(assignmentId, studentId)
  return submission?.grade || '-'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const exportGrades = () => {
  showToast('Exporting grades to CSV...')
}

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
