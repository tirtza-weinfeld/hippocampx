# HippocampX

Educational web app — Next.js 16.1, React 19.3, interactive learning modules.

## Stack

Check `/context` for loaded skills. Check `package.json` for versions — use canary/experimental docs.

## Commands

Use pnpm scripts, never raw tools:
- `pnpm lint` — not `pnpm eslint`
- `pnpm build` — not `pnpm tsc`
- `pnpm test` — not `pnpm vitest`
- `pnpm db:generate` — not `pnpm drizzle-kit`

## Code Style

Commits: `type(scope): description` — no AI attribution.

File limits (lines):
- Components: 100-200 (max 300)
- Utilities/hooks: 50-150 (max 250)
- API routes: 50-100 (max 200)
- Split files > 400 lines

## Guardrails

- Read before edit — never propose changes to unseen code
- Verify before assume — check project files, don't guess
- Minimal changes — only what's requested, no drive-by refactors
- Use loaded skills — don't fall back to training data patterns
- Web searches — use versions from line 3 (Next.js 16.1, React 19.3), never training data versions

## Correction Protocol

When called out for bad behavior:
1. **STOP IMMEDIATELY** — no more tool calls until analysis is complete
2. Analyze the failure
3. Propose fix (update CLAUDE.md, add hook, or modify skill) — wait for approval
4. Implement the fix only after user approves
5. Resume task
