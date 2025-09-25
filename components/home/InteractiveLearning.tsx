'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Puzzle, 
  Brain, 
  Target, 
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Music,
  Globe,
  Code,
  ChartBar
} from 'lucide-react'
import confetti from 'canvas-confetti'
import Image from 'next/image'

const activities = [
  {
    title: "Memory Challenge",
    description: "Test your memory by matching pairs of cards",
    icon: <Brain className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
    image: "https://source.unsplash.com/random/800x400/?brain",
    content: (
      <div className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
          <Image
            src="https://source.unsplash.com/random/800x400/?brain"
            alt="Memory Challenge"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Memory games help improve your working memory and concentration.
          Try to match the pairs of cards in the shortest time possible!
        </p>
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={() => {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
              })
            }}
          >
            Start Challenge
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="flex-1">
            View Leaderboard
            <Trophy className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  },
  {
    title: "Pattern Recognition",
    description: "Identify patterns and complete the sequence",
    icon: <Puzzle className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
    image: "https://source.unsplash.com/random/800x400/?pattern",
    content: (
      <div className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
          <Image
            src="https://source.unsplash.com/random/800x400/?pattern"
            alt="Pattern Recognition"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Pattern recognition is a key cognitive skill that helps in problem-solving
          and learning new concepts. Can you spot the pattern?
        </p>
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={() => {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
              })
            }}
          >
            Start Challenge
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="flex-1">
            View Leaderboard
            <Trophy className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  },
  {
    title: "Focus Training",
    description: "Improve your concentration with timed tasks",
    icon: <Target className="w-8 h-8" />,
    color: "from-green-500 to-emerald-500",
    image: "https://source.unsplash.com/random/800x400/?focus",
    content: (
      <div className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
          <Image
            src="https://source.unsplash.com/random/800x400/?focus"
            alt="Focus Training"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Focus training exercises help you maintain attention and improve
          productivity. Ready to challenge yourself?
        </p>
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={() => {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
              })
            }}
          >
            Start Training
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="flex-1">
            View Progress
            <ChartBar className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  },
  {
    title: "Language Learning",
    description: "Master new languages through interactive exercises",
    icon: <Globe className="w-8 h-8" />,
    color: "from-yellow-500 to-orange-500",
    image: "https://source.unsplash.com/random/800x400/?language",
    content: (
      <div className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
          <Image
            src="https://source.unsplash.com/random/800x400/?language"
            alt="Language Learning"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Learn new languages through interactive exercises, pronunciation practice,
          and cultural immersion activities.
        </p>
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={() => {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
              })
            }}
          >
            Start Learning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="flex-1">
            Choose Language
            <Globe className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  },
  {
    title: "Coding Challenges",
    description: "Solve programming puzzles and build projects",
    icon: <Code className="w-8 h-8" />,
    color: "from-indigo-500 to-purple-500",
    image: "https://source.unsplash.com/random/800x400/?coding",
    content: (
      <div className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
          <Image
            src="https://source.unsplash.com/random/800x400/?coding"
            alt="Coding Challenges"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Enhance your programming skills with interactive coding challenges,
          algorithm puzzles, and real-world projects.
        </p>
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={() => {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
              })
            }}
          >
            Start Coding
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="flex-1">
            View Projects
            <Code className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  },
  {
    title: "Music Theory",
    description: "Learn music through interactive exercises",
    icon: <Music className="w-8 h-8" />,
    color: "from-pink-500 to-rose-500",
    image: "https://source.unsplash.com/random/800x400/?music",
    content: (
      <div className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
          <Image
            src="https://source.unsplash.com/random/800x400/?music"
            alt="Music Theory"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Master music theory through interactive exercises, ear training,
          and rhythm practice.
        </p>
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={() => {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
              })
            }}
          >
            Start Learning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="flex-1">
            Practice Mode
            <Music className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  }
]

export function InteractiveLearning() {
  const [currentActivity, setCurrentActivity] = useState(0)

  const nextActivity = () => {
    if (currentActivity < activities.length - 1) {
      setCurrentActivity(currentActivity + 1)
    }
  }

  const prevActivity = () => {
    if (currentActivity > 0) {
      setCurrentActivity(currentActivity - 1)
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            Interactive Learning Activities
          </h2>
          <p className="text-muted-foreground">
            Engage with fun activities that enhance your learning experience
          </p>
        </motion.div>

        <Card className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActivity}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${activities[currentActivity].color}`}>
                  {activities[currentActivity].icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">
                    {activities[currentActivity].title}
                  </h3>
                  <p className="text-muted-foreground">
                    {activities[currentActivity].description}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-muted/50 dark:bg-muted/20 rounded-lg">
                {activities[currentActivity].content}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={prevActivity}
                  disabled={currentActivity === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {activities.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentActivity ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={nextActivity}
                  disabled={currentActivity === activities.length - 1}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </section>
  )
} 