CREATE TYPE "public"."credit_role" AS ENUM('author', 'artist', 'composer', 'lyricist', 'playwright', 'director', 'host');--> statement-breakpoint
CREATE TYPE "public"."notation_type" AS ENUM('formula', 'pronunciation', 'abbreviation', 'mnemonic', 'symbol');--> statement-breakpoint
CREATE TYPE "public"."relation_type" AS ENUM('translation', 'synonym', 'antonym', 'hypernym', 'hyponym', 'meronym', 'holonym', 'analog', 'case_variant', 'derivation');--> statement-breakpoint
CREATE TYPE "public"."sense_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('book', 'movie', 'article', 'academic_paper', 'conversation', 'synthetic_ai', 'musical', 'podcast');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('unverified', 'flagged', 'pending_review', 'verified', 'canonical');--> statement-breakpoint
CREATE TYPE "public"."collection_type" AS ENUM('musical', 'album', 'soundtrack', 'movie', 'tv_show', 'single', 'other');--> statement-breakpoint
ALTER TYPE "public"."part_of_speech" ADD VALUE 'article';--> statement-breakpoint
ALTER TYPE "public"."part_of_speech" ADD VALUE 'particle';--> statement-breakpoint
ALTER TYPE "public"."part_of_speech" ADD VALUE 'numeral';--> statement-breakpoint
ALTER TYPE "public"."part_of_speech" ADD VALUE 'symbol';--> statement-breakpoint
CREATE TABLE "contributors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contributors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"type" varchar(50) DEFAULT 'person',
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "entry_audio" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "entry_audio_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"entry_id" integer NOT NULL,
	"audio_url" varchar(512) NOT NULL,
	"transcript" text,
	"duration_ms" integer,
	"accent_code" varchar(10) DEFAULT 'en-US',
	"content_type" varchar(50) DEFAULT 'audio/mpeg'
);
--> statement-breakpoint
CREATE TABLE "examples" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "examples_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sense_id" integer NOT NULL,
	"text" text NOT NULL,
	"language_code" varchar(5) DEFAULT 'en',
	"source_part_id" integer,
	"cached_citation" varchar(255),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "uq_example_sense_text" UNIQUE("sense_id","text")
);
--> statement-breakpoint
CREATE TABLE "lexical_entries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lexical_entries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"lemma" varchar(255) NOT NULL,
	"part_of_speech" "part_of_speech" NOT NULL,
	"language_code" varchar(5) DEFAULT 'en' NOT NULL,
	"discriminator" integer DEFAULT 1 NOT NULL,
	"frequency_rank" integer,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sense_notations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sense_notations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sense_id" integer NOT NULL,
	"type" "notation_type" NOT NULL,
	"value" text NOT NULL,
	"description" text,
	CONSTRAINT "uq_sense_notation" UNIQUE("sense_id","type","value")
);
--> statement-breakpoint
CREATE TABLE "sense_relations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sense_relations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"source_sense_id" integer NOT NULL,
	"target_sense_id" integer NOT NULL,
	"relation_type" "relation_type" NOT NULL,
	"strength" integer DEFAULT 100,
	"explanation" text,
	"is_synthetic" boolean DEFAULT true,
	"verification_status" "verification_status" DEFAULT 'unverified' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sense_tags" (
	"sense_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"explanation" text,
	CONSTRAINT "sense_tags_sense_id_tag_id_pk" PRIMARY KEY("sense_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "senses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "senses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"entry_id" integer NOT NULL,
	"definition" text NOT NULL,
	"order_index" integer DEFAULT 0,
	"difficulty" "sense_difficulty",
	"usage_frequency" real,
	"is_synthetic" boolean DEFAULT false,
	"verification_status" "verification_status" DEFAULT 'unverified' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "source_credits" (
	"source_id" integer NOT NULL,
	"contributor_id" integer NOT NULL,
	"role" "credit_role" NOT NULL,
	CONSTRAINT "source_credits_source_id_contributor_id_role_pk" PRIMARY KEY("source_id","contributor_id","role")
);
--> statement-breakpoint
CREATE TABLE "source_parts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "source_parts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"source_id" integer NOT NULL,
	"parent_part_id" integer,
	"name" varchar(255) NOT NULL,
	"type" varchar(50),
	"order_index" integer,
	CONSTRAINT "uq_source_part" UNIQUE NULLS NOT DISTINCT("source_id","parent_part_id","name")
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "source_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"publication_year" integer,
	"reliability_score" real DEFAULT 0.5,
	"metadata" jsonb,
	CONSTRAINT "uq_source_type_title" UNIQUE("type","title")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category_id" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "senses_vec_openai" (
	"sense_id" integer PRIMARY KEY NOT NULL,
	"embedding" halfvec(1536) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"relation_scan_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "collections_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"type" "collection_type" NOT NULL,
	"year" integer,
	"image_url" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "songs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"lyrics" text NOT NULL,
	"collection_id" integer NOT NULL,
	"track_number" integer NOT NULL,
	"composer" varchar(255),
	"lyricist" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alembic_version" (
	"version_num" varchar(32) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "algorithms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "questions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "terms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "solution_args" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "solution_expressions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "solution_variables" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "symbol_tag_args" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "symbol_tag_expressions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "symbol_tag_variables" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "symbol_tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "antonyms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "definitions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "phrases" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "related_words" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "synonyms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "words" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "algorithms" CASCADE;--> statement-breakpoint
DROP TABLE "questions" CASCADE;--> statement-breakpoint
DROP TABLE "terms" CASCADE;--> statement-breakpoint
DROP TABLE "solution_args" CASCADE;--> statement-breakpoint
DROP TABLE "solution_expressions" CASCADE;--> statement-breakpoint
DROP TABLE "solution_variables" CASCADE;--> statement-breakpoint
DROP TABLE "symbol_tag_args" CASCADE;--> statement-breakpoint
DROP TABLE "symbol_tag_expressions" CASCADE;--> statement-breakpoint
DROP TABLE "symbol_tag_variables" CASCADE;--> statement-breakpoint
DROP TABLE "symbol_tags" CASCADE;--> statement-breakpoint
DROP TABLE "antonyms" CASCADE;--> statement-breakpoint
DROP TABLE "definitions" CASCADE;--> statement-breakpoint
DROP TABLE "phrases" CASCADE;--> statement-breakpoint
DROP TABLE "related_words" CASCADE;--> statement-breakpoint
DROP TABLE "synonyms" CASCADE;--> statement-breakpoint
DROP TABLE "words" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_name_unique";--> statement-breakpoint
ALTER TABLE "word_forms" DROP CONSTRAINT "word_forms_word_id_words_id_fk";
--> statement-breakpoint
DROP INDEX "word_forms_word_id_idx";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "word_forms" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "word_forms" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "word_forms" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "word_forms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "display_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "ai_description" text;--> statement-breakpoint
ALTER TABLE "solutions" ADD COLUMN "args" jsonb;--> statement-breakpoint
ALTER TABLE "solutions" ADD COLUMN "variables" jsonb;--> statement-breakpoint
ALTER TABLE "solutions" ADD COLUMN "expressions" jsonb;--> statement-breakpoint
ALTER TABLE "word_forms" ADD COLUMN "entry_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "word_forms" ADD COLUMN "form_text" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "word_forms" ADD COLUMN "grammatical_features" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "entry_audio" ADD CONSTRAINT "entry_audio_entry_id_lexical_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."lexical_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examples" ADD CONSTRAINT "examples_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examples" ADD CONSTRAINT "examples_source_part_id_source_parts_id_fk" FOREIGN KEY ("source_part_id") REFERENCES "public"."source_parts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sense_notations" ADD CONSTRAINT "sense_notations_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sense_relations" ADD CONSTRAINT "sense_relations_source_sense_id_senses_id_fk" FOREIGN KEY ("source_sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sense_relations" ADD CONSTRAINT "sense_relations_target_sense_id_senses_id_fk" FOREIGN KEY ("target_sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sense_tags" ADD CONSTRAINT "sense_tags_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sense_tags" ADD CONSTRAINT "sense_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "senses" ADD CONSTRAINT "senses_entry_id_lexical_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."lexical_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_credits" ADD CONSTRAINT "source_credits_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_credits" ADD CONSTRAINT "source_credits_contributor_id_contributors_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."contributors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_parts" ADD CONSTRAINT "source_parts_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_parts" ADD CONSTRAINT "fk_source_parts_parent" FOREIGN KEY ("parent_part_id") REFERENCES "public"."source_parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "senses_vec_openai" ADD CONSTRAINT "senses_vec_openai_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_contributor_name_trgm" ON "contributors" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_audio_entry" ON "entry_audio" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "idx_example_sense" ON "examples" USING btree ("sense_id");--> statement-breakpoint
CREATE INDEX "idx_example_source_part" ON "examples" USING btree ("source_part_id");--> statement-breakpoint
CREATE INDEX "idx_example_text_trgm" ON "examples" USING gin ("text" gin_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_lemma_lang_pos_disc" ON "lexical_entries" USING btree ("lemma","language_code","part_of_speech","discriminator");--> statement-breakpoint
CREATE INDEX "idx_entry_lemma_trgm" ON "lexical_entries" USING gin ("lemma" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_entry_frequency_rank" ON "lexical_entries" USING btree ("frequency_rank");--> statement-breakpoint
CREATE INDEX "idx_notation_sense" ON "sense_notations" USING btree ("sense_id");--> statement-breakpoint
CREATE INDEX "idx_notation_type" ON "sense_notations" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_notation_abbr_lookup" ON "sense_notations" USING btree ("type","value");--> statement-breakpoint
CREATE INDEX "idx_relation_source" ON "sense_relations" USING btree ("source_sense_id");--> statement-breakpoint
CREATE INDEX "idx_relation_target" ON "sense_relations" USING btree ("target_sense_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_sense_relation" ON "sense_relations" USING btree ("source_sense_id","target_sense_id","relation_type");--> statement-breakpoint
CREATE INDEX "idx_sense_entry" ON "senses" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "idx_sense_difficulty" ON "senses" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "idx_credits_lookup" ON "source_credits" USING btree ("contributor_id","role");--> statement-breakpoint
CREATE INDEX "idx_source_parts_source" ON "source_parts" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "idx_source_parts_parent" ON "source_parts" USING btree ("parent_part_id");--> statement-breakpoint
CREATE INDEX "idx_source_title_trgm" ON "sources" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_tag_name_category" ON "tags" USING btree ("name","category_id");--> statement-breakpoint
CREATE INDEX "idx_senses_vec_openai_vec" ON "senses_vec_openai" USING hnsw ("embedding" halfvec_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_collections_title" ON "collections" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_collections_type" ON "collections" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_songs_title" ON "songs" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_songs_collection_id" ON "songs" USING btree ("collection_id");--> statement-breakpoint
ALTER TABLE "word_forms" ADD CONSTRAINT "word_forms_entry_id_lexical_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."lexical_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "solutions_problem_file_unique" ON "solutions" USING btree ("problem_id","file_name");--> statement-breakpoint
CREATE INDEX "idx_form_entry" ON "word_forms" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "idx_form_text" ON "word_forms" USING btree ("form_text");--> statement-breakpoint
CREATE INDEX "idx_form_text_trgm" ON "word_forms" USING gin ("form_text" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_grammar" ON "word_forms" USING gin ("grammatical_features");--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "solutions" DROP COLUMN "space_complexity";--> statement-breakpoint
ALTER TABLE "word_forms" DROP COLUMN "word_id";--> statement-breakpoint
ALTER TABLE "word_forms" DROP COLUMN "form_type";--> statement-breakpoint
ALTER TABLE "word_forms" DROP COLUMN "form";--> statement-breakpoint
ALTER TABLE "word_forms" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "word_forms" DROP COLUMN "created_at";--> statement-breakpoint
DROP TYPE "public"."problem_topics";--> statement-breakpoint
DROP TYPE "public"."symbol_kind";