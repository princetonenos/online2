#!/usr/bin/env node
// scripts/auto_fix_routes_and_views.js
// Scans router and views for admin/teacher/student pages.
// Creates missing view stubs and inserts missing routes under parent route blocks where possible.
// Makes safe backups before editing.
// Run: node scripts/auto_fix_routes_and_views.js

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ROUTER = path.join(ROOT, 'src', 'router', 'index.js');
const VIEWS_DIR = path.join(ROOT, 'src', 'views');
const BACKUP_SUFFIX = `.auto_fix_bak_${Date.now()}`;

function safeRead(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
function safeWrite(p, content){ fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content, 'utf8'); }

if (!fs.existsSync(path.join(ROOT, 'src'))) {
  console.error('Error: src directory not found. Run this from the project root.');
  process.exit(1);
}

// Expected base routes and standard child routes for each role (conservative)
const EXPECTED = {
  teacher: [
    { name: 'TeacherDashboard', path: 'dashboard', component: 'views/teacher/TeacherDashboard.vue' },
    { name: 'TeacherClasses', path: 'classes', component: 'views/teacher/ActiveClasses.vue' },
    { name: 'TeacherAssignments', path: 'assignments', component: 'views/teacher/Assignments.vue' },
    { name: 'TeacherCalendar', path: 'calendar', component: 'views/teacher/TeacherCalendar.vue' },
    { name: 'TeacherStudents', path: 'students', component: 'views/teacher/Students.vue' },
    { name: 'TeacherAnalytics', path: 'analytics', component: 'views/teacher/Analytics.vue' },
    { name: 'TeacherGrading', path: 'grading', component: 'views/teacher/Grading.vue' },
  ],
  admin: [
    { name: 'AdminDashboard', path: 'dashboard', component: 'views/admin/Dashboard.vue' },
    { name: 'AdminUsers', path: 'users', component: 'views/admin/UsersList.vue' },
    { name: 'AdminReports', path: 'reports', component: 'views/admin/Reports.vue' },
  ],
  student: [
    { name: 'StudentDashboard', path: 'dashboard', component: 'views/student/Dashboard.vue' },
    { name: 'StudentClasses', path: 'classes', component: 'views/student/ClassList.vue' },
    { name: 'StudentCalendar', path: 'calendar', component: 'views/student/CalendarView.vue' },
  ]
};

// Minimal Vue view stub generator
function stubContent(role, title, extra = '') {
  return `<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">${title}</h2>
    <div class="bg-white p-4 rounded shadow text-sm text-gray-600">
      This is a generated stub for ${title}.
      ${extra}
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped></style>
`;
}

// Turn component import path to file system path
function compToFs(componentPath) {
  if (!componentPath) return null;
  let p = componentPath.trim();
  if (p.startsWith('views/')) p = path.join(ROOT, 'src', p);
  else if (p.startsWith('./') || p.startsWith('../') || p.startsWith('/')) p = path.join(ROOT, p);
  else p = path.join(ROOT, 'src', p);
  // ensure .vue suffix
  if (!p.endsWith('.vue')) p = p + '.vue';
  return p;
}

// Read router
const routerText = safeRead(ROUTER);
if (!routerText) {
  console.error('Router file not found at', ROUTER);
  process.exit(1);
}

// Backup router
const routerBak = ROUTER + BACKUP_SUFFIX;
fs.copyFileSync(ROUTER, routerBak);
console.log('Backed up router to', routerBak);

// Helper to test presence of a route name in router file
function hasRouteName(name) {
  const re = new RegExp(`name\\s*:\\s*['"\`]${name}['"\`]`);
  return re.test(routerText);
}

// Helper to find parent block index for path '/teacher' etc.
function findParentBlockBounds(routerTextLocal, parentPath) {
  const parentRe = new RegExp(`path\\s*:\\s*['"\`]${parentPath}['"\`]`);
  const idx = routerTextLocal.search(parentRe);
  if (idx === -1) return null;
  // find position of the children array after idx
  const childrenIdx = routerTextLocal.indexOf('children', idx);
  if (childrenIdx === -1) return null;
  const bracketOpen = routerTextLocal.indexOf('[', childrenIdx);
  if (bracketOpen === -1) return null;
  // bracket matching to find close
  let depth = 0;
  let i = bracketOpen;
  for (; i < routerTextLocal.length; i++) {
    const ch = routerTextLocal[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) return { open: bracketOpen, close: i };
    }
  }
  return null;
}

// Insert route entries into children array at position close (before close bracket)
function insertRoutesIntoRouter(original, parentPath, entriesText) {
  const bounds = findParentBlockBounds(original, parentPath);
  if (!bounds) return { ok: false, message: `Could not locate children array for parent path '${parentPath}'.` };
  const before = original.slice(0, bounds.close);
  const after = original.slice(bounds.close);
  // insert with indentation
  return { ok: true, text: before + '\n' + entriesText + '\n' + after };
}

// Create a route string for insertion
function makeRouteString(r) {
  return `      { path: '${r.path}', name: '${r.name}', component: () => import('../${r.component}') },`;
}

// MAIN: scan and fix
let newRouterText = routerText;
const summary = { createdFiles: [], addedRoutes: [], createdStubs: [], warnings: [] };

