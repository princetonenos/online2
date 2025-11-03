<template>
  <nav class="bg-white border-b border-classroom-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Portal title and role indicator -->
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-medium text-classroom-gray-900">
            {{ portalTitle }}
          </h1>
          <span class="chip text-sm" :class="roleBadgeClass">
            {{ currentUser?.role }}
          </span>
        </div>

        <!-- Portal navigation -->
        <div class="flex items-center space-x-1">
          <template v-if="isAdmin">
            <!-- Admin navigation -->
            <router-link
              v-for="item in adminNavItems"
              :key="item.name"
              :to="item.to"
              class="px-3 py-2 rounded-classroom text-sm font-medium transition-colors focus-classroom"
              :class="{
                'bg-classroom-primary text-white': $route.path.includes(item.path),
                'text-classroom-gray-700 hover:bg-classroom-gray-100': !$route.path.includes(item.path)
              }"
              :data-testid="`nav-${item.name.toLowerCase()}`"
            >
              {{ item.name }}
            </router-link>
          </template>

          <template v-else-if="isTeacher">
            <!-- Teacher navigation -->
            <router-link
              v-for="item in teacherNavItems"
              :key="item.name"
              :to="item.to"
              class="px-3 py-2 rounded-classroom text-sm font-medium transition-colors focus-classroom"
              :class="{
                'bg-classroom-primary text-white': $route.path.includes(item.path),
                'text-classroom-gray-700 hover:bg-classroom-gray-100': !$route.path.includes(item.path)
              }"
              :data-testid="`nav-${item.name.toLowerCase().replace(' ', '-')}`"
            >
              {{ item.name }}
            </router-link>
          </template>

          <template v-else-if="isStudent">
            <!-- Student navigation -->
            <router-link
              v-for="item in studentNavItems"
              :key="item.name"
              :to="item.to"
              class="px-3 py-2 rounded-classroom text-sm font-medium transition-colors focus-classroom"
              :class="{
                'bg-classroom-primary text-white': $route.path.includes(item.path),
                'text-classroom-gray-700 hover:bg-classroom-gray-100': !$route.path.includes(item.path)
              }"
              :data-testid="`nav-${item.name.toLowerCase().replace(' ', '-')}`"
            >
              {{ item.name }}
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '../store/users'

const route = useRoute()
const usersStore = useUsersStore()

const currentUser = computed(() => usersStore.currentUser)
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const isTeacher = computed(() => currentUser.value?.role === 'teacher')
const isStudent = computed(() => currentUser.value?.role === 'student')

const portalTitle = computed(() => {
  if (isAdmin.value) return 'Admin Portal'
  if (isTeacher.value) return 'Teacher Portal'
  if (isStudent.value) return 'Student Portal'
  return 'Classroom'
})

const roleBadgeClass = computed(() => {
  if (isAdmin.value) return 'chip-primary'
  if (isTeacher.value) return 'chip-secondary'
  if (isStudent.value) return 'chip-gray'
  return 'chip-gray'
})

// Admin navigation items
const adminNavItems = [
  { name: 'Dashboard', to: { name: 'AdminDashboard' }, path: '/admin/dashboard' },
  { name: 'Calendar', to: { name: 'CalendarView' }, path: '/calendar' },
  { name: 'Profile', to: { name: 'ProfileView' }, path: '/profile' },
  { name: 'Schools', to: { name: 'AdminSchools' }, path: '/admin/schools' },
  { name: 'Users', to: { name: 'AdminUsers' }, path: '/admin/users' },
  { name: 'Reports', to: { name: 'AdminReports' }, path: '/admin/reports' },
  { name: 'Settings', to: { name: 'Settings' }, path: '/settings' }
]

// Teacher navigation items
const teacherNavItems = [
  { name: 'Dashboard', to: { name: 'TeacherDashboard' }, path: '/teacher/dashboard' },
  { name: 'Calendar', to: { name: 'TeacherCalendar' }, path: '/teacher/calendar' },
  { name: 'Profile', to: { name: 'ProfileView' }, path: '/profile' },
  { name: 'My Classes', to: { name: 'TeacherClasses' }, path: '/teacher/classes' },
  { name: 'Assignments', to: { name: 'TeacherAssignmentList' }, path: '/teacher/assignmentscard' },
  { name: 'Reports', to: { name: 'TeacherReports' }, path: '/teacher/reports' },
  { name: 'Settings', to: { name: 'Settings' }, path: '/settings' }
]

// Student navigation items
const studentNavItems = [
  { name: 'Dashboard', to: { name: 'StudentDashboard' }, path: '/student/dashboard' },
  { name: 'Calendar', to: { name: 'StudentCalendar' }, path: '/student/calendar' },
  { name: 'Profile', to: { name: 'ProfileView' }, path: '/profile' },
  { name: 'My Classes', to: { name: 'StudentClasses' }, path: '/student/classes' },
  { name: 'Assignments', to: { name: 'StudentClasswork' }, path: '/student/classwork' },
  { name: 'Grades', to: { name: 'StudentGrades' }, path: '/student/grades' }
]
</script>
