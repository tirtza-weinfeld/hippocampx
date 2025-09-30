CREATE TYPE "public"."part_of_speech" AS ENUM('noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'determiner');--> statement-breakpoint
CREATE TABLE "antonyms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"definition_id" uuid NOT NULL,
	"antonym" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word_id" uuid NOT NULL,
	"part_of_speech" "part_of_speech" NOT NULL,
	"definition" text NOT NULL,
	"example" text,
	"order_index" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "phrases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word_id" uuid NOT NULL,
	"phrase" text NOT NULL,
	"definition" text NOT NULL,
	"example" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "related_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"definition_id" uuid NOT NULL,
	"related_word" text NOT NULL,
	"relationship_type" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "synonyms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"definition_id" uuid NOT NULL,
	"synonym" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "word_forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word_id" uuid NOT NULL,
	"form_type" text NOT NULL,
	"form" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" text NOT NULL,
	"pronunciation" text,
	"audio_url" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "words_word_unique" UNIQUE("word")
);
--> statement-breakpoint
ALTER TABLE "antonyms" ADD CONSTRAINT "antonyms_definition_id_definitions_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "definitions" ADD CONSTRAINT "definitions_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phrases" ADD CONSTRAINT "phrases_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_words" ADD CONSTRAINT "related_words_definition_id_definitions_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "synonyms" ADD CONSTRAINT "synonyms_definition_id_definitions_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_forms" ADD CONSTRAINT "word_forms_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "antonyms_definition_id_idx" ON "antonyms" USING btree ("definition_id");--> statement-breakpoint
CREATE INDEX "definitions_word_id_idx" ON "definitions" USING btree ("word_id");--> statement-breakpoint
CREATE INDEX "definitions_part_of_speech_idx" ON "definitions" USING btree ("part_of_speech");--> statement-breakpoint
CREATE INDEX "phrases_word_id_idx" ON "phrases" USING btree ("word_id");--> statement-breakpoint
CREATE INDEX "related_words_definition_id_idx" ON "related_words" USING btree ("definition_id");--> statement-breakpoint
CREATE INDEX "synonyms_definition_id_idx" ON "synonyms" USING btree ("definition_id");--> statement-breakpoint
CREATE INDEX "word_forms_word_id_idx" ON "word_forms" USING btree ("word_id");--> statement-breakpoint
CREATE INDEX "word_idx" ON "words" USING btree ("word");