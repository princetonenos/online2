import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/shared/Login.vue')
  },
  // Teacher routes
  {
    path: '/teacher',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'TeacherDashboard' }
      },
      {
        path: 'dashboard',
        name: 'TeacherDashboard',
        component: () => import('../views/teacher/TeacherDashboard.vue')
      },
      {
        path: 'classes',
        name: 'TeacherClasses',
        component: () => import('../views/teacher/ClassesList.vue')
      },
      {
        path: 'classes/create',
        name: 'TeacherClassCreate',
        component: () => import('../views/teacher/ClassCreate.vue')
      },
      {
        path: 'classes/:id',
        name: 'TeacherClassDetail',
        component: () => import('../views/teacher/ClassDetail.vue'),
        props: true
      },
      {
        path: 'classes/:id/live',
        name: 'LiveSession',
        component: () => import('../views/teacher/LiveClass.vue')
      },
      {
        path: 'assignments',
        name: 'TeacherAssignmentList',
        component: () => import('../views/teacher/AssignmentList.vue')
      },
      {
        path: 'assignments/create',
        name: 'TeacherAssignmentCreate',
        component: () => import('../views/teacher/AssignmentCreate.vue')
      },
      {
        path: 'calendar',
        name: 'TeacherCalendar',
        component: () => import('../views/shared/CalendarView.vue')
      },
      {
        path: 'reports',
        name: 'TeacherReports',
        component: () => import('../views/Reports.vue')
      }
    ]
  },
  // Student routes
  {
    path: '/student',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'StudentDashboard' }
      },
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: () => import('../views/student/Dashboard.vue')
      },
      {
        path: 'classes',
        name: 'StudentClasses',
        component: () => import('../views/student/ClassList.vue')
      },
      {
        path: 'classes/:id',
        name: 'StudentClassDetail',
        component: () => import('../views/student/ClassDetail.vue'),
        props: true
      },
      {
        path: 'join',
        name: 'StudentJoinClass',
        component: () => import('../views/student/JoinClass.vue')
      },
      {
        path: 'classwork',
        name: 'StudentClasswork',
        component: () => import('../views/student/Classwork.vue')
      },
      {
        path: 'classwork/:assignmentId',
        name: 'StudentAssignmentDetail',
        component: () => import('../views/student/AssignmentDetail.vue'),
        props: true
      },
      {
        path: 'calendar',
        name: 'StudentCalendar',
        component: () => import('../views/student/CalendarView.vue')
      },
      {
        path: 'grades',
        name: 'StudentGrades',
        component: () => import('../views/student/Grades.vue')
      },
      {
        path: 'people',
        name: 'StudentPeople',
        component: () => import('../views/student/People.vue')
      },
      {
        path: 'stream',
        name: 'StudentStream',
        component: () => import('../views/student/Stream.vue')
      }
    ]
  },
  // Admin routes
  {
    path: '/admin',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'AdminDashboard' }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'schools',
        name: 'AdminSchools',
        component: () => import('../views/admin/SchoolsView.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/UsersView.vue')
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: () => import('../views/admin/ReportsView.vue')
      }
    ]
  },
  // Course routes (nested)
  {
    path: '/course/:id',
    component: () => import('../views/CourseShell.vue'),
    children: [
      {
        path: 'stream',
        name: 'Stream',
        component: () => import('../views/Stream.vue')
      },
      {
        path: 'classwork',
        name: 'Classwork',
        component: () => import('../views/Classwork.vue')
      },
      {
        path: 'people',
        name: 'People',
        component: () => import('../views/People.vue')
      },
      {
        path: 'grades',
        name: 'Grades',
        component: () => import('../views/Grades.vue')
      },
      {
        path: 'live',
        name: 'LiveClass',
        component: () => import('../views/teacher/LiveClass.vue')
      }
    ]
  },
  {
    path: '/course/:id/assignments/:assignmentId',
    name: 'AssignmentDetail',
    component: () => import('../views/AssignmentDetail.vue'),
    props: true
  },
  // Shared routes
  {
    path: '/profile',
    name: 'ProfileView',
    component: () => import('../views/shared/ProfileView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/shared/Settings.vue')
  },
  {
    path: '/calendar',
    name: 'CalendarView',
    component: () => import('../views/shared/CalendarView.vue')
  },
  // Legacy routes (to be deprecated)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/Create.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard for role-based access
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
  
  // Check if route requires specific role
  if (to.path.startsWith('/teacher') && user?.role !== 'teacher') {
    return next({ name: 'Login' })
  }
  if (to.path.startsWith('/student') && user?.role !== 'student') {
    return next({ name: 'Login' })
  }
  if (to.path.startsWith('/admin') && user?.role !== 'admin') {
    return next({ name: 'Login' })
  }
  
  next()
})

export default router
