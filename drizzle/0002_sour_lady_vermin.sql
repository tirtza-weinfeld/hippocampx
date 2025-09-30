ALTER TABLE "words" ADD COLUMN "usage" integer;--> statement-breakpoint
CREATE INDEX "word_usage_idx" ON "words" USING btree ("usage");