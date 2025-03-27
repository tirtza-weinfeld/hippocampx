"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useReducedMotion } from "framer-motion"

const activities = [
  {
    title: "Slope Explorer",
    description: "Discover how derivatives relate to the slopes of curves",
    href: "/calculus/lab/slope-explorer",
    color: "bg-gradient-to-br from-blue-500 to-blue-700",
    textColor: "text-white",
  },
  {
    title: "Area Builder",
    description: "Visualize integrals as areas under curves",
    href: "/calculus/lab/area-builder",
    color: "bg-gradient-to-br from-green-500 to-green-700",
    textColor: "text-white",
  },
  {
    title: "Function Laboratory",
    description: "Experiment with different functions and their transformations",
    href: "/calculus/lab/function-laboratory",
    color: "bg-gradient-to-br from-indigo-500 to-purple-700",
    textColor: "text-white",
  },
]

export function FeaturedActivities() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Interactive Activities</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Explore calculus concepts through hands-on interactive experiences
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {activities.map((activity) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
              whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
            >
              <Card className="h-full overflow-hidden border-2 border-border bg-background/60 backdrop-blur-sm">
                <div className="aspect-video w-full overflow-hidden">
                  {activity.title === "Slope Explorer" && (
                    <svg viewBox="0 0 400 225" className="w-full h-full">
                      <defs>
                        <linearGradient id="slopeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgb(var(--blue-500))" />
                          <stop offset="100%" stopColor="rgb(var(--blue-700))" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <rect width="400" height="225" className="fill-blue-500/90 dark:fill-blue-700/90" />

                      {/* Coordinate system */}
                      <line x1="50" y1="112.5" x2="350" y2="112.5" className="stroke-white/50" strokeWidth="2" />
                      <line x1="200" y1="25" x2="200" y2="200" className="stroke-white/50" strokeWidth="2" />

                      {/* Function curve */}
                      <path
                        d="M 50,180 Q 125,25 200,112.5 Q 275,200 350,50"
                        fill="none"
                        className="stroke-white"
                        strokeWidth="3"
                        filter="url(#glow)"
                      />

                      {/* Tangent line */}
                      <line
                        x1="150"
                        y1="150"
                        x2="250"
                        y2="75"
                        className="stroke-pink-400"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />

                      {/* Tangent point */}
                      <circle cx="200" cy="112.5" r="6" className="fill-pink-400" />

                      {/* Slope indicator */}
                      <text x="220" y="80" className="fill-white font-bold" fontSize="16">
                        Slope = 1.5
                      </text>
                      <text x="150" y="50" className="fill-white font-bold" fontSize="18">
                        f&apos; (x)
                      </text>
                    </svg>
                  )}

                  {activity.title === "Area Builder" && (
                    <svg viewBox="0 0 400 225" className="w-full h-full">
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgb(var(--green-500))" />
                          <stop offset="100%" stopColor="rgb(var(--green-700))" />
                        </linearGradient>
                      </defs>
                      <rect width="400" height="225" className="fill-green-500/90 dark:fill-green-700/90" />

                      {/* Coordinate system */}
                      <line x1="50" y1="175" x2="350" y2="175" className="stroke-white/50" strokeWidth="2" />
                      <line x1="50" y1="25" x2="50" y2="175" className="stroke-white/50" strokeWidth="2" />

                      {/* Function curve */}
                      <path
                        d="M 50,175 C 100,100 150,150 200,75 C 250,25 300,50 350,100"
                        fill="none"
                        className="stroke-white"
                        strokeWidth="3"
                      />

                      {/* Area under curve */}
                      <path
                        d="M 50,175 C 100,100 150,150 200,75 C 250,25 300,50 350,100 L 350,175 Z"
                        className="fill-white/20"
                      />

                      {/* Rectangles (Riemann sum) */}
                      <rect x="50" y="125" width="50" height="50" className="fill-white/40 stroke-white" />
                      <rect x="100" y="150" width="50" height="25" className="fill-white/40 stroke-white" />
                      <rect x="150" y="100" width="50" height="75" className="fill-white/40 stroke-white" />
                      <rect x="200" y="50" width="50" height="125" className="fill-white/40 stroke-white" />
                      <rect x="250" y="75" width="50" height="100" className="fill-white/40 stroke-white" />
                      <rect x="300" y="100" width="50" height="75" className="fill-white/40 stroke-white" />

                      {/* Integral symbol */}
                      <text x="30" y="100" className="fill-white font-bold" fontSize="36">
                        ∫
                      </text>
                      <text x="150" y="40" className="fill-white font-bold" fontSize="18">
                        Area = ∫f(x)dx
                      </text>
                    </svg>
                  )}

                  {activity.title === "Function Laboratory" && (
                    <svg viewBox="0 0 400 225" className="w-full h-full">
                      <defs>
                        <linearGradient id="functionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgb(var(--indigo-500))" />
                          <stop offset="100%" stopColor="rgb(var(--purple-700))" />
                        </linearGradient>
                      </defs>
                      <rect width="400" height="225" className="fill-indigo-500/90 dark:fill-indigo-700/90" />

                      {/* Coordinate system */}
                      <line x1="50" y1="112.5" x2="350" y2="112.5" className="stroke-white/50" strokeWidth="2" />
                      <line x1="200" y1="25" x2="200" y2="200" className="stroke-white/50" strokeWidth="2" />

                      {/* Original function - sine wave */}
                      <path
                        d="M 50,112.5 C 75,75 100,150 125,112.5 C 150,75 175,150 200,112.5 C 225,75 250,150 275,112.5 C 300,75 325,150 350,112.5"
                        fill="none"
                        className="stroke-white/50"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />

                      {/* Transformed function - amplified sine wave */}
                      <path
                        d="M 50,112.5 C 75,50 100,175 125,112.5 C 150,50 175,175 200,112.5 C 225,50 250,175 275,112.5 C 300,50 325,175 350,112.5"
                        fill="none"
                        className="stroke-white"
                        strokeWidth="3"
                      />

                      {/* Transformation arrows */}
                      <line x1="125" y1="112.5" x2="125" y2="50" className="stroke-pink-400" strokeWidth="2" />
                      <polygon points="125,50 120,60 130,60" className="fill-pink-400" />

                      <line x1="275" y1="112.5" x2="275" y2="50" className="stroke-pink-400" strokeWidth="2" />
                      <polygon points="275,50 270,60 280,60" className="fill-pink-400" />

                      {/* Function notation */}
                      <text x="50" y="40" className="fill-white font-bold" fontSize="16">
                        f(x) = sin(x)
                      </text>
                      <text x="250" y="40" className="fill-white font-bold" fontSize="16">
                        g(x) = 2·sin(x)
                      </text>
                    </svg>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{activity.title}</h3>
                    <p className="text-muted-foreground">{activity.description}</p>
                    <div className="pt-4">
                      <Link href={activity.href}>
                        <Button className="w-full">
                          Explore <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

