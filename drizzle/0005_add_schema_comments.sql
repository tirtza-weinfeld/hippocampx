-- Schema Comments Migration
-- Format: Description | Domain (tables) or Description | Example (columns)

-- ============================================================================
-- 1. DOMAIN: LEXICON (The Core Dictionary)
-- ============================================================================

-- Table: lexical_entries
COMMENT ON TABLE lexical_entries IS 'Headwords and canonical forms (lemmas) | Lexicon';
COMMENT ON COLUMN lexical_entries.id IS 'Auto-generated primary key | 202';
COMMENT ON COLUMN lexical_entries.lemma IS 'Canonical dictionary form | "run"';
COMMENT ON COLUMN lexical_entries.part_of_speech IS 'Grammatical category enum | "verb"';
COMMENT ON COLUMN lexical_entries.language_code IS 'ISO 639-1 code | "en"';
COMMENT ON COLUMN lexical_entries.discriminator IS 'Homograph disambiguator (1, 2..) | 1';
COMMENT ON COLUMN lexical_entries.embedding IS '1536d Half-precision semantic vector | [0.01, -0.2...]';
COMMENT ON COLUMN lexical_entries.metadata IS 'Etymology and morphology JSON | {"root": "rinnan"}';
COMMENT ON COLUMN lexical_entries.created_at IS 'Immutable creation timestamp | 2024-01-01T12:00:00Z';
COMMENT ON COLUMN lexical_entries.updated_at IS 'Last modification timestamp | 2024-01-02T15:30:00Z';

-- Table: word_forms
COMMENT ON TABLE word_forms IS 'Inflectional morphology and variations | Lexicon';
COMMENT ON COLUMN word_forms.id IS 'Auto-generated primary key | 801';
COMMENT ON COLUMN word_forms.entry_id IS 'Parent lexical entry ID | 202';
COMMENT ON COLUMN word_forms.form_text IS 'Inflected string | "running"';
COMMENT ON COLUMN word_forms.grammatical_features IS 'Polyglot grammar constraints (Zod) | {"tense": "present", "aspect": "progressive"}';

-- Table: senses
COMMENT ON TABLE senses IS 'Semantic definitions and meaning separation | Lexicon';
COMMENT ON COLUMN senses.id IS 'Auto-generated primary key | 444';
COMMENT ON COLUMN senses.entry_id IS 'Parent lexical entry ID | 202';
COMMENT ON COLUMN senses.definition IS 'Textual explanation of meaning | "To move at a speed faster than a walk"';
COMMENT ON COLUMN senses.order_index IS 'Rank for UI display (0=primary) | 0';
COMMENT ON COLUMN senses.embedding IS '1536d Half-precision semantic vector | [0.88, 0.12...]';
COMMENT ON COLUMN senses.is_synthetic IS 'Boolean flag: True if AI-generated | false';
COMMENT ON COLUMN senses.verification_status IS 'Editorial workflow state | "verified"';

-- Table: entry_audio
COMMENT ON TABLE entry_audio IS 'Phonetic and spoken data assets | Lexicon';
COMMENT ON COLUMN entry_audio.id IS 'Auto-generated primary key | 910';
COMMENT ON COLUMN entry_audio.entry_id IS 'Parent lexical entry ID | 202';
COMMENT ON COLUMN entry_audio.audio_url IS 'Remote storage URL (S3/R2) | "https://cdn.../run.mp3"';
COMMENT ON COLUMN entry_audio.transcript IS 'IPA phonetic transcription | "/rʌn/"';
COMMENT ON COLUMN entry_audio.duration_ms IS 'Clip duration in milliseconds | 1200';
COMMENT ON COLUMN entry_audio.accent_code IS 'BCP 47 region code | "en-US"';
COMMENT ON COLUMN entry_audio.content_type IS 'MIME type of asset | "audio/mpeg"';

-- ============================================================================
-- 2. DOMAIN: SEMANTIC GRAPH (Relations)
-- ============================================================================

-- Table: sense_relations
COMMENT ON TABLE sense_relations IS 'Edges defining synonymy and semantic distance | Semantic Graph';
COMMENT ON COLUMN sense_relations.id IS 'Auto-generated primary key | 100';
COMMENT ON COLUMN sense_relations.source_sense_id IS 'Origin node ID | 444';
COMMENT ON COLUMN sense_relations.target_sense_id IS 'Target node ID | 445';
COMMENT ON COLUMN sense_relations.relation_type IS 'Edge classification | "synonym"';
COMMENT ON COLUMN sense_relations.strength IS 'Semantic weight (0-100) | 85';
COMMENT ON COLUMN sense_relations.explanation IS 'Human-readable justification | "Nuance difference: Sprint implies short distance"';

