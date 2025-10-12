import { CodeBlockSkeleton } from "@/components/mdx/code/code-block";
import { Solution } from "./mascot-types";
import { ProblemSolutionsServer } from "./problem-solutions-server";
import { Suspense } from "react";

export function ProblemCode(slug: string, solutions: Record<string, Solution>) {
  return (
    <>
      {Object.entries(solutions).map(([fileName, solution]) => {
        const meta = `source=problems/${slug}/${fileName}`
        return (
          <Suspense key={`${slug}-${fileName}`} fallback={<CodeBlockSkeleton />}>
            <ProblemSolutionsServer code={solution.code} meta={meta} />
            {/* <div>{solution.code}</div> */}
            {/* <SlowComponent /> */}
          </Suspense>
          // <Suspense key={`${slug}-${fileName}`} fallback={<CodeBlockSkeleton />}>
          //   <ProblemSolutionsServer code={solution.code} meta={meta} />
          // </Suspense>
        )
      }
      )}
    </>

  )
}

async function SlowComponent() {
  const slowContent = await new Promise(resolve => setTimeout(resolve, 3000)).then(() => 'hello slow component')
  return (
    <div>{slowContent}</div>
  )
}