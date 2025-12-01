"use client"

import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { useReducedMotion } from "motion/react"

export function RatesIntro() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">What are Rates of Change?</h2>
        <Card className="card-fun">
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <p className="text-lg">
                  A rate of change tells us how quickly something is changing compared to something else.
                </p>
                <p>
                  For example, when a car&apos;s speedometer shows 60 mph, that&apos;s a rate of change! It means your
                  position is changing by 60 miles for each hour that passes.
                </p>
                <p>
                  Rates of change are all around us - how fast water fills a bathtub, how quickly a plant grows, or how
                  rapidly temperature changes throughout the day.
                </p>
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
                    {/* Coordinate axes */}
                    <motion.path
                      d="M 20,180 L 180,180 M 20,180 L 20,20"
                      fill="none"
                      className="stroke-foreground/30"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 1, ease: "easeInOut" }}
                    />

                    {/* Curve with different slopes */}
                    <motion.path
                      d="M 20,180 L 60,160 L 100,120 L 140,60 L 180,20"
                      fill="none"
                      className="stroke-blue-500 dark:stroke-blue-400"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 2, ease: "easeInOut", delay: 1 }}
                    />

                    {/* Slope indicators */}
                    <motion.path
                      d="M 40,170 L 50,165"
                      fill="none"
                      className="stroke-green-500 dark:stroke-green-400"
                      strokeWidth="2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 3 }}
                    />

                    <motion.path
                      d="M 80,140 L 90,130"
                      fill="none"
                      className="stroke-yellow-500 dark:stroke-yellow-400"
                      strokeWidth="2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 3.5 }}
                    />

                    <motion.path
                      d="M 120,90 L 130,75"
                      fill="none"
                      className="stroke-orange-500 dark:stroke-orange-400"
                      strokeWidth="2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 4 }}
                    />

                    <motion.path
                      d="M 160,40 L 170,25"
                      fill="none"
                      className="stroke-red-500 dark:stroke-red-400"
                      strokeWidth="2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 4.5 }}
                    />

                    {/* Labels */}
                    <motion.text
                      x="180"
                      y="195"
                      textAnchor="middle"
                      className="fill-foreground"
                      fontSize="12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: shouldReduceMotion ? 0 : 5 }}
                    >
                      time
                    </motion.text>

                    <motion.text
                      x="10"
                      y="20"
                      textAnchor="middle"
                      className="fill-foreground"
                      fontSize="12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: shouldReduceMotion ? 0 : 5 }}
                    >
                      value
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

