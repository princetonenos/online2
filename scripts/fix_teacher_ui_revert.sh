#!/usr/bin/env bash
set -euo pipefail
# scripts/fix_teacher_ui_revert.sh
# Run from repo root. Creates backups before changes and prints a summary.

echo "== fix_teacher_ui_revert.sh ==

1) Restoring .bak view backups if present.
2) Removing centralized AppHeader and MainLayout files (if present).
3) Cleaning helper scripts added earlier.
4) Updating teacher Dashboard quick-actions: remove 'Create class' and ensure Assignments button links.
5) Ensure router has TeacherAssignments route.

Backups:
- Any modified file gets a .prefix_restore.bak copy before edit."

# Helper
backup() {
  src="$1"
  if [ -f "$src" ]; then
    cp "$src" "${src}.pre_revert.bak"
    echo "Backed up $src -> ${src}.pre_revert.bak"
  fi
}

# 1) Restore view backups (*.bak) created earlier by cleanup steps.
echo
echo "1) Restoring .bak view backups..."
restored=0
find src -type f -name "*.bak" | while read -r bak; do
  orig="${bak%.bak}"
  if [ -f "$orig" ]; then
    echo "Skipping restore of $orig because it already exists (backup $bak found)."
  else
    cp "$bak" "$orig"
    echo "Restored $orig from $bak"
    restored=$((restored+1))
  fi
done
echo "Restored backups: $restored"

# 2) Remove centralized header/layout if present
echo
echo "2) Removing centralized AppHeader and MainLayout (if they exist)."
if [ -f "src/components/AppHeader.vue" ]; then
  backup "src/components/AppHeader.vue"
  rm -f src/components/AppHeader.vue
  echo "Removed src/components/AppHeader.vue"
fi
if [ -f "src/layouts/MainLayout.vue" ]; then
  backup "src/layouts/MainLayout.vue"
  rm -f src/layouts/MainLayout.vue
  echo "Removed src/layouts/MainLayout.vue"
fi

# 3) Remove helper scripts we previously added (optional)
echo
echo "3) Removing helper scripts added earlier (safe cleanup)."
for s in scripts/remove_inline_headers.sh scripts/check_routing_imports.sh scripts/check_teacher_portal.sh scripts/add-admin-components-and-stores.patch scripts/add-teacher-dashboard-and-store.patch; do
  if [ -f "$s" ]; then
    backup "$s"
    rm -f "$s"
    echo "Removed $s"
  fi
done

# 4) Update teacher Dashboard quick-actions
DASH="src/views/teacher/Dashboard.vue"
if [ -f "$DASH" ]; then
  echo
  echo "4) Patching $DASH quick-actions to remove 'Create class' and ensure assignments link."
  backup "$DASH"

  # Create a small replacement snippet for the quick actions area.
  # This will replace the first "Quick actions" block found in the file.
  # The new snippet removes Create class and ensures Assignments is a router-link to TeacherAssignments.
  read -r -d '' NEW_SNIPPET <<'SNIP'
<!-- Quick actions (automatically updated) -->
<div class="grid grid-cols-2 gap-4 quick-grid">
  <router-link class="block bg-white rounded shadow p-3 hover:shadow-lg" :to="{ name: 'TeacherAssignments' }">
    <div class="flex items-center gap-3">
      <!-- assignments icon -->
      <svg width="28" height="28" viewBox="0 0 24 24" class="text-yellow-600" style="flex-shrink:0">
        <path d="M8 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      <div>
        <div class="text-sm font-medium">Assignments</div>
        <div class="text-xs text-gray-500">View & grade</div>
      </div>
    </div>
  </router-link>

  <button class="block bg-white rounded shadow p-3 hover:shadow-lg" @click="openCreateCourse">
    <div class="flex items-center gap-3">
      <svg width="28" height="28" viewBox="0 0 24 24" class="text-green-600" style="flex-shrink:0">
        <path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      <div>
        <div class="text-sm font-medium">Create course</div>
        <div class="text-xs text-gray-500">Add a new course</div>
      </div>
    </div>
  </button>

  <button class="block bg-white rounded shadow p-3 hover:shadow-lg" @click="openAddEvent">
    <div class="flex items-center gap-3">
      <svg width="28" height="28" viewBox="0 0 24 24" class="text-blue-600" style="flex-shrink:0">
        <path d="M3 8h18M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M16 2v4M8 2v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div>
        <div class="text-sm font-medium">Add event</div>
        <div class="text-xs text-gray-500">Schedule in calendar</div>
      </div>
    </div>
  </button>

  <button class="block bg-white rounded shadow p-3 hover:shadow-lg" @click="openCreateStudent">
    <div class="flex items-center gap-3">
      <svg width="28" height="28" viewBox="0 0 24 24" class="text-indigo-600" style="flex-shrink:0">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 20a9 9 0 0 1 18 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      <div>
        <div class="text-sm font-medium">Create student</div>
        <div class="text-xs text-gray-500">Enroll a new student</div>
      </div>
    </div>
  </button>
