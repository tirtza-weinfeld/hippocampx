CREATE TYPE "public"."creditrole" AS ENUM('author', 'artist', 'composer', 'lyricist', 'playwright', 'director', 'host');--> statement-breakpoint
CREATE TYPE "public"."sourcetype" AS ENUM('book', 'movie', 'article', 'academic_paper', 'conversation', 'synthetic_ai', 'musical', 'podcast');--> statement-breakpoint
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
CREATE TABLE "lexical_entries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lexical_entries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"lemma" varchar(255) NOT NULL,
	"part_of_speech" "partofspeech" NOT NULL,
	"language_code" varchar(5) DEFAULT 'en' NOT NULL,
	"embedding" halfvec(1536),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sense_relations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sense_relations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"source_sense_id" integer NOT NULL,
	"target_sense_id" integer NOT NULL,
	"relation_type" "relationtype" NOT NULL,
	"strength" integer DEFAULT 100,
	"explanation" text
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
	"embedding" halfvec(1536),
	"is_synthetic" boolean DEFAULT false,
	"verification_status" varchar(50) DEFAULT 'unverified'
);
--> statement-breakpoint
CREATE TABLE "source_credits" (
	"source_id" integer NOT NULL,
	"contributor_id" integer NOT NULL,
	"role" "creditrole" NOT NULL,
	CONSTRAINT "source_credits_source_id_contributor_id_role_pk" PRIMARY KEY("source_id","contributor_id","role")
);
--> statement-breakpoint
CREATE TABLE "source_parts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "source_parts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"source_id" integer NOT NULL,
	"parent_part_id" integer,
	"name" varchar(255) NOT NULL,
	"type" varchar(50),
	"order_index" integer
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "sourcetype" NOT NULL,
	"title" varchar(255) NOT NULL,
	"publication_year" integer,
	"reliability_score" real DEFAULT 0.5,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "words" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "word_tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "word_relations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "definitions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "words" CASCADE;--> statement-breakpoint
