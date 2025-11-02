#!/usr/bin/env bash
set -e
ROUTER_FILE="src/router/index.js"
if [ ! -f "$ROUTER_FILE" ]; then
  echo "Router file not found at $ROUTER_FILE"
  exit 1
fi
echo "Extracting route names and paths from $ROUTER_FILE"
echo "Format: ROUTE_NAME -> PATH"
# Simple extraction of route names and paths
grep -E "(name:|path:)" "$ROUTER_FILE" | while read -r line; do
  if [[ "$line" == *"name:"* ]]; then
    name=$(echo "$line" | sed -E 's/.*name:[[:space:]]*['\''"]?([^'\''",]*).*/\1/')
  elif [[ "$line" == *"path:"* ]] && [[ -n "$name" ]]; then
    path=$(echo "$line" | sed -E 's/.*path:[[:space:]]*['\''"]?([^'\''",]*).*/\1/')
    echo "$name -> $path"
    name=""
  fi
done
