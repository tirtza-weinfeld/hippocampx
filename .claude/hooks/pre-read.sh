#!/bin/bash
# Pre-read hook: Enforce smart file reading
# Blocks reading more than 400 lines without explicit limit

set -e

# Read JSON input from stdin
input=$(cat)

# Extract parameters from tool_input
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
limit=$(echo "$input" | jq -r '.tool_input.limit // empty')

# Exit silently if no file path
if [ -z "$file_path" ]; then
  exit 0
fi

# Allow binary files (images, PDFs, notebooks) - they handle limits differently
if echo "$file_path" | grep -qiE '\.(png|jpg|jpeg|gif|webp|svg|ico|pdf|ipynb)$'; then
  exit 0
fi

# If no limit specified, check file size
if [ -z "$limit" ]; then
  # Check if file exists and get line count
  if [ -f "$file_path" ]; then
    line_count=$(wc -l < "$file_path" 2>/dev/null | tr -d ' ')

    if [ "$line_count" -gt 400 ]; then
      echo "BLOCKED: File has $line_count lines. Use limit parameter (max 400) or ask for explicit permission to read more." >&2
      echo "Suggestion: Read(file_path=\"$file_path\", limit=400)" >&2
      exit 2
    fi
  fi
fi

# If limit is specified but > 400, block
if [ -n "$limit" ] && [ "$limit" -gt 400 ]; then
  echo "BLOCKED: Requested limit=$limit exceeds 400 lines. Ask for explicit permission to read more than 400 lines." >&2
  exit 2
fi

exit 0
