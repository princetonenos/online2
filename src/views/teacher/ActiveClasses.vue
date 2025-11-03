<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Active classes</h2>
    <div v-if="classes.length === 0" class="text-sm text-gray-500">No active classes.</div>
    <ul class="space-y-3">
      <li v-for="c in classes" :key="c.id" class="bg-white rounded shadow p-4 flex justify-between items-center">
        <div>
          <div class="font-medium">{{ c.title }}</div>
          <div class="text-xs text-gray-500">{{ formatDate(c.startAt) }} • {{ c.level }} • {{ c.status }}</div>
        </div>
        <div class="flex gap-2">
          <router-link :to="{ name: 'TeacherClassDetail', params: { id: c.id } }" class="text-sm text-blue-600">Open</router-link>
          <button class="text-sm text-red-600" @click="remove(c.id)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTeacherClassesStore } from '../../stores/teacherClasses'
const store = useTeacherClassesStore()
store.fetchAll()
const classes = computed(() => store.active().filter(c => c.teacherId === (JSON.parse(localStorage.getItem('mock:currentUser')||'{}').id)))
function formatDate(iso){ try{return new Date(iso).toLocaleString()}catch{return iso} }
function remove(id){
  if(!confirm('Delete class?')) return
  store.removeClass(id)
}
</script>

<style scoped></style>
