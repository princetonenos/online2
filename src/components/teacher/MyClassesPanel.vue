<template>
  <div class="p-4 bg-white rounded shadow space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-medium">My classes</h3>
      <button class="text-sm text-blue-600" @click="openAll">All</button>
    </div>

    <ul class="space-y-2">
      <li v-for="c in myClasses" :key="c.id" class="flex items-center justify-between">
        <div>
          <div class="font-medium">{{ c.title }}</div>
          <div class="text-xs text-gray-500">{{ formatDate(c.startAt) }} • {{ c.level }}</div>
        </div>
        <div class="flex gap-2">
          <button class="text-sm text-blue-600" @click="$emit('view', c.id)">View</button>
          <button class="text-sm text-red-600" @click="remove(c.id)">Delete</button>
        </div>
      </li>
      <li v-if="myClasses.length===0" class="text-sm text-gray-500">No classes</li>
    </ul>

    <div class="pt-2">
      <button class="w-full py-2 bg-green-600 text-white rounded" @click="$emit('create')">Create class</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTeacherClassesStore } from '../../stores/teacherClasses'

const store = useTeacherClassesStore()
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
const myClasses = computed(() => store.items.filter(c => c.teacherId === currentUser?.id))

function formatDate(iso) {
  try { return new Date(iso).toLocaleString() } catch { return iso }
}
function openAll() {
  // route to teacher's classes page
  // emit an event and let parent handle navigation
  // parent should listen to '@open-all'
  // fallback: navigate if router available
  // $emit not allowed in script setup directly; parent will handle via @open-all
}
function remove(id) {
  if (!confirm('Delete class?')) return
  store.removeClass(id)
}
</script>
