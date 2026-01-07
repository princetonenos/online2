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
        component: () => import('../views/teacher/ActiveClasses.vue')
      },
      {
        path: 'classes/active',
        name: 'TeacherActiveClasses',
        component: () => import('../views/teacher/ActiveClasses.vue')
      },
      {
        path: 'classes/create',
        name: 'TeacherClassCreate',
        component: () => import('../views/teacher/ClassCreate.vue')
      },
      {
        path: 'classes/:id',
        name: 'TeacherClassDetail',
        component: () => import('../views/teacher/ActiveClasses.vue'),
        props: true
      },
      {
        path: 'classes/:id/live',
        name: 'LiveSession',
        component: () => import('../views/teacher/LiveClass.vue')
      },
      {
        path: 'analytics',
        name: 'TeacherAnalytics',
        component: () => import('../views/teacher/Analytics.vue')
      },
      {
        path: 'students',
        name: 'TeacherStudents',
        component: () => import('../views/teacher/Students.vue')
      },
      {
        path: 'assignments',
        name: 'TeacherAssignments',
        component: () => import('../views/teacher/Assignments.vue')
      },
      {
        path: 'assignments/create',
        name: 'TeacherAssignmentCreate',
        component: () => import('../views/teacher/AssignmentCreate.vue')
      },
      {
        path: 'grading',
        name: 'TeacherGrading',
        component: () => import('../views/teacher/Grading.vue')
      },
      {
        path: 'calendar',
        name: 'TeacherCalendar',
        component: () => import('../views/teacher/TeacherCalendar.vue')
      },
      {
        path: 'reports',
        name: 'TeacherReports',
        component: () => import('../views/teacher/ReportsView.vue')
      },
      {
        path: 'statistics',
        name: 'TeacherStatistics',
        component: () => import('../views/teacher/ReportsView.vue') // Using reports for now
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
        path: 'classes/:id/live',
        name: 'StudentLiveClass',
        component: () => import('../views/student/LiveClass.vue'),
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
      },
      {
        path: 'analytics',
        name: 'StudentAnalytics',
        component: () => import('../views/student/Analytics.vue')
      },
      {
        path: 'resources',
        name: 'StudentResources',
        component: () => import('../views/student/Resources.vue')
      },
      {
        path: 'achievements',
        name: 'StudentAchievements',
        component: () => import('../views/student/Achievements.vue')
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
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/UsersList.vue')
      },
      {
        path: 'users/create',
        name: 'AdminUserCreate',
        component: () => import('../views/admin/UserCreate.vue')
      },
      {
        path: 'users/:id/edit',
        name: 'AdminUserEdit',
        component: () => import('../views/admin/UserEdit.vue'),
        props: true
      },
      {
        path: 'roles',
        name: 'AdminRoles',
        component: () => import('../views/admin/Roles.vue')
      },
      {
        path: 'schools',
        name: 'AdminSchools',
        component: () => import('../views/admin/SchoolsList.vue')
      },
      {
        path: 'classes',
        name: 'AdminClasses',
        component: () => import('../views/admin/manageclass.vue')
      },
      {
        path: 'classes/:id',
        name: 'AdminClassDetail',
        component: () => import('../views/admin/viewClass.vue'),
        props: true
      },
      {
        path: 'class-templates',
        name: 'AdminClassTemplates',
        component: () => import('../views/admin/ClassTemplates.vue')
      },
      {
        path: 'assignments/moderation',
        name: 'AdminAssignmentsModeration',
        component: () => import('../views/admin/AssignmentsModeration.vue')
      },
      {
        path: 'enrollments',
        name: 'AdminEnrollments',
        component: () => import('../views/admin/Enrollments.vue')
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: () => import('../views/admin/Reports.vue')
      },
      {
        path: 'logs',
        name: 'AdminLogs',
        component: () => import('../views/admin/Logs.vue')
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('../views/admin/Settings.vue')
      },
      {
        path: 'bulk-operations',
        name: 'AdminBulkOperations',
        component: () => import('../views/admin/BulkOperations.vue')
      },
      {
        path: 'analytics',
        name: 'AdminAnalytics',
        component: () => import('../views/admin/Analytics.vue')
      },
      {
        path: 'backup',
        name: 'AdminBackup',
        component: () => import('../views/admin/Backup.vue')
      },
      {
        path: 'users/bulk-import',
        name: 'AdminUserBulkImport',
        component: () => import('../views/admin/UserBulkImport.vue')
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
  
  history: createWebHistory('/online2/'),
  routes
})

// Route guard for role-based access
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('auth:user') || 'null')
  
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