</div>
<!-- End quick-actions auto-update -->
SNIP

  # make a targeted replacement:
  # find the first occurrence of the phrase "Quick actions" and replace the following block up to the next closing comment or blank line block.
  # We'll implement a safer replace by creating a temp file:
  awk -v rsnippet="$NEW_SNIPPET" '
    BEGIN { found=0 }
    {
      lines[NR]=$0
    }
    END {
      # find line index with "Quick actions" heading
      idx=0
      for(i=1;i<=NR;i++){
        if (lines[i] ~ /Quick actions/ && idx==0) { idx=i; break }
      }
      if (idx==0) {
        # no quick actions header found: append snippet near end of template root
        for(i=1;i<=NR;i++) print lines[i]
        print rsnippet
        exit
      }
      # print up to idx-1
      for(i=1;i<idx;i++) print lines[i]
      # print the snippet
      print rsnippet
      # attempt to skip original block: find next blank line after idx and resume printing from there+1
      # fallback: print rest starting idx+1
      resume=idx+1
      for(j=idx+1;j<=NR;j++){
        # heuristic: if a line only contains </aside> or </div> followed by blank line, stop skipping
        if (lines[j] ~ /<\/aside>|<\/section>|<!-- End quick-actions auto-update -->/) { resume=j+1; break }
      }
      for(k=resume;k<=NR;k++) print lines[k]
    }
  ' "$DASH" > "${DASH}.tmp" && mv "${DASH}.tmp" "$DASH"

  echo "Patched quick-actions in $DASH (backup at ${DASH}.pre_revert.bak)."
else
  echo "No dashboard file found at $DASH. Skipping quick-actions patch."
fi

# 5) Ensure router has TeacherAssignments route pointing to views/teacher/Assignments.vue
ROUTER="src/router/index.js"
ASSIGN_ROUTE_LINE="{ path: 'assignments', name: 'TeacherAssignments', component: () => import('../views/teacher/Assignments.vue') },"
if [ -f "$ROUTER" ]; then
  backup "$ROUTER"
  if grep -q "name: 'TeacherAssignments'" "$ROUTER"; then
    echo
    echo "TeacherAssignments route already present in $ROUTER"
  else
    echo
    echo "Adding TeacherAssignments route to $ROUTER under the /teacher children block."
    # Insert route just after the TeacherDashboard route occurrence. This is a conservative append inside the /teacher block.
    awk -v rline="$ASSIGN_ROUTE_LINE" '
      BEGIN{added=0}
      {
        print $0
        if($0 ~ /name: '\''TeacherDashboard'\''/ && added==0){
          # search ahead for the closing of that line and insert next line at appropriate place:
          # find the next line that contains "children:" or a known pattern; here we just continue
        }
        # simplistic: when inside teacher route block, after the line containing "children: [" insert the route
        if($0 ~ /path: '\''\/teacher'\''/){ inTeacher=1 }
        if(inTeacher && $0 ~ /children: \[/ && added==0) {
          print "      " rline
          added=1
        }
      }
    ' "$ROUTER" > "${ROUTER}.tmp" && mv "${ROUTER}.tmp" "$ROUTER"
    echo "Appended TeacherAssignments route (backup at ${ROUTER}.pre_revert.bak)."
  fi
else
  echo "Router file not found at $ROUTER. Skipping route injection."
fi

# 6) Quick scan for broken imports and routes and print summary
echo
echo "6) Quick sanity checks (imports/routes)"
echo "Scanning for TeacherAssignments use in code..."
grep -R --line-number "TeacherAssignments" src || true

echo
echo "Scanning for Dashboard imports that might still reference old UI files..."
grep -n "Dashboard.vue" -R src || true

echo
echo "Files changed (backups end with .pre_revert.bak):"
git status --porcelain || true

echo
echo "7) Final instructions:"
echo " - Restart dev server: rm -rf node_modules/.vite && npm run dev"
echo " - Open browser and test teacher dashboard: click Assignments KPI and Quick action."
echo " - If any page still shows the old design, search for other Dashboard*.vue files in src/views/teacher and update router mapping manually."

echo "Script finished."
