#!/usr/bin/env node
// scripts/patch_dashboard_quick_actions.js
import fs from 'fs';
const p = 'src/views/teacher/Dashboard.vue';
if (!fs.existsSync(p)) { console.error('Dashboard.vue missing at',p); process.exit(1); }
const backup = p + '.bak.' + Date.now();
fs.copyFileSync(p, backup);
console.log('Backup created:', backup);
let s = fs.readFileSync(p,'utf8');

// remove blocks that reference "Create class" (simple)
s = s.replace(/<[^>]*>[^<]*Create class[^<]*<\/[^>]*>/gi, '');

// replace any quick-action Assignments block to use router-link to TeacherAssignments
s = s.replace(/(<button[^>]*>\s*\n\s*<div[^>]*>\s*\n\s*<div[^>]*>\s*Assignments[\s\S]*?<\/button>)/gi, (m)=> {
  // if already a router-link skip
  if (m.includes('router-link')) return m;
  return m.replace(/<button([^>]*)>/,'<router-link$1 :to="{ name: \'TeacherAssignments\' }">').replace(/<\/button>/,'</router-link>');
});

fs.writeFileSync(p,s,'utf8');
console.log('Patched Dashboard.vue; review and restart dev server.');
