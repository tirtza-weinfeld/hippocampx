import { IntegrationIntro } from "@/components/calculus/integration/integration-intro"
import { AreaGame } from "@/components/calculus/integration/area-game"
import { PageTransition } from "@/components/calculus/page-transition"

export default function IntegrationPage() {
  return (
    <PageTransition>
      <div className="@container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
          Integration: Finding Areas
        </h1>
        <p className="mt-4 text-xl text-foreground/80">
          Discover how integration helps us find areas under curves and solve real-world problems.
        </p>

        <div className="mt-8 space-y-12">
          <IntegrationIntro />
          <AreaGame />
        </div>
      </div>
    </PageTransition>
  )
}

