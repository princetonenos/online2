<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Teaching Calendar
          </h1>
          <p class="text-gray-600 mt-2">Manage your schedule, classes, and important events</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 bg-white rounded-classroom shadow-sm border border-gray-200 p-1">
            <button 
              @click="changeView('month')"
              :class="currentView === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
              class="px-4 py-2 rounded-classroom transition-colors text-sm font-medium"
            >
              Month
            </button>
            <button 
              @click="changeView('week')"
              :class="currentView === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
              class="px-4 py-2 rounded-classroom transition-colors text-sm font-medium"
            >
              Week
            </button>
            <button 
              @click="changeView('day')"
              :class="currentView === 'day' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
              class="px-4 py-2 rounded-classroom transition-colors text-sm font-medium"
            >
              Day
            </button>
          </div>
          <button 
            @click="openCreate"
            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-classroom transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2"
          >
            <span class="material-icons text-sm">add</span>
            <span>Add Event</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar Navigation -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <button 
            @click="previousPeriod"
            class="p-2 bg-gray-100 hover:bg-gray-200 rounded-classroom transition-colors"
          >
            <span class="material-icons text-gray-600 text-sm">chevron_left</span>
          </button>
          <h2 class="text-2xl font-bold text-gray-900">{{ currentPeriodText }}</h2>
          <button 
            @click="nextPeriod"
            class="p-2 bg-gray-100 hover:bg-gray-200 rounded-classroom transition-colors"
          >
            <span class="material-icons text-gray-600 text-sm">chevron_right</span>
          </button>
          <button 
            @click="goToToday"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-classroom transition-colors text-sm font-medium"
          >
            Today
          </button>
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

      <!-- Calendar View -->
      <div class="bg-white rounded-classroom border border-gray-200 overflow-hidden">
        <!-- Month View -->
        <div v-if="currentView === 'month'" class="calendar-month">
          <!-- Weekday Headers -->
          <div class="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            <div 
              v-for="day in weekdays" 
              :key="day"
              class="p-4 text-center text-sm font-semibold text-gray-600 border-r border-gray-200 last:border-r-0"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7">
            <div 
              v-for="day in calendarDays" 
              :key="day.date"
              :class="[
                'min-h-32 p-2 border-r border-b border-gray-200 last:border-r-0',
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                day.isToday ? 'bg-blue-50 border-blue-200' : '',
                day.isSelected ? 'bg-blue-100 border-blue-300' : ''
              ]"
              @click="selectDate(day.date)"
            >
              <div class="flex justify-between items-center mb-2">
                <span 
                  :class="[
                    'text-sm font-medium',
                    day.isToday ? 'bg-blue-500 text-white px-2 py-1 rounded-full' : 'text-gray-900',
                    !day.isCurrentMonth ? 'text-gray-400' : ''
                  ]"
                >
                  {{ day.day }}
                </span>
                <button 
                  @click.stop="quickAddEvent(day.date)"
                  class="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span class="material-icons text-sm">add</span>
                </button>
              </div>
              
              <!-- Events for this day -->
              <div class="space-y-1">
                <div 
                  v-for="event in getEventsForDate(day.date)"
                  :key="event.id"
                  :class="getEventColor(event.type)"
                  class="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate"
                  @click.stop="openEdit(event)"
                >
                  <div class="font-medium">{{ event.title }}</div>
                  <div class="text-xs opacity-75">{{ formatTime(event.start) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div v-if="currentView === 'week'" class="calendar-week">
          <div class="grid grid-cols-8 border-b border-gray-200">
            <div class="p-4 border-r border-gray-200 bg-gray-50"></div>
            <div 
              v-for="day in currentWeekDays" 
              :key="day.date"
              :class="[
                'p-4 text-center border-r border-gray-200 last:border-r-0',
                day.isToday ? 'bg-blue-50' : 'bg-gray-50'
              ]"
            >
              <div class="text-sm font-semibold text-gray-600">{{ day.weekday }}</div>
              <div 
                :class="[
                  'text-lg font-bold mt-1',
                  day.isToday ? 'bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' : 'text-gray-900'
                ]"
              >
                {{ day.day }}
              </div>
            </div>
          </div>

          <!-- Time Slots -->
          <div class="relative">
            <div 
              v-for="hour in hours" 
              :key="hour"
              class="grid grid-cols-8 border-b border-gray-200 min-h-16"
            >
              <div class="p-2 border-r border-gray-200 bg-gray-50 text-right text-sm text-gray-500">
                {{ hour }}:00
              </div>
              <div 
                v-for="day in currentWeekDays" 
                :key="day.date + hour"
                class="p-1 border-r border-gray-200 last:border-r-0 relative hover:bg-gray-50 cursor-pointer"
                @click="quickAddEventWithTime(day.date, hour)"
              >
                <!-- Events for this time slot -->
                <div 
                  v-for="event in getEventsForDateAndTime(day.date, hour)"
                  :key="event.id"
                  :class="getEventColor(event.type)"
                  class="absolute left-1 right-1 p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity"
                  :style="{ top: getEventPosition(event), height: getEventHeight(event) }"
                  @click.stop="openEdit(event)"
                >
                  <div class="font-medium">{{ event.title }}</div>
                  <div class="text-xs opacity-75">{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Day View -->
        <div v-if="currentView === 'day'" class="calendar-day">
          <div class="flex border-b border-gray-200">
            <div class="w-20 p-4 border-r border-gray-200 bg-gray-50"></div>
            <div class="flex-1 p-4 text-center bg-gray-50">
              <div class="text-lg font-bold text-gray-900">{{ selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }}</div>
            </div>
          </div>

          <!-- Time Slots -->
          <div class="relative">
            <div 
              v-for="hour in hours" 
              :key="hour"
              class="flex border-b border-gray-200 min-h-16"
            >
              <div class="w-20 p-2 border-r border-gray-200 bg-gray-50 text-right text-sm text-gray-500">
                {{ hour }}:00
              </div>
              <div 
                class="flex-1 p-1 relative hover:bg-gray-50 cursor-pointer"
                @click="quickAddEventWithTime(selectedDate, hour)"
              >
                <!-- Events for this time slot -->
                <div 
                  v-for="event in getEventsForDateAndTime(selectedDate, hour)"
                  :key="event.id"
                  :class="getEventColor(event.type)"
                  class="absolute left-1 right-1 p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity"
                  :style="{ top: getEventPosition(event), height: getEventHeight(event) }"
                  @click.stop="openEdit(event)"
                >
                  <div class="font-medium">{{ event.title }}</div>
                  <div class="text-xs opacity-75">{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events Sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Upcoming Events -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Upcoming Events</h2>
            <button class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
              <span>View All</span>
              <span class="material-icons text-sm">chevron_right</span>
            </button>
          </div>

          <div class="space-y-4">
            <div 
              v-for="event in upcomingEvents" 
              :key="event.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors cursor-pointer group"
              @click="openEdit(event)"
            >
              <div class="flex items-center space-x-4">
                <div :class="getEventColor(event.type) + ' w-12 h-12 rounded-classroom flex items-center justify-center'">
                  <span class="material-icons text-white text-lg">
                    {{ getEventIcon(event.type) }}
                  </span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ event.title }}</h3>
                  <p class="text-sm text-gray-600">{{ formatDateTime(event.start) }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ event.notes }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  @click.stop="openEdit(event)"
                  class="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                >
                  <span class="material-icons text-sm">edit</span>
                </button>
                <button 
                  @click.stop="remove(event.id)"
                  class="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                >
                  <span class="material-icons text-sm">delete</span>
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="upcomingEvents.length === 0" class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-gray-400 text-2xl">event</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
              <p class="text-gray-500 mb-4">Schedule your first event to get started</p>
              <button 
                @click="openCreate"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <!-- Event Types -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Event Types</h3>
          <div class="space-y-3">
            <div 
              v-for="type in eventTypes" 
              :key="type.value"
              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors cursor-pointer"
              @click="quickAddEventWithType(type.value)"
            >
              <div :class="type.color + ' w-8 h-8 rounded-classroom flex items-center justify-center'">
                <span class="material-icons text-white text-sm">{{ type.icon }}</span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ type.label }}</div>
                <div class="text-xs text-gray-500">{{ type.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar Stats -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Calendar Stats</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Events</span>
              <span class="text-lg font-bold text-gray-900">{{ events.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">This Week</span>
              <span class="text-lg font-bold text-blue-600">{{ thisWeekEvents.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Classes</span>
              <span class="text-lg font-bold text-green-600">{{ classEvents.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Assignments</span>
              <span class="text-lg font-bold text-purple-600">{{ assignmentEvents.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Modal -->
    <EventModal v-model:open="modalOpen" :event="editing" @saved="onSaved" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTeacherClassesStore } from '../../stores/teacherClasses'
import EventModal from '../../components/teacher/EventModal.vue'

const store = useTeacherClassesStore()
const modalOpen = ref(false)
const editing = ref(null)
const currentView = ref('month')
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')

// Event types configuration
const eventTypes = [
  { value: 'class', label: 'Class', icon: 'school', color: 'bg-blue-500', description: 'Scheduled class session' },
  { value: 'assignment', label: 'Assignment', icon: 'assignment', color: 'bg-purple-500', description: 'Homework or project' },
  { value: 'meeting', label: 'Meeting', icon: 'groups', color: 'bg-green-500', description: 'Staff or parent meeting' },
  { value: 'personal', label: 'Personal', icon: 'person', color: 'bg-orange-500', description: 'Personal appointment' },
  { value: 'deadline', label: 'Deadline', icon: 'schedule', color: 'bg-red-500', description: 'Important deadline' }
]

// Initialize store
onMounted(() => {
  refresh()
})

function refresh() {
  store.fetchAll()
}

// Get events for this teacher
const events = computed(() => store.events.filter(e => e.ownerId === currentUser?.id))

// Calendar navigation
const currentPeriodText = computed(() => {
  if (currentView.value === 'month') {
    return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  } else if (currentView.value === 'week') {
    const start = new Date(currentDate.value)
    start.setDate(start.getDate() - start.getDay())
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  } else {
    return selectedDate.value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
})

function changeView(view) {
  currentView.value = view
}

function previousPeriod() {
  if (currentView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  } else if (currentView.value === 'week') {
    currentDate.value = new Date(currentDate.value.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else {
    selectedDate.value = new Date(selectedDate.value.getTime() - 24 * 60 * 60 * 1000)
  }
}

function nextPeriod() {
  if (currentView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  } else if (currentView.value === 'week') {
    currentDate.value = new Date(currentDate.value.getTime() + 7 * 24 * 60 * 60 * 1000)
  } else {
    selectedDate.value = new Date(selectedDate.value.getTime() + 24 * 60 * 60 * 1000)
  }
}

function goToToday() {
  currentDate.value = new Date()
  selectedDate.value = new Date()
}

// Calendar data
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
  
  const days = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    days.push({
      date: new Date(current),
      day: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === new Date().toDateString(),
      isSelected: current.toDateString() === selectedDate.value.toDateString()
    })
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

const currentWeekDays = computed(() => {
  const start = new Date(currentDate.value)
  start.setDate(start.getDate() - start.getDay())
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    return {
      date: date,
      day: date.getDate(),
      weekday: weekdays[date.getDay()],
      isToday: date.toDateString() === new Date().toDateString()
    }
  })
})

// Event management
function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(ev) {
  editing.value = { ...ev }
  modalOpen.value = true
}

function onSaved(ev) {
  if (!ev.id) {
    ev.id = Date.now().toString()
    ev.ownerId = currentUser?.id
    store.addEvent(ev)
  } else {
    store.updateEvent(ev)
  }
  modalOpen.value = false
}

function remove(id) {
  if (!confirm('Delete this event?')) return
  store.removeEvent(id)
}

function selectDate(date) {
  selectedDate.value = date
  if (currentView.value === 'month') {
    currentView.value = 'day'
  }
}

function quickAddEvent(date) {
  editing.value = {
    start: new Date(date.setHours(9, 0, 0, 0)).toISOString(),
    end: new Date(date.setHours(10, 0, 0, 0)).toISOString()
  }
  modalOpen.value = true
}

function quickAddEventWithTime(date, hour) {
  editing.value = {
    start: new Date(date.setHours(hour, 0, 0, 0)).toISOString(),
    end: new Date(date.setHours(hour + 1, 0, 0, 0)).toISOString()
  }
  modalOpen.value = true
}

function quickAddEventWithType(type) {
  editing.value = { type }
  modalOpen.value = true
}

// Event display helpers
function getEventsForDate(date) {
  return events.value.filter(event => {
    const eventDate = new Date(event.start).toDateString()
    return eventDate === date.toDateString()
  })
}

function getEventsForDateAndTime(date, hour) {
  return events.value.filter(event => {
    const eventDate = new Date(event.start).toDateString()
    const eventHour = new Date(event.start).getHours()
    return eventDate === date.toDateString() && eventHour === hour
  })
}

function getEventColor(type) {
  const eventType = eventTypes.find(t => t.value === type) || eventTypes[0]
  return `${eventType.color} text-white`
}

function getEventIcon(type) {
  const eventType = eventTypes.find(t => t.value === type) || eventTypes[0]
  return eventType.icon
}

function getEventPosition(event) {
  const start = new Date(event.start)
  const minutes = start.getMinutes()
  return `${(minutes / 60) * 64}px` // 64px per hour
}

function getEventHeight(event) {
  const start = new Date(event.start)
  const end = new Date(event.end)
  const duration = (end - start) / (1000 * 60 * 60) // hours
  return `${duration * 64}px` // 64px per hour
}

function formatTime(iso) {
  try { 
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
  } catch { 
    return iso 
  }
}

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString([], { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    })
  } catch {
    return iso
  }
}

// Filtered events
const upcomingEvents = computed(() => {
  const now = new Date()
  return events.value
    .filter(event => new Date(event.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5)
})

const thisWeekEvents = computed(() => {
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return events.value.filter(event => {
    const eventDate = new Date(event.start)
    return eventDate >= now && eventDate <= nextWeek
  })
})

const classEvents = computed(() => {
  return events.value.filter(event => event.type === 'class')
})

const assignmentEvents = computed(() => {
  return events.value.filter(event => event.type === 'assignment')
})
</script>

<style scoped>
.calendar-month .grid > div {
  min-height: 120px;
}

.calendar-week .grid > div,
.calendar-day .grid > div {
  min-height: 64px;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
