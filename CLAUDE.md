# CLAUDE.md

HippocampX: Educational web app — Next.js 16.1+, React 19.2+, interactive learning modules.

## Rule Files

Rules in `.claude/rules/` auto-load by file path. Do not fall back to training data.

If no rule matches or versions conflict → **ASK before proceeding**.

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

Check `package.json` for versions. Search for documentation matching version >= installed. use canary/experimental docs. 