import { ChanceIntro } from "@/components/calculus/chance-basics/chance-intro"
import { CoinFlipDemo } from "@/components/calculus/chance-basics/coin-flip-demo"
import { ProbabilityScale } from "@/components/calculus/chance-basics/probability-scale"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Route } from "next"

export default function ChanceBasicsPage() {
  return (
    <div className="@container px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
        Chance Basics: Understanding Probability
      </h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Learn the fundamentals of probability through fun, interactive examples
      </p>

      <div className="mt-8 space-y-12">
        <ChanceIntro />
        <CoinFlipDemo />
        <ProbabilityScale />

        <div className="flex justify-center">
          <Link href={"/experiments/coin-flip" as Route}>
            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
              Try the Coin Flip Experiment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

