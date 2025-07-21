# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HippocampX is an educational web application built with Next.js, featuring interactive learning modules across mathematics (calculus), computer science (AI, algorithms), and creative subjects. The project leverages MDX for rich content authoring with custom plugins for enhanced functionality.

## Development Commands

### Core Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production application
- `pnpm lint` - Run ESLint linting
- `pnpm start` - Start production server

### Database Operations
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open database management UI
- `pnpm db:seed` - Seed database with initial data

### Testing
- `pnpm test` - Run unit tests (Vitest)
- `pnpm test:ui` - Open test UI
- `pnpm test:coverage` - Generate coverage reports
- `pnpm test:e2e` - Run E2E tests (Playwright)
- `pnpm test:e2e:ui` - Run E2E tests with UI
- `pnpm test:py` - Run Python tests for metadata extraction

### Content Processing
- `pnpm extract-metadata` - Extract metadata from code examples in `examples/code/`

## Architecture & Key Technologies

### Frontend Stack
- **Next.js 15+ (Canary)** with App Router, React Server Components, Server Actions
- **React 19+ (Canary)** with concurrent features, `use()` hook, automatic batching
- **TypeScript 5.4+** with strict mode, satisfies operator, const assertions
- **Tailwind CSS v4.1** zero-config with `@theme` CSS variables, container queries
- **Radix UI** for WAI-ARIA compliant primitives
- **Framer Motion** with `useReducedMotion()` and GPU-accelerated transforms

### Content & MDX System
- **MDX** with unified/remark/rehype ecosystem and custom plugins
- **Advanced Remark Plugins**:
  - `remark-smart-code-import` - Dynamic code extraction with metadata
  - `remark-code-tooltip` - Interactive AST-based tooltips
  - `remark-github-alerts` - Semantic alert components
- **Shiki v3.7+** with tree-sitter parsers and custom transformers
- **KaTeX** for LaTeX math rendering with tree-shaking

### Database & Backend
- **PostgreSQL** via @vercel/postgres with connection pooling
- **Drizzle ORM** with type-safe migrations and prepared statements
- **Python 3.13+** backend with async/await and pattern matching
- **Server Actions** for type-safe client-server communication

## Project Structure

### `/app` - Next.js App Router Pages
Educational modules organized by domain:
- `/ai` - AI learning (games, tutorials, neural networks)
- `/binary` - Binary number system education
- `/calculus` - Interactive calculus (derivatives, limits, integration)
- `/hadestown` - Musical-themed learning games
- `/infinity` - Mathematical infinity concepts
- `/notes` - Algorithm documentation (MDX)

### `/components` - Component Organization
- Domain-specific components mirror app structure
- `/mdx` - Enhanced MDX components (code blocks, tooltips, tables)
- `/ui` - Base UI components (shadcn/ui)
- `/layout` - App structure components

### `/lib` - Core Utilities
- `/db` - Database schema, queries, and seed data
- `/extracted-metadata` - Code analysis metadata
- `/tic-tac-toe` - Game logic and AI implementation

### `/plugins` - Custom MDX Plugins
- `remark-smart-code-import` - Dynamic code import with metadata
- `remark-code-tooltip` - Interactive code explanations
- `remark-github-alerts` - Alert components
- `toc-plugin` - Table of contents generation

### `/examples` - Educational Code
- Python implementations with metadata extraction
- Test files for validation and development

## Development Guidelines

### Code Style & Standards
- **TypeScript-First**: `.ts`/`.tsx` only, strict mode with `exactOptionalPropertyTypes`
- **Modern JavaScript**: ES2025+ features (top-level await, pipeline operator)
- **Type Safety**: Zero `any`, explicit return types, branded types for domain objects
- **Package Management**: `pnpm` with workspace protocols and selective dependency hoisting
- **Import/Export**: ESM only, consistent import ordering with `import type`
- **Error Handling**: Structured error objects, never throw strings

