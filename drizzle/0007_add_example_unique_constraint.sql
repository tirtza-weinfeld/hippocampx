-- Add unique constraint on examples(sense_id, text) to prevent duplicates
-- First clean up any existing duplicates (keep lowest id)
DELETE FROM examples
WHERE id NOT IN (
  SELECT MIN(id)
  FROM examples
  GROUP BY sense_id, text
);

-- Now add the constraint
ALTER TABLE examples
ADD CONSTRAINT uq_example_sense_text UNIQUE (sense_id, text);
