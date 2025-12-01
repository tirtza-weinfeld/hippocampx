import { HomeHero } from "@/components/old/calculus/home-hero"
import { MathChallengeOfDay } from "@/components/old/calculus/math-challenge-of-day"
import { LearningPathways } from "@/components/old/calculus/learning-pathways"
import { FeaturedActivities } from "@/components/old/calculus/featured-activities"
import { WhatIsCalculus } from "@/components/old/calculus/what-is-calculus"

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
