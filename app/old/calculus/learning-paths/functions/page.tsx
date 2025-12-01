import { FunctionsIntro } from "@/components/old/calculus/functions/functions-intro"
import { FunctionExplorer } from "@/components/old/calculus/functions/function-explorer"
import { PageTransition } from "@/components/old/calculus/page-transition"

export default function FunctionsPage() {
  return (
    <PageTransition>  
      <div className="@container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
          Function Families: Meet the Math Characters
        </h1>
        <p className="mt-4 text-xl text-foreground/80">
          Explore different types of functions and discover their unique properties and behaviors.
        </p>

        <div className="mt-8 space-y-12">
          <FunctionsIntro />
          <FunctionExplorer />
        </div>
      </div>
    </PageTransition>
  )
}

