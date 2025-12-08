-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."collection_type" AS ENUM('musical', 'album', 'soundtrack', 'movie', 'tv_show', 'single', 'other');--> statement-breakpoint
CREATE TYPE "public"."partofspeech" AS ENUM('noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'determiner', 'auxiliary', 'phrase', 'other');--> statement-breakpoint
CREATE TYPE "public"."relationtype" AS ENUM('synonym', 'antonym', 'hypernym', 'hyponym', 'meronym', 'holonym', 'related');--> statement-breakpoint
CREATE TABLE "alembic_version" (
	"version_num" varchar(32) PRIMARY KEY NOT NULL
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
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "words" (
	"id" serial PRIMARY KEY NOT NULL,
	"word_text" varchar(255) NOT NULL,
	"language_code" varchar(10) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "word_tags" (
	"word_id" integer NOT NULL,
	"tag_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "word_relations" (
	"word_id_1" integer NOT NULL,
	"word_id_2" integer NOT NULL,
	"relation_type" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "word_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"word_id" integer NOT NULL,
	"form_text" varchar(255) NOT NULL,
	"form_type" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "definitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"word_id" integer NOT NULL,
	"definition_text" text NOT NULL,
	"part_of_speech" varchar(50) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "examples" (
	"id" serial PRIMARY KEY NOT NULL,
	"definition_id" integer NOT NULL,
	"example_text" text NOT NULL,
	"source" varchar(255)
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
CREATE INDEX "idx_word_text_lower" ON "words" USING btree ("word_text" text_ops);--> statement-breakpoint
CREATE INDEX "ix_words_language_code" ON "words" USING btree ("language_code" text_ops);--> statement-breakpoint
CREATE INDEX "idx_word_tag" ON "word_tags" USING btree ("word_id" int4_ops,"tag_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_word_relation" ON "word_relations" USING btree ("word_id_1" int4_ops,"word_id_2" int4_ops,"relation_type" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_word_relations_relation_type" ON "word_relations" USING btree ("relation_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_form_text" ON "word_forms" USING btree ("form_text" text_ops);--> statement-breakpoint
CREATE INDEX "ix_word_forms_word_id" ON "word_forms" USING btree ("word_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_definition_text" ON "definitions" USING btree ("definition_text" text_ops);--> statement-breakpoint
CREATE INDEX "ix_definitions_word_id" ON "definitions" USING btree ("word_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_example_text" ON "examples" USING btree ("example_text" text_ops);--> statement-breakpoint
CREATE INDEX "ix_examples_definition_id" ON "examples" USING btree ("definition_id" int4_ops);
*/