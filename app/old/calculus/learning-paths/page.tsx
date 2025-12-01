import { PageTransition } from "@/components/old/calculus/page-transition"
import { LearningPathways } from "@/components/old/calculus/learning-pathways"

export default function LearningPathsPage() {
  return (
    <PageTransition>
      <div className="@container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
          Learning Pathways
        </h1>
        <p className="mt-4 text-xl text-foreground/80">
          Choose your adventure and start exploring the fascinating world of calculus.
        </p>

        <div className="mt-8">
          <LearningPathways />
        </div>
      </div>
    </PageTransition>
  )
}

