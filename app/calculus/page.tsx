import { HomeHero } from "@/components/calculus/home-hero"
import { MathChallengeOfDay } from "@/components/calculus/math-challenge-of-day"
import { LearningPathways } from "@/components/calculus/learning-pathways"
import { FeaturedActivities } from "@/components/calculus/featured-activities"
import { WhatIsCalculus } from "@/components/calculus/what-is-calculus"

export default function Home() {
  return (
    <div className=" px-4 py-8 @md:py-12">
      <HomeHero />
      <WhatIsCalculus />
      <MathChallengeOfDay />
      <LearningPathways />
      <FeaturedActivities />
    </div>
  )
}

