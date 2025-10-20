import { Solution } from "./mascot-types";
import { ProblemSolutionsServer } from "./problem-solutions-server";

export async function ProblemCode({ slug, solutions }: { slug: string, solutions: Record<string, Solution> }) {

  return (
    <div>

      {Object.entries(solutions).map(([fileName, solution]) => {
        const meta = `source=problems/${slug}/${fileName}`
        return (
            <ProblemSolutionsServer key={`${slug}-${fileName}`} code={solution.code} meta={meta} />

        )
      }
      )}
    </div>

  )
}

