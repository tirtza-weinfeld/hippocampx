/**
 * Problems Queries
 */

import "server-only";

import { cacheLife } from "next/cache";
import { and, eq } from "drizzle-orm";
import { neonDb } from "../../connection";
import { problems, solutions, symbols, lsp } from "../../schema";
import type { Problem, Solution, Symbol, Lsp } from "../../schema";
import { formatIntuitionContent, formatTimeComplexity } from "@/lib/utils/format-problem-content";

/**
 * Get all problems (lightweight, for filtering)
 */
export async function getProblems(): Promise<Problem[]> {
  'use cache: remote'
  cacheLife('hours')

  return neonDb.select().from(problems).orderBy(problems.slug);
}

/**
 * Get solutions by problem ID
 */
export async function getSolutionsByProblemId(
  problemId: string
): Promise<Solution[]> {
  'use cache: remote'
  cacheLife('hours')

  const rawSolutions = await neonDb
    .select()
    .from(solutions)
    .where(eq(solutions.problem_id, problemId))
    .orderBy(solutions.order_index);

  // Format intuition and time_complexity fields
  return rawSolutions.map(solution => ({
    ...solution,
    intuition: solution.intuition ? formatIntuitionContent(solution.intuition) : null,
    time_complexity: solution.time_complexity ? formatTimeComplexity(solution.time_complexity) : null,
  }));
}

/**
 * Get all symbols for a solution
 */
export async function getSymbolsBySolutionId(
  solutionId: string
): Promise<Symbol[]> {
  'use cache: remote'
  cacheLife('hours')

  return neonDb
    .select()
    .from(symbols)
    .where(eq(symbols.solution_id, solutionId));
}

/**
 * Get all LSP reference rows for a solution (for tooltip placement)
 */
export async function getLspReferencesBySolutionId(
  solutionId: string
): Promise<Lsp[]> {
  'use cache: remote'
  cacheLife('hours')

  return neonDb
    .select()
    .from(lsp)
    .where(
      and(
        eq(lsp.solution_id, solutionId),
        eq(lsp.type, 'reference')
      )
    );
}

/**
 * Get LSP definition row for a specific scope (function/class body range)
 */
export async function getLspDefinitionByScope(
  solutionId: string,
  scopeQname: string
): Promise<Lsp | undefined> {
  'use cache: remote'
  cacheLife('hours')

  const rows = await neonDb
    .select()
    .from(lsp)
    .where(
      and(
        eq(lsp.solution_id, solutionId),
        eq(lsp.qname, scopeQname),
        eq(lsp.type, 'definition')
      )
    )
    .limit(1);

  return rows[0];
}
