<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-classroom classroom-shadow p-6">
      <h1 class="text-2xl font-semibold mb-4">Sign in</h1>

      <form @submit.prevent="submit">
        <label class="block mb-2">
          <span class="text-sm">Email</span>
          <input v-model="form.email" type="email" required class="w-full mt-1 p-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"/>
        </label>

        <label class="block mb-4">
          <span class="text-sm">Password</span>
          <input v-model="form.password" type="password" required class="w-full mt-1 p-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"/>
        </label>

        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <input id="remember" type="checkbox" v-model="remember" class="mr-2 rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary"/>
            <label for="remember" class="text-sm">Remember me</label>
          </div>

          <div class="text-sm">
            <a @click.prevent="openForgot" href="#" class="text-classroom-primary hover:text-classroom-primary-dark transition-colors">Forgot?</a>
          </div>
        </div>

        <button
          :disabled="loading"
          class="w-full py-2 px-4 bg-classroom-primary text-white rounded-classroom hover:opacity-90 transition-colors font-medium focus-classroom"
          type="submit"
        >
          <span v-if="!loading">Sign in</span>
          <span v-else>Signing in…</span>
        </button>
      </form>

      <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

      <hr class="my-6 border-classroom-gray-200"/>

      <div class="text-sm">
        <div class="mb-2">Test quick sign-in:</div>
        <div class="flex gap-2">
          <button class="px-3 py-1 border border-classroom-gray-300 rounded-classroom hover:bg-classroom-gray-50 transition-colors" @click="quick('admin')">Admin</button>
          <button class="px-3 py-1 border border-classroom-gray-300 rounded-classroom hover:bg-classroom-gray-50 transition-colors" @click="quick('teacher')">Teacher</button>
          <button class="px-3 py-1 border border-classroom-gray-300 rounded-classroom hover:bg-classroom-gray-50 transition-colors" @click="quick('student')">Student</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../store/auth'

const router = useRouter()
const auth = useAuth()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const remember = ref(true)

const targetByRole = {
  admin: 'AdminDashboard',
  teacher: 'TeacherDashboard',
  student: 'StudentDashboard'
}

function routeExists(name) {
  try { return router.hasRoute(name) } catch (e) { return false }
}

async function submit() {
  loading.value = true
  error.value = ''
  try {
    // call store login which returns user object { role, id, name, ... }
    const user = await auth.login({ email: form.value.email, password: form.value.password })
    if (!user) throw new Error('Login failed')

    // decide target route safely
    const targetName = targetByRole[user.role] || null
    if (targetName && routeExists(targetName)) {
      await router.push({ name: targetName })
      return
    }

    // fallback behavior if route missing
    if (routeExists('Dashboard')) {
      await router.push({ name: 'Dashboard' })
      return
    }

    error.value = `Signed in as ${user.role} but target route missing. Contact admin.`
  } catch (err) {
    // show friendly messages
    if (err?.code === 'ETIMEDOUT') error.value = 'Network timeout. Try again.'
    else error.value = err.message || 'Failed to sign in'
  } finally {
    loading.value = false
  }
}

function openForgot() {
  // replace with your forgot password dialog route
  if (routeExists('ForgotPassword')) router.push({ name: 'ForgotPassword' })
  else alert('Forgot password route not found.')
}

// quick role sign-in for dev/testing
async function quick(role) {
  loading.value = true
  error.value = ''
  try {
    const user = await auth.quickSignIn(role)
    const target = targetByRole[user.role]
    if (target && routeExists(target)) router.push({ name: target })
    else router.push({ name: 'Dashboard' })
  } catch (e) {
    error.value = 'Quick sign-in failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* keep minimal styling; convert to your design tokens if needed */
</style>
