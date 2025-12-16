# Hippo Kit

PostgreSQL database toolkit for Neon. Browse, query, and edit tables grouped by schema.

## Naming

```
Repo:     hippo-kit
Package:  hippo-kit
CLI:      hippo
Config:   hippo.config.ts
Web UI:   hippo-studio.vercel.app
```

## How It Works

```
┌──────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  hippo-studio.vercel.app?port=4000                           │
│  (UI only — no DB access)                                    │
│                          │                                   │
│                          │ fetch('/api/tables')              │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  localhost:4000 (hippo-kit local server)                │ │
│  │  - Has DB credentials from .env                         │ │
│  │  - Runs SQL queries                                     │ │
│  │  - Returns JSON to browser                              │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          │ SQL                               │
│                          ▼                                   │
│                    User's Neon DB                            │
└──────────────────────────────────────────────────────────────┘
```

1. User runs `npx hippo`
2. CLI starts local server on port 4000 (default)
3. CLI opens `hippo-studio.vercel.app?port=4000`
4. Web app reads port from URL, makes requests to `localhost:4000`
5. Local server queries Neon, returns data
6. Credentials never leave user's machine

## Install

```bash
npm install -D hippo-kit && npx hippo
pnpm add -D hippo-kit && pnpm exec hippo
```

## Commands

```bash
hippo
hippo --port 5000
hippo --no-open
hippo --verbose
```

## Config

```ts
// hippo.config.ts
import { defineConfig } from 'hippo-kit'

export default defineConfig({
  env: 'NEON_DATABASE_URL',
  schema: './lib/db/neon/schema.ts',
})
```

Auto-detects schemas from database. Falls back to `drizzle.config.ts`.

## Architecture

**Two repos:**

```
hippo-kit/          → npm package (CLI + local server)
├── src/
│   ├── bin.ts
│   ├── config.ts
│   ├── server.ts
│   └── api/
│       ├── tables.ts
│       └── query.ts
├── package.json
└── tsconfig.json

hippo-web/          → hosted UI (hippo-studio.vercel.app)
├── src/
│   ├── components/
│   ├── pages/
│   ├── stores/
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## API (Local Server)

```
GET    /api/schemas                   → string[]
GET    /api/tables                    → TableInfo[]
GET    /api/tables/:schema/:name      → TableMetadata
GET    /api/tables/:schema/:name/rows → { data, total, page }
POST   /api/tables/:schema/:name/rows → InsertedRow
PUT    /api/tables/:schema/:name/rows/:id → UpdatedRow
DELETE /api/tables/:schema/:name/rows/:id → { success }
POST   /api/query                     → { columns, rows }
```

## Routes (Hosted UI)

```
/                              Dashboard
/tables/:schema/:name          Table browser
/query                         SQL editor
/diagram                       ER diagram
```

## Tech

**CLI (hippo-kit):**

| | |
|-|-|
| Runtime | Node.js |
| CLI | CAC |
| Server | Hono |
| DB | drizzle-orm |

**UI (hippo-web):**

| | |
|-|-|
| Framework | React 19 |
| Bundler | Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Editor | CodeMirror 6 |
| Diagram | React Flow |

## P0

**Schema Grouping:**
- Auto-detect schemas from DB
- Group tables by schema
- Color-coded badges

**Table Browser:**
- Row counts, column metadata
- Pagination, sort, search

**Data Editor:**
- Inline cell editing
- Add/delete rows

**Query Editor:**
- Syntax highlighting
- Cmd+Enter to run
- Results as table

## P1

- ER diagram
- Query autocomplete
- Query history
- Keyboard shortcuts

## P2

- Bulk delete
- Export/import CSV/JSON
- Saved queries
- FK navigation
- Undo/redo

## Constraints

- Neon PostgreSQL only
- Localhost server only
- No migrations
- Requires internet (for hosted UI)

## Security

- Local server binds to localhost
- Credentials never leave user's machine
- Parameterized queries
- DELETE confirmation
- Readonly mode
