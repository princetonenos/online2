<template>
  <div class="p-6 max-w-2xl">
    <h1 class="text-2xl font-semibold mb-6">Create User</h1>
    <form class="space-y-4" @submit.prevent="submit">
      <div>
        <label class="block text-sm mb-1" for="name">Name</label>
        <input v-model="form.name" id="name" type="text" class="border rounded px-3 py-2 w-full" placeholder="Full name" required />
      </div>
      <div>
        <label class="block text-sm mb-1" for="email">Email</label>
        <input v-model="form.email" id="email" type="email" class="border rounded px-3 py-2 w-full" placeholder="email@example.com" required />
      </div>
      <div>
        <label class="block text-sm mb-1" for="role">Role</label>
        <select v-model="form.role" id="role" class="border rounded px-3 py-2 w-full">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label class="block text-sm mb-1" for="school">School</label>
        <input v-model="form.school" id="school" type="text" class="border rounded px-3 py-2 w-full" placeholder="School name" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1" for="password">Password</label>
          <input v-model="password" id="password" type="password" class="border rounded px-3 py-2 w-full" placeholder="At least 6 characters" minlength="6" required />
        </div>
        <div>
          <label class="block text-sm mb-1" for="confirm">Confirm Password</label>
          <input v-model="confirm" id="confirm" type="password" class="border rounded px-3 py-2 w-full" placeholder="Re-enter password" minlength="6" required />
        </div>
      </div>

      <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded">{{ error }}</div>

      <div class="flex gap-3 pt-2">
        <router-link to="/admin/users" class="px-4 py-2 border rounded">Cancel</router-link>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create User' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/store/users'

const router = useRouter()
const users = useUsersStore()

const form = ref({ name: '', email: '', role: 'student', school: '' })
const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  try {
    await users.loadFromStorage()
    const exists = users.getByEmail(form.value.email)
    if (exists) {
      error.value = 'A user with this email already exists'
      return
    }
    await users.createUser(form.value, password.value)
    if (window.showToast) window.showToast('User created')
    router.push('/admin/users')
  } catch (e) {
    error.value = e?.message || 'Failed to create user'
  } finally {
    loading.value = false
  }
}
</script>
