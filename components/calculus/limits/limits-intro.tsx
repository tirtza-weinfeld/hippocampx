"use client"

import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { useReducedMotion } from "motion/react"

export function LimitsIntro() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">What is a Limit?</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <p>A limit is about getting closer and closer to a value, without necessarily reaching it.</p>
                <p>
                  When we write <code className="bg-muted px-1 py-0.5 rounded">lim x→a f(x) = L</code>, we&apos;re saying:
                  &quot;As x gets closer and closer to a, f(x) gets closer and closer to L.&quot;
                </p>
                <p>
                  Think of it like trying to touch a wall - you can get half the distance away, then half again, and
                  half again... You&apos;ll get very, very close, but you might never actually touch it!
                </p>

                <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                  <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Quick Examples:</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>
                      lim x→2 (x² - 4)/(x - 2) = 4
                      <div className="ml-6 text-muted-foreground">
                        Even though we can&apos;t directly calculate the value at x=2 (division by zero), the limit exists!
                      </div>
                    </li>
                    <li>
                      lim x→0 sin(x)/x = 1
                      <div className="ml-6 text-muted-foreground">
                        This famous limit is key in calculus and appears in many applications
                      </div>
                    </li>
                    <li>
                      lim x→∞ 1/x = 0
                      <div className="ml-6 text-muted-foreground">
                        As x gets larger and larger, 1/x gets closer and closer to 0
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
                  <div className="absolute right-0 top-0 h-full w-1 bg-indigo-500/50 dark:bg-indigo-400/50 rounded-full" />
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 flex items-center justify-center text-white font-bold"
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            x: [0, 120, 140, 150, 155, 158, 159],
                          }
                    }
                    transition={{
                      duration: 5,
                      times: [0, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 1,
                    }}
                  >
                    x
                  </motion.div>
                  <div className="absolute bottom-0 left-0 right-8 h-1 bg-muted rounded-full" />
                  <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">x → a</div>

                  {/* Animated limit symbols */}
                  <motion.div
                    className="absolute -top-4 -left-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-md text-sm font-medium"
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
                    lim
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-10 right-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md text-sm font-medium"
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
                    f(x) → L
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

