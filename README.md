# Google Classroom Replica

A pixel-accurate front-end replica of Google Classroom built with Vue 3, featuring the exact layout, design tokens, and user flows of the original product.

## Features

- **Dashboard**: Course grid with welcome section and upcoming assignments
- **Course Navigation**: Stream, Classwork, People, and Grades tabs
- **Stream**: Announcements, posts, comments, and attachments
- **Classwork**: Topics, assignments, quizzes, and materials
- **People**: Teachers and students management
- **Grades**: Student and teacher gradebook views
- **Assignment Detail**: Full assignment workflow with submissions and grading

## Tech Stack

- **Vue 3** (Composition API)
- **Vue Router** for navigation
- **Pinia** for state management
- **Tailwind CSS** for styling
- **Material Icons** + **Google Fonts Roboto**
- **Vite** for development server

## Design Tokens

- **Primary Green**: `#20A464` (class tile accent)
- **Secondary Yellow**: `#F5BA14` (accents)
- **Support Green**: `#60BE90` (gradients)
- **Primary Font**: Roboto (400/500/700)
- **Baseline Spacing**: 4px scale
- **Border Radius**: 8px

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppHeader.vue
│   ├── AppDrawer.vue
│   ├── CourseTile.vue
│   ├── StreamComposer.vue
│   ├── PostItem.vue
│   ├── AttachmentPreview.vue
│   ├── AssignmentCard.vue
│   └── ...
├── views/              # Page-level components
│   ├── Dashboard.vue
│   ├── CourseShell.vue
│   ├── Stream.vue
│   ├── Classwork.vue
│   ├── People.vue
│   ├── Grades.vue
│   └── AssignmentDetail.vue
├── store/              # Pinia stores
│   ├── courses.js
│   ├── users.js
│   ├── posts.js
│   └── assignments.js
├── router/             # Vue Router configuration
│   └── index.js
├── data/mock/          # Mock data
│   ├── users.json
│   ├── courses.json
│   ├── posts.json
│   └── assignments.json
└── ...
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5173/`

## Available Routes

- `/` - Dashboard (course grid)
- `/course/:id/stream` - Stream (announcements)
- `/course/:id/classwork` - Classwork (assignments)
- `/course/:id/people` - People (teachers & students)
- `/course/:id/grades` - Grades (gradebook)
- `/course/:id/assignments/:assignmentId` - Assignment detail

## Key Features Implemented

### ✅ Core Functionality
- [x] Dashboard with course grid
- [x] Course navigation with tabs
- [x] Stream with posts and comments
- [x] Classwork with topics and assignments
- [x] People management
- [x] Grades and gradebook
- [x] Assignment submission workflow

### ✅ UI/UX Features
- [x] Pixel-accurate Google Classroom design
- [x] Responsive design for desktop and mobile
- [x] Material Design icons and components
- [x] Loading skeletons and empty states
- [x] Toast notifications
- [x] Accessibility features (ARIA labels, focus management)

### ✅ State Management
- [x] User authentication and role switching
- [x] Course and assignment data
- [x] Posts and comments
- [x] Submissions and grades
- [x] Local storage persistence

## Simulated Limitations

- **No Backend**: All data is mocked and persisted in localStorage
- **File Uploads**: File selection is simulated (no actual upload)
- **Real-time Features**: Comments and updates are simulated
- **Authentication**: Role switching instead of real login

## Role Switching

The app includes a role switcher in the user menu to test both teacher and student experiences:
- **Teacher**: Can create posts, assignments, and grade submissions
- **Student**: Can view content, submit assignments, and see grades

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development Notes

- Uses Vue 3 Composition API for better TypeScript support and code organization
- Tailwind CSS configured with exact Google Classroom design tokens
- Mock data includes realistic course structures and user interactions
- All components are fully responsive and accessible

## Legal Notice

This is a front-end replica for educational and prototyping purposes. Google Classroom is a trademark of Google LLC. This project does not use Google logos or claim any affiliation with Google. All design tokens and layouts are recreated based on public interface analysis for learning purposes.
