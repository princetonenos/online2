<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-classroom-gray-900">Classes</h1>
      <div class="flex items-center gap-3">
        <router-link 
          to="/admin/dashboard"
          class="btn-outline flex items-center space-x-2"
          aria-label="Back to admin dashboard"
        >
          <span class="material-icons">arrow_back</span>
          <span>Back</span>
        </router-link>
        <router-link 
          to="/admin/class-templates"
          class="btn-primary flex items-center space-x-2"
          aria-label="Open class templates"
        >
          <span class="material-icons">add</span>
          <span>Create Class</span>
        </router-link>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white rounded-classroom classroom-shadow mb-4">
      <div class="p-4 border-b border-classroom-gray-100">
        <div class="flex flex-col md:flex-row md:items-center gap-3">
          <div class="relative flex-1 max-w-lg">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by class, code, or teacher..."
              class="w-full pl-10 pr-4 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
              aria-label="Search classes"
            >
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-classroom-gray-400">
              search
            </span>
          </div>
          <button class="btn-outline" @click="reload" aria-label="Reload list">
            <span class="material-icons text-sm">refresh</span>
            <span class="hidden sm:inline">Reload</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Classes Table -->
    <div class="bg-white rounded-classroom classroom-shadow overflow-x-auto">
      <table class="w-full">
        <thead class="bg-classroom-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Class</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Code</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Subjects</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Teacher</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Students</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Status</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-classroom-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="c in filteredClasses"
            :key="c.id"
            class="border-b border-classroom-gray-100 hover:bg-classroom-gray-50 transition-colors"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-classroom-primary/10 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-classroom-primary">class</span>
                </div>
                <div>
                  <div class="font-medium text-classroom-gray-900">{{ c.name }}</div>
                  <div class="text-xs text-classroom-gray-500">{{ c.section || c.subject || 'General' }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-classroom-gray-900">
              <div class="flex items-center gap-2">
                <span class="font-mono text-sm">{{ c.code }}</span>
                <button class="btn-ghost px-1" @click="copy(c.code)" :aria-label="`Copy code ${c.code}`">
                  <span class="material-icons text-sm">content_copy</span>
                </button>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1 max-w-[360px]">
                <span v-for="s in (c.subjects||[])" :key="s" class="chip chip-info text-xs">{{ s }}</span>
                <span v-if="!c.subjects || !c.subjects.length" class="text-xs text-classroom-gray-400">—</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <img :src="c.teacherAvatar || '/avatars/teacher1.jpg'" :alt="c.teacherName" class="w-6 h-6 rounded-full" />
                <span class="text-classroom-gray-900">{{ c.teacherName || '—' }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-classroom-gray-900">{{ c.studentCount ?? 0 }}</td>
            <td class="px-4 py-3">
              <span class="chip" :class="c.status === 'ACTIVE' || c.status === 'active' ? 'chip-success' : 'chip-warning'">{{ (c.status||'ACTIVE').toString().toLowerCase() }}</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-2">
                <router-link :to="`/admin/classes/${c.id}`" class="btn-outline text-xs px-2 py-1" aria-label="View class details">View</router-link>
                <button class="btn-outline text-xs px-2 py-1" @click="openStudents(c)" aria-label="Manage students">Students</button>
                <button class="btn-outline text-xs px-2 py-1" @click="openSubjects(c)" aria-label="Manage subjects">Subjects</button>
                <button class="btn-outline text-xs px-2 py-1" @click="toggleStatus(c)" :aria-label="(c.status==='ACTIVE'?'Archive':'Activate') + ' class'" :class="c.status==='ACTIVE'?'text-red-600':'text-green-600'">
                  {{ c.status==='ACTIVE' ? 'Archive' : 'Activate' }}
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!filteredClasses.length">
            <td colspan="7" class="px-4 py-8 text-center text-classroom-gray-500">No classes found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Enroll Students Modal -->
    <div v-if="showStudentsModal && selectedClass" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" @keydown.esc="showStudentsModal=false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden" role="dialog" aria-modal="true" aria-label="Enroll students">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold">Enroll Students · {{ selectedClass.name }}</h3>
          <button class="btn-ghost" @click="showStudentsModal=false" aria-label="Close">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Select from roster</label>
            <div class="flex items-center gap-2 mb-2">
              <input v-model="studentSearch" placeholder="Search students" class="w-full p-2 border rounded-classroom focus:outline-none focus:ring-2 focus:ring-classroom-primary" aria-label="Search students" />
              <span class="text-xs text-classroom-gray-500">{{ filteredRoster.length }} found</span>
            </div>
            <div class="border rounded-classroom max-h-56 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label v-for="stu in filteredRoster" :key="stu.id" class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="selectedStudentIds" :value="stu.id" />
                <span class="truncate">{{ stu.name || stu.fullName || stu.email }}</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Or paste IDs/emails</label>
            <textarea v-model="studentsInput" rows="4" class="w-full p-2 border rounded-classroom focus:outline-none focus:ring-2 focus:ring-classroom-primary" aria-label="Pasted student IDs or emails"></textarea>
          </div>
        </div>
        <div class="p-4 border-t flex items-center justify-end gap-2">
          <button class="btn-outline" @click="showStudentsModal=false">Cancel</button>
          <button class="btn-primary" @click="enrollStudents">Enroll</button>
        </div>
      </div>
    </div>

    <!-- Manage Subjects Modal -->
    <div v-if="showSubjectsModal && selectedClass" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" @keydown.esc="showSubjectsModal=false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden" role="dialog" aria-modal="true" aria-label="Manage subjects">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold">Manage Subjects · {{ selectedClass.name }}</h3>
          <button class="btn-ghost" @click="showSubjectsModal=false" aria-label="Close">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4 space-y-3">
          <label class="block text-sm font-medium">Subjects (comma separated)</label>
          <input v-model="subjectsInput" placeholder="English, Math, Kiswahili" class="w-full p-2 border rounded-classroom focus:outline-none focus:ring-2 focus:ring-classroom-primary" aria-label="Subjects list" />
        </div>
        <div class="p-4 border-t flex items-center justify-end gap-2">
          <button class="btn-outline" @click="showSubjectsModal=false">Cancel</button>
          <button class="btn-primary" @click="saveSubjects">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useUsersStore } from '../../store/users'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const usersStore = useUsersStore()
const searchQuery = ref('')
const classes = ref([])

// Modals
const showStudentsModal = ref(false)
const showSubjectsModal = ref(false)
const selectedClass = ref(null)

// Enrollment state
const studentSearch = ref('')
const selectedStudentIds = ref([])
const studentsInput = ref('')
const rosterStudents = computed(() => usersStore.getStudents ? usersStore.getStudents : (usersStore.users || []).filter(u => u.role === 'student'))
const filteredRoster = computed(() => {
  const q = studentSearch.value.trim().toLowerCase()
  if (!q) return rosterStudents.value
  return rosterStudents.value.filter(s => (s.name||s.fullName||'').toLowerCase().includes(q) || (s.email||'').toLowerCase().includes(q))
})

// Subjects state
const subjectsInput = ref('')

const filteredClasses = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return classes.value
  return classes.value.filter(c => 
    (c.name||'').toLowerCase().includes(q) ||
    (c.code||'').toLowerCase().includes(q) ||
    (c.teacherName||'').toLowerCase().includes(q)
  )
})

