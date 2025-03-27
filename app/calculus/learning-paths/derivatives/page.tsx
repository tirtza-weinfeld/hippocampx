import { DerivativesIntro } from "@/components/calculus/derivatives/derivatives-intro"
import { CarSpeedSimulation } from "@/components/calculus/derivatives/car-speed-simulation"
import { TangentExplorer } from "@/components/calculus/derivatives/tangent-explorer"
import { PageTransition } from "@/components/calculus/page-transition"

export default function DerivativesPage() {
  return (
    <PageTransition>
      <div className="@container px-4 py-8 @md:py-12">
        <h1 className="text-3xl font-bold tracking-tighter @sm:text-4xl @md:text-5xl bg-gradient-to-r from-blue-600 via-sky-600 to-teal-600 text-transparent bg-clip-text">
          Derivatives: The Speed of Change
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Discover how derivatives help us understand how things change over time.
        </p>

        <div className="mt-8 space-y-12">
          <DerivativesIntro />
          <TangentExplorer />
          <CarSpeedSimulation />
        </div>
      </div>
    </PageTransition>
  )
}

