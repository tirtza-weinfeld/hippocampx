"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useReducedMotion } from "framer-motion"

export function SeriesIntro() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">What are Infinite Series?</h2>
        <Card className="card-fun">
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <p className="text-lg">An infinite series is what happens when we add up infinitely many numbers!</p>
                <p>
                  When we write <code className="bg-muted px-1 py-0.5 rounded">Σ a_n</code>, we&apos;re adding up all the
                  terms in a sequence that goes on forever.
                </p>
                <p>
                  For example, the sum 1 + 1/2 + 1/4 + 1/8 + ... keeps going forever, but amazingly, it adds up to
                  exactly 2!
                </p>
              </div>
              <div className="flex items-center justify-center">
                <motion.div className="relative h-48 w-48 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="text-3xl font-bold text-pink-500 dark:text-pink-400"
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: [1, 1.2, 1],
                            }
                      }
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      Σ
                    </motion.div>
                    <div className="mt-4 space-y-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <motion.div
                          key={n}
                          className="text-sm font-medium"
                          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: shouldReduceMotion ? 0 : n * 0.3 }}
                        >
                          {n === 1 ? "1" : `1/${Math.pow(2, n - 1)}`}
                          {n < 5 ? " + " : " + ..."}
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      className="mt-4 text-xl font-bold text-pink-500 dark:text-pink-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 2 }}
                    >
                      = 2
                    </motion.div>
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

