<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-xl font-semibold mb-4">Join class</h2>

    <form @submit.prevent="join">
      <label class="block mb-3">
        <div class="text-sm text-gray-600 mb-1">Class code or ID</div>
        <input v-model="code" required class="w-full p-2 border rounded" placeholder="Enter class code or id"/>
      </label>

      <div class="flex items-center gap-2">
        <button type="submit" class="px-4 py-2 bg-classroom-primary text-white rounded">Join</button>
        <button type="button" class="px-3 py-2 border rounded" @click="cancel">Cancel</button>
      </div>
    </form>

    <div v-if="message" class="mt-4 text-sm" :class="messageType==='ok' ? 'text-green-600' : 'text-red-600'">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const code = ref('')
const message = ref('')
const messageType = ref('')

function findClassByCode(c) {
  const classes = JSON.parse(localStorage.getItem('mock:classes') || '[]')
  // try to match id first, then a code field if present
  return classes.find(x => String(x.id) === String(c) || (x.code && String(x.code) === String(c)))
}

function join() {
  if (!code.value.trim()) {
    messageType.value = 'err'
    message.value = 'Enter a valid code or id'
    return
  }
  const cls = findClassByCode(code.value.trim())
  if (!cls) {
    messageType.value = 'err'
    message.value = 'Class not found. Check the code or id'
    return
  }
  // demo behavior: add current student to class.students if not present
  const current = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
  if (!current || current.role !== 'student') {
    messageType.value = 'err'
    message.value = 'You must be signed in as a student to join'
    return
  }
  cls.students = cls.students || []
  if (!cls.students.includes(current.id)) cls.students.push(current.id)
  // persist
  const all = JSON.parse(localStorage.getItem('mock:classes') || '[]').map(x => x.id === cls.id ? cls : x)
  localStorage.setItem('mock:classes', JSON.stringify(all))
  messageType.value = 'ok'
  message.value = 'Joined successfully'
  setTimeout(()=> router.push({ name: 'StudentClasses' }).catch(()=>router.push('/student/classes')), 700)
}

function cancel(){ router.back() }
</script>

<style scoped>
/* minimal styling so this matches existing app styles */
</style>
