/**
 * Server-side database queries for agent problems and solutions
 */

import { cache } from 'react';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import { eq } from 'drizzle-orm';
import { problems, solutions } from '../schema-problems';
import type { Problem, Solution } from '../schema-problems';

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
  return db
    .select()
    .from(solutions)
    .where(eq(solutions.problem_id, problemId))
    .orderBy(solutions.order_index);
});
