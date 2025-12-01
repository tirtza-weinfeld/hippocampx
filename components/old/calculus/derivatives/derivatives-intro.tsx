"use client"

import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { useReducedMotion } from "motion/react"

export function DerivativesIntro() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">What is a Derivative?</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <p>
                  A derivative tells us how fast something is changing. Think of it as the <strong>speed</strong> of
                  change.
                </p>
                <p>
                  When we write <code className="bg-muted px-1 py-0.5 rounded">d/dx</code> or{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">f&apos;(x)</code>, we&apos;re asking: &quot;How quickly is this value
                  changing right now?&quot;
                </p>
                <p>
                  For example, if you&apos;re in a car and the speedometer shows 60 mph, that&apos;s the derivative of your
                  position! It tells you how quickly your position is changing.
                </p>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Quick Examples:</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>
                      If f(x) = x², then f&apos;(x) = 2x
                      <div className="ml-6 text-muted-foreground">This means the slope gets steeper as x increases</div>
                    </li>
                    <li>
                      If f(x) = sin(x), then f&apos;(x) = cos(x)
                      <div className="ml-6 text-muted-foreground">This is why sine and cosine create smooth waves</div>
                    </li>
                    <li>
                      If s(t) = 5t², then s&apos;(t) = 10t
                      <div className="ml-6 text-muted-foreground">If s is position, then s&apos; is velocity (speed)</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <motion.div
                  className="relative h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/20 to-sky-500/5 dark:from-blue-500/30 dark:to-sky-500/10 flex items-center justify-center"
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
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">f&apos;(x)</div>
                    <div className="text-sm font-medium mt-2">Rate of Change</div>
                  </div>

                  {/* Animated derivative symbols */}
                  <motion.div
                    className="absolute -top-4 -right-4 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 px-2 py-1 rounded-md text-sm font-medium"
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: [0, -10, 0],
                            rotate: [0, 5, 0],
                          }
                    }
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    d/dx
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-2 -left-8 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2 py-1 rounded-md text-sm font-medium"
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: [0, 10, 0],
                            rotate: [0, -5, 0],
                          }
                    }
                    transition={{
                      duration: 3.5,
                      delay: 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    Slope
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

