import { SeriesIntro } from "@/components/old/calculus/series/series-intro"
import { InfiniteSeriesGame } from "@/components/old/calculus/series/infinite-series-game"
import { PageTransition } from "@/components/old/calculus/page-transition"

export default function SeriesPage() {
  return (
    <PageTransition>
      <div className="@container px-4 py-8 @md:py-12">
        <h1 className="text-3xl font-bold tracking-tighter  @sm:text-4xl @md:text-5xl bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text">
          Infinite Series: Adding Forever
        </h1>
        <p className="mt-4 text-xl text-foreground/80">
          Explore what happens when we add numbers that go on forever and ever!
        </p>

        <div className="mt-8 space-y-12">
          <SeriesIntro />
          <InfiniteSeriesGame />
        </div>
      </div>
    </PageTransition>
  )
}

