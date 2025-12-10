# Dictionary Schema - Current State

> **Status: SCHEMA DEPLOYED** - Database schema is live. Frontend and queries need updating.

## What's Done

- [x] Schema defined in `lib/db/neon/schemas/dictionary.ts`
- [x] Extensions enabled: `vector`, `pg_trgm`
- [x] Schema pushed to Neon database via `pnpm db:push`
- [x] All tables created with indexes

## What Needs Updating

- [ ] `lib/db/neon/queries/dictionary/` - Query functions
- [ ] `lib/actions/dictionary.ts` - Server actions
- [ ] `components/dictionary/*.tsx` - UI components
- [ ] `lib/db/neon/seeds/` - Seed data and scripts

---

## Schema Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ LEXICAL HIERARCHY                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ lexical_entries (id, lemma, part_of_speech, language_code, embedding)   │
│ ├── word_forms (id, entry_id, form_text, grammatical_features)          │
│ ├── senses (id, entry_id, definition, order_index, embedding)           │
│ │     ├── examples (id, sense_id, text, language_code, embedding)       │
│ │     ├── sense_tags (sense_id, tag_id, explanation)                    │
│ │     └── sense_relations (source_sense_id, target_sense_id, type)      │
│ └── entry_audio (id, entry_id, audio_url, transcript, duration_ms)      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ SOURCE HIERARCHY (Recursive)                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ sources (id, type, title, publication_year, reliability_score)          │
│ ├── source_parts (id, source_id, parent_part_id, name, type, order)     │
│ └── source_credits (source_id, contributor_id, role)                    │
│       └── contributors (id, name, type, metadata)                       │
└─────────────────────────────────────────────────────────────────────────┘

tags (id, name, category)
```

---

## Tables Reference

### Core Tables

| Table | Columns | Notes |
|-------|---------|-------|
| `lexical_entries` | id, lemma, part_of_speech, language_code, embedding, metadata, created_at, updated_at | Main word entries. Unique on (lemma, language_code, part_of_speech) |
| `word_forms` | id, entry_id, form_text, grammatical_features | Inflections. grammatical_features is JSONB |
| `senses` | id, entry_id, definition, order_index, embedding, is_synthetic, verification_status | Meanings. order_index for display order |
| `sense_relations` | id, source_sense_id, target_sense_id, relation_type, strength, explanation | Links between senses (synonym, antonym, etc.) |
| `sense_tags` | sense_id, tag_id, explanation | Junction table with optional explanation |
| `tags` | id, name, category | Tag definitions |
| `examples` | id, sense_id, text, language_code, source_part_id, embedding, cached_citation | Usage examples |
| `entry_audio` | id, entry_id, audio_url, transcript, duration_ms, accent_code, content_type | Audio as URL (not bytea) |

### Source Tables

| Table | Columns | Notes |
|-------|---------|-------|
| `sources` | id, type, title, publication_year, reliability_score, metadata | Books, musicals, etc. |
| `source_parts` | id, source_id, parent_part_id, name, type, order_index | Recursive hierarchy (Act → Song) |
| `source_credits` | source_id, contributor_id, role | Composite PK |
| `contributors` | id, name, type, metadata | Authors, composers, etc. |

---

## Enums

```typescript
partOfSpeechEnum: "noun" | "verb" | "adjective" | "adverb" | "pronoun" |
                  "preposition" | "conjunction" | "interjection" | "determiner" |
                  "article" | "particle" | "numeral" | "symbol"

relationTypeEnum: "translation" | "synonym" | "antonym" | "hypernym" |
                  "hyponym" | "meronym" | "holonym" | "nuance"

sourceTypeEnum: "book" | "movie" | "article" | "academic_paper" |
                "conversation" | "synthetic_ai" | "musical" | "podcast"

creditRoleEnum: "author" | "artist" | "composer" | "lyricist" |
                "playwright" | "director" | "host"
```

---

## Key Changes from Old Schema

| Old | New | Notes |
|-----|-----|-------|
| `words` table | `lexical_entries` | Renamed, added embedding |
| `word.word` | `entry.lemma` | Field renamed |
| `definitions` table | `senses` | Renamed, added order_index |
| `word_tags` | `sense_tags` | Tags on senses, not entries |
| `word_relations` | `sense_relations` | Relations between senses |
| `word_audio.audio_data` (bytea) | `entry_audio.audio_url` (varchar) | URL instead of blob |
| — | `contributors` | New table |
| — | `source_credits` | New junction table |
| — | `source_parts.parent_part_id` | Recursive hierarchy |
| — | `examples.language_code` | For multilingual tsvector |
| — | `senses.order_index` | Display ordering |
| — | `sense_tags.explanation` | Why this tag |

---

## Indexes

### Vector (HNSW)
- `lexical_entries.embedding`
- `senses.embedding`
- `examples.embedding`

### Trigram (GIN) - Fuzzy Search
- `lexical_entries.lemma`
- `word_forms.form_text`
- `examples.text`
- `contributors.name`
- `sources.title`

### JSONB (GIN)
- `word_forms.grammatical_features`

---

## Drizzle Relations

All relations defined for relational queries:

```typescript
// Entry with all children
db.query.lexicalEntries.findFirst({
  where: eq(lexicalEntries.id, id),
  with: {
    forms: true,
    senses: {
      with: {
        examples: { with: { sourcePart: { with: { source: true } } } },
        tags: { with: { tag: true } },
        outgoingRelations: { with: { target: true } },
      },
    },
    audio: true,
  },
});
```

---

## Type Exports

```typescript
// Base types
LexicalEntry, InsertLexicalEntry
WordForm, InsertWordForm
Sense, InsertSense
SenseRelation, InsertSenseRelation
Tag, InsertTag
SenseTag, InsertSenseTag
Contributor, InsertContributor
Source, InsertSource
SourceCredit, InsertSourceCredit
SourcePart, InsertSourcePart
Example, InsertExample
EntryAudio, InsertEntryAudio

