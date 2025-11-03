<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Analytics</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="bg-white p-4 rounded shadow">
        <div class="text-sm text-gray-500">Avg. completion</div>
        <div class="text-2xl font-semibold mt-2">{{ avgCompletion }}%</div>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <div class="text-sm text-gray-500">Active classes</div>
        <div class="text-2xl font-semibold mt-2">{{ activeCount }}</div>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <div class="text-sm text-gray-500">Students</div>
        <div class="text-2xl font-semibold mt-2">{{ studentCount }}</div>
      </div>
    </div>

    <section class="bg-white rounded shadow p-4">
      <h3 class="font-medium mb-2">Engagement (last 30 days)</h3>
      <div class="h-40 bg-gray-50 flex items-center justify-center text-gray-400">
        Chart placeholder — plug Chart.js / Recharts here.
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTeacherClassesStore } from '../../stores/teacherClasses'
const store = useTeacherClassesStore()
onMounted(()=>store.fetchAll())
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser')||'{}')
const myClasses = computed(()=> store.items.filter(c=>c.teacherId===currentUser.id))
const studentCount = computed(()=> store.getStudents().length)
const activeCount = computed(()=> myClasses.value.filter(c=>c.status==='active' || c.status==='scheduled').length)
const avgCompletion = computed(()=> store.avgCompletion())
</script>

<style scoped></style>