DROP TABLE "word_tags" CASCADE;--> statement-breakpoint
DROP TABLE "word_relations" CASCADE;--> statement-breakpoint
DROP TABLE "definitions" CASCADE;--> statement-breakpoint
ALTER TABLE "lexical_entries" ALTER COLUMN "part_of_speech" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."partofspeech";--> statement-breakpoint
CREATE TYPE "public"."partofspeech" AS ENUM('noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'determiner', 'article', 'particle', 'numeral', 'symbol');--> statement-breakpoint
ALTER TABLE "lexical_entries" ALTER COLUMN "part_of_speech" SET DATA TYPE "public"."partofspeech" USING "part_of_speech"::"public"."partofspeech";--> statement-breakpoint
ALTER TABLE "sense_relations" ALTER COLUMN "relation_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."relationtype";--> statement-breakpoint
CREATE TYPE "public"."relationtype" AS ENUM('translation', 'synonym', 'antonym', 'hypernym', 'hyponym', 'meronym', 'holonym', 'nuance');--> statement-breakpoint
ALTER TABLE "sense_relations" ALTER COLUMN "relation_type" SET DATA TYPE "public"."relationtype" USING "relation_type"::"public"."relationtype";--> statement-breakpoint
DROP INDEX "ix_word_forms_word_id";--> statement-breakpoint
DROP INDEX "idx_example_text";--> statement-breakpoint
DROP INDEX "ix_examples_definition_id";--> statement-breakpoint
DROP INDEX "idx_form_text";--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "word_forms" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "word_forms" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "word_forms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "examples" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "examples" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "examples_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "category" varchar(50);--> statement-breakpoint
ALTER TABLE "word_forms" ADD COLUMN "entry_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "word_forms" ADD COLUMN "grammatical_features" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "examples" ADD COLUMN "sense_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "examples" ADD COLUMN "text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "examples" ADD COLUMN "language_code" varchar(5) DEFAULT 'en';--> statement-breakpoint
ALTER TABLE "examples" ADD COLUMN "source_part_id" integer;--> statement-breakpoint
ALTER TABLE "examples" ADD COLUMN "embedding" halfvec(1536);--> statement-breakpoint
ALTER TABLE "examples" ADD COLUMN "cached_citation" varchar(255);--> statement-breakpoint
ALTER TABLE "entry_audio" ADD CONSTRAINT "entry_audio_entry_id_lexical_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."lexical_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sense_relations" ADD CONSTRAINT "sense_relations_source_sense_id_senses_id_fk" FOREIGN KEY ("source_sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sense_relations" ADD CONSTRAINT "sense_relations_target_sense_id_senses_id_fk" FOREIGN KEY ("target_sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sense_tags" ADD CONSTRAINT "sense_tags_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sense_tags" ADD CONSTRAINT "sense_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "senses" ADD CONSTRAINT "senses_entry_id_lexical_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."lexical_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_credits" ADD CONSTRAINT "source_credits_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_credits" ADD CONSTRAINT "source_credits_contributor_id_contributors_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."contributors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_parts" ADD CONSTRAINT "source_parts_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_parts" ADD CONSTRAINT "fk_source_parts_parent" FOREIGN KEY ("parent_part_id") REFERENCES "public"."source_parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_contributor_name_trgm" ON "contributors" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_audio_entry" ON "entry_audio" USING btree ("entry_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_lemma_lang_pos" ON "lexical_entries" USING btree ("lemma","language_code","part_of_speech");--> statement-breakpoint
CREATE INDEX "idx_entry_embedding" ON "lexical_entries" USING hnsw ("embedding" halfvec_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_entry_lemma_trgm" ON "lexical_entries" USING gin ("lemma" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_relation_source" ON "sense_relations" USING btree ("source_sense_id");--> statement-breakpoint
CREATE INDEX "idx_relation_target" ON "sense_relations" USING btree ("target_sense_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_sense_relation" ON "sense_relations" USING btree ("source_sense_id","target_sense_id","relation_type");--> statement-breakpoint
CREATE INDEX "idx_sense_entry" ON "senses" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "idx_sense_embedding" ON "senses" USING hnsw ("embedding" halfvec_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_credits_lookup" ON "source_credits" USING btree ("contributor_id","role");--> statement-breakpoint
CREATE INDEX "idx_source_parts_source" ON "source_parts" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "idx_source_parts_parent" ON "source_parts" USING btree ("parent_part_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_source_part" ON "source_parts" USING btree ("source_id","parent_part_id","name");--> statement-breakpoint
CREATE INDEX "idx_source_title_trgm" ON "sources" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_forms" ADD CONSTRAINT "word_forms_entry_id_lexical_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."lexical_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examples" ADD CONSTRAINT "examples_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examples" ADD CONSTRAINT "examples_source_part_id_source_parts_id_fk" FOREIGN KEY ("source_part_id") REFERENCES "public"."source_parts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_songs_title" ON "songs" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_songs_collection_id" ON "songs" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "idx_form_entry" ON "word_forms" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "idx_form_text_trgm" ON "word_forms" USING gin ("form_text" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_grammar" ON "word_forms" USING gin ("grammatical_features");--> statement-breakpoint
CREATE INDEX "idx_example_sense" ON "examples" USING btree ("sense_id");--> statement-breakpoint
CREATE INDEX "idx_example_source_part" ON "examples" USING btree ("source_part_id");--> statement-breakpoint
CREATE INDEX "idx_example_embedding" ON "examples" USING hnsw ("embedding" halfvec_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_example_text_trgm" ON "examples" USING gin ("text" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_collections_title" ON "collections" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_collections_type" ON "collections" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_form_text" ON "word_forms" USING btree ("form_text");--> statement-breakpoint
ALTER TABLE "tags" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "word_forms" DROP COLUMN "word_id";--> statement-breakpoint
ALTER TABLE "word_forms" DROP COLUMN "form_type";--> statement-breakpoint
ALTER TABLE "examples" DROP COLUMN "definition_id";--> statement-breakpoint
ALTER TABLE "examples" DROP COLUMN "example_text";--> statement-breakpoint
ALTER TABLE "examples" DROP COLUMN "source";--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_name_unique" UNIQUE("name");