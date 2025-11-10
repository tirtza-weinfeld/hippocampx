CREATE TYPE "public"."problem_topics" AS ENUM('array', 'dp', 'graph', 'tree', 'backtracking', 'game', 'heap', 'matrix', 'simulation', 'bfs', 'dfs', 'greedy', 'sliding-window');--> statement-breakpoint
CREATE TYPE "public"."symbol_kind" AS ENUM('function', 'class', 'variable', 'expression', 'parameter', 'method');--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"number" integer,
	"title" text NOT NULL,
	"definition" text,
	"leetcode_url" text,
	"difficulty" "difficulty" NOT NULL,
	"topics" text[],
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "problems_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "solution_args" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"solution_id" uuid NOT NULL,
	"arg_name" text NOT NULL,
	"description" text NOT NULL,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solution_expressions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"solution_id" uuid NOT NULL,
	"expression" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solution_variables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"solution_id" uuid NOT NULL,
	"var_name" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"code" text NOT NULL,
	"intuition" text,
	"time_complexity" text,
	"space_complexity" text,
	"returns" text,
	"order_index" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "symbol_tag_args" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol_id" uuid NOT NULL,
	"arg_name" text NOT NULL,
	"arg_type" text,
	"description" text,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "symbol_tag_expressions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol_id" uuid NOT NULL,
	"expression" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "symbol_tag_variables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol_id" uuid NOT NULL,
	"var_name" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "symbol_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"qname" text NOT NULL,
	"solution_id" uuid,
	"kind" "symbol_kind" NOT NULL,
	"name" text NOT NULL,
	"label" text,
	"code" text,
	"intuition" text,
	"summary" text,
	"file_path" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "symbol_tags_qname_unique" UNIQUE("qname")
);
--> statement-breakpoint
ALTER TABLE "solution_args" ADD CONSTRAINT "solution_args_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solution_expressions" ADD CONSTRAINT "solution_expressions_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solution_variables" ADD CONSTRAINT "solution_variables_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbol_tag_args" ADD CONSTRAINT "symbol_tag_args_symbol_id_symbol_tags_id_fk" FOREIGN KEY ("symbol_id") REFERENCES "public"."symbol_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbol_tag_expressions" ADD CONSTRAINT "symbol_tag_expressions_symbol_id_symbol_tags_id_fk" FOREIGN KEY ("symbol_id") REFERENCES "public"."symbol_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbol_tag_variables" ADD CONSTRAINT "symbol_tag_variables_symbol_id_symbol_tags_id_fk" FOREIGN KEY ("symbol_id") REFERENCES "public"."symbol_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbol_tags" ADD CONSTRAINT "symbol_tags_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "problems_slug_idx" ON "problems" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "problems_difficulty_idx" ON "problems" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "problems_topics_idx" ON "problems" USING btree ("topics");--> statement-breakpoint
CREATE INDEX "solution_args_idx" ON "solution_args" USING btree ("solution_id");--> statement-breakpoint
CREATE INDEX "solution_exprs_idx" ON "solution_expressions" USING btree ("solution_id");--> statement-breakpoint
CREATE INDEX "solution_vars_idx" ON "solution_variables" USING btree ("solution_id");--> statement-breakpoint
CREATE INDEX "solutions_problem_idx" ON "solutions" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "symbol_tag_args_idx" ON "symbol_tag_args" USING btree ("symbol_id");--> statement-breakpoint
CREATE INDEX "symbol_tag_exprs_idx" ON "symbol_tag_expressions" USING btree ("symbol_id");--> statement-breakpoint
CREATE INDEX "symbol_tag_vars_idx" ON "symbol_tag_variables" USING btree ("symbol_id");--> statement-breakpoint
CREATE INDEX "symbol_tags_qname_idx" ON "symbol_tags" USING btree ("qname");--> statement-breakpoint
CREATE INDEX "symbol_tags_solution_idx" ON "symbol_tags" USING btree ("solution_id");