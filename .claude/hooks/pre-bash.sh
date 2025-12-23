#!/bin/bash
# Pre-bash hook: Validate commands before execution
# Blocks dangerous patterns not caught by permissions

set -e

# Read JSON input from stdin
input=$(cat)

# Extract command from tool_input
command=$(echo "$input" | jq -r '.tool_input.command // empty')

# Exit silently if no command
if [ -z "$command" ]; then
  exit 0
fi

# Block patterns (exit 2 = blocking error)
# These supplement the deny rules in settings.json

# Block recursive deletion of important directories
if echo "$command" | grep -qE 'rm\s+(-[rf]+\s+)*(node_modules|\.next|\.git|src|lib|app|components)/?\s*$'; then
  echo "Blocked: Recursive deletion of important directory" >&2
  exit 2
fi

# Block force push to main/master
if echo "$command" | grep -qE 'git\s+push.*(-f|--force).*\s+(origin\s+)?(main|master)'; then
  echo "Blocked: Force push to main/master" >&2
  exit 2
fi

# Block dropping database tables without confirmation
if echo "$command" | grep -qiE '(DROP\s+TABLE|DROP\s+DATABASE|TRUNCATE)'; then
  echo "Blocked: Destructive database operation" >&2
  exit 2
fi

# Block piping untrusted content to shell
if echo "$command" | grep -qE 'curl.*\|\s*(sh|bash|zsh)'; then
  echo "Blocked: Piping remote content to shell" >&2
  exit 2
fi

# Block npx/npm - this project uses pnpm
if echo "$command" | grep -qE '^(npx|npm)\s'; then
  echo "Blocked: Use pnpm instead of npm/npx" >&2
  exit 2
fi

# Block pnpm with raw tool names - use scripts instead
# pnpm eslint → pnpm lint, pnpm tsc → pnpm build, etc.
if echo "$command" | grep -qE '^pnpm\s+(eslint|tsc|typescript|prettier|vitest|playwright|jest|drizzle-kit)\b'; then
  echo "Blocked: Use pnpm scripts (e.g., 'pnpm lint' not 'pnpm eslint'). Check package.json for available scripts." >&2
  exit 2
fi

exit 0
