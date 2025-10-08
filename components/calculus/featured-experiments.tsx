"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CoinsIcon as CoinIcon, Dices, PlayCircle, WalletCardsIcon as Cards } from "lucide-react"
import Image from "next/image"
import { Route } from "next"


export function FeaturedExperiments() {
  const experiments = [
    {
      title: "Coin Flip Simulator",
      description: "Flip virtual coins and track the results to see probability in action.",
      icon: <CoinIcon className="h-6 w-6" />,
      href: "/calculus/experiments/coin-flip" as Route,
      color: "from-violet-500 to-fuchsia-400",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Dice Roll Challenge",
      description: "Roll dice and predict outcomes while learning about random chance.",
      icon: <Dices className="h-6 w-6" />,
      href: "/calculus/experiments/dice-roll" as Route,
      color: "from-amber-500 to-orange-400",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Card Probability",
      description: "Draw cards from a deck and discover the probability of different hands.",
      icon: <Cards className="h-6 w-6" />,
      href: "/calculus/experiments/card-probability" as Route,
      color: "from-green-500 to-emerald-400",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
              Featured Experiments
            </h2>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Try these interactive probability experiments and see chance in action!
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {experiments.map((experiment, index) => (
            <motion.div
              key={experiment.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full overflow-hidden border-2 bg-background/60 backdrop-blur-sm">
                <div className="aspect-video w-full overflow-hidden">
                  <Image
                    src={experiment.image || "/placeholder.svg"}
                    alt={experiment.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${experiment.color} text-white`}
                    >
                      {experiment.icon}
                    </div>
                    <CardTitle>{experiment.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{experiment.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href={experiment.href} className="w-full">
                    <Button className={`w-full bg-gradient-to-r ${experiment.color} text-white`}>
                      <PlayCircle className="mr-2 h-4 w-4" /> Try It Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/calculus/experiments">
            <Button variant="outline" size="lg" className="border-2">
              View All Experiments
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

