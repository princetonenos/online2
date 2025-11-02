#!/usr/bin/env bash
set -e

echo "Scanning for dashboard view files and creating stubs if missing..."

# expected dashboard paths
declare -A EXPECTED=(
  ["admin"]="src/views/admin/Dashboard.vue"
  ["teacher"]="src/views/teacher/Dashboard.vue"
  ["student"]="src/views/student/Dashboard.vue"
)

for role in "${!EXPECTED[@]}"; do
  file="${EXPECTED[$role]}"
  dir=$(dirname "$file")
  if [ ! -f "$file" ]; then
    echo "Creating stub for $role dashboard: $file"
    mkdir -p "$dir"
    cat > "$file" <<'EOF'
<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold">ROLE Dashboard (stub)</h1>
    <p class="mt-2">This is a stub for ROLE dashboard. Replace with real UI.</p>
    <router-link :to="{ name: 'Login' }" class="mt-4 inline-block text-sm">Back to login</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
EOF
    # replace ROLE placeholder with actual role name
    sed -i "s/ROLE/$(echo $role | sed -e 's/^./\U&/g')/g" "$file"
    echo "Stub created: $file"
  else
    echo "Exists: $file"
  fi
done

echo "Stub creation complete. Run 'npm run dev' and verify routes."
