-- Add unique constraint on sources(type, title) to prevent duplicates
-- First clean up any existing duplicates (keep lowest id)
DELETE FROM sources
WHERE id NOT IN (
  SELECT MIN(id)
  FROM sources
  GROUP BY type, title
);

-- Now add the constraint
ALTER TABLE sources
ADD CONSTRAINT uq_source_type_title UNIQUE (type, title);