-- ============================================================================
-- 3. DOMAIN: PROVENANCE (Sources & Truth)
-- ============================================================================

-- Table: contributors
COMMENT ON TABLE contributors IS 'Agents (people/orgs) responsible for content | Provenance';
COMMENT ON COLUMN contributors.id IS 'Auto-generated primary key | 50';
COMMENT ON COLUMN contributors.name IS 'Display name of agent | "Stephen Sondheim"';
COMMENT ON COLUMN contributors.type IS 'Agent classification | "person"';
COMMENT ON COLUMN contributors.metadata IS 'Identity resolution data | {"wikidata": "Q153259"}';

-- Table: sources
COMMENT ON TABLE sources IS 'Authoritative artifacts acting as ground truth | Provenance';
COMMENT ON COLUMN sources.id IS 'Auto-generated primary key | 30';
COMMENT ON COLUMN sources.type IS 'Artifact medium | "musical"';
COMMENT ON COLUMN sources.title IS 'Work title | "Into the Woods"';
COMMENT ON COLUMN sources.publication_year IS 'Release year | 1986';
COMMENT ON COLUMN sources.reliability_score IS 'Hallucination safety weight (0.0-1.0) | 0.95';
COMMENT ON COLUMN sources.metadata IS 'Bibliographic data | {"isbn": "978-0..."}';

-- Table: source_credits
COMMENT ON TABLE source_credits IS 'Attribution links between Agents and Artifacts | Provenance';
COMMENT ON COLUMN source_credits.source_id IS 'Artifact ID | 30';
COMMENT ON COLUMN source_credits.contributor_id IS 'Agent ID | 50';
COMMENT ON COLUMN source_credits.role IS 'Contribution type | "composer"';

-- Table: source_parts
COMMENT ON TABLE source_parts IS 'Granular location hierarchy (Book->Chapter) | Provenance';
COMMENT ON COLUMN source_parts.id IS 'Auto-generated primary key | 200';
COMMENT ON COLUMN source_parts.source_id IS 'Root artifact ID | 30';
COMMENT ON COLUMN source_parts.parent_part_id IS 'Recursive parent ID (null=root) | 199';
COMMENT ON COLUMN source_parts.name IS 'Section name | "Act 1"';
COMMENT ON COLUMN source_parts.type IS 'Section type | "act"';
COMMENT ON COLUMN source_parts.order_index IS 'Sequential order | 1';

-- Table: examples
COMMENT ON TABLE examples IS 'Contextual usage citations | Provenance';
COMMENT ON COLUMN examples.id IS 'Auto-generated primary key | 500';
COMMENT ON COLUMN examples.sense_id IS 'Linked definition ID | 444';
COMMENT ON COLUMN examples.text IS 'The usage sentence | "She ran into the woods."';
COMMENT ON COLUMN examples.language_code IS 'ISO 639-1 code | "en"';
COMMENT ON COLUMN examples.source_part_id IS 'Specific citation location ID | 200';
COMMENT ON COLUMN examples.embedding IS '1536d Half-precision semantic vector | [0.11, 0.98...]';
COMMENT ON COLUMN examples.cached_citation IS 'Denormalized display string | "Into the Woods, Act 1"';

-- ============================================================================
-- 4. DOMAIN: ONTOLOGY (Taxonomy)
-- ============================================================================

-- Table: categories
COMMENT ON TABLE categories IS 'High-level conceptual domains (Root Nodes) | Ontology';
COMMENT ON COLUMN categories.id IS 'Natural key / Slug | "register"';
COMMENT ON COLUMN categories.display_name IS 'UI Label | "Register"';
COMMENT ON COLUMN categories.ai_description IS 'LLM system prompt context | "Tags indicating social formality"';

-- Table: tags
COMMENT ON TABLE tags IS 'Specific attribute markers (Leaf Nodes) | Ontology';
COMMENT ON COLUMN tags.id IS 'Auto-generated primary key | 15';
COMMENT ON COLUMN tags.category_id IS 'Parent category slug | "register"';
COMMENT ON COLUMN tags.name IS 'Tag label | "formal"';
COMMENT ON COLUMN tags.metadata IS 'UI properties | {"color": "#ff0000"}';

-- Table: sense_tags
COMMENT ON TABLE sense_tags IS 'Edges linking Senses to Ontology Nodes | Ontology';
COMMENT ON COLUMN sense_tags.sense_id IS 'Target sense ID | 444';
COMMENT ON COLUMN sense_tags.tag_id IS 'Applied tag ID | 15';
COMMENT ON COLUMN sense_tags.explanation IS 'Reasoning for tag application | "Used in legal proceedings"';
