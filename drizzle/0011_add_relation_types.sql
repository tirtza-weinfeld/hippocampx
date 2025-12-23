-- Add new relation types and migrate away from 'nuance'

-- Step 1: Add new enum values
ALTER TYPE relationtype ADD VALUE IF NOT EXISTS 'analog';
ALTER TYPE relationtype ADD VALUE IF NOT EXISTS 'case_variant';
ALTER TYPE relationtype ADD VALUE IF NOT EXISTS 'derivation';

-- Step 2: Migrate existing 'nuance' relations to 'analog'
-- (analog is the closest semantic match for "related but not hierarchical")
UPDATE sense_relations SET relation_type = 'analog' WHERE relation_type = 'nuance';
