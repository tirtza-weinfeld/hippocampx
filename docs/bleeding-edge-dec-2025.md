# Bleeding Edge: December 2025

> Research summary for dictionary schema modernization

## Embedding Models (MTEB SOTA)

| Model | Dims | Context | MTEB Score | Features |
|-------|------|---------|------------|----------|
| Qwen3-Embedding-8B | 4096 | 32K | 70.58 (#1 multilingual) | MRL, 100+ langs, bf16/int8/int4 |
| Qwen3-Embedding-4B | 2560 | 32K | - | MRL, balanced |
| NV-Embed-v2 | 4096 | 32K | 69.32 | Llama-3.1-8B base, Oct 2025 |
| voyage-3.5 | 256-2048 | 32K | - | MRL, float/int8/binary |
| voyage-3.5-lite | 256-2048 | 32K | - | Low latency |
| Gemini-embedding-001 | - | - | #1 overall | GA Dec 2025 |

**MRL** = Matryoshka Representation Learning (truncate to any dim, re-normalize)

**Note**: OpenAI `text-embedding-3-large` (3072 dims, Jan 2024) has not been updated. No new OpenAI embedding models released in 2025. Use Qwen3/Voyage/Gemini for SOTA.

## pgvector 0.8.1

| Type | Max Dims | Storage | Use Case |
|------|----------|---------|----------|
| `vector` | 16,000 | 4 bytes/dim | Full precision |
| `halfvec` | 16,000 | 2 bytes/dim | Main embeddings (50% savings) |
| `sparsevec` | 16,000 non-zero | Variable | BM25, SPLADE, BGE-M3 |
| `bit` | 64,000 | 1 bit/dim | Binary quant (32x compression) |

**New in 0.8**: Iterative scans prevent over-filtering
```sql
SET hnsw.iterative_scan = 'relaxed_order';
SET hnsw.max_scan_tuples = 10000;
```

## AI-Curated Graph (Semantic Relations)

**Problem**: Pure vector search fails for synonym/antonym detection.

Antonyms share identical context windows ("The coffee is hot/cold"), causing high cosine similarity. Vector search for "hot" returns "cold" as a top match—a false positive that would embarrass any dictionary.

**Architecture**:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  senses_vec     │    │  LLM Agent      │    │ sense_relations │
│  (Discovery)    │ →  │  (Judgment)     │ →  │  (Authority)    │
│                 │    │                 │    │                 │
│  Vector ANN     │    │  "hot↔cold =    │    │  type: antonym  │
│  finds cloud    │    │   ANTONYM"      │    │  is_synthetic:  │
│                 │    │  "hot↔warm =    │    │    true         │
│                 │    │   SYNONYM"      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

| Stage | Tool | Output |
|-------|------|--------|
| Discovery | Vector ANN | Candidate cloud |
| Judgment | Reasoning LLM | Relation classification |
| Authority | SQL table | Frozen, auditable decision |

**Why keep `sense_relations`**:
- Curated authority (not probabilistic guesses)
- Asymmetric relations (hypernym/hyponym are directional)
- Metadata (`explanation`, `strength`, provenance)
- Stable results (don't change when model updates)
- Graph traversal queries

## Neuro-Symbolic RAG (2025 Paradigm)

```
2024: Vector → LLM → Response (hallucination prone)

2025: Vector FIND → Agent VERIFY → KG STRUCTURE → Response
```

### CLAUSE Architecture (3-agent neuro-symbolic)

1. **Retriever** - dense + sparse hybrid search
2. **Reasoner** - multi-hop KG traversal
3. **Validator** - symbolic verification

Result: +39.3 EM@1 vs GraphRAG baseline, 18.6% lower latency

### Hindsight Memory (4-network)

| Network | Purpose |
|---------|---------|
| Facts | World state (immutable truths) |
| Experiences | Agent observations |
| Summaries | Entity rollups |
| Beliefs | Evolving conclusions |

## Hybrid Search

| Layer | Type | Purpose |
|-------|------|---------|
| Dense | halfvec HNSW | Semantic similarity |
| Sparse | sparsevec / tsvector | Lexical precision (BM25) |
| Fusion | RRF | Combine rankings |

**RRF Formula**: `score = 1 / (k + rank)`, k=60 typical

## MRL Funnel Search

```
Query embedding (4096 dims)
    ↓ truncate to 256, binary quantize
    ↓ coarse search (10K candidates)
    ↓ truncate to 512
    ↓ rerank (1K candidates)
    ↓ full 1024 dims
    ↓ final rerank (100 results)
```

## Index Configuration

```typescript
HNSW_CONFIG = {
  m: 24,               // connections (16-48)
  efConstruction: 128, // build queue
  efSearch: 100,       // query queue
  iterativeScan: "relaxed_order",
  maxScanTuples: 10_000,
}
```

## Sources

- [Qwen3-Embedding-8B](https://huggingface.co/Qwen/Qwen3-Embedding-8B)
- [NV-Embed-v2](https://developer.nvidia.com/blog/nvidia-text-embedding-model-tops-mteb-leaderboard/)
- [Voyage AI Embeddings](https://docs.voyageai.com/docs/embeddings)
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)
- [pgvector](https://github.com/pgvector/pgvector)
- [CLAUSE: Agentic Neuro-Symbolic KG Reasoning](https://arxiv.org/abs/2509.21035)
- [Hindsight Agentic Memory](https://novalogiq.com/2025/12/16/hindsight-agentic-memory/)
- [ParadeDB Hybrid Search](https://www.paradedb.com/blog/hybrid-search-in-postgresql-the-missing-manual)
