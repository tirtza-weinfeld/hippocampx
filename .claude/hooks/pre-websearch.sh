#!/bin/bash
# Block web searches with legacy versions

QUERY="$CLAUDE_TOOL_INPUT"

# Check for legacy versions
if echo "$QUERY" | grep -qiE "next\.?js\s*(14|15)(\s|$)|react\s*(17|18)(\s|$)"; then
  echo "BLOCK: Use Next.js 16.1 and React 19.3 (from CLAUDE.md line 3), not legacy versions"
  exit 1
fi

exit 0
