<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Assignments</h2>
    <div v-if="assignments.length===0" class="text-sm text-gray-500">No assignments yet.</div>
    <ul class="space-y-3">
      <li v-for="a in assignments" :key="a.id" class="bg-white rounded shadow p-4">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-medium">{{ a.title }}</div>
            <div class="text-xs text-gray-500">Due: {{ formatDate(a.dueAt) }}</div>
            <div class="text-xs text-gray-500">Class: {{ getClassTitle(a.classId) }}</div>
          </div>
          <div class="text-sm text-gray-600">{{ a.submissions?.length || 0 }} submissions</div>
        </div>
        <div class="mt-3">
          <h4 class="font-medium text-sm mb-2">Submissions</h4>
          <ul class="space-y-2">
            <li v-for="s in a.submissions" :key="s.userId" class="flex justify-between items-center">
              <div class="text-sm">{{ getStudentName(s.userId) }} <span class="text-xs text-gray-500">({{ s.submittedAt }})</span></div>
              <div class="flex gap-2">
                <div v-if="s.grade!=null" class="text-sm text-green-600">Grade: {{ s.grade }}</div>
                <button v-else class="text-sm text-blue-600" @click="gradeSubmission(a.id, s.userId)">Grade</button>
              </div>
            </li>
            <li v-if="!a.submissions || a.submissions.length===0" class="text-sm text-gray-500">No submissions</li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const assignments = ref(JSON.parse(localStorage.getItem('mock:assignments')||'[]'))
function formatDate(iso){ try{return new Date(iso).toLocaleString()}catch{return iso} }
function getClassTitle(id){ const classes = JSON.parse(localStorage.getItem('mock:classes')||'[]'); const c = classes.find(x=>x.id===id); return c ? c.title : '—' }
function getStudentName(id){ const students = JSON.parse(localStorage.getItem('mock:students')||'[]'); const s = students.find(x=>x.id===id); return s ? s.name : id }
function gradeSubmission(assignmentId, userId){
  const as = JSON.parse(localStorage.getItem('mock:assignments')||'[]')
  const a = as.find(x=>x.id===assignmentId)
  if(!a) return alert('Assignment not found')
  const sub = a.submissions.find(s=>s.userId===userId)
  const g = prompt(`Enter grade for ${getStudentName(userId)}`)
  if(g!=null){
    sub.grade = Number(g)
    localStorage.setItem('mock:assignments', JSON.stringify(as))
    assignments.value = as
    alert('Grade saved')
  }
}
</script>

<style scoped></style>