// 1) For every expected route, check if already present. If not, try to insert under correct parent.
Object.entries(EXPECTED).forEach(([role, routes]) => {
  const parentPath = `/${role}`; // '/teacher', '/admin', '/student'
  // find which are missing
  const missing = routes.filter(r => !hasRouteName(r.name));
  if (missing.length === 0) {
    console.log(`All expected ${role} routes present.`);
    return;
  }
  // prepare route strings
  const entriesText = missing.map(makeRouteString).join('\n');
  const res = insertRoutesIntoRouter(newRouterText, parentPath, entriesText);
  if (!res.ok) {
    summary.warnings.push(`Could not auto-insert ${role} routes: ${missing.map(m=>m.name).join(', ')}. ${res.message}`);
    console.warn('Warning:', summary.warnings[summary.warnings.length-1]);
  } else {
    newRouterText = res.text;
    summary.addedRoutes.push(...missing.map(m=>m.name));
    console.log(`Inserted missing ${role} routes: ${missing.map(m=>m.name).join(', ')}`);
  }
});

// 2) For every route entry now present in router, check if its component file exists. If a component path is referenced but file missing, create a stub.
const componentImportRe = /component\s*:\s*\(\s*\)\s*=>\s*import\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
let m;
const referencedComponents = [];
while ((m = componentImportRe.exec(newRouterText)) !== null) {
  referencedComponents.push(m[1]);
}
for (const comp of referencedComponents) {
  const fsPath = compToFs(comp);
  if (!fsPath) continue;
  if (!fs.existsSync(fsPath)) {
    // safe to create if under src/views
    if (fsPath.includes(path.join('src','views'))) {
      // decide role and title from path
      const rel = path.relative(path.join(ROOT,'src','views'), fsPath);
      const parts = rel.split(path.sep);
      const role = parts[0] || 'shared';
      const title = parts.slice(1).join('/') || path.basename(fsPath);
      // create stub content
      const stub = stubContent(role, title, `Auto-created stub for ${comp}`);
      fs.mkdirSync(path.dirname(fsPath), { recursive: true });
      fs.writeFileSync(fsPath, stub, 'utf8');
      summary.createdFiles.push(fsPath);
      summary.createdStubs.push(fsPath);
      console.log('Created missing component stub:', fsPath);
    } else {
      summary.warnings.push(`Referenced component ${comp} resolved to ${fsPath} outside src/views. Manual fix recommended.`);
      console.warn('Warning: referenced component outside src/views:', comp);
    }
  }
}

// 3) Also ensure common teacher view files exist (idempotent)
const mustExistTeacherViews = [
  'views/teacher/TeacherDashboard.vue',
  'views/teacher/ActiveClasses.vue',
  'views/teacher/Assignments.vue',
  'views/teacher/TeacherCalendar.vue',
  'views/teacher/Students.vue'
];
mustExistTeacherViews.forEach(comp => {
  const fsPath = compToFs(comp);
  if (!fs.existsSync(fsPath)) {
    fs.writeFileSync(fsPath, stubContent('teacher', path.basename(fsPath, '.vue')), 'utf8');
    summary.createdFiles.push(fsPath);
    console.log('Created missing teacher view stub:', fsPath);
  }
});

// 4) Ensure admin and student base dashboards exist (safe)
[['views/admin/Dashboard.vue','admin'], ['views/student/Dashboard.vue','student']].forEach(item => {
  const fsPath = compToFs(item[0]);
  if (fsPath && !fs.existsSync(fsPath)) {
    fs.writeFileSync(fsPath, stubContent(item[1], `${item[1]} Dashboard`), 'utf8');
    summary.createdFiles.push(fsPath);
    console.log('Created missing dashboard stub:', fsPath);
  }
});

// 5) Write router file if changed
if (newRouterText !== routerText) {
  const routerOut = ROUTER + BACKUP_SUFFIX;
  fs.copyFileSync(ROUTER, routerOut);
  fs.writeFileSync(ROUTER, newRouterText, 'utf8');
  console.log('Router updated. Backup saved as', routerOut);
  summary.addedRoutes = summary.addedRoutes || [];
} else {
  console.log('No changes needed in router.');
}

// 6) Light scan: check Dashboard quick actions in teacher dashboard files and report buttons that don't reference expected route names.
// We'll search for "My classes", "Assignments", "Calendar" in teacher Dashboard and show nearby lines.
const teacherDashPaths = [
  path.join(ROOT,'src','views','teacher','Dashboard.vue'),
  path.join(ROOT,'src','views','teacher','TeacherDashboard.vue')
];
for (const dashPath of teacherDashPaths) {
  if (!fs.existsSync(dashPath)) continue;
  const txt = fs.readFileSync(dashPath,'utf8');
  ['My classes','My Classes','Assignments','Calendar','Students','Analytics'].forEach(label => {
    if (txt.includes(label)) {
      // show small context
      const idx = txt.indexOf(label);
      const snippet = txt.slice(Math.max(0, idx-80), Math.min(txt.length, idx+140)).replace(/\n/g, ' ');
      console.log(`Found "${label}" in ${dashPath}. Context: ...${snippet}...`);
    }
  });
}

// 7) Final summary and suggestions
console.log('\nSummary:');
if (summary.addedRoutes && summary.addedRoutes.length) {
  console.log('Added routes:', summary.addedRoutes.join(', '));
} else {
  console.log('No route insertions performed.');
}
if (summary.createdFiles && summary.createdFiles.length) {
  console.log('Created files:', summary.createdFiles.length);
  summary.createdFiles.forEach(f => console.log('  -', path.relative(ROOT,f)));
} else {
  console.log('No new files created.');
}
if (summary.warnings && summary.warnings.length) {
  console.log('Warnings:');
  summary.warnings.forEach(w => console.log('  -', w));
}

console.log('\nNext steps (manual):');
console.log('- Restart dev server: rm -rf node_modules/.vite && npm run dev');
console.log('- Open the app and test teacher dashboard flows: /teacher/dashboard -> My classes / Assignments / Calendar');
console.log('- If any inserted routes are not at the correct place, open src/router/index.js backup with suffix', BACKUP_SUFFIX, 'and adjust manually.');
console.log('- Review created stubs and replace with real UI as needed.');

process.exit(0);
