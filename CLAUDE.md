# CLAUDE.md

HippocampX: Educational web app — Next.js 16.1+, React 19.2+, interactive learning modules.

## Rule Files

BEFORE responding to ANY technical question:
1. Read the relevant rule file from `.cursor/rules/`
2. Check `package.json` for exact versions
3. Cite the rule or version that informs your answer

Rule files:
- `react.mdc` — React patterns
- `nextjs.mdc` — Next.js patterns
- `motion.mdc` — Animation patterns
- `tailwind.mdc` — Styling patterns
- `plugins.mdc` — Plugin patterns
- `python.mdc` — Python patterns
- `test.mdc` — Test patterns
- `typescript.mdc` — TypeScript patterns

If no rule exists, say so. Do not proceed without user confirmation.

## Commands

Run tools through pnpm scripts:
- `pnpm lint` — linting
- `pnpm build` — production build
- `pnpm build:plugins` — TypeScript compilation
- `pnpm test` — unit tests
- `pnpm test:e2e` — e2e tests
- `pnpm dev` — development server

## Commits

Format: `type(scope): description`

Commit as the user only. No AI attribution.

## File Size

Target lines of code:
- React components: 100-200 (max 300)
- Utilities/hooks: 50-150 (max 250)
- API routes: 50-100 (max 200)
- Split files exceeding 400-500 lines

## Resources

Check `package.json` for versions. Search for documentation matching version >= installed. Prefer canary/experimental docs.