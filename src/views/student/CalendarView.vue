<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Calendar</h1>
      <p class="text-classroom-gray-600">Your class schedule and assignment due dates</p>
    </div>

    <!-- Calendar view -->
    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-medium text-classroom-gray-900">{{ currentMonth }}</h2>
        <div class="flex items-center space-x-2">
          <button 
            @click="previousMonth"
            class="p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors"
          >
            <span class="material-icons">chevron_left</span>
          </button>
          <button 
            @click="nextMonth"
            class="p-2 rounded-classroom hover:bg-classroom-gray-100 transition-colors"
          >
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div 
          v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
          :key="day"
          class="text-center text-sm font-medium text-classroom-gray-500 py-2"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="min-h-24 border border-classroom-gray-200 p-2"
          :class="{
            'bg-classroom-gray-50': !day.isCurrentMonth,
            'hover:bg-classroom-gray-50 cursor-pointer': day.isCurrentMonth
          }"
          @click="day.isCurrentMonth && selectDate(day.date)"
        >
          <div class="flex items-center justify-between mb-1">
            <span 
              class="text-sm font-medium"
              :class="{
                'text-classroom-gray-400': !day.isCurrentMonth,
                'text-classroom-gray-900': day.isCurrentMonth && !day.isToday,
                'text-classroom-primary bg-classroom-primary rounded-full w-6 h-6 flex items-center justify-center': day.isToday
              }"
            >
              {{ day.day }}
            </span>
          </div>

          <!-- Events -->
          <div class="space-y-1">
            <div
              v-for="event in day.events"
              :key="event.id"
              class="text-xs p-1 rounded-classroom truncate cursor-pointer"
              :class="getEventClass(event.type)"
              @click.stop="navigateToEvent(event)"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming events -->
    <div class="mt-8">
      <h2 class="text-2xl font-medium text-classroom-gray-900 mb-6">Upcoming Events</h2>
      
      <div class="bg-white rounded-classroom classroom-shadow overflow-hidden">
        <div v-if="upcomingEvents.length === 0" class="p-8 text-center text-classroom-gray-500">
          <span class="material-icons text-4xl mb-2 opacity-50">event</span>
          <p>No upcoming events</p>
        </div>
        
        <div v-else class="divide-y divide-classroom-gray-100">
          <div
            v-for="event in upcomingEvents"
            :key="event.id"
            class="p-4 hover:bg-classroom-gray-50 transition-colors cursor-pointer"
            @click="navigateToEvent(event)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-classroom-gray-900 mb-1">
                  {{ event.title }}
                </h3>
                <p class="text-sm text-classroom-gray-600 mb-2">
                  {{ event.description }}
                </p>
                <div class="flex items-center space-x-4 text-xs text-classroom-gray-500">
                  <span class="flex items-center space-x-1">
                    <span class="material-icons text-sm">schedule</span>
                    <span>{{ formatEventTime(event) }}</span>
                  </span>
                  <span class="chip" :class="getEventTypeClass(event.type)">
                    {{ event.type === 'class' ? 'Class' : 'Assignment' }}
                  </span>
                </div>
              </div>
              <span class="material-icons text-classroom-gray-400">chevron_right</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'
import { useAssignmentsStore } from '../../store/assignments'

const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

const currentDate = ref(new Date())
const currentMonth = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // First day of the month
  const firstDay = new Date(year, month, 1)
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)
  
  // Start from the first Sunday of the calendar view
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  // End at the last Saturday of the calendar view
  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateCopy = new Date(date)
    const dayEvents = getEventsForDate(dateCopy)
    
    days.push({
      date: new Date(dateCopy),
      day: dateCopy.getDate(),
      isCurrentMonth: dateCopy.getMonth() === month,
      isToday: dateCopy.toDateString() === today.toDateString(),
      events: dayEvents
    })
  }
  
  return days
})

