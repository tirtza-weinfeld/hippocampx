-- Track when each sense was last scanned for relations
-- Allows incremental relation discovery (only scan new/updated senses)

ALTER TABLE senses_vec_openai
ADD COLUMN relation_scan_at TIMESTAMPTZ DEFAULT NULL;

-- Index for finding unscanned senses
CREATE INDEX idx_senses_vec_openai_unscanned
ON senses_vec_openai (relation_scan_at)
WHERE relation_scan_at IS NULL;
