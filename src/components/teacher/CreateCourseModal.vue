<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-white rounded p-6 w-full max-w-lg">
      <h3 class="text-lg font-medium mb-3">Create course</h3>
      <form @submit.prevent="create">
        <label class="block mb-2">
          <div class="text-sm">Course title</div>
          <input v-model="form.title" required class="w-full p-2 border rounded" />
        </label>
        <label class="block mb-2">
          <div class="text-sm">Description</div>
          <textarea v-model="form.description" class="w-full p-2 border rounded"></textarea>
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

const form = reactive({ title: '', description: '' })

function create() {
  const payload = { id: Date.now().toString(), title: form.title, description: form.description, createdAt: new Date().toISOString(), teacherId: JSON.parse(localStorage.getItem('mock:currentUser'))?.id }
  emit('created', payload)
  // parent should call store.addCourse(payload)
  emit('update:open', false)
}
</script>