// Composite types (for API responses)
SourceWithMeta       // Source + credits[] + parts[]
SenseWithDetails     // Sense + examples[] + tags[] + outgoingRelations[]
LexicalEntryComplete // LexicalEntry + forms[] + senses[] + audio[]
```

---

## Query Patterns

### Search by Lemma (Exact)
```typescript
db.select().from(lexicalEntries)
  .where(eq(lexicalEntries.lemma, query));
```

### Search by Lemma (Fuzzy)
```typescript
db.select().from(lexicalEntries)
  .where(sql`${lexicalEntries.lemma} % ${query}`)
  .orderBy(sql`${lexicalEntries.lemma} <-> ${query}`)
  .limit(20);
```

### Search by Lemma (Semantic)
```typescript
db.select().from(lexicalEntries)
  .orderBy(sql`${lexicalEntries.embedding} <=> ${embedding}::halfvec`)
  .limit(10);
```

### Filter by Tag
```typescript
db.select({ entry: lexicalEntries })
  .from(senseTags)
  .innerJoin(tags, eq(senseTags.tag_id, tags.id))
  .innerJoin(senses, eq(senseTags.sense_id, senses.id))
  .innerJoin(lexicalEntries, eq(senses.entry_id, lexicalEntries.id))
  .where(eq(tags.name, tagName));
```

### Filter by Source
```typescript
db.select({ entry: lexicalEntries })
  .from(examples)
  .innerJoin(senses, eq(examples.sense_id, senses.id))
  .innerJoin(lexicalEntries, eq(senses.entry_id, lexicalEntries.id))
  .innerJoin(sourceParts, eq(examples.source_part_id, sourceParts.id))
  .innerJoin(sources, eq(sourceParts.source_id, sources.id))
  .where(eq(sources.title, sourceTitle));
```

### Filter by Contributor
```typescript
db.select({ entry: lexicalEntries })
  .from(examples)
  .innerJoin(senses, eq(examples.sense_id, senses.id))
  .innerJoin(lexicalEntries, eq(senses.entry_id, lexicalEntries.id))
  .innerJoin(sourceParts, eq(examples.source_part_id, sourceParts.id))
  .innerJoin(sources, eq(sourceParts.source_id, sources.id))
  .innerJoin(sourceCredits, eq(sourceCredits.source_id, sources.id))
  .innerJoin(contributors, eq(sourceCredits.contributor_id, contributors.id))
  .where(sql`${contributors.name} % ${contributorName}`);
```

---

## Zod Validators

For validating `grammatical_features` JSONB:

```typescript
import {
  EnglishGrammarSchema,
  GermanGrammarSchema,
  ItalianGrammarSchema,
  ArabicGrammarSchema,
  PolyglotGrammarSchema
} from "@/lib/db/neon/schemas/dictionary";

// Validate before insert
const result = PolyglotGrammarSchema.safeParse(features);
if (!result.success) throw new Error("Invalid grammar");
```

---

## Frontend Migration Map

| Old Component Pattern | New Pattern |
|----------------------|-------------|
| `word.id` | `entry.id` |
| `word.word` | `entry.lemma` |
| `word.partOfSpeech` | `entry.part_of_speech` |
| `word.definitions[]` | `entry.senses[].definition` |
| `word.tags[]` | `entry.senses[].tags[].tag` |
| `word.relations[]` | `entry.senses[].outgoingRelations[]` |
| `word.audio` (blob) | `entry.audio[].audio_url` (URL) |
| `definition.examples[]` | `sense.examples[]` |

---

## Files to Update

| File | Current State | Action Needed |
|------|--------------|---------------|
| `lib/db/neon/schemas/dictionary.ts` | ✅ Done | — |
| `lib/db/neon/queries/dictionary/index.ts` | ❌ Uses old schema | Rewrite queries |
| `lib/actions/dictionary.ts` | ❌ Uses old schema | Update to new types |
| `components/dictionary/word-list-client.tsx` | ❌ Uses old types | Update props/types |
| `components/dictionary/dictionary-content.tsx` | ❌ Uses old types | Update rendering |
| `components/dictionary/dictionary-filters.tsx` | ❌ Uses old types | Update filter logic |
| `components/dictionary/search-bar.tsx` | ⚠️ May work | Verify |
| `lib/db/neon/seeds/data/words/*.ts` | ❌ Old format | Update seed data |
| `lib/db/neon/seeds/scripts/seed-dictionary.ts` | ❌ Old tables | Rewrite seeding |

---

## Optional: Full Text Search

To add BM25-style search on examples (multilingual):

```sql
ALTER TABLE examples ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector(
      CASE language_code
        WHEN 'en' THEN 'english'::regconfig
        WHEN 'de' THEN 'german'::regconfig
        WHEN 'it' THEN 'italian'::regconfig
        WHEN 'ar' THEN 'arabic'::regconfig
        ELSE 'simple'::regconfig
      END,
      text
    )
  ) STORED;

CREATE INDEX idx_example_search ON examples USING gin(search_vector);
```
