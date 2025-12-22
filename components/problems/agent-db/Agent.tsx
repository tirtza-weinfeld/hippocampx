'use cache'

import { cacheLife } from 'next/cache'
import { Suspense } from 'react';
import { AgentProblemsView } from '@/components/agent';
import { getProblems } from '@/lib/db/queries/problems';
import { AgentProblemCard } from './agent-problem-card';

/**
 * Server component - renders all problem cards from database.
 *
 * Modern React 19 Architecture:
 * 1. Fetch all problems (lightweight metadata only)
 * 2. Transform to filtering metadata
 * 3. Create problem components (server components passed as ReactNode)
 * 4. Client wrapper provides expand context, manages filtering
 * 5. Each card shell reads expand state from context
 */

export default async function Agent() {
  cacheLife('hours')

  // Fetch all problems (lightweight - no solutions)
  const problems = await getProblems();

  // Transform to metadata format for filtering
  const metadata = problems.map(problem => ({
    id: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty,
    topics: problem.topics || [],
    createdAt: problem.created_at.toISOString(),
    updatedAt: problem.updated_at.toISOString(),
  }));




  // Create problem components map - each card fetches its own solutions
  const problemComponents = Object.fromEntries(
    problems.map(problem => [
      problem.slug,
      <Suspense key={problem.slug} fallback={<div className="p-4 text-gray-500">Loading...</div>}>
        <AgentProblemCard problem={problem} />
      </Suspense>
    ])
  );

  return (
    <AgentProblemsView
      metadata={metadata}
      problemComponents={problemComponents}
    />
  );
}