### Testing Strategy
- **Test-Driven Development**: Red-Green-Refactor cycle, tests define requirements
- **Unit Testing**: Vitest with happy-dom, Testing Library for component behavior
- **Integration Testing**: Playwright with parallel execution and trace viewer
- **Visual Testing**: Playwright screenshots with automated visual regression
- **Python Testing**: pytest with type checking via mypy and coverage via pytest-cov
- **Performance Testing**: Web Vitals monitoring in E2E tests
- **Coverage**: ≥90% with branch coverage, 100% for critical paths

### Test Structure
- Mirror source structure: `src/components/...` → `tests/components/...`
- Use descriptive naming: `*.test.tsx` for React, `*.test.ts` for TypeScript
- E2E tests in `e2e/` directory

### MDX & Content Development
- Code examples in `examples/code/` with metadata extraction
- Use `pnpm extract-metadata` after adding new code examples
- Leverage custom plugins for enhanced functionality:
  - Smart code imports: `{/* import:function_name */}`
  - Interactive tooltips: `{/* tooltip:variable_name */}`
  - Line range highlighting and grouping

### Database Development
- **Schema**: Define in `lib/db/schema.ts` with Drizzle DSL, use branded types for IDs
- **Migrations**: Generated migrations with rollback support, seed data in transactions
- **Queries**: Prepared statements for performance, use `$inferSelect`/`$inferInsert` types
- **Transactions**: Nested transactions with proper rollback, optimistic concurrency control
- **Testing**: Database testing with isolated test databases, snapshot testing for schema

### Animation & Accessibility
- **Motion**: Framer Motion with `useReducedMotion()`, spring animations, layout animations
- **Accessibility**: WCAG 2.1 AAA compliance, focus trap management, screen reader testing
- **Color**: OKLCH color space for perceptual uniformity and better contrast
- **Focus Management**: Visible focus indicators, logical tab order, skip links
- **Responsive**: Container queries over media queries, fluid typography with clamp()
- **Performance**: Prefer CSS transforms, will-change property, avoid layout thrashing

### Security & Performance
- **Input Validation**: Zod schemas with branded types, runtime validation in Server Actions
- **Security**: CSP headers, CSRF protection, input sanitization, secure headers
- **Performance**: React Compiler auto-optimization, Suspense boundaries, streaming SSR
- **Code Splitting**: Route-based and component-based splitting with `next/dynamic`
- **Caching**: Aggressive caching with `revalidateTag()`, edge caching, ISR
- **Monitoring**: Web Vitals tracking, error boundaries with telemetry
- **Bundle Analysis**: Regular bundle audits, tree-shaking verification

### Modern Development Workflow
- **Development**: Hot reload with Turbopack, React Fast Refresh, CSS hot reloading
- **Type Checking**: Incremental compilation, project references, composite builds
- **Linting**: ESLint 9+ with flat config, Prettier with plugin sorting
- **Git Hooks**: Husky with lint-staged, conventional commits, automated changelog
- **CI/CD**: GitHub Actions with caching, parallel jobs, deployment previews
- **Monitoring**: OpenTelemetry integration, structured logging with Pino
- **Documentation**: Auto-generated API docs, living style guide with Storybook

### Code Quality Standards
- **Architecture**: Clean Architecture principles, dependency injection, SOLID principles
- **State Management**: Server state with React Query, client state with Zustand/Jotai
- **Error Handling**: Error boundaries, structured error objects, graceful degradation
- **Logging**: Structured logging with correlation IDs, proper log levels
- **Metrics**: Performance monitoring, user analytics, feature flags
- **Internationalization**: React-intl with ICU message format, RTL support

## Special Features

### Dynamic Code Import System
MDX files can import code snippets from `examples/code/` with:
- Function-based extraction
- Line range selection
- Automatic metadata generation
- Interactive tooltips and explanations

### Interactive Learning Components
- Educational games with React DnD
- Mathematical visualizations with Recharts
- AI simulation components
- Progressive disclosure patterns

### Multi-Domain Learning Architecture
Each learning domain (calculus, AI, binary) has:
- Dedicated component libraries
- Custom styling in `styles/components/`
- Educational progression tracking
- Interactive assessment tools

Run `pnpm extract-metadata` after modifying code examples to update tooltips and documentation.