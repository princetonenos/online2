<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Grading</h2>
    <div v-if="toGrade.length===0" class="text-sm text-gray-500">No submissions pending grading.</div>
    <ul class="space-y-3">
      <li v-for="entry in toGrade" :key="entry.key" class="bg-white rounded shadow p-4">
        <div class="flex justify-between">
          <div>
            <div class="font-medium">{{ entry.assignment.title }}</div>
            <div class="text-xs text-gray-500">{{ getStudentName(entry.sub.userId) }} • {{ formatDate(entry.sub.submittedAt) }}</div>
          </div>
          <div class="flex gap-2 items-center">
            <input v-model.number="entry.value" type="number" class="w-20 p-1 border rounded" placeholder="Grade"/>
            <button class="px-3 py-1 bg-green-600 text-white rounded" @click="saveGrade(entry)">Save</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const assignments = JSON.parse(localStorage.getItem('mock:assignments')||'[]')
const students = JSON.parse(localStorage.getItem('mock:students')||'[]')
const toGrade = ref([])
function formatDate(iso){ try{return new Date(iso).toLocaleString()}catch{return iso} }
function getStudentName(id){ const s = students.find(x=>x.id===id); return s? s.name : id }
// prepare list of ungraded submissions
for(const a of assignments){
  if(a.submissions && a.submissions.length){
    for(const sub of a.submissions){
      if(sub.grade==null){
        toGrade.value.push({ key: a.id + ':' + sub.userId, assignment: a, sub, value: null })
      }
    }
  }
}
function saveGrade(entry){
  const as = JSON.parse(localStorage.getItem('mock:assignments')||'[]')
  const a = as.find(x=>x.id===entry.assignment.id)
  if(!a) return
  const s = a.submissions.find(x=>x.userId===entry.sub.userId)
  s.grade = Number(entry.value)
  localStorage.setItem('mock:assignments', JSON.stringify(as))
  // remove from toGrade
  toGrade.value = toGrade.value.filter(x=>x.key !== entry.key)
  alert('Grade saved')
}
</script>

<style scoped></style>
