import { Suspense } from 'react';
import { getSolutionsByProblemId } from '@/lib/db/queries/agent-problems';
import { AgentCard, AgentSection } from '@/components/agent';
import type { Problem } from '@/lib/db/schema-problems';
import type { SectionType } from '@/components/agent/agent-section-tab';
import { MarkdownRenderer } from '@/components/mdx/parse/markdown-renderer';
import CodeBlock from '@/components/mdx/code/code-block';

export type AgentProblemCardProps = {
  problem: Problem;
};

/**
 * Server component that renders a single problem card.
 * Fetches its own solutions independently - streams as it loads.
 */
export async function AgentProblemCard({ problem }: AgentProblemCardProps) {
  // Fetch solutions for this problem only
  const solutionsList = await getSolutionsByProblemId(problem.id);

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
    <AgentCard
      id={problem.slug}
      title={problem.title}
      difficulty={problem.difficulty}
      topics={problem.topics || []}
      solutionFiles={solutionFiles}
      defaultFile={defaultFile}
      fileSectionMap={fileSectionMap}
      leetcodeUrl={problem.leetcode_url || ''}
    >
      {/* Definition section (shared across all solutions) */}
      {problem.definition && (
        <AgentSection section="definition">
          <MarkdownRenderer>{problem.definition}</MarkdownRenderer>
        </AgentSection>
      )}

      {/* Solution-specific sections */}
      {solutionsList.map(solution => (
        <Suspense key={solution.id} fallback={<div className="text-gray-500">Loading...</div>}>
          {/* Code snippet */}
          <AgentSection section="codeSnippet" file={solution.file_name}>
           <CodeBlock className="language-python" >
            {solution.code}
           </CodeBlock>
          </AgentSection>

          {/* Intuition */}
          {solution.intuition && (
            <AgentSection section="intuition" file={solution.file_name}>
              <MarkdownRenderer>{solution.intuition}</MarkdownRenderer>
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
                {Object.entries(solution.variables as Record<string, string>).map(([key, value]) => (
                  <MarkdownRenderer key={key}>
                    {`- \`${key}\`: ${value}`}
                  </MarkdownRenderer>
                ))}
            </AgentSection>
          )}

          {/* Key Expressions */}
          {solution.expressions && Object.keys(solution.expressions as object).length > 0 && (
            <AgentSection section="keyExpressions" file={solution.file_name}>
                {Object.entries(solution.expressions as Record<string, string>).map(([key, value]) => (
                  <MarkdownRenderer key={key}>
                    {`- \`${key}\`: ${value}`}
                  </MarkdownRenderer>
                ))}
            </AgentSection>
          )}
        </Suspense>
      ))}
    </AgentCard>
  );
}
