import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import TeacherDashboard from '../views/TeacherDashboard.vue'
import CourseShell from '../views/CourseShell.vue'
import Stream from '../views/Stream.vue'
import Classwork from '../views/Classwork.vue'
import People from '../views/People.vue'
import Grades from '../views/Grades.vue'
import AssignmentDetail from '../views/AssignmentDetail.vue'
import LiveClass from '../views/LiveClass.vue'
import ProfileView from '../views/ProfileView.vue'
import StudentDashboard from '../views/student/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: TeacherDashboard
  },
  // Student routes
  {
    path: '/student/dashboard',
    name: 'StudentDashboard',
    component: StudentDashboard
  },
  {
    path: '/student/classes',
    name: 'StudentClasses',
    component: () => import('../views/student/ClassList.vue')
  },
  {
    path: '/student/classes/:id',
    name: 'StudentClassDetail',
    component: () => import('../views/student/ClassDetail.vue')
  },
  {
    path: '/student/join',
    name: 'StudentJoinClass',
    component: () => import('../views/student/JoinClass.vue')
  },
  {
    path: '/student/classwork',
    name: 'StudentClasswork',
    component: () => import('../views/student/Classwork.vue')
  },
  {
    path: '/student/classwork/:assignmentId',
    name: 'StudentAssignmentDetail',
    component: () => import('../views/student/AssignmentDetail.vue')
  },
  {
    path: '/student/calendar',
    name: 'StudentCalendar',
    component: () => import('../views/student/CalendarView.vue')
  },
  {
    path: '/student/grades',
    name: 'StudentGrades',
    component: () => import('../views/student/Grades.vue')
  },
  {
    path: '/student/people',
    name: 'StudentPeople',
    component: () => import('../views/student/People.vue')
  },
  {
    path: '/student/stream',
    name: 'StudentStream',
    component: () => import('../views/student/Stream.vue')
  },
  {
    path: '/course/:id',
    component: CourseShell,
    children: [
      {
        path: 'stream',
        name: 'Stream',
        component: Stream
      },
      {
        path: 'classwork',
        name: 'Classwork',
        component: Classwork
      },
      {
        path: 'people',
        name: 'People',
        component: People
      },
      {
        path: 'grades',
        name: 'Grades',
        component: Grades
      },
      {
        path: 'live',
        name: 'LiveClass',
        component: LiveClass
      }
    ]
  },
  {
    path: '/course/:id/assignments/:assignmentId',
    name: 'AssignmentDetail',
    component: AssignmentDetail
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/Create.vue')
  },
  {
    path: '/teacher/create-class',
    name: 'ClassCreate',
    component: () => import('../views/ClassCreate.vue')
  },
  {
    path: '/teacher/classes',
    name: 'ClassesList',
    component: () => import('../views/ClassesList.vue')
  },
  {
    path: '/teacher/classes/:id',
    name: 'ClassDetail',
    component: () => import('../views/ClassDetail.vue')
  },
  {
    path: '/teacher/classes/:id/live',
    name: 'LiveSession',
    component: () => import('../views/LiveClass.vue')
  },
  {
    path: '/teacher/calendar',
    name: 'CalendarView',
    component: () => import('../views/CalendarView.vue')
  },
  {
    path: '/teacher/assignments',
    name: 'AssignmentList',
    component: () => import('../views/AssignmentList.vue')
  },
  {
    path: '/teacher/assignments/create',
    name: 'AssignmentCreate',
    component: () => import('../views/AssignmentCreate.vue')
  },
  {
    path: '/teacher/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue')
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView
  },
  {
    path: '/calendar',
    name: 'CalendarView',
    component: () => import('../views/CalendarView.vue')
  },
  {
    path: '/admin/schools',
    name: 'SchoolsView',
    component: () => import('../views/admin/SchoolsView.vue')
  },
  {
    path: '/admin/users',
    name: 'UsersView',
    component: () => import('../views/admin/UsersView.vue')
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: () => import('../views/admin/ReportsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
