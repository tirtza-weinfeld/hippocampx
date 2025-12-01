"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "motion/react"
import { Award, Trophy, Medal, Star } from "lucide-react"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/old/calculus/confetti"

export default function ProgressPage() {
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState("progress")

  // Simulate loading progress data
  useEffect(() => {
    const timer = setTimeout(() => {
      // setShowReward(true)
      setShowConfetti(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const learningPaths = [
    {
      name: "Chance Basics",
      progress: 75,
      color: "bg-violet-500",
      achievements: [
        { name: "Coin Flip Master", completed: true, icon: <Award className="h-4 w-4" /> },
        { name: "Probability Pioneer", completed: true, icon: <Star className="h-4 w-4" /> },
        { name: "Chance Champion", completed: true, icon: <Trophy className="h-4 w-4" /> },
        { name: "Prediction Pro", completed: false, icon: <Medal className="h-4 w-4" /> },
      ],
    },
    {
      name: "Probability Fractions",
      progress: 60,
      color: "bg-fuchsia-500",
      achievements: [
        { name: "Fraction Friend", completed: true, icon: <Award className="h-4 w-4" /> },
        { name: "Decimal Detective", completed: true, icon: <Star className="h-4 w-4" /> },
        { name: "Percentage Pro", completed: false, icon: <Trophy className="h-4 w-4" /> },
        { name: "Ratio Ranger", completed: false, icon: <Medal className="h-4 w-4" /> },
      ],
    },
    {
      name: "Random Experiments",
      progress: 40,
      color: "bg-amber-500",
      achievements: [
        { name: "Experiment Explorer", completed: true, icon: <Award className="h-4 w-4" /> },
        { name: "Data Collector", completed: true, icon: <Star className="h-4 w-4" /> },
        { name: "Result Recorder", completed: false, icon: <Trophy className="h-4 w-4" /> },
        { name: "Analysis Ace", completed: false, icon: <Medal className="h-4 w-4" /> },
      ],
    },
    {
      name: "Data Collection",
      progress: 25,
      color: "bg-green-500",
      achievements: [
        { name: "Data Gatherer", completed: true, icon: <Award className="h-4 w-4" /> },
        { name: "Chart Creator", completed: false, icon: <Star className="h-4 w-4" /> },
        { name: "Graph Guru", completed: false, icon: <Trophy className="h-4 w-4" /> },
        { name: "Visualization Virtuoso", completed: false, icon: <Medal className="h-4 w-4" /> },
      ],
    },
    {
      name: "Combinations & Outcomes",
      progress: 10,
      color: "bg-pink-500",
      achievements: [
        { name: "Outcome Observer", completed: true, icon: <Award className="h-4 w-4" /> },
        { name: "Combination Crafter", completed: false, icon: <Star className="h-4 w-4" /> },
        { name: "Possibility Pioneer", completed: false, icon: <Trophy className="h-4 w-4" /> },
        { name: "Permutation Pro", completed: false, icon: <Medal className="h-4 w-4" /> },
      ],
    },
    {
      name: "Predictions & Fairness",
      progress: 5,
      color: "bg-indigo-500",
      achievements: [
        { name: "Fair Play Friend", completed: true, icon: <Award className="h-4 w-4" /> },
        { name: "Prediction Pal", completed: false, icon: <Star className="h-4 w-4" /> },
        { name: "Fairness Finder", completed: false, icon: <Trophy className="h-4 w-4" /> },
        { name: "Equity Expert", completed: false, icon: <Medal className="h-4 w-4" /> },
      ],
    },
  ]

  const experiments = [
    { name: "Coin Flip", completed: 15, total: 20 },
    { name: "Dice Roll", completed: 8, total: 20 },
    { name: "Card Drawing", completed: 5, total: 20 },
    { name: "Spinner", completed: 0, total: 20 },
    { name: "Marble Grab", completed: 0, total: 20 },
  ]

  return (
    <div className="container px-4 py-8 md:py-12">
      <Confetti trigger={showConfetti} count={100} />
      {/* <RewardBadge
        title="Progress Champion!"
        description="You've completed 8 achievements in your probability journey!"
        icon="trophy"
        color="violet"
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
            Your Learning Progress
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">Track your probability learning journey and achievements</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Learning Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="stats">Stats & Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-6">
            <Card className="border-2 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Learning Pathways Progress</CardTitle>
                <CardDescription>Track your journey through probability concepts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningPaths.map((path, index) => (
                    <motion.div
                      key={path.name}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{path.name}</span>
                        <span className="text-sm text-muted-foreground">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" indicatorClassName={path.color} />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="font-medium">Experiment Completion</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {experiments.map((experiment, index) => (
                      <motion.div
                        key={experiment.name}
                        className="bg-muted p-4 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{experiment.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {experiment.completed} of {experiment.total}
                          </span>
                        </div>
                        <Progress value={(experiment.completed / experiment.total) * 100} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card className="border-2 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>Badges and rewards you&apos;ve earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningPaths.map((path) => (
                    <div key={path.name} className="space-y-2">
                      <h3 className="font-medium">{path.name}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {path.achievements.map((achievement) => (
                          <div
                            key={achievement.name}
                            className={`p-3 rounded-lg border-2 ${
                              achievement.completed
                                ? `border-${path.color.replace("bg-", "")} bg-${path.color.replace("bg-", "")}/10`
                                : "border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 opacity-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`${achievement.completed ? path.color : "bg-gray-400"} text-white p-1 rounded-full`}
                              >
                                {achievement.icon}
                              </div>
                              <span className={achievement.completed ? "font-medium" : "text-muted-foreground"}>
                                {achievement.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <Card className="border-2 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
                <CardDescription>Your probability learning journey in numbers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    className="bg-violet-500/10 border-2 border-violet-500/20 rounded-xl p-4 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">28</div>
                    <div className="text-sm text-muted-foreground">Experiments Completed</div>
                  </motion.div>
                  <motion.div
                    className="bg-fuchsia-500/10 border-2 border-fuchsia-500/20 rounded-xl p-4 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-400">8</div>
                    <div className="text-sm text-muted-foreground">Achievements Earned</div>
                  </motion.div>
                  <motion.div
                    className="bg-green-500/10 border-2 border-green-500/20 rounded-xl p-4 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">5</div>
                    <div className="text-sm text-muted-foreground">Hours Spent Learning</div>
                  </motion.div>
                  <motion.div
                    className="bg-amber-500/10 border-2 border-amber-500/20 rounded-xl p-4 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">36%</div>
                    <div className="text-sm text-muted-foreground">Overall Completion</div>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-8 bg-muted p-4 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <h3 className="font-medium mb-2">Learning Insights:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                      <span>You&apos;re making excellent progress in Chance Basics (75% complete)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-fuchsia-500"></div>
                      <span>Your strongest area is understanding coin flip probability</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span>Try exploring more card probability experiments to boost your progress</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>You&apos;re on track to complete the basic probability curriculum in 2 weeks</span>
                    </li>
                  </ul>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