function copy(text){
  if (!text) return
  navigator.clipboard.writeText(text).then(()=>{ if (window.showToast) window.showToast('Copied: '+text) })
}

function openStudents(c){
  selectedClass.value = c
  selectedStudentIds.value = []
  studentsInput.value = ''
  showStudentsModal.value = true
}

function openSubjects(c){
  selectedClass.value = c
  const subs = (c.settings && c.settings.subjects) ? c.settings.subjects.join(', ') : (c.subjects||[]).join(', ')
  subjectsInput.value = subs
  showSubjectsModal.value = true
}

async function enrollStudents(){
  if (!selectedClass.value) return
  const token = localStorage.getItem('auth:token')
  const typed = (studentsInput.value || '').split(/[\n,;\s]+/).map(s=>s.trim()).filter(Boolean)
  const ids = Array.from(new Set([...selectedStudentIds.value, ...typed.filter(v=>/^[0-9a-fA-F-]{8,}$/.test(v))]))
  try {
    if (token && ids.length){
      await axios.post(`${API_URL}/classes/${selectedClass.value.id}/students`, { studentIds: ids }, { headers: { Authorization: `Bearer ${token}` } })
      if (window.showToast) window.showToast('Students enrolled')
    }
  } catch(e){ console.warn('Admin enroll failed', e?.message||e) }
  showStudentsModal.value = false
  await reload()
}

async function saveSubjects(){
  if (!selectedClass.value) return
  const arr = subjectsInput.value.split(',').map(s=>s.trim()).filter(Boolean)
  const token = localStorage.getItem('auth:token')
  try {
    if (token){
      await axios.put(`${API_URL}/classes/${selectedClass.value.id}/settings`, { settings: { subjects: arr } }, { headers: { Authorization: `Bearer ${token}` } })
      if (window.showToast) window.showToast('Subjects updated')
    }
  } catch(e){ console.warn('Admin subjects update failed', e?.message||e) }
  showSubjectsModal.value = false
  await reload()
}

function toggleStatus(c){
  c.status = (c.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE')
  if (window.showToast) window.showToast(`Class ${c.status === 'ACTIVE' ? 'activated' : 'archived'}`)
}

async function reload(){
  await usersStore.loadFromStorage?.()
  await loadFromBackend()
}

async function loadFromBackend(){
  try {
    const token = localStorage.getItem('auth:token')
    const res = token ? await axios.get(`${API_URL}/classes`, { headers: { Authorization: `Bearer ${token}` } }) : { data: { data: [] } }
    const items = res.data?.data || []
    classes.value = items.map(it => ({
      id: it.id,
      name: it.name || it.title || 'Untitled',
      code: it.code,
      teacherName: it.owner?.fullName || it.teacherName || '—',
      teacherAvatar: it.owner?.avatarUrl,
      studentCount: it._count?.enrollments || it.studentCount || 0,
      section: it.section,
      subject: it.subject,
      subjects: (it.settings && it.settings.subjects) || [],
      settings: it.settings || {},
      status: it.status || 'ACTIVE'
    }))
    if (!classes.value.length){
      // Fallback demo data
      classes.value = [
        { id: 'c-1', name: 'Grade 1', code: 'GR1-ABCD', teacherName: 'Teacher A', studentCount: 0, subjects: ['English','Math'], status: 'ACTIVE' },
        { id: 'c-2', name: 'PP1', code: 'PP1-XY12', teacherName: 'Teacher B', studentCount: 0, subjects: [], status: 'ACTIVE' }
      ]
    }
  } catch (e) {
    console.warn('Load admin classes failed', e?.message || e)
  }
}

onMounted(async () => {
  await reload()
})
</script>
