#!/usr/bin/env node
// scripts/ensure_teacher_views_and_routes.js
// Creates missing teacher views, ensures router has TeacherClasses, TeacherAssignments, TeacherCalendar.
// Backs up router before editing. Run from project root: node scripts/ensure_teacher_views_and_routes.js

import fs from 'fs';
import path from 'path';

const routerPath = path.join('src','router','index.js');
const viewsDir = path.join('src','views','teacher');

if (!fs.existsSync('src')) {
  console.error('Error: src folder not found. Run from project root.');
  process.exit(2);
}

// helper
const writeIfMissing = (filePath, content) => {
  if (fs.existsSync(filePath)) {
    console.log(`OK exists: ${filePath}`);
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
  return true;
};

// 1) ensure view files
const activeClassesTpl = `<!-- src/views/teacher/ActiveClasses.vue -->
<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">My Classes</h2>
    <div v-if="myClasses.length===0" class="text-sm text-gray-500">No classes yet.</div>
    <ul class="space-y-4">
      <li v-for="c in myClasses" :key="c.id" class="bg-white p-4 rounded shadow flex justify-between items-center">
        <div>
          <div class="font-medium">{{ c.title }}</div>
          <div class="text-xs text-gray-500">{{ formatDate(c.startAt) }} • {{ c.level }}</div>
        </div>
        <div class="flex gap-2">
          <button class="text-sm text-blue-600" @click="openDetail(c.id)">View</button>
          <button class="text-sm text-red-600" @click="removeClass(c.id)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
const all = JSON.parse(localStorage.getItem('mock:classes') || '[]')
const myClasses = computed(() => all.filter(c => c.teacherId === currentUser?.id))
function formatDate(iso){ try { return new Date(iso).toLocaleString() } catch { return iso } }
function openDetail(id){ router.push({ name: 'TeacherClassDetail', params: { id } }).catch(()=>router.push('/teacher/classes/'+id)) }
function removeClass(id){ if(!confirm('Delete?')) return; const remaining = all.filter(x=>x.id!==id); localStorage.setItem('mock:classes', JSON.stringify(remaining)); location.reload() }
</script>
<style scoped></style>
`;

const assignmentsTpl = `<!-- src/views/teacher/Assignments.vue -->
<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Assignments</h2>
    <div v-if="assignments.length===0" class="text-sm text-gray-500">No assignments.</div>
    <ul class="space-y-4">
      <li v-for="a in assignments" :key="a.id" class="bg-white p-4 rounded shadow">
        <div class="flex justify-between">
          <div>
            <div class="font-medium">{{ a.title }}</div>
            <div class="text-xs text-gray-500">Due: {{ formatDate(a.dueAt) }}</div>
            <div class="text-xs text-gray-500">Class: {{ classTitle(a.classId) }}</div>
          </div>
          <div class="text-sm text-gray-600">{{ (a.submissions||[]).length }} submissions</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const assignments = ref(JSON.parse(localStorage.getItem('mock:assignments')||'[]'))
function formatDate(iso){ try{return new Date(iso).toLocaleString()}catch{return iso} }
function classTitle(id){ const c = (JSON.parse(localStorage.getItem('mock:classes')||'[]')).find(x=>x.id===id); return c?c.title:'—' }
</script>
<style scoped></style>
`;

const calendarTpl = `<!-- src/views/teacher/TeacherCalendar.vue -->
<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Calendar</h2>
    <div class="mb-4">
      <button class="px-3 py-1 bg-green-600 text-white rounded" @click="openCreate">Add event</button>
    </div>
    <div v-if="events.length===0" class="text-sm text-gray-500">No events yet.</div>
    <ul class="space-y-3">
      <li v-for="e in events" :key="e.id" class="bg-white p-3 rounded shadow flex justify-between">
        <div>
          <div class="font-medium">{{ e.title }}</div>
          <div class="text-xs text-gray-500">{{ formatTime(e.start) }} • {{ e.type }}</div>
        </div>
        <div class="flex gap-2">
          <button class="text-sm text-blue-600" @click="edit(e)">Edit</button>
          <button class="text-sm text-red-600" @click="remove(e.id)">Delete</button>
        </div>
      </li>
    </ul>

    <div v-if="modal" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div class="bg-white p-6 rounded w-full max-w-md">
        <h3 class="mb-3">{{ editing.id ? 'Edit event' : 'Add event' }}</h3>
        <form @submit.prevent="save">
          <label class="block mb-2"><div class="text-sm">Title</div><input v-model="editing.title" class="w-full p-2 border rounded" required></label>
          <label class="block mb-2"><div class="text-sm">Start</div><input v-model="editing.start" type="datetime-local" class="w-full p-2 border rounded" required></label>
          <div class="flex justify-end gap-2 mt-3"><button type="button" class="px-3 py-1 border rounded" @click="close">Cancel</button><button class="px-3 py-1 bg-green-600 text-white rounded">Save</button></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const LS = 'mock:events'
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser')||'null')
const events = ref([])
const modal = ref(false)
const editing = ref({ id:null, title:'', start:'', type:'class' })
function refresh(){ events.value = (JSON.parse(localStorage.getItem(LS)||'[]')).filter(e=>e.ownerId===currentUser?.id) }
onMounted(refresh)
function openCreate(){ editing.value={id:null,title:'',start:'',type:'class'}; modal.value=true }
function close(){ modal.value=false }
function save(){ const all = JSON.parse(localStorage.getItem(LS)||'[]'); if(!editing.value.id){ editing.value.id=Date.now().toString(); editing.value.ownerId=currentUser?.id; editing.value.start=new Date(editing.value.start).toISOString(); all.unshift(editing.value) } else { const i=all.findIndex(x=>x.id===editing.value.id); if(i>=0) all[i] = {...all[i], title: editing.value.title, start: new Date(editing.value.start).toISOString()} } localStorage.setItem(LS, JSON.stringify(all)); modal.value=false; refresh() }
function edit(ev){ editing.value = {...ev}; editing.value.start = new Date(ev.start).toISOString().slice(0,16); modal.value=true }
function remove(id){ if(!confirm('Delete event?')) return; const all = JSON.parse(localStorage.getItem(LS)||'[]').filter(x=>x.id!==id); localStorage.setItem(LS, JSON.stringify(all)); refresh() }
function formatTime(iso){ try { return new Date(iso).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) } catch { return iso } }
</script>
<style scoped></style>
`;

console.log('Ensuring teacher views exist under src/views/teacher ...');
writeIfMissing(path.join(viewsDir,'ActiveClasses.vue'), activeClassesTpl);
writeIfMissing(path.join(viewsDir,'Assignments.vue'), assignmentsTpl);
writeIfMissing(path.join(viewsDir,'TeacherCalendar.vue'), calendarTpl);

// 2) Update router
if (!fs.existsSync(routerPath)) {
  console.warn('Router file not found at', routerPath, '. Please add routes manually.');
  process.exit(0);
}

const routerText = fs.readFileSync(routerPath, 'utf8');
const backupPath = routerPath + '.ensure_backup_' + Date.now() + '.bak';
fs.writeFileSync(backupPath, routerText, 'utf8');
console.log('Backed up router to', backupPath);

// If route names already exist, do nothing for them. Otherwise insert them into the /teacher children array.
const required = [
  { name: 'TeacherClasses', path: "classes", component: "'../views/teacher/ActiveClasses.vue'" },
  { name: 'TeacherAssignments', path: "assignments", component: "'../views/teacher/Assignments.vue'" },
  { name: 'TeacherCalendar', path: "calendar", component: "'../views/teacher/TeacherCalendar.vue'" }
];

let newRouter = routerText;

// quick function to test presence
const hasName = (name) => new RegExp(`name\\s*:\\s*['"]${name}['"]`).test(newRouter);

const missing = required.filter(r => !hasName(r.name));
if (missing.length === 0) {
  console.log('All required teacher route names already present in router. No change needed.');
  process.exit(0);
}

console.log('Missing teacher routes:', missing.map(m=>m.name).join(', '));

// Find /teacher route block and children array position
const teacherIndex = newRouter.search(/path\s*:\s*['"]\/teacher['"]/);
if (teacherIndex === -1) {
  console.error("Cannot find a route with path '/teacher' in router. Please add a teacher parent route and re-run.");
  process.exit(1);
}

// find children: [ following that
const childrenPos = newRouter.indexOf('children', teacherIndex);
if (childrenPos === -1) {
  console.error("Found /teacher route but it has no children array. Please add children: [] block and re-run.");
  process.exit(1);
}
// find the opening bracket of children array
const bracketPos = newRouter.indexOf('[', childrenPos);
if (bracketPos === -1) {
  console.error("Could not locate children array bracket. Manual edit required.");
  process.exit(1);
}

// find the closing bracket of that children array (basic bracket matching)
let i = bracketPos;
let depth = 0;
let closePos = -1;
for (; i < newRouter.length; i++) {
  const ch = newRouter[i];
  if (ch === '[') depth++;
  else if (ch === ']') {
    depth--;
    if (depth === 0) { closePos = i; break; }
  }
}
if (closePos === -1) {
  console.error("Could not detect end of children array. Manual edit required.");
  process.exit(1);
}

// prepare insertion text (indentation match)
const indent = '      ';
let insertText = '\\n';
for (const r of missing) {
  insertText += `${indent}{ path: '${r.path}', name: '${r.name}', component: () => import(${r.component}) },\\n`;
}
insertText += '    ';

newRouter = newRouter.slice(0, closePos) + insertText + newRouter.slice(closePos);

fs.writeFileSync(routerPath, newRouter, 'utf8');
console.log('Inserted missing teacher routes into', routerPath);
console.log('Done. Please restart dev server (rm -rf node_modules/.vite && npm run dev) and test.');
