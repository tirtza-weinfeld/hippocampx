import { Suspense } from 'react';
import { getSolutionsByProblemId } from '@/lib/db/queries/problems';
import { AgentCardShell, AgentSection } from '@/components/agent';
import { AgentCardShellContent } from '@/components/agent/agent-card-shell-content';
import { TimeComplexityBadge } from '@/components/agent/time-complexity-badge';
import type { Problem, Solution } from '@/lib/db/schema';
import type { SectionType } from '@/components/agent/agent-section-tab';
import { MarkdownRenderer } from '@/components/mdx/parse/markdown-renderer';
import CodeBlock from '@/components/mdx/code/code-block';

export type AgentProblemCardProps = {
  problem: Problem;
};

/**
 * Server component wrapper - renders shell immediately, suspends content.
 * Header shows instantly, solutions stream in when ready.
 * Time complexity badge streams independently via its own Suspense.
 */
export function AgentProblemCard({ problem }: AgentProblemCardProps) {
  // Create promise but DON'T await - allows header to render instantly
  const solutionsPromise = getSolutionsByProblemId(problem.id);

  return (
    <AgentCardShell
      problem={problem}
      timeComplexityBadge={
        <Suspense fallback={null}>
          <TimeComplexityBadgeContent solutionsPromise={solutionsPromise} />
        </Suspense>
      }
    >
      <Suspense fallback={<div className="p-4 text-gray-500">Loading solutions...</div>}>
        <AgentProblemCardContent problem={problem} solutionsPromise={solutionsPromise} />
      </Suspense>
    </AgentCardShell>
  );
}

/**
 * Server component that awaits solutions and renders time complexity with KaTeX.
 */
async function TimeComplexityBadgeContent({
  solutionsPromise
}: {
  solutionsPromise: Promise<Solution[]>
}) {
  const solutions = await solutionsPromise;
  const rawLine = solutions[0]?.time_complexity?.split('\n')[0].trim();
  // Remove leading "- " and trailing ":" if present
  const timeComplexity = rawLine?.replace(/^-\s*/, '').replace(/:$/, '');

  if (!timeComplexity) {
    return null;
  }

  return (
    <TimeComplexityBadge>
      <MarkdownRenderer>{timeComplexity}</MarkdownRenderer>
    </TimeComplexityBadge>
  );
}

/**
 * Server component that awaits solutions promise and renders content.
 * Wrapped in Suspense - streams independently.
 */
async function AgentProblemCardContent({
  problem,
  solutionsPromise
}: {
  problem: Problem;
  solutionsPromise: Promise<Solution[]>
}) {
  // Await the promise in this suspended component
  const solutionsList = await solutionsPromise;

  // Build file list and section map
  const solutionFiles = solutionsList.map(s => s.file_name);
  const defaultFile = solutionFiles[0] || '';

  // Build fileSectionMap - which sections are available for each file
  const fileSectionMap: Record<string, SectionType[]> = {};

  for (const solution of solutionsList) {

    const sections: SectionType[] = [];

    // Definition is shared across all files
    if (problem.definition) {
      sections.push('definition');
    }

    // Code snippet always exists
    sections.push('codeSnippet');

    // Optional sections
    if (solution.intuition) sections.push('intuition');
    if (solution.time_complexity) sections.push('timeComplexity');
    if (solution.variables && Object.keys(solution.variables as object).length > 0) {
      sections.push('keyVariables');
    }
    if (solution.expressions && Object.keys(solution.expressions as object).length > 0) {
      sections.push('keyExpressions');
    }

    fileSectionMap[solution.file_name] = sections;
  }


  return (
    <AgentCardShellContent
      solutionFiles={solutionFiles}
      defaultFile={defaultFile}
      fileSectionMap={fileSectionMap}
    >
      {/* Definition section (shared across all solutions) */}
      {problem.definition && (
        <AgentSection section="definition">
          <MarkdownRenderer>{problem.definition}</MarkdownRenderer>
          {/* <div>{problem.definition}</div> */}
        </AgentSection>
      )}

      {/* Solution-specific sections */}
      {solutionsList.map(solution => (
        <Suspense key={solution.id} fallback={<div className="text-gray-500">Loading...</div>}>
          {/* Code snippet */}
          <AgentSection section="codeSnippet" file={solution.file_name}>
           {/* <CodeBlock className="language-python"  meta={`source=problems/${problem.slug}/${solution.file_name}`}> */}
           <CodeBlock className="language-python" >
            {solution.code}
           </CodeBlock>
          </AgentSection>

          {/* Intuition */}
          {solution.intuition && (
            <AgentSection section="intuition" file={solution.file_name}>
              <MarkdownRenderer> {solution.intuition}</MarkdownRenderer>
              {/* <pre> {solution.intuition}</pre> */}
            </AgentSection>
          )}

          {/* Time Complexity */}
          {solution.time_complexity && (
            <AgentSection section="timeComplexity" file={solution.file_name}>
              <MarkdownRenderer>{solution.time_complexity}</MarkdownRenderer>
            </AgentSection>
          )}

          {/* Key Variables */}
          {solution.variables && Object.keys(solution.variables as object).length > 0 && (
            <AgentSection section="keyVariables" file={solution.file_name}>
                {Object.entries(solution.variables).map(([key, value]) => (
                  <MarkdownRenderer key={key}>
                    {`- \`${key}\`: ${value}`}
                  </MarkdownRenderer>
                ))}
            </AgentSection>
          )}

          {/* Key Expressions */}
          {solution.expressions && Object.keys(solution.expressions as object).length > 0 && (
            <AgentSection section="keyExpressions" file={solution.file_name}>
                {Object.entries(solution.expressions).map(([key, value]) => (
                  <MarkdownRenderer key={key}>
                    {`- \`${key}\`: ${value}`}
                  </MarkdownRenderer>
                ))}
            </AgentSection>
          )}
        </Suspense>
      ))}
    </AgentCardShellContent>
  );
}
