-- Drop old tables
DROP TABLE IF EXISTS solution_args CASCADE;
DROP TABLE IF EXISTS solution_expressions CASCADE;
DROP TABLE IF EXISTS solution_variables CASCADE;
DROP TABLE IF EXISTS symbol_tag_args CASCADE;
DROP TABLE IF EXISTS symbol_tag_expressions CASCADE;
DROP TABLE IF EXISTS symbol_tag_variables CASCADE;
DROP TABLE IF EXISTS symbol_tags CASCADE;

-- Modify solutions table (remove metadata columns, keep only code)
ALTER TABLE solutions DROP COLUMN IF EXISTS intuition;
ALTER TABLE solutions DROP COLUMN IF EXISTS time_complexity;
ALTER TABLE solutions DROP COLUMN IF EXISTS space_complexity;
ALTER TABLE solutions DROP COLUMN IF EXISTS returns;

-- Create new symbols table
CREATE TABLE "symbols" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "solution_id" uuid,
  "qname" text NOT NULL UNIQUE,
  "kind" text NOT NULL,
  "name" text NOT NULL,
  "content" text,
  "metadata" jsonb,
  "parent_id" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign keys
ALTER TABLE "symbols" ADD CONSTRAINT "symbols_solution_id_solutions_id_fk"
  FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "symbols" ADD CONSTRAINT "symbols_parent_id_symbols_id_fk"
  FOREIGN KEY ("parent_id") REFERENCES "public"."symbols"("id") ON DELETE cascade ON UPDATE no action;

-- Create indexes
CREATE INDEX "symbols_qname_idx" ON "symbols" USING btree ("qname");
CREATE INDEX "symbols_solution_idx" ON "symbols" USING btree ("solution_id");
CREATE INDEX "symbols_parent_idx" ON "symbols" USING btree ("parent_id");
CREATE INDEX "symbols_kind_idx" ON "symbols" USING btree ("kind");
CREATE INDEX "solutions_unique_idx" ON "solutions" USING btree ("problem_id", "file_name");
