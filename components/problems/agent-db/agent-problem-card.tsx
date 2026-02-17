import { Suspense } from 'react';
import { getSolutionsByProblemId, getSymbolsBySolutionId } from '@/lib/db/queries/problems';
import { AgentCardShell, AgentSection } from '@/components/agent';
import { AgentCardShellContent } from '@/components/agent/agent-card-shell-content';
import { TimeComplexityBadge } from '@/components/agent/time-complexity-badge';
import type { Problem, Solution } from '@/lib/db/schema';
import type { SectionType } from '@/components/agent/agent-section-tab';
import { MarkdownRenderer } from '@/components/mdx/parse/markdown-renderer';
import { DbCodeBlock } from './db-code-block';

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
  const solutionsList = await solutionsPromise;

  // Fetch symbols for all solutions in parallel
  const symbolsBySolution = await Promise.all(
    solutionsList.map(s => getSymbolsBySolutionId(s.id))
  );

  // Build file list and section map
  const solutionFiles = solutionsList.map(s => s.file_name);
  const defaultFile = solutionFiles[0] || '';

  const fileSectionMap: Record<string, SectionType[]> = {};

  for (let i = 0; i < solutionsList.length; i++) {
    const solution = solutionsList[i];
    const syms = symbolsBySolution[i];
    const sections: SectionType[] = [];

    if (problem.definition) sections.push('definition');
    sections.push('codeSnippet');
    if (solution.intuition) sections.push('intuition');
    if (solution.time_complexity) sections.push('timeComplexity');
    if (syms.some(s => s.kind === 'variable')) sections.push('keyVariables');
    if (syms.some(s => s.kind === 'expression')) sections.push('keyExpressions');

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
        </AgentSection>
      )}

      {/* Solution-specific sections */}
      {solutionsList.map((solution, i) => {
        const syms = symbolsBySolution[i];
        const variables = syms.filter(s => s.kind === 'variable');
        const expressions = syms.filter(s => s.kind === 'expression');

        return (
          <Suspense key={solution.id} fallback={<div className="text-gray-500">Loading...</div>}>
            {/* Code snippet with DB-backed tooltips */}
            <AgentSection section="codeSnippet" file={solution.file_name}>
              {/* <DbCodeBlock tooltips code={solution.code} solutionId={solution.id} symbols={syms} /> */}
              <DbCodeBlock code={solution.code} />   
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

            {/* Key Variables — from symbols table */}
            {variables.length > 0 && (
              <AgentSection section="keyVariables" file={solution.file_name}>
                {variables.map(v => {
                  const name = v.qname.split('.').pop() ?? v.qname;
                  return (
                    <MarkdownRenderer key={v.qname}>
                      {`- \`${name}\`: ${v.summary ?? ''}`}
                    </MarkdownRenderer>
                  );
                })}
              </AgentSection>
            )}

            {/* Key Expressions — from symbols table */}
            {expressions.length > 0 && (
              <AgentSection section="keyExpressions" file={solution.file_name}>
                {expressions.map(e => {
                  const name = e.qname.split('.').pop() ?? e.qname;
                  return (
                    <MarkdownRenderer key={e.qname}>
                      {`- \`${name}\`: ${e.summary ?? ''}`}
                    </MarkdownRenderer>
                  );
                })}
              </AgentSection>
            )}
          </Suspense>
        );
      })}
    </AgentCardShellContent>
  );
}
