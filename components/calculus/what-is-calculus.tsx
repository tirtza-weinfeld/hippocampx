"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function WhatIsCalculus() {
  return (
    <motion.section
      className="py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-2 border-border overflow-hidden bg-background/60 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 pb-4">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span>What is Calculus?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <motion.p
              className="text-lg font-medium text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Calculus is like having MATH SUPERPOWERS to understand how things change and grow! ✨🦸‍♀️🦸‍♂️✨
            </motion.p>

            <motion.div
              className="relative h-40 md:h-48 overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-purple-100 dark:border-purple-800"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                <motion.path
                  d="M0,50 C150,0 350,100 500,50 L500,100 L0,100 Z"
                  fill="#6366f1"
                  fillOpacity="0.3"
                  initial={{ d: "M0,100 C150,100 350,100 500,100 L500,100 L0,100 Z" }}
                  animate={{ d: "M0,50 C150,0 350,100 500,50 L500,100 L0,100 Z" }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d="M0,70 C100,20 400,110 500,70 L500,100 L0,100 Z"
                  fill="#8b5cf6"
                  fillOpacity="0.3"
                  initial={{ d: "M0,100 C100,100 400,100 500,100 L500,100 L0,100 Z" }}
                  animate={{ d: "M0,70 C100,20 400,110 500,70 L500,100 L0,100 Z" }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                />
              </svg>

              <motion.div
                className="absolute top-4 left-4 right-4 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-medium text-base">
                  <span className="text-xl">🎢</span> Imagine a roller coaster that goes up, down, and loops around!
                </p>
                <p className="mt-2">Calculus helps us understand exactly how it moves at every point.</p>
              </motion.div>

              <motion.div
                className="absolute bottom-4 right-4"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <motion.circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill="#4f46e5"
                    fillOpacity="0.2"
                    stroke="#4f46e5"
                    strokeWidth="2"
                    initial={{ r: 20 }}
                    animate={{ r: 25 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                  <motion.path
                    d="M20,40 Q30,20 40,40"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ d: "M20,30 Q30,30 40,30" }}
                    animate={{ d: "M20,40 Q30,20 40,40" }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 relative overflow-hidden"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-blue-600 dark:text-blue-400 text-lg flex items-center">
                    <span className="mr-2">🔍</span> Derivatives
                  </h3>

                  <svg width="50" height="50" viewBox="0 0 50 50" className="mt-1">
                    <motion.line
                      x1="10"
                      y1="25"
                      x2="40"
                      y2="25"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="2 2"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    />
                    <motion.circle
                      cx="25"
                      cy="25"
                      r="3"
                      fill="#3b82f6"
                      initial={{ cx: 15 }}
                      animate={{ cx: 35 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />
                    <motion.line
                      x1="25"
                      y1="15"
                      x2="25"
                      y2="35"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      initial={{ x1: 15, x2: 15, opacity: 0 }}
                      animate={{ x1: 25, x2: 25, opacity: 1 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </div>

                <p>
                  Derivatives tell us <strong>how fast</strong> something is changing at any exact moment.
                </p>
                <p className="text-sm mt-1">
                  <span className="font-bold">Example:</span> How quickly a car speeds up or slows down.
                </p>
              </motion.div>

              <motion.div
                className="space-y-2 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 relative overflow-hidden"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-green-600 dark:text-green-400 text-lg flex items-center">
                    <span className="mr-2">🧮</span> Integrals
                  </h3>

                  <svg width="50" height="50" viewBox="0 0 50 50" className="mt-1">
                    <motion.path
                      d="M10,35 C15,35 15,15 25,15 C35,15 35,35 40,35"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />
                    <motion.rect
                      x="10"
                      y="35"
                      width="5"
                      height="0"
                      fill="#22c55e"
                      fillOpacity="0.3"
                      stroke="#22c55e"
                      initial={{ height: 0 }}
                      animate={{ height: 10 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.1,
                      }}
                    />
                    <motion.rect
                      x="15"
                      y="35"
                      width="5"
                      height="0"
                      fill="#22c55e"
                      fillOpacity="0.3"
                      stroke="#22c55e"
                      initial={{ height: 0 }}
                      animate={{ height: 15 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.2,
                      }}
                    />
                    <motion.rect
                      x="20"
                      y="35"
                      width="5"
                      height="0"
                      fill="#22c55e"
                      fillOpacity="0.3"
                      stroke="#22c55e"
                      initial={{ height: 0 }}
                      animate={{ height: 18 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.3,
                      }}
                    />
                    <motion.rect
                      x="25"
                      y="35"
                      width="5"
                      height="0"
                      fill="#22c55e"
                      fillOpacity="0.3"
                      stroke="#22c55e"
                      initial={{ height: 0 }}
                      animate={{ height: 20 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.4,
                      }}
                    />
                    <motion.rect
                      x="30"
                      y="35"
                      width="5"
                      height="0"
                      fill="#22c55e"
                      fillOpacity="0.3"
                      stroke="#22c55e"
                      initial={{ height: 0 }}
                      animate={{ height: 18 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    />
                    <motion.rect
                      x="35"
                      y="35"
                      width="5"
                      height="0"
                      fill="#22c55e"
                      fillOpacity="0.3"
                      stroke="#22c55e"
                      initial={{ height: 0 }}
                      animate={{ height: 15 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.6,
                      }}
                    />
                  </svg>
                </div>

                <p>
                  Integrals add up <strong>tiny pieces</strong> to find the total amount of something.
                </p>
                <p className="text-sm mt-1">
                  <span className="font-bold">Example:</span> Finding the total distance traveled on a journey.
                </p>
              </motion.div>
            </div>

            <motion.div
              className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800 relative overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-center">
                <div className="mr-4">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <motion.circle
                      cx="30"
                      cy="30"
                      r="25"
                      fill="#eab308"
                      fillOpacity="0.2"
                      stroke="#eab308"
                      strokeWidth="2"
                      initial={{ r: 20 }}
                      animate={{ r: 25 }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />
                    <motion.path
                      d="M20,30 L30,20 L40,30 L30,40 Z"
                      fill="#eab308"
                      fillOpacity="0.4"
                      stroke="#eab308"
                      strokeWidth="2"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      style={{ transformOrigin: "center" }}
                    />
                    <motion.path
                      d="M30,20 L30,40"
                      stroke="#eab308"
                      strokeWidth="2"
                      strokeDasharray="2 2"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    />
                    <motion.path
                      d="M20,30 L40,30"
                      stroke="#eab308"
                      strokeWidth="2"
                      strokeDasharray="2 2"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
                    />
                  </svg>
                </div>
                <p className="font-medium">
                  Calculus helps design video games, roller coasters, and predict the weather!
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/calculus/learning-paths">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg px-6 py-5 h-auto group">
                  Start Your Math Adventure!
                  <motion.div
                    className="inline-block ml-2"
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      ease: "easeInOut",
                      repeatDelay: 1,
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}

