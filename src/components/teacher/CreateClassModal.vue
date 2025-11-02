<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-white rounded p-6 w-full max-w-lg">
      <h3 class="text-lg font-medium mb-3">Create class</h3>
      <form @submit.prevent="create">
        <label class="block mb-2">
          <div class="text-sm">Title</div>
          <input v-model="form.title" class="w-full p-2 border rounded" required />
        </label>
        <label class="block mb-2">
          <div class="text-sm">Start date & time</div>
          <input v-model="form.startAt" type="datetime-local" class="w-full p-2 border rounded" />
        </label>
        <label class="block mb-2">
          <div class="text-sm">Duration (minutes)</div>
          <input v-model.number="form.duration" type="number" class="w-full p-2 border rounded" />
        </label>
        <label class="block mb-2">
          <div class="text-sm">Level</div>
          <select v-model="form.level" class="w-full p-2 border rounded">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-3 py-1 border rounded" @click="$emit('update:open', false)">Cancel</button>
          <button class="px-3 py-1 bg-green-600 text-white rounded">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open','created'])

const form = reactive({ title: '', startAt: '', duration: 60, level: 'beginner' })

function create(){
  const payload = {
    id: Date.now().toString(),
    title: form.title || 'Untitled',
    startAt: form.startAt || new Date().toISOString(),
    duration: Number(form.duration),
    level: form.level,
    status: 'scheduled',
    teacherId: JSON.parse(localStorage.getItem('mock:currentUser'))?.id || 't0'
  }
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  classes.unshift(payload)
  localStorage.setItem('mock:classes', JSON.stringify(classes))
  emit('created', payload)
}
</script>

<style scoped></style>
