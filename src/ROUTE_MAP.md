# Route Mapping - Classroom Application

## View Components Inventory

### Admin Portal Views
- `src/views/admin/SchoolsView.vue` → Admin Navigation > Schools
- `src/views/admin/UsersView.vue` → Admin Navigation > Users  
- `src/views/admin/ReportsView.vue` → Admin Navigation > Reports

### Teacher Portal Views
- `src/views/TeacherDashboard.vue` → Teacher Portal Home
- `src/views/ClassesList.vue` → Teacher Navigation > My Classes
- `src/views/ClassDetail.vue` → Teacher Classes Detail
- `src/views/ClassCreate.vue` → Teacher Create Class
- `src/views/AssignmentList.vue` → Teacher Navigation > Assignments
- `src/views/AssignmentCreate.vue` → Teacher Create Assignment
- `src/views/CalendarView.vue` → Teacher Navigation > Calendar
- `src/views/Reports.vue` → Teacher Navigation > Reports
- `src/views/Settings.vue` → Teacher Navigation > Settings

### Student Portal Views
- `src/views/student/Dashboard.vue` → Student Portal Home
- `src/views/student/ClassList.vue` → Student Navigation > My Classes
- `src/views/student/ClassDetail.vue` → Student Class Detail
- `src/views/student/JoinClass.vue` → Student Join Class
- `src/views/student/Classwork.vue` → Student Navigation > Assignments
- `src/views/student/AssignmentDetail.vue` → Student Assignment Detail
- `src/views/student/CalendarView.vue` → Student Navigation > Calendar
- `src/views/student/Grades.vue` → Student Navigation > Grades
- `src/views/student/People.vue` → Student People Page
- `src/views/student/Stream.vue` → Student Stream Page

### Shared Views
- `src/views/Login.vue` → Application Login
- `src/views/ProfileView.vue` → Shared Navigation > Profile
- `src/views/CalendarView.vue` → Shared Navigation > Calendar
- `src/views/Dashboard.vue` → Legacy Dashboard (to be deprecated)
- `src/views/Create.vue` → Legacy Create (to be deprecated)

### Course Views (Nested Routes)
- `src/views/CourseShell.vue` → Course Layout Container
- `src/views/Stream.vue` → Course Stream
- `src/views/Classwork.vue` → Course Classwork
- `src/views/People.vue` → Course People
- `src/views/Grades.vue` → Course Grades
- `src/views/LiveClass.vue` → Course Live Session
- `src/views/AssignmentDetail.vue` → Course Assignment Detail

### Component Files
- `src/components/AppDrawer.vue` → Main Sidebar Navigation
- `src/components/AppHeader.vue` → Main Header
- `src/components/PortalNavigation.vue` → Role-Based Portal Navigation
- `src/components/CourseTile.vue` → Course Display Component
- `src/components/AssignmentCard.vue` → Assignment Display Component
- `src/components/AttachmentPreview.vue` → File Attachment Component
- `src/components/PostItem.vue` → Stream Post Component
- `src/components/StreamComposer.vue` → Stream Post Composer

## Navigation Structure

### Admin Navigation
- Calendar → `/calendar` (CalendarView)
- Profile → `/profile` (ProfileView)
- Schools → `/admin/schools` (SchoolsView)
- Users → `/admin/users` (UsersView)
- Reports → `/admin/reports` (AdminReports)
- Settings → `/settings` (Settings)

### Teacher Navigation
- Calendar → `/teacher/calendar` (CalendarView)
- Profile → `/profile` (ProfileView)
- My Classes → `/teacher/classes` (ClassesList)
- Assignments → `/teacher/assignments` (AssignmentList)
- Grades → `/grades` (Grades)
- Settings → `/settings` (Settings)

### Student Navigation
- Calendar → `/student/calendar` (StudentCalendar)
- Profile → `/profile` (ProfileView)
- My Classes → `/student/classes` (StudentClasses)
- Assignments → `/student/classwork` (StudentClasswork)
- Grades → `/student/grades` (StudentGrades)

## Route Configuration Status

✅ **All views are properly registered in router**
✅ **All navigation links are wired correctly**
✅ **Role-based redirects are implemented**
✅ **Data-testid attributes are present on all main pages**
✅ **Active link highlighting works correctly**

## Missing Pages Status

❌ **No missing pages** - All referenced components exist and are accessible

## Accessibility Status

✅ **Proper ARIA labels on all interactive elements**
✅ **Focus management implemented**
✅ **Semantic HTML structure**
✅ **Keyboard navigation support**

## Testing Coverage

✅ **All main pages have data-testid attributes**
✅ **Navigation flows tested for all roles**
✅ **No console errors during navigation**
