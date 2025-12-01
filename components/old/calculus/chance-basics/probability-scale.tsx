"use client"

import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProbabilityScale() {
  const probabilityEvents = [
    {
      probability: 0,
      description: "Impossible",
      examples: ["Rolling a 7 on a standard die", "Drawing a blue card from a deck with only red cards"],
      color: "bg-red-500",
    },
    {
      probability: 0.25,
      description: "Unlikely",
      examples: ["Rolling a 6 on a standard die", "Drawing a king from a deck of cards"],
      color: "bg-orange-500",
    },
    {
      probability: 0.5,
      description: "Even Chance",
      examples: ["Flipping a coin and getting heads", "Spinning a fair spinner with two equal sections"],
      color: "bg-yellow-500",
    },
    {
      probability: 0.75,
      description: "Likely",
      examples: ["Rolling a number less than 6 on a standard die", "Drawing a card that is not a spade"],
      color: "bg-green-500",
    },
    {
      probability: 1,
      description: "Certain",
      examples: ["Rolling a number between 1 and 6 on a standard die", "Drawing a card from a deck of cards"],
      color: "bg-emerald-500",
    },
  ]

  return (
    <section className="py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-4">The Probability Scale</h2>
        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>From Impossible to Certain</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <p>Probability is measured on a scale from 0 to 1 (or 0% to 100%).</p>

              <div className="relative h-12 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-lg overflow-hidden">
                {probabilityEvents.map((event, index) => (
                  <div
                    key={index}
                    className="absolute top-0 transform -translate-x-1/2"
                    style={{ left: `${event.probability * 100}%` }}
                  >
                    <div className="h-12 w-1 bg-white"></div>
                    <div className="absolute top-14 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="text-sm font-bold">{event.probability}</div>
                      <div className="text-xs">{event.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-20 grid gap-4 md:grid-cols-5">
                {probabilityEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-muted p-4 rounded-lg"
                  >
                    <div className={`h-2 w-full ${event.color} rounded-full mb-2`}></div>
                    <h3 className="font-bold text-sm">{event.description}</h3>
                    <p className="text-xs text-muted-foreground mb-2">P = {event.probability}</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      {event.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Key Points:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>
                    A probability of 0 means an event is <strong>impossible</strong> - it will never happen.
                  </li>
                  <li>
                    A probability of 1 means an event is <strong>certain</strong> - it will definitely happen.
                  </li>
                  <li>
                    A probability of 0.5 means an event has an <strong>even chance</strong> of happening or not
                    happening.
                  </li>
                  <li>
                    The closer to 1, the more <strong>likely</strong> an event is to happen.
                  </li>
                  <li>
                    The closer to 0, the more <strong>unlikely</strong> an event is to happen.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

