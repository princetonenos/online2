<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Calendar</h2>

    <div class="mb-4 flex gap-2">
      <button class="px-3 py-1 bg-green-600 text-white rounded" @click="openCreate">Add event</button>
      <button class="px-3 py-1 border rounded" @click="refresh">Refresh</button>
    </div>

    <!-- basic calendar: grouped by date -->
    <div v-if="grouped.length === 0" class="text-sm text-gray-500">No events. Click Add event to create one.</div>

    <div v-for="grp in grouped" :key="grp.date" class="mb-4">
      <div class="text-sm font-medium text-gray-700 mb-2">{{ grp.date }}</div>
      <ul class="space-y-2">
        <li v-for="ev in grp.events" :key="ev.id" class="bg-white p-3 rounded shadow flex justify-between items-center">
          <div>
            <div class="font-medium">{{ ev.title }}</div>
            <div class="text-xs text-gray-500">{{ formatTime(ev.start) }} - {{ formatTime(ev.end) }} • {{ ev.type || 'event' }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ ev.notes }}</div>
          </div>
          <div class="flex gap-2">
            <button class="text-sm text-blue-600" @click="openEdit(ev)">Edit</button>
            <button class="text-sm text-red-600" @click="remove(ev.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>

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
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')

function refresh() {
  store.fetchAll()
}

onMounted(() => {
  refresh()
})

// get events for this teacher
const events = computed(() => store.events.filter(e => e.ownerId === currentUser?.id))

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

// group events by date (local)
const grouped = computed(() => {
  const list = [...events.value].sort((a,b)=>new Date(a.start)-new Date(b.start))
  const byDate = {}
  for (const e of list) {
    const d = new Date(e.start).toLocaleDateString()
    byDate[d] = byDate[d] || []
    byDate[d].push(e)
  }
  return Object.keys(byDate).map(k => ({ date: k, events: byDate[k] }))
})

function formatTime(iso) {
  try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } catch { return iso }
}
</script>

<style scoped>
/* small responsive tweaks */
</style>
