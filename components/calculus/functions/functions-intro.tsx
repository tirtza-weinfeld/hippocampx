"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useReducedMotion } from "framer-motion"

export function FunctionsIntro() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">What are Function Families?</h2>
        <Card className="card-fun">
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <p className="text-lg">
                  Functions are like special machines that take an input and give you an output.
                </p>
                <p>
                  Different types of functions behave in different ways - just like different characters in a story!
                </p>
                <p>
                  Some functions grow quickly (like exponential), some wiggle back and forth (like sine and cosine), and
                  some make beautiful curves (like parabolas).
                </p>
                <p>
                  By understanding these function families, you&apos;ll be able to predict how they behave and use them to
                  solve all kinds of problems!
                </p>
              </div>
              <div className="flex items-center justify-center">
                <motion.div className="relative h-48 w-48 flex items-center justify-center">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    {/* Linear function y = x */}
                    <motion.path
                      d="M 20,180 L 180,20"
                      fill="none"
                      className="stroke-indigo-500 dark:stroke-indigo-400"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 1.5, ease: "easeInOut" }}
                    />

                    {/* Quadratic function y = x^2 */}
                    <motion.path
                      d="M 20,180 Q 100,20 180,180"
                      fill="none"
                      className="stroke-purple-500 dark:stroke-purple-400"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 1.5, ease: "easeInOut", delay: 0.5 }}
                    />

                    {/* Sine function */}
                    <motion.path
                      d="M 20,100 C 40,50 60,150 80,100 C 100,50 120,150 140,100 C 160,50 180,150 200,100"
                      fill="none"
                      className="stroke-blue-500 dark:stroke-blue-400"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 1.5, ease: "easeInOut", delay: 1 }}
                    />

                    {/* Exponential function */}
                    <motion.path
                      d="M 20,180 C 60,170 100,150 140,80 C 160,40 170,20 180,10"
                      fill="none"
                      className="stroke-pink-500 dark:stroke-pink-400"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 1.5, ease: "easeInOut", delay: 1.5 }}
                    />

                    {/* Axes */}
                    <motion.path
                      d="M 20,100 L 180,100 M 100,20 L 100,180"
                      fill="none"
                      className="stroke-foreground/20"
                      strokeWidth="1"
                      strokeDasharray="4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: shouldReduceMotion ? 0 : 2 }}
                    />
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

