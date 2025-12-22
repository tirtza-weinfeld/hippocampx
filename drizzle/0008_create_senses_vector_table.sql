-- Enable pgvector extension (required for halfvec type)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create senses vector table for OpenAI text-embedding-3-small (1536 dims)
CREATE TABLE senses_vec_openai (
  sense_id INTEGER PRIMARY KEY REFERENCES senses(id) ON DELETE CASCADE,
  embedding halfvec(1536) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create HNSW index for fast cosine similarity search
CREATE INDEX idx_senses_vec_openai_vec
ON senses_vec_openai
USING hnsw (embedding halfvec_cosine_ops);
