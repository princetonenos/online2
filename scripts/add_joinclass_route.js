#!/usr/bin/env node
/**
 * scripts/add_joinclass_route.js
 *
 * Usage:
 *   node scripts/add_joinclass_route.js
 *
 * This script safely inserts a StudentJoinClass route into src/router/index.js
 * under the /student parent route's children array. It creates a backup of the router
 * before editing: src/router/index.js.joinclass_backup_TIMESTAMP.bak
 *
 * If the route already exists it will do nothing.
 */
import fs from 'fs'
import path from 'path'

const ROUTER = path.join(process.cwd(), 'src', 'router', 'index.js')
if (!fs.existsSync(ROUTER)) {
  console.error('Router file not found at', ROUTER)
  process.exit(1)
}

const ROUTE_NAME = 'StudentJoinClass'
const ROUTE_LINE = "      { path: 'join', name: 'StudentJoinClass', component: () => import('../views/student/JoinClass.vue') },\n"

let src = fs.readFileSync(ROUTER, 'utf8')

// If route already present by name or component, skip
if (new RegExp(`name\\s*:\\s*['"\`]${ROUTE_NAME}['"\`]`).test(src) || /JoinClass\.vue/.test(src) ) {
  console.log('StudentJoinClass route already present in router. No changes made.')
  process.exit(0)
}

// create backup
const bakPath = ROUTER + '.joinclass_backup_' + Date.now() + '.bak'
fs.copyFileSync(ROUTER, bakPath)
console.log('Backup saved to', bakPath)

// locate the /student parent route children array
const parentIdx = src.search(/path\s*:\s*['"`]\/student['"`]/)
if (parentIdx === -1) {
  console.error("Could not find a parent route with path '/student' in router. Please open src/router/index.js and add the following route manually:\n")
  console.error(ROUTE_LINE)
  process.exit(1)
}

const childrenIdx = src.indexOf('children', parentIdx)
if (childrenIdx === -1) {
  console.error("Found '/student' route but no children array. Please add a children: [ ... ] block under the /student route and re-run the script.")
  process.exit(1)
}

const bracketOpen = src.indexOf('[', childrenIdx)
if (bracketOpen === -1) {
  console.error('Could not find opening [ for children array after /student entry. Manual edit required.')
  process.exit(1)
}

// find matching closing bracket for that children array
let depth = 0
let closePos = -1
for (let i = bracketOpen; i < src.length; i++) {
  const ch = src[i]
  if (ch === '[') depth++
  else if (ch === ']') {
    depth--
    if (depth === 0) { closePos = i; break }
  }
}
if (closePos === -1) {
  console.error('Could not detect end of children array for /student entry. Manual edit required.')
  process.exit(1)
}

// insert the route just before the closing bracket
const before = src.slice(0, closePos)
const after = src.slice(closePos)

// Attempt to maintain indentation by inspecting characters before bracket
let indent = '      '
const prevLineStart = before.lastIndexOf('\n', before.length - 1)
if (prevLineStart !== -1) {
  const line = before.slice(prevLineStart + 1).match(/^(\s*)/)
  if (line && line[1]) indent = line[1]
}

const insertion = ROUTE_LINE
const newSrc = before + insertion + after
fs.writeFileSync(ROUTER, newSrc, 'utf8')
console.log('Inserted StudentJoinClass route into', ROUTER)
console.log('If your router structure is non-standard, open the backup', bakPath, 'and make manual adjustments.')
console.log('Now restart dev server and test: navigate to /student and click the Join class button (or use router.push by name StudentJoinClass).')
