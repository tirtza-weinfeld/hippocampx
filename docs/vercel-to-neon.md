# Vercel Postgres → Neon Migration

## Current State

```
Neon DB (NEON_DATABASE_URL):
├── dictionary tables (lexical_entries, senses, word_forms, examples, etc.)
├── songs tables (collections, songs)
└── external tables (alembic_version)

Vercel Postgres (POSTGRES_URL):
└── problems tables (problems, solutions)
```

Two connections, two env vars:
```bash
NEON_DATABASE_URL=...
POSTGRES_URL=...
```

### File Structure

```
lib/db/
├── neon/
│   ├── connection.ts        # neonDb using @neondatabase/serverless
│   ├── schema.ts            # exports dictionary, songs, external schemas
│   ├── schemas/
│   │   ├── dictionary.ts
│   │   ├── songs.ts
│   │   └── external.ts
│   └── queries/
└── vercel/
    ├── connection.ts        # vercelDb using @vercel/postgres
    ├── schema.ts
    ├── schemas/
    │   └── problems.ts
    └── queries/
        └── problems.ts

drizzle.config.ts            # DRIZZLE_CLI_DB_TARGET switches between neon/vercel
```

## Target State

```
Neon DB (single):
├── dictionary tables
├── songs tables
├── external tables
└── problems tables
```

One connection:
```bash
DATABASE_URL=...
```

### File Structure

```
lib/db/
├── connection.ts            # db using @neondatabase/serverless
├── schemas/
│   ├── index.ts             # exports all schemas
│   ├── dictionary.ts
│   ├── songs.ts
│   ├── external.ts
│   └── problems.ts
└── queries/

drizzle.config.ts            # Single target
```

## Files to Change

```
lib/db/
├── connection.ts            # Flatten from neon/
├── schemas/
│   ├── index.ts             # Replaces schema.ts
│   ├── dictionary.ts
│   ├── songs.ts
│   ├── external.ts
│   └── problems.ts          # Move from vercel/
└── queries/                 # Merge neon/ and vercel/ queries
├── neon/                    # Delete
└── vercel/                  # Delete

backend/scripts/problems/
└── sync_problems_to_db.py   # POSTGRES_URL → DATABASE_URL

drizzle.config.ts            # Remove vercel target logic
package.json                 # Remove @vercel/postgres
.env.local                   # POSTGRES_URL → DATABASE_URL
```
