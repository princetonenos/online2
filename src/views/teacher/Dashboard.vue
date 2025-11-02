<template>
  <div class="p-6 space-y-6">
    <app-header :user="currentUser" />

    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Teacher dashboard</h1>
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
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <kpi-widget title="Active classes" :value="stats.activeClasses" @click.native="goToClasses" />
          <kpi-widget title="Students" :value="stats.totalStudents" @click.native="goToStudents" />
          <kpi-widget title="Avg. completion" :value="stats.avgCompletion + '%'" @click.native="goToStatistics" />
        </div>

        <section class="bg-white rounded shadow p-4">
          <h3 class="font-medium mb-2">Upcoming classes</h3>
          <ul class="space-y-2">
            <li v-for="c in upcoming" :key="c.id" class="flex justify-between items-center">
              <div>
                <div class="font-medium">{{ c.title }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(c.startAt) }} • {{ c.level }}</div>
              </div>
              <div class="flex items-center gap-2">
                <button class="text-sm text-blue-600" @click="joinClass(c.id)">Join</button>
                <button class="text-sm" @click="viewClass(c.id)">View</button>
              </div>
            </li>
            <li v-if="upcoming.length===0" class="text-sm text-gray-500">No upcoming classes</li>
          </ul>
        </section>
      </section>

      <aside class="space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <QuickActionCard icon="➕" title="Create class" subtitle="Quick create" @click="openCreate" />
          <QuickActionCard icon="📝" title="Assignments" subtitle="View & grade" @click="goToAssignments" />
          <QuickActionCard icon="📊" title="Statistics" subtitle="Class performance" @click="goToStatistics" />
          <QuickActionCard icon="👥" title="Students" subtitle="Manage students" @click="goToStudents" />
        </div>

        <div class="bg-white p-3 rounded shadow">
          <div class="text-sm text-gray-600 mb-2">Quick actions</div>
          <button class="w-full py-2 bg-green-600 text-white rounded" @click="openCreate">Create class</button>
        </div>
      </aside>
    </div>

    <!-- Tab content -->
    <section class="bg-white rounded shadow p-4">
      <component :is="activeComponent" :items="tabData" @edit-student="editStudent" />
    </section>

    <!-- Create Class Modal -->
    <CreateClassModal v-model:open="createOpen" @created="onClassCreated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeacherClassesStore } from '../../stores/teacherClasses'
import QuickActionCard from '../../components/admin/QuickActionCard.vue'
import CreateClassModal from '../../components/teacher/CreateClassModal.vue'
import KpiWidget from '../../components/admin/KPIWidget.vue'
import AppHeader from '../../components/AppHeader.vue'

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
  if (activeTab.value === 'assignments') return store.getAssignments()
  return []
})

const stats = ref({ activeClasses: 0, totalStudents: 0, avgCompletion: 0 })
const upcoming = ref([])

function formatDate(ts) {
  try { return new Date(ts).toLocaleString() } catch { return ts }
}

async function load() {
  await store.fetchAll()
  stats.value.activeClasses = store.active().length
  stats.value.totalStudents = store.totalStudents()
  stats.value.avgCompletion = store.avgCompletion()
  upcoming.value = store.upcoming(5)
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
function goToStatistics() { router.push({ name: 'TeacherStatistics' }) }

function openCreate(){ createOpen.value = true }
function onClassCreated(payload){
  store.add(payload)
  createOpen.value = false
  load()
}
function viewClass(id){ router.push({ name: 'TeacherClassDetail', params: { id } }) }
function joinClass(id){ router.push({ name: 'TeacherClassJoin', params: { id } }) }
function editStudent(id){ router.push({ name: 'TeacherStudentDetail', params: { id } }) }

const nextClassText = computed(()=> {
  const next = store.upcoming(1)[0]
  return next ? formatDate(next.startAt) : 'No classes'
})
</script>

<style scoped>
/* adapt to your design tokens */
</style>
