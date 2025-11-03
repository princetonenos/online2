#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"
echo "=== Teacher quick-links checker ==="

# locate teacher Dashboard.vue
DASH=$(find src -type f -path "*/views/teacher/Dashboard.vue" -print -quit)
if [ -z "$DASH" ]; then
  echo "ERROR: src/views/teacher/Dashboard.vue not found."
  exit 2
fi
echo "Dashboard found: $DASH"

# expected quick actions -> desired route names / files
declare -A expect
expect["My classes"]="TeacherClasses src/views/teacher/ActiveClasses.vue"
expect["Assignments"]="TeacherAssignments src/views/teacher/Assignments.vue"
expect["Calendar"]="TeacherCalendar src/views/teacher/TeacherCalendar.vue"
expect["Analytics"]="TeacherAnalytics src/views/teacher/Analytics.vue"
expect["Students"]="TeacherStudents src/views/teacher/Students.vue"
expect["Create course"]="(modal) src/components/teacher/CreateCourseModal.vue"
expect["Add event"]="(modal) src/components/teacher/EventModal.vue"
expect["Create student"]="(modal) src/components/teacher/CreateStudentModal.vue"

echo
echo "Checking router names and view files..."
ROUTER="src/router/index.js"
if [ ! -f "$ROUTER" ]; then
  echo "WARNING: Router file not found at $ROUTER. Skipping router name checks."
fi

# helper to check router name exists
has_route() {
  local name="$1"
  if [ -f "$ROUTER" ]; then
    grep -qE "name:[[:space:]]*['\"]${name}['\"]" "$ROUTER" && return 0 || return 1
  else
    return 1
  fi
}

# scan dashboard for occurrences and link types
echo
printf "%-14s | %-8s | %-30s\n" "Action" "Router?" "Target file exists?"
printf "%-14s-+-%-8s-+-%-30s\n" "--------------" "--------" "------------------------------"
for key in "${!expect[@]}"; do
  info="${expect[$key]}"
  route=$(echo "$info" | awk '{print $1}')
  file=$(echo "$info" | awk '{print $2}')
  # check if dashboard has the label (template text)
  if grep -q "$key" "$DASH"; then
    found="yes"
  else
    found="no"
  fi
  # router check
  if [[ "$route" == "(modal)" ]]; then
    rcheck="modal"
  else
    if has_route "$route"; then rcheck="yes"; else rcheck="no"; fi
  fi
  # file check
  if [ -n "$file" ] && [ -f "$file" ]; then fexists="yes"; else fexists="no"; fi

  printf "%-14s | %-8s | %-30s\n" "$key" "$rcheck" "$fexists"
done

echo
echo "Searching for router.push usage in Dashboard for quick-actions..."
grep -nE "router\.push|router\.replace" "$DASH" || echo "No router.push usage found in dashboard."

echo
echo "List of teacher route names found in router:"
if [ -f "$ROUTER" ]; then
  grep -oE "name:[[:space:]]*['\"][A-Za-z0-9_-]+['\"]" "$ROUTER" | sed -E "s/name:[[:space:]]*['\"]([^'\"]+)['\"]/\1/" | sort -u
else
  echo "(router file missing)"
fi

echo
echo "Check complete. Fix any 'no' entries above before running the UI test."
