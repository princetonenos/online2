<template>
  <Transition name="modal-backdrop">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Transition name="modal">
        <div class="bg-white rounded p-6 w-full max-w-lg animate-scale-in">
          <h3 class="text-lg font-medium mb-3">Create Course</h3>
          <form @submit.prevent="create">
            <label class="block mb-3">
              <div class="text-sm mb-1">Course Title</div>
              <input v-model="form.title" required class="w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-classroom-primary focus:border-transparent" />
            </label>
            <label class="block mb-3">
              <div class="text-sm mb-1">Description</div>
              <textarea v-model="form.description" class="w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-classroom-primary focus:border-transparent"></textarea>
            </label>
            <div class="flex justify-end gap-2 mt-6">
              <button type="button" class="px-4 py-2 border rounded transition-all duration-200 hover:bg-classroom-gray-50 animate-press" @click="$emit('update:open', false)">Cancel</button>
              <button class="px-4 py-2 bg-classroom-primary text-white rounded transition-all duration-200 hover:bg-green-700 animate-press animate-ripple">Create</button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
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
