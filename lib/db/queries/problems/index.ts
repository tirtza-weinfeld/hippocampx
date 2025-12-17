/**
 * Problems Queries
 */

import "server-only";

import { cacheLife } from "next/cache";
import { eq } from "drizzle-orm";
import { neonDb } from "../../connection";
import { problems, solutions } from "../../schema";
import type { Problem, Solution } from "../../schema";
import { formatIntuitionContent, formatTimeComplexity } from "@/lib/utils/format-problem-content";

/**
 * Get all problems (lightweight, for filtering)
 */
export async function getProblems(): Promise<Problem[]> {
  'use cache: remote'
  cacheLife('hours')

  return neonDb.select().from(problems).orderBy(problems.number);
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
