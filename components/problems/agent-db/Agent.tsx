import { AgentProblemsView } from '@/components/agent';
import { getProblems } from '@/lib/db/queries/agent-problems';
import { AgentProblemCard } from './agent-problem-card';

/**
 * Server component - renders all problem cards from database.
 *
 * Database-driven Architecture:
 * 1. Fetch all problems (lightweight metadata only)
 * 2. Transform to filtering metadata
 * 3. Create problem card components (each fetches its own solutions independently)
 * 4. Pass to AgentProblemsView for filtering/display
 */

export default async function Agent() {
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

  // Create problem components map - each card will fetch its own solutions
  const problemComponents = Object.fromEntries(
    problems.map(problem => [
      problem.slug,
      <AgentProblemCard
        key={problem.slug}
        problem={problem}
      />
    ])
  );

  return (
    <AgentProblemsView
      metadata={metadata}
      problemComponents={problemComponents}
    />
  );
}