const upcomingEvents = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const events = []
  
  // Add classes (mock schedule)
  enrolledClasses.value.forEach(course => {
    // Mock class schedule - in real app this would come from course schedule data
    const classDays = ['Mon', 'Wed', 'Fri'] // Example schedule
    const classTime = '10:00 AM'
    
    classDays.forEach(day => {
      const nextClassDate = getNextClassDate(day)
      if (nextClassDate >= today) {
        events.push({
          id: `class-${course.id}-${nextClassDate.toISOString()}`,
          title: course.name,
          description: `Class with ${course.teacherName}`,
          date: nextClassDate,
          type: 'class',
          courseId: course.id
        })
      }
    })
  })
  
  // Add assignments
  assignmentsStore.assignments.forEach(assignment => {
    const dueDate = new Date(assignment.dueDate)
    if (dueDate >= today) {
      const course = coursesStore.getCourseById(assignment.courseId)
      events.push({
        id: `assignment-${assignment.id}`,
        title: assignment.title,
        description: `Due for ${course?.name || 'Unknown Course'}`,
        date: dueDate,
        type: 'assignment',
        assignmentId: assignment.id,
        courseId: assignment.courseId
      })
    }
  })
  
  return events
    .sort((a, b) => a.date - b.date)
    .slice(0, 10)
})

const enrolledClasses = computed(() => {
  if (!usersStore.currentUser) return []
  return coursesStore.getCoursesForUser(usersStore.currentUser.id)
})

const getEventsForDate = (date) => {
  const events = []
  const dateString = date.toDateString()
  
  // Check for classes on this day
  enrolledClasses.value.forEach(course => {
    const classDays = ['Mon', 'Wed', 'Fri'] // Mock schedule
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    
    if (classDays.includes(dayName)) {
      events.push({
        id: `class-${course.id}-${dateString}`,
        title: course.name,
        type: 'class',
        courseId: course.id
      })
    }
  })
  
  // Check for assignments due on this day
  assignmentsStore.assignments.forEach(assignment => {
    const dueDate = new Date(assignment.dueDate)
    if (dueDate.toDateString() === dateString) {
      events.push({
        id: `assignment-${assignment.id}`,
        title: assignment.title,
        type: 'assignment',
        assignmentId: assignment.id,
        courseId: assignment.courseId
      })
    }
  })
  
  return events
}

const getNextClassDate = (dayName) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const targetDay = days.indexOf(dayName)
  const currentDay = today.getDay()
  
  let daysToAdd = targetDay - currentDay
  if (daysToAdd <= 0) daysToAdd += 7
  
  const nextDate = new Date(today)
  nextDate.setDate(today.getDate() + daysToAdd)
  return nextDate
}

const getEventClass = (type) => {
  switch (type) {
    case 'class':
      return 'bg-classroom-primary bg-opacity-10 text-classroom-primary'
    case 'assignment':
      return 'bg-classroom-secondary bg-opacity-10 text-classroom-secondary'
    default:
      return 'bg-classroom-gray-100 text-classroom-gray-700'
  }
}

const getEventTypeClass = (type) => {
  switch (type) {
    case 'class':
      return 'chip-primary'
    case 'assignment':
      return 'chip-secondary'
    default:
      return 'chip-gray'
  }
}

const formatEventTime = (event) => {
  if (event.type === 'class') {
    return `${event.date.toLocaleDateString()} at 10:00 AM` // Mock time
  } else {
    return `Due ${event.date.toLocaleDateString()}`
  }
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDate = (date) => {
  // In a real app, this might show a modal with events for that day
  console.log('Selected date:', date)
}

const navigateToEvent = (event) => {
  if (event.type === 'class') {
    router.push(`/student/classes/${event.courseId}`)
  } else if (event.type === 'assignment') {
    router.push(`/student/classwork/${event.assignmentId}`)
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      coursesStore.loadCourses(),
      assignmentsStore.loadAssignments()
    ])
  } catch (error) {
    console.error('Error loading calendar data:', error)
    showToast('Error loading calendar information')
  }
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
