# CLAUDE.md

HippocampX: Educational web app — Next.js *16.1+* , React *19.2+*, interactive learning modules.

## Rules

Consult `.cursor/rules/` for technology-specific guidelines. Read relevant rule files before working on matching file types.

## Commands

Run tools through pnpm scripts:
- `pnpm lint` — lint all files
- `pnpm lint <path>` — lint file, directory, or pattern (e.g., `pnpm lint lib/db-viewer/types.ts`, `pnpm lint lib/db-viewer/`, `pnpm lint lib/**/*.ts`)
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

Check `package.json` for versions. Search for documentation matching version >= installed. use canary/experimental docs.

## Behavior Correction

When user calls out bad behavior:
1. STOP — do not continue the task
2. Analyze what went wrong and why
3. Propose a concrete fix (rule, hook, or CLAUDE.md update)
4. Implement the fix immediately — this persists across sessions
5. Only then resume the task

Examples of bad behavior:
- Reading files already in context
- Ignoring loaded rules, falling back to training data
- Not reading files when explicitly referenced
- Giving hypothetical answers without checking actual project files 