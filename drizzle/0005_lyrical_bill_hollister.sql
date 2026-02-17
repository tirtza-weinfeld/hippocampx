CREATE TYPE "public"."lsp_type" AS ENUM('definition', 'reference');--> statement-breakpoint
CREATE TYPE "public"."symbol_kind" AS ENUM('function', 'method', 'class', 'variable', 'parameter', 'expression', 'comment');--> statement-breakpoint
CREATE TABLE "lsp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"solution_id" uuid NOT NULL,
	"qname" text NOT NULL,
	"type" "lsp_type" NOT NULL,
	"start_line" integer NOT NULL,
	"start_char" integer NOT NULL,
	"end_line" integer NOT NULL,
	"end_char" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "symbols" (
	"qname" text PRIMARY KEY NOT NULL,
	"solution_id" uuid NOT NULL,
	"kind" "symbol_kind" NOT NULL,
	"summary" text
);
--> statement-breakpoint
ALTER TABLE "lsp" ADD CONSTRAINT "lsp_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lsp" ADD CONSTRAINT "lsp_qname_symbols_qname_fk" FOREIGN KEY ("qname") REFERENCES "public"."symbols"("qname") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbols" ADD CONSTRAINT "symbols_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lsp_solution_idx" ON "lsp" USING btree ("solution_id");--> statement-breakpoint
CREATE INDEX "lsp_qname_idx" ON "lsp" USING btree ("qname");--> statement-breakpoint
CREATE INDEX "symbols_solution_idx" ON "symbols" USING btree ("solution_id");--> statement-breakpoint
ALTER TABLE "problems" DROP COLUMN "number";--> statement-breakpoint
ALTER TABLE "solutions" DROP COLUMN "args";--> statement-breakpoint
ALTER TABLE "solutions" DROP COLUMN "variables";--> statement-breakpoint
ALTER TABLE "solutions" DROP COLUMN "expressions";--> statement-breakpoint
ALTER TABLE "solutions" DROP COLUMN "returns";