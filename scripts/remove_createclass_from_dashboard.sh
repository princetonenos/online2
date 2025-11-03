#!/usr/bin/env bash
set -euo pipefail
DASH="src/views/teacher/Dashboard.vue"
if [ ! -f "$DASH" ]; then
  echo "Dashboard not found at $DASH"
  exit 1
fi
cp "$DASH" "${DASH}.pre_remove.bak"
echo "Backup created: ${DASH}.pre_remove.bak"

# Remove button elements or cards that contain 'Create class' (template)
# Use perl to remove tags that include the text 'Create class' inside them (safe but conservative)
perl -0777 -pe 's{<[^>]*>[^<]*Create class[^<]*</[^>]*>}{}gsi' -i "$DASH"

# Remove any import lines for CreateClassModal
perl -ni -e 'print unless /CreateClassModal/; ' "$DASH"

# Remove any modal component tags <CreateClassModal .../> or block <CreateClassModal>..</CreateClassModal>
perl -0777 -pe 's{<CreateClassModal\b[^>]*\/>}{}gsi; s{<CreateClassModal\b[^>]*>.*?</CreateClassModal>}{}gsi' -i "$DASH"

# Remove script tokens referencing createOpen/createClassOpen/createClass
perl -0777 -pe 's/\bcreate(Class)?Open\b[^,\n;)]*[,;\)]?//gsi' -i "$DASH"
perl -0777 -pe 's/\bcreateClass\b[^,\n;)]*[,;\)]?//gsi' -i "$DASH"

echo "Removed 'Create class' blocks, imports, and modal tags from $DASH"
echo "Review the backup file if needed: ${DASH}.pre_remove.bak"
