<template>
  <div class="p-6 space-y-6">
    

    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Teacher Dashboard</h1>
      <div class="flex items-center gap-3">
        <div class="text-sm text-gray-600">Next class</div>
        <div class="text-base font-medium">{{ nextClassText }}</div>
      </div>
    </div>

    <!-- Tabs -->
    <nav class="flex gap-3 border-b pb-3">
      <button v-for="t in tabs" :key="t.key"
        @click="activateTab(t.key)"
        :class="['px-3 py-2 rounded', activeTab === t.key ? 'bg-green-50 border-b-2 border-green-600' : 'hover:bg-gray-50']">
        {{ t.label }}
      </button>
    </nav>

    <!-- Top area: KPIs + Quick actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section class="lg:col-span-2 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <kpi-widget title="Active classes" :value="stats.activeClasses" @click.native="goToClasses" />
          <kpi-widget title="Students" :value="stats.totalStudents" @click.native="goToClasses" />
          <kpi-widget title="Assignments" :value="stats.totalAssignments" @click.native="goToAssignments" />
          <kpi-widget title="Grading" :value="stats.pendingGrading" @click.native="goToAssignments" />
        </div>

        <!-- Upcoming classes and events -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section class="bg-white rounded shadow p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">Upcoming classes</h3>
              <button class="text-sm text-blue-600" @click="goToClasses">View all</button>
            </div>
            <ul class="space-y-2">
              <li v-for="c in upcomingClasses" :key="c.id" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <div class="font-medium text-sm">{{ c.title }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(c.startAt) }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="text-xs text-blue-600 hover:text-blue-800" @click="viewClass(c.id)">View</button>
                  <button class="text-xs text-green-600 hover:text-green-800" @click="joinClass(c.id)">Join</button>
                </div>
              </li>
              <li v-if="upcomingClasses.length===0" class="text-sm text-gray-500 text-center py-4">No upcoming classes</li>
            </ul>
          </section>

          <section class="bg-white rounded shadow p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">Upcoming events</h3>
              <button class="text-sm text-blue-600" @click="goToCalendar">View all</button>
            </div>
            <ul class="space-y-2">
              <li v-for="e in upcomingEvents" :key="e.id" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <div class="font-medium text-sm">{{ e.title }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(e.start) }}</div>
                </div>
                <div class="text-xs px-2 py-1 rounded" 
                     :class="e.type === 'meeting' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                  {{ e.type }}
                </div>
              </li>
              <li v-if="upcomingEvents.length===0" class="text-sm text-gray-500 text-center py-4">No upcoming events</li>
            </ul>
          </section>
        </div>

        <!-- Assignments needing grading -->
        <section class="bg-white rounded shadow p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium">Assignments needing grading</h3>
            <button class="text-sm text-blue-600" @click="goToAssignments">View all</button>
          </div>
          <ul class="space-y-2">
            <li v-for="a in assignmentsNeedingGrading" :key="a.id" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div>
                <div class="font-medium text-sm">{{ a.title }}</div>
                <div class="text-xs text-gray-500">
                  Due: {{ formatDate(a.dueDate) }} • 
                  Submissions: {{ a.submissions }} • 
                  Graded: {{ a.graded }}/{{ a.submissions }}
                </div>
              </div>
              <button class="text-xs bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600" 
                      @click="gradeAssignment(a.id)">
                Grade
              </button>
            </li>
            <li v-if="assignmentsNeedingGrading.length===0" class="text-sm text-gray-500 text-center py-4">No assignments need grading</li>
          </ul>
        </section>
      </section>

      <aside class="space-y-4">
        <!-- My Classes Panel -->
        <MyClassesPanel @create="openCreate" @view="viewClass" @open-all="goToClasses" />

        <div class="quick-grid">
          <div class="transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <QuickActionCard icon="➕" title="Create class" subtitle="Quick create" @click="openCreate" />
          </div>
          <div class="transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <QuickActionCard icon="📚" title="My classes" subtitle="View & manage" @click="goToClasses" />
          </div>
          <div class="transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <QuickActionCard icon="📝" title="Assignments" subtitle="View & grade" @click="goToAssignments" />
          </div>
          <div class="transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <QuickActionCard icon="📅" title="Calendar" subtitle="Schedule events" @click="goToCalendar" />
          </div>
        </div>

        <div class="bg-white p-4 rounded shadow">
          <div class="text-sm font-medium text-gray-700 mb-3">Quick stats</div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Total classes:</span>
              <span class="font-medium">{{ stats.activeClasses }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total students:</span>
              <span class="font-medium">{{ stats.totalStudents }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Avg. progress:</span>
              <span class="font-medium">{{ stats.avgCompletion }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Pending grading:</span>
              <span class="font-medium text-orange-600">{{ stats.pendingGrading }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-3 rounded shadow">
          <div class="text-sm text-gray-600 mb-2">Quick actions</div>
          <div class="space-y-2">
            <button class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700" @click="openCreate">
              Create class
            </button>
            <button class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="openCreateCourse">
              Create course
            </button>
            <button class="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700" @click="goToCalendar">
              Add event
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Tab content -->
    <section class="bg-white rounded shadow p-4">
      <component :is="activeComponent" :items="tabData" @edit-student="editStudent" />
    </section>

    <!-- Create Class Modal -->
    <CreateClassModal v-model:open="createOpen" @created="onClassCreated" />

    <!-- Create Course Modal -->
    <CreateCourseModal v-model:open="createCourseOpen" @created="onCourseCreated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeacherClassesStore } from '../../stores/teacherClasses'
import QuickActionCard from '../../components/admin/QuickActionCard.vue'
import CreateClassModal from '../../components/teacher/CreateClassModal.vue'
import CreateCourseModal from '../../components/teacher/CreateCourseModal.vue'
import MyClassesPanel from '../../components/teacher/MyClassesPanel.vue'
import KpiWidget from '../../components/admin/KPIWidget.vue'

/* child components used dynamically (simple inline views) */
const ClassesListInline = {
  props: ['items'],
  template: `
    <div>
      <h3 class="font-medium mb-2">Active classes</h3>
      <ul class="space-y-2">
        <li v-for="c in items" :key="c.id" class="flex justify-between">
          <div><div class="font-medium">{{ c.title }}</div><div class="text-xs text-gray-500">{{ c.startAt }}</div></div>
          <div><router-link :to="{ name: 'TeacherClassDetail', params:{id:c.id} }" class="text-sm text-blue-600">Open</router-link></div>
        </li>
      </ul>
    </div>`
}

const StudentsInline = {
  props: ['items'],
  template: `
    <div>
      <h3 class="font-medium mb-2">Students</h3>
      <ul class="space-y-2">
        <li v-for="s in items" :key="s.id" class="flex justify-between items-center">
          <div>
            <div class="font-medium">{{ s.name }}</div>
            <div class="text-xs text-gray-500">{{ s.email }}</div>
          </div>
          <div>
            <router-link :to="{ name: 'TeacherStudentDetail', params:{id:s.id} }" class="text-sm text-blue-600">Open</router-link>
          </div>
        </li>
      </ul>
    </div>`
}

const AssignmentsInline = {
  props: ['items'],
  template: `<div><h3 class="font-medium mb-2">Assignments</h3><div class="text-sm text-gray-500">List & quick stats go here</div></div>`
}

const StatisticsInline = {
  props: ['items'],
  template: `<div><h3 class="font-medium mb-2">Statistics</h3><div class="text-sm text-gray-500">Graphs and completion rates</div></div>`
}

/* store + router */
const router = useRouter()
const store = useTeacherClassesStore()

const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
const createOpen = ref(false)
const createCourseOpen = ref(false)

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'active', label: 'Active classes' },
  { key: 'students', label: 'Students' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'stats', label: 'Avg. completion' }
]
const activeTab = ref('overview')

const tabComponentMap = {
  overview: ClassesListInline,
  active: ClassesListInline,
  students: StudentsInline,
  assignments: AssignmentsInline,
  stats: StatisticsInline
}

const activeComponent = computed(() => tabComponentMap[activeTab.value] || ClassesListInline)
const tabData = computed(() => {
  if (activeTab.value === 'students') return store.getStudents()
  if (activeTab.value === 'active' || activeTab.value === 'overview') return store.active()
  if (activeTab.value === 'assignments') return []
  return []
})

// Computed properties for data
const upcomingClasses = computed(() => store.upcoming(5))
const upcomingEvents = computed(() => {
  const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
  return store.events.filter(e => e.ownerId === currentUser?.id && new Date(e.start) > new Date()).slice(0, 5)
})
const assignmentsNeedingGrading = computed(() => [])

const stats = ref({ 
  activeClasses: 0, 
  totalStudents: 0, 
  totalAssignments: 0,
  pendingGrading: 0,
  avgCompletion: 0 
})

function formatDate(ts) {
  try { return new Date(ts).toLocaleString() } catch { return ts }
}

async function load() {
  await store.fetchAll()
  
  stats.value.activeClasses = store.active().length
  stats.value.totalStudents = store.totalStudents()
  stats.value.totalAssignments = store.courses.length
  stats.value.pendingGrading = 0
  stats.value.avgCompletion = store.avgCompletion()
}

onMounted(load)

function activateTab(key) {
  activeTab.value = key
  // navigate to the page for deeper actions
  if (key === 'active') router.push({ name: 'TeacherClasses' })
  if (key === 'students') router.push({ name: 'TeacherStudents' })
  if (key === 'stats') router.push({ name: 'TeacherStatistics' })
}

function goToClasses() { router.push({ name: 'TeacherClasses' }) }
function goToStudents() { router.push({ name: 'TeacherStudents' }) }
function goToAssignments() { router.push({ name: 'TeacherAssignments' }) }
function goToCalendar() { router.push({ name: 'TeacherCalendar' }) }
function goToStatistics() { router.push({ name: 'TeacherStatistics' }) }

function openCreate(){ createOpen.value = true }
function openCreateCourse(){ createCourseOpen.value = true }
function onClassCreated(payload){
  store.addClass(payload)
  createOpen.value = false
  load()
}
function onCourseCreated(payload){
  store.addCourse(payload)
  createCourseOpen.value = false
  load()
}
function viewClass(id){ router.push({ name: 'TeacherClassDetail', params: { id } }) }
function joinClass(id){ router.push({ name: 'LiveSession', params: { id } }) }
function editStudent(id){ 
  router.push({ name: 'TeacherStudents' }) 
}
function gradeAssignment(id){ 
  router.push({ name: 'TeacherAssignmentList' }) 
}

const nextClassText = computed(()=> {
  const next = store.upcoming(1)[0]
  return next ? formatDate(next.startAt) : 'No classes'
})
</script>

<style scoped>
.quick-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0,1fr));
}
</style>
