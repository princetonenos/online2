<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-medium text-classroom-gray-900 mb-2">People</h2>
        <p class="text-classroom-gray-600">Teachers and students in this class</p>
      </div>
      <button 
        v-if="isTeacher"
        @click="openInviteModal"
        class="btn-primary flex items-center space-x-2"
      >
        <span class="material-icons text-lg">person_add</span>
        <span>Invite</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Teachers section -->
      <div class="bg-white rounded-classroom classroom-shadow">
        <div class="p-4 border-b border-classroom-gray-100">
          <h3 class="font-medium text-classroom-gray-900">Teachers</h3>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div 
              v-for="teacher in teachers"
              :key="teacher.id"
              class="flex items-center space-x-3 p-2 rounded-classroom hover:bg-classroom-gray-50 transition-colors"
            >
              <img :src="teacher.avatar" :alt="teacher.name" class="w-10 h-10 rounded-full">
              <div class="flex-1">
                <p class="font-medium text-classroom-gray-900">{{ teacher.name }}</p>
                <p class="text-sm text-classroom-gray-500">{{ teacher.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Students section -->
      <div class="bg-white rounded-classroom classroom-shadow">
        <div class="p-4 border-b border-classroom-gray-100">
          <h3 class="font-medium text-classroom-gray-900">Students</h3>
          <p class="text-sm text-classroom-gray-500">{{ students.length }} students</p>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div 
              v-for="student in students"
              :key="student.id"
              class="flex items-center space-x-3 p-2 rounded-classroom hover:bg-classroom-gray-50 transition-colors"
            >
              <img :src="student.avatar" :alt="student.name" class="w-10 h-10 rounded-full">
              <div class="flex-1">
                <p class="font-medium text-classroom-gray-900">{{ student.name }}</p>
                <p class="text-sm text-classroom-gray-500">{{ student.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '../store/users'
import { useCoursesStore } from '../store/courses'

const route = useRoute()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()

const courseId = computed(() => route.params.id)
const currentUser = computed(() => usersStore.currentUser)
const isTeacher = computed(() => usersStore.isTeacher)

const course = computed(() => coursesStore.getCourseById(courseId.value))

const teachers = computed(() => {
  if (!course.value) return []
  return course.value.teachers.map(teacherId => usersStore.getUserById(teacherId)).filter(Boolean)
})

const students = computed(() => {
  if (!course.value) return []
  return course.value.students.map(studentId => usersStore.getUserById(studentId)).filter(Boolean)
})

const openInviteModal = () => {
  showToast('Invite people modal would open here')
}

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
