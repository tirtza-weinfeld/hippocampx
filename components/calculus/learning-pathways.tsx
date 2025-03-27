"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ActivityIcon as Function, Activity, TrendingUp, ArrowDownUp, Layers, Sigma } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useReducedMotion } from "framer-motion"

export function LearningPathways() {
  const shouldReduceMotion = useReducedMotion()

  const pathways = [
    {
      title: "Functions",
      description: "Meet the math characters! Learn about different types of functions and how they behave.",
      icon: <Function className="h-6 w-6" />,
      href: "/calculus/learning-paths/functions",
      color: "from-indigo-500 to-blue-400",
      emoji: "📊",
    },
    {
      title: "Limits",
      description: "Discover what happens as we approach values without quite reaching them.",
      icon: <ArrowDownUp className="h-6 w-6" />,
      href: "/calculus/learning-paths/limits",
      color: "from-purple-500 to-indigo-400",
      emoji: "🧲",
    },
    {
      title: "Derivatives",
      description: "Explore the magic of finding slopes and rates of change at any point.",
      icon: <TrendingUp className="h-6 w-6" />,
      href: "/calculus/learning-paths/derivatives",
      color: "from-sky-500 to-blue-400",
      emoji: "📈",
    },
    {
      title: "Integration",
      description: "Learn how to find areas under curves and solve fascinating problems.",
      icon: <Layers className="h-6 w-6" />,
      href: "/calculus/learning-paths/integration",
      color: "from-green-500 to-emerald-400",
      emoji: "📐",
    },
    {
      title: "Rates of Change",
      description: "See how calculus helps us understand motion, growth, and change in the real world.",
      icon: <Activity className="h-6 w-6" />,
      href: "/calculus/learning-paths/rates-of-change",
      color: "from-red-500 to-rose-400",
      emoji: "🚀",
    },
    {
      title: "Infinite Series",
      description: "Explore what happens when we add up numbers that go on forever!",
      icon: <Sigma className="h-6 w-6" />,
      href: "/calculus/learning-paths/series",
      color: "from-amber-500 to-orange-400",
      emoji: "♾️",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-transparent bg-clip-text">
              Learning Pathways
            </h2>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Choose your adventure and start exploring the fascinating world of calculus.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {pathways.map((pathway) => (
              <motion.div
                key={pathway.title}
                variants={item}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.03,
                        transition: { duration: 0.2 },
                      }
                }
              >
                <Link href={pathway.href} className="block h-full">
                  <Card className="h-full overflow-hidden transition-all border-2 border-border bg-background/60 backdrop-blur-sm">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${pathway.color} opacity-0 hover:opacity-10 transition-opacity duration-300`}
                    />
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div
                          className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${pathway.color} text-white`}
                        >
                          {pathway.icon}
                        </div>
                        <span className="text-2xl">{pathway.emoji}</span>
                      </div>
                      <CardTitle className="mt-4 text-xl">{pathway.title}</CardTitle>
                      <CardDescription className="text-foreground/70">{pathway.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <div
                        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${pathway.color} text-white`}
                      >
                        Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

