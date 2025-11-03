<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Students</h2>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div class="lg:col-span-2 bg-white rounded shadow p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium">Enrolled students</h3>
          <button class="text-sm text-blue-600" @click="refresh">Refresh</button>
        </div>
        <ul class="space-y-3">
          <li v-for="s in students" :key="s.id" class="flex justify-between items-center">
            <div>
              <div class="font-medium">{{ s.name }}</div>
              <div class="text-xs text-gray-500">{{ s.email }}</div>
            </div>
            <div class="flex gap-2">
              <router-link :to="{ name: 'TeacherStudentDetail', params:{ id: s.id } }" class="text-sm text-blue-600">Open</router-link>
              <button class="text-sm text-red-600" @click="remove(s.id)">Remove</button>
            </div>
          </li>
        </ul>
      </div>

      <aside class="bg-white rounded shadow p-4">
        <h3 class="font-medium mb-2">Enroll student</h3>
        <form @submit.prevent="enroll">
          <label class="block mb-2 text-sm">Name
            <input v-model="form.name" required class="w-full p-2 border rounded mt-1"/>
          </label>
          <label class="block mb-2 text-sm">Email
            <input v-model="form.email" required class="w-full p-2 border rounded mt-1"/>
          </label>
          <label class="block mb-3 text-sm">Class
            <select v-model="form.classId" class="w-full p-2 border rounded mt-1">
              <option v-for="c in myClasses" :value="c.id" :key="c.id">{{ c.title }}</option>
            </select>
          </label>
          <div class="flex justify-end gap-2">
            <button type="button" class="px-3 py-1 border rounded" @click="clear">Clear</button>
            <button class="px-3 py-1 bg-green-600 text-white rounded">Enroll</button>
          </div>
        </form>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useTeacherClassesStore } from '../../stores/teacherClasses'
const store = useTeacherClassesStore()
store.fetchAll()
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser')||'{}')
const students = computed(()=> store.getStudents())
const myClasses = computed(()=> store.items.filter(c=>c.teacherId === currentUser.id))

const form = reactive({ name:'', email:'', classId: myClasses.value[0]?.id || '' })

function enroll(){
  const id = 's' + Date.now()
  const student = { id, name: form.name, email: form.email, progress: 0 }
  // save to mock students
  const list = JSON.parse(localStorage.getItem('mock:students')||'[]')
  list.unshift(student)
  localStorage.setItem('mock:students', JSON.stringify(list))
  // attach to class (add students array)
  const classes = JSON.parse(localStorage.getItem('mock:classes')||'[]')
  const cls = classes.find(x=>x.id===form.classId)
  if(cls){
    cls.students = cls.students || []
    cls.students.push(student.id)
    localStorage.setItem('mock:classes', JSON.stringify(classes))
    // refresh store
    store.fetchAll()
    alert('Student enrolled')
    clear()
  } else {
    alert('Class not found')
  }
}
function clear(){ form.name=''; form.email=''; form.classId = myClasses.value[0]?.id || '' }
function remove(id){
  if(!confirm('Remove student?')) return
  let list = JSON.parse(localStorage.getItem('mock:students')||'[]')
  list = list.filter(s=>s.id!==id)
  localStorage.setItem('mock:students', JSON.stringify(list))
  store.fetchAll()
}
function refresh(){ store.fetchAll() }
</script>

<style scoped></style>
