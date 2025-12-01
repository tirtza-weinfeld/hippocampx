import { RatesIntro } from "@/components/old/calculus/rates/rates-intro"
import { RateComparisonGame } from "@/components/old/calculus/rates/rate-comparison-game"
import { PageTransition } from "@/components/old/calculus/page-transition"

export default function RatesOfChangePage() {
  return (
    <PageTransition>
      <div className="@container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
          Rates of Change: How Fast Things Move
        </h1>
        <p className="mt-4 text-xl text-foreground/80">
          Discover how calculus helps us understand and measure how quickly things change over time.
        </p>

        <div className="mt-8 space-y-12">
          <RatesIntro />
          <RateComparisonGame />
        </div>
      </div>
    </PageTransition>
  )
}

