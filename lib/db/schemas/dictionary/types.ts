import { customType } from "drizzle-orm/pg-core"

export const EMBEDDING_DIM = 1536

export const halfvec = customType<{ data: number[]; driverData: string }>({
  dataType: () => `halfvec(${EMBEDDING_DIM})`,
  toDriver: (value) => `[${value.join(",")}]`,
  fromDriver: (value) =>
    typeof value === "string"
      ? value.replace(/^\[|\]$/g, "").split(",").map(Number)
      : (value as number[]),
})

export function createHalfvec(dimensions: number) {
  return customType<{ data: number[]; driverData: string }>({
    dataType: () => `halfvec(${dimensions})`,
    toDriver: (value) => `[${value.join(",")}]`,
    fromDriver: (value) =>
      typeof value === "string"
        ? value.replace(/^\[|\]$/g, "").split(",").map(Number)
        : (value as number[]),
  })
}

// NOTE: tsvector columns should be created via raw SQL migration:
// ALTER TABLE examples ADD COLUMN search_vector tsvector
//   GENERATED ALWAYS AS (
//     to_tsvector(
//       CASE language_code
//         WHEN 'en' THEN 'english'::regconfig
//         WHEN 'de' THEN 'german'::regconfig
//         WHEN 'it' THEN 'italian'::regconfig
//         WHEN 'ar' THEN 'arabic'::regconfig
//         ELSE 'simple'::regconfig
//       END,
//       text
//     )
//   ) STORED;
// CREATE INDEX idx_example_search ON examples USING gin(search_vector);
