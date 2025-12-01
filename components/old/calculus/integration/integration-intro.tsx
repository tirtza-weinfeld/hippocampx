"use client"

import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { useReducedMotion } from "motion/react"

export function IntegrationIntro() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">What is Integration?</h2>
        <Card className="card-fun">
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <p className="text-lg">
                  Integration is like adding up tiny pieces to find the total area under a curve.
                </p>
                <p>
                  When we write <code className="bg-muted px-1 py-0.5 rounded">∫ f(x) dx</code>, we&apos;re asking: &quot;What&apos;s
                  the total area under this function?&quot;
                </p>
                <p>
                  Think of it like filling a swimming pool with tiny cups of water. Each cup is so small, but when you
                  add them all together, you get the whole pool!
                </p>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">Quick Examples:</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>
                      ∫ x dx = x²/2 + C
                      <div className="ml-6 text-muted-foreground">
                        This finds the area under a straight line with slope 1
                      </div>
                    </li>
                    <li>
                      ∫ x² dx = x³/3 + C
                      <div className="ml-6 text-muted-foreground">This finds the area under a parabola</div>
                    </li>
                    <li>
                      ∫₀² x² dx = 8/3
                      <div className="ml-6 text-muted-foreground">
                        This is a definite integral - it gives us exactly 8/3 square units
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <motion.div
                  className="relative h-48 w-48"
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
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <motion.path
                      d="M 10,150 C 30,120 50,180 70,140 C 90,100 110,120 130,80 C 150,40 170,60 190,30"
                      fill="none"
                      className="stroke-green-500 dark:stroke-green-400"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 2, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M 10,150 C 30,120 50,180 70,140 C 90,100 110,120 130,80 C 150,40 170,60 190,30 L 190,150 L 10,150 Z"
                      className="fill-green-500/20 dark:fill-green-400/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: shouldReduceMotion ? 0 : 2 }}
                    />
                    <motion.text
                      x="100"
                      y="180"
                      textAnchor="middle"
                      className="fill-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: shouldReduceMotion ? 0 : 3 }}
                    >
                      ∫ f(x) dx
                    </motion.text>
                  </svg>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

