<template>
  <div class="p-6">
    <admin-header />
    <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <kpi-widget title="Total users" :value="stats.totalUsers" />
      <kpi-widget title="Active classes" :value="stats.activeClasses" />
      <kpi-widget title="Pending flags" :value="stats.flaggedAssignments" />
    </div>
    <div class="mt-6">
      <h2 class="text-lg font-medium">Recent activity</h2>
      <div v-if="loading">Loading...</div>
      <ul v-else>
        <li v-for="item in recent" :key="item.id" class="mt-2">
          <audit-entry :entry="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import AdminHeader from '../components/admin/AdminHeader.vue'
import KpiWidget from '../components/admin/KPIWidget.vue'
import AuditEntry from '../components/admin/AuditEntry.vue'
import { ref, onMounted } from 'vue'

const stats = ref({ totalUsers: 0, activeClasses: 0, flaggedAssignments: 0 })
const recent = ref([])
const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    stats.value = { totalUsers: 120, activeClasses: 14, flaggedAssignments: 2 }
    recent.value = JSON.parse(localStorage.getItem('mock:adminRecent') || '[]')
    loading.value = false
  }, 400)
})
</script>
