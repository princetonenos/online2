<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-white rounded p-6 w-full max-w-md">
      <h3 class="text-lg font-medium mb-3">{{ event && event.id ? 'Edit event' : 'Add event' }}</h3>

      <form @submit.prevent="save">
        <label class="block mb-2">
          <div class="text-sm">Title</div>
          <input v-model="local.title" required class="w-full p-2 border rounded" />
        </label>

        <label class="block mb-2">
          <div class="text-sm">Start</div>
          <input v-model="local.start" type="datetime-local" required class="w-full p-2 border rounded" />
        </label>

        <label class="block mb-2">
          <div class="text-sm">End</div>
          <input v-model="local.end" type="datetime-local" required class="w-full p-2 border rounded" />
        </label>

        <label class="block mb-2">
          <div class="text-sm">Type</div>
          <select v-model="local.type" class="w-full p-2 border rounded">
            <option value="class">class</option>
            <option value="meeting">meeting</option>
            <option value="personal">personal</option>
          </select>
        </label>

        <label class="block mb-2">
          <div class="text-sm">Notes</div>
          <textarea v-model="local.notes" class="w-full p-2 border rounded"></textarea>
        </label>

        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-3 py-1 border rounded" @click="$emit('update:open', false)">Cancel</button>
          <button class="px-3 py-1 bg-green-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
const props = defineProps({ open: Boolean, event: { type: Object, default: null } })
const emit = defineEmits(['update:open','saved'])

const local = reactive({
  id: null,
  title: '',
  start: '',
  end: '',
  type: 'class',
  notes: ''
})

watch(() => props.event, (v) => {
  if (v) {
    local.id = v.id || null
    local.title = v.title || ''
    // convert ISO to local datetime-local value
    local.start = v.start ? new Date(v.start).toISOString().slice(0,16) : ''
    local.end = v.end ? new Date(v.end).toISOString().slice(0,16) : ''
    local.type = v.type || 'class'
    local.notes = v.notes || ''
  } else {
    local.id = null; local.title=''; local.start=''; local.end=''; local.type='class'; local.notes=''
  }
}, { immediate: true })

function save() {
  const out = {
    id: local.id || null,
    title: local.title,
    start: new Date(local.start).toISOString(),
    end: new Date(local.end).toISOString(),
    type: local.type,
    notes: local.notes
  }
  emit('saved', out)
}
</script>
