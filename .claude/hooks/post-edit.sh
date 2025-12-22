#!/bin/bash
# Post-edit hook: Auto-lint modified files
# Runs after Write or Edit tool completes

set -e

# Read JSON input from stdin
input=$(cat)

# Extract file path from tool_input
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Exit silently if no file path
if [ -z "$file_path" ]; then
  exit 0
fi

# Only lint TypeScript/JavaScript files
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs)
    # Check if file exists and is in project
    if [ -f "$file_path" ]; then
      # Run lint and block on errors (exit 2 = blocking error)
      if ! pnpm lint "$file_path" 2>&1; then
        echo "Fix lint errors before continuing" >&2
        exit 2
      fi
    fi
    ;;
esac

exit 0
