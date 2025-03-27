import { LimitsIntro } from "@/components/calculus/limits/limits-intro"
import { ApproachingGame } from "@/components/calculus/limits/approaching-game"
import { PageTransition } from "@/components/calculus/page-transition"

export default function LimitsPage() {  
  return (
    <PageTransition>
      <div className="@container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-transparent bg-clip-text">
          Limits: Getting Closer and Closer
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Discover how we can approach a value without ever reaching it.
        </p>

        <div className="mt-8 space-y-12">
          <LimitsIntro />
          <ApproachingGame />
        </div>
      </div>
    </PageTransition>
  )
}

