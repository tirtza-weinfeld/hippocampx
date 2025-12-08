/**
 * Problems Queries - Vercel Database
 */

import { cache } from "react";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelSql } from "@vercel/postgres";
import { eq } from "drizzle-orm";
import { problems, solutions } from "../schema";
import type { Problem, Solution } from "../schema";
import { formatIntuitionContent, formatTimeComplexity } from "@/lib/utils/format-problem-content";

const db = drizzle(vercelSql);

/**
 * Get all problems (lightweight, for filtering)
 */
export const getProblems = cache(async function getProblems(): Promise<Problem[]> {
  return db.select().from(problems).orderBy(problems.number);
});

/**
 * Get solutions by problem ID
 */
export const getSolutionsByProblemId = cache(async function getSolutionsByProblemId(
  problemId: string
): Promise<Solution[]> {
  const rawSolutions = await db
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
});
