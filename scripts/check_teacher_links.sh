#!/usr/bin/env bash
set -e
ROUTER="src/router/index.js"
echo "Checking teacher routes and view file links..."

# expected teacher routes
expected=("TeacherDashboard" "TeacherClasses" "TeacherStudents" "TeacherAssignments" "TeacherStatistics" "TeacherCalendar" "TeacherClassDetail" "TeacherStudentDetail")
for name in "${expected[@]}"; do
  if grep -q "name:[[:space:]]*['\"]${name}['\"]" "$ROUTER"; then
    echo "OK route exists: $name"
  else
    echo "MISSING route: $name"
  fi
done

# check that referenced components exist
grep -R --line-number "import .*Teacher.* from" src | sed -n '1,200p'
echo "Also check Dashboard imports for 'components/teacher' and 'components/admin' usage"
grep -nE "components\/teacher|components\/admin" src/views/teacher || true
