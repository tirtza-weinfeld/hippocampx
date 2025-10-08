import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CoinsIcon as CoinIcon, Dices, PlayCircle, WalletCardsIcon as Cards, Shuffle, PieChart } from "lucide-react"
import Image from "next/image"
import type { Route } from "next"

export default function ExperimentsPage() {
  const experiments = [
    {
      title: "Coin Flip Simulator",
      description: "Flip virtual coins and track the results to see probability in action.",
      icon: <CoinIcon className="h-6 w-6" />,
      href: "/experiments/coin-flip" as Route,
      color: "from-violet-500 to-fuchsia-400",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Beginner",
    },
    {
      title: "Dice Roll Challenge",
      description: "Roll dice and predict outcomes while learning about random chance.",
      icon: <Dices className="h-6 w-6" />,
      href: "/experiments/dice-roll" as Route,
      color: "from-amber-500 to-orange-400",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Beginner",
    },
    {
      title: "Card Probability",
      description: "Draw cards from a deck and discover the probability of different hands.",
      icon: <Cards className="h-6 w-6" />,
      href: "/experiments/card-probability" as Route,
      color: "from-green-500 to-emerald-400",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
    },
    {
      title: "Spinner Probability",
      description: "Create custom spinners and predict where they'll land.",
      icon: <PieChart className="h-6 w-6" />,
      href: "/experiments/spinner" as Route,
      color: "from-blue-500 to-cyan-400",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
    },
    {
      title: "Marble Grab",
      description: "Grab marbles from a bag and calculate the probability of different colors.",
      icon: <Shuffle className="h-6 w-6" />,
      href: "/experiments/marble-grab" as Route,
      color: "from-pink-500 to-rose-400",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Advanced",
    },
    {
      title: "Probability Calculator",
      description: "Calculate the probability of complex events with this interactive tool.",
      icon: <PlayCircle className="h-6 w-6" />,
      href: "/experiments/calculator" as Route,
      color: "from-indigo-500 to-violet-400",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Advanced",
    },
  ]

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
          Probability Experiments
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Try these interactive experiments to see probability in action and test your understanding
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {experiments.map((experiment) => (
          <Card
            key={experiment.title}
            className="border-2 overflow-hidden transition-all hover:shadow-lg bg-background/60 backdrop-blur-sm"
          >
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={experiment.image || "/placeholder.svg"}
                alt={experiment.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${experiment.color} text-white`}
                  >
                    {experiment.icon}
                  </div>
                  <CardTitle>{experiment.title}</CardTitle>
                </div>
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${experiment.color} text-white`}>
                    {experiment.difficulty}
                  </span>
                </div>
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
        ))}
      </div>
    </div>
  )
}

