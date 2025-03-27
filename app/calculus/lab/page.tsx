import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ActivityIcon as Function,
  TrendingUp,
  Layers,
  Activity,
  ArrowDownUp,
  BarChart4,
} from "lucide-react"
import { PageTransition } from "@/components/calculus/page-transition"

export default function LabPage() {
  const activities = [
    {
      title: "Slope Explorer",
      description: "Visualize derivatives and tangent lines on interactive curves.",
      icon: <TrendingUp className="h-6 w-6" />,
      href: "/calculus/lab/slope-explorer",
      color: "from-blue-500 to-sky-400",
      emoji: "📈",
      difficulty: "Beginner",
    },
    {
      title: "Area Builder",
      description: "Discover the power of integrals by finding areas under curves.",
      icon: <Layers className="h-6 w-6" />,
      href: "/calculus/lab/area-builder",
      color: "from-green-500 to-emerald-400",
      emoji: "📐",
      difficulty: "Beginner",
    },
    {
      title: "Function Laboratory",
      description: "Build, transform, and analyze functions to see calculus in action.",
      icon: <Function className="h-6 w-6" />,
      href: "/calculus/lab/function-laboratory",
      color: "from-indigo-500 to-violet-400",
      emoji: "🧪",
      difficulty: "Intermediate",
    },
    {
      title: "Limit Approach",
      description: "See what happens as x approaches different values in interactive functions.",
      icon: <ArrowDownUp className="h-6 w-6" />,
      href: "/calculus/lab/limit-approach",
      color: "from-purple-500 to-indigo-400",
      emoji: "🔍",
      difficulty: "Intermediate",
    },
    {
      title: "Rate Analyzer",
      description: "Explore rates of change in real-world scenarios with interactive simulations.",
      icon: <Activity className="h-6 w-6" />,
      href: "/calculus/lab/rate-analyzer",
      color: "from-red-500 to-pink-400",
      emoji: "⏱️",
      difficulty: "Advanced",
    },
    {
      title: "Graph Creator",
      description: "Create and analyze your own mathematical functions and their derivatives.",
      icon: <BarChart4 className="h-6 w-6" />,
      href: "/calculus/lab/graph-creator",
      color: "from-amber-500 to-orange-400",
      emoji: "📊",
      difficulty: "Advanced",
    },
  ]

  return (
    <PageTransition>
      <div className="@container px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 via-sky-600 to-teal-600 text-transparent bg-clip-text">
            Interactive Math Lab
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore calculus concepts through hands-on interactive visualizations and experiments
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {activities.map((activity) => (
            <Card
              key={activity.title}
              className="border-2 border-border overflow-hidden transition-all hover:shadow-lg bg-background/60 backdrop-blur-sm"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${activity.color}`}></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${activity.color} text-white`}
                    >
                      {activity.icon}
                    </div>
                    <span className="text-2xl">{activity.emoji}</span>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${activity.color} text-white`}>
                      {activity.difficulty}
                    </span>
                  </div>
                </div>
                <CardTitle className="mt-2">{activity.title}</CardTitle>
                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={activity.href} className="w-full">
                  <Button className={`w-full bg-gradient-to-r ${activity.color} text-white`}>
                    Launch Activity <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

