/**
 * Server-side database queries for agent problems, solutions, and symbols
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import { eq, like, and, sql } from 'drizzle-orm';
import { problems, solutions, symbols } from '../schema-problems';
import type { Problem, Solution, Symbol } from '../schema-problems';
import { parseSymbolQuery, type SymbolQueryContext } from './symbol-resolver';

const db = drizzle(vercelSql);

/**
 * Get all problems with basic info
 */
export async function getProblems(): Promise<Problem[]> {
  return db.select().from(problems).orderBy(problems.number);
}

/**
 * Get a single problem by slug
 */
export async function getProblemBySlug(slug: string): Promise<Problem | null> {
  const result = await db.select().from(problems).where(eq(problems.slug, slug)).limit(1);
  return result[0] || null;
}

/**
 * Get all solutions for a problem
 */
export async function getSolutionsByProblem(problemId: string): Promise<Solution[]> {
  return db
    .select()
    .from(solutions)
    .where(eq(solutions.problem_id, problemId))
    .orderBy(solutions.order_index);
}

/**
 * Get a specific solution by problem slug and filename
 */
export async function getSolution(
  problemSlug: string,
  fileName: string
): Promise<(Solution & { problem: Problem }) | null> {
  const result = await db
    .select({
      id: solutions.id,
      problem_id: solutions.problem_id,
      file_name: solutions.file_name,
      code: solutions.code,
      order_index: solutions.order_index,
      created_at: solutions.created_at,
      updated_at: solutions.updated_at,
      problem: problems,
    })
    .from(solutions)
    .innerJoin(problems, eq(solutions.problem_id, problems.id))
    .where(and(eq(problems.slug, problemSlug), eq(solutions.file_name, fileName)))
    .limit(1);

  return result[0] || null;
}

/**
 * Get all symbols for a solution
 */
export async function getSymbolsBySolution(solutionId: string): Promise<Symbol[]> {
  return db
    .select()
    .from(symbols)
    .where(eq(symbols.solution_id, solutionId))
    .orderBy(symbols.kind, symbols.name);
}

/**
 * Smart symbol resolution - Query symbols with context-based disambiguation
 *
 * @param query - Symbol query (e.g., "dp", "1235:dp", "maximum_profit_in_job_scheduling.dp")
 * @param context - Optional context for disambiguation
 * @returns Array of matching symbols
 *
 * @example
 * // Get all dp symbols in problem 1235
 * const symbols = await resolveSymbol("dp", { problemNumber: "1235" });
 *
 * // Get dp symbol in specific function
 * const symbol = await resolveSymbol("maximum_profit_in_job_scheduling.dp");
 *
 * // Fully qualified query
 * const symbol = await resolveSymbol("1235:top_down.py:maximum_profit_in_job_scheduling.dp");
 */
export async function resolveSymbol(
  query: string,
  context?: SymbolQueryContext
): Promise<Symbol[]> {
  const parsed = parseSymbolQuery(query, context);

  // If we have an exact match, query directly
  if (parsed.exactMatch) {
    const result = await db
      .select()
      .from(symbols)
      .where(eq(symbols.qname, parsed.exactMatch))
      .limit(1);

    return result;
  }

  // Otherwise use LIKE pattern matching
  const result = await db
    .select()
    .from(symbols)
    .where(like(symbols.qname, parsed.pattern))
    .limit(20); // Limit to prevent huge result sets

  return result;
}

/**
 * Get symbol by exact qname
 */
export async function getSymbolByQname(qname: string): Promise<Symbol | null> {
  const result = await db
    .select()
    .from(symbols)
    .where(eq(symbols.qname, qname))
    .limit(1);

  return result[0] || null;
}

/**
 * Get all symbols for a problem (across all solutions)
 */
export async function getSymbolsByProblemSlug(problemSlug: string): Promise<Symbol[]> {
  const result = await db
    .select({
      id: symbols.id,
      solution_id: symbols.solution_id,
      qname: symbols.qname,
      kind: symbols.kind,
      name: symbols.name,
      content: symbols.content,
      metadata: symbols.metadata,
      parent_id: symbols.parent_id,
      created_at: symbols.created_at,
      updated_at: symbols.updated_at,
    })
    .from(symbols)
    .innerJoin(solutions, eq(symbols.solution_id, solutions.id))
    .innerJoin(problems, eq(solutions.problem_id, problems.id))
    .where(eq(problems.slug, problemSlug))
    .orderBy(symbols.kind, symbols.name);

  return result;
}

/**
 * Search symbols by name (fuzzy search)
 */
export async function searchSymbols(searchTerm: string, limit = 10): Promise<Symbol[]> {
  return db
    .select()
    .from(symbols)
    .where(like(symbols.name, `%${searchTerm}%`))
    .limit(limit);
}
