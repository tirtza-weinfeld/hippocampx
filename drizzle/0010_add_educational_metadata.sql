-- Add educational metadata for dictionary entries
-- Supports difficulty levels, frequency ranking, and math formulas

-- Drop wrongly-typed difficulty column from senses (was using problems.difficulty enum)
-- Note: Keep the 'difficulty' enum - it's used by problems table
ALTER TABLE senses DROP COLUMN IF EXISTS difficulty;

-- Create sense_difficulty enum for dictionary (separate from problems.difficulty)
DO $$ BEGIN
  CREATE TYPE sense_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add frequency_rank to lexical_entries (corpus rank, 1 = most common)
ALTER TABLE lexical_entries
ADD COLUMN IF NOT EXISTS frequency_rank INTEGER;

-- Index for sorting by frequency (e.g., "Top 100 most common words")
CREATE INDEX IF NOT EXISTS idx_entry_frequency_rank ON lexical_entries (frequency_rank);

-- Add educational fields to senses
ALTER TABLE senses
ADD COLUMN IF NOT EXISTS difficulty sense_difficulty,
ADD COLUMN IF NOT EXISTS usage_frequency REAL;

-- Drop formula column if it exists (removed - too specialized)
ALTER TABLE senses DROP COLUMN IF EXISTS formula;

-- Index for filtering by difficulty
CREATE INDEX IF NOT EXISTS idx_sense_difficulty ON senses (difficulty);

-- Create notation_type enum for alternative representations
DO $$ BEGIN
  CREATE TYPE notation_type AS ENUM ('formula', 'pronunciation', 'abbreviation', 'mnemonic', 'symbol');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create sense_notations table
CREATE TABLE IF NOT EXISTS sense_notations (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sense_id INTEGER NOT NULL REFERENCES senses(id) ON DELETE CASCADE,
  type notation_type NOT NULL,
  value TEXT NOT NULL
);

-- Indexes for sense_notations
CREATE INDEX IF NOT EXISTS idx_notation_sense ON sense_notations (sense_id);
CREATE INDEX IF NOT EXISTS idx_notation_type ON sense_notations (type);
