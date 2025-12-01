"use client"

import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { useReducedMotion } from "motion/react"

export function ChanceIntro() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">What is Probability?</h2>
        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <p className="text-lg">
                  Probability is how likely something is to happen. It&apos;s a way to measure chance!
                </p>
                <p>When we talk about probability, we&apos;re asking: &quot;What are the chances that this will happen?&quot;</p>
                <p>
                  For example, when you flip a coin, there are two possible outcomes: heads or tails. The probability of
                  getting heads is 1 out of 2, or 50%.
                </p>
                <p>Probability is written as a fraction, decimal, or percentage:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>As a fraction: 1/2</li>
                  <li>As a decimal: 0.5</li>
                  <li>As a percentage: 50%</li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <motion.div
                  className="relative h-48 w-48 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/5 dark:from-violet-500/30 dark:to-fuchsia-500/10 flex items-center justify-center"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: [1, 1.05, 1],
                        }
                  }
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-500 dark:to-fuchsia-500 bg-clip-text text-transparent">
                      P(event)
                    </div>
                    <div className="text-sm font-medium mt-2 text-muted-foreground">
                      Number of favorable outcomes
                      <hr className="my-1 border-muted" />
                      Total number of possible outcomes
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

