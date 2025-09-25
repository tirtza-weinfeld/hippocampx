'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Timer,
  Share2,
  Heart,
  Bookmark
} from 'lucide-react'
import confetti from 'canvas-confetti'
import Image from 'next/image'

const triviaQuestions = [
  {
    question: "How many neurons does the average human brain contain?",
    options: [
      "10 million",
      "1 billion",
      "86 billion",
      "100 trillion"
    ],
    answer: 2,
    funFact: "Your brain has about 86 billion neurons! If you lined up all your neurons end to end, they would stretch 850 miles!",
    image: "https://source.unsplash.com/random/800x400/?brain",
    category: "Brain Structure",
    difficulty: "Medium"
  },
  {
    question: "What percentage of your body's energy does your brain use?",
    options: [
      "5%",
      "20%",
      "35%",
      "50%"
    ],
    answer: 1,
    funFact: "Your brain uses 20% of your body's energy, despite being only 2% of your body weight!",
    image: "https://source.unsplash.com/random/800x400/?energy",
    category: "Brain Energy",
    difficulty: "Easy"
  },
  {
    question: "How fast can the brain process an image?",
    options: [
      "13 milliseconds",
      "100 milliseconds",
      "1 second",
      "2 seconds"
    ],
    answer: 0,
    funFact: "Your brain can process an image in just 13 milliseconds - that's faster than the blink of an eye!",
    image: "https://source.unsplash.com/random/800x400/?vision",
    category: "Brain Speed",
    difficulty: "Hard"
  }
]

export function BrainTrivia() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFunFact, setShowFunFact] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    if (index === triviaQuestions[currentQuestion].answer) {
      setScore(score + 1)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      })
    }
    setTimeout(() => {
      setShowFunFact(true)
    }, 1000)
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setShowFunFact(false)
    setTimeLeft(30)
    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCurrentQuestion(0)
      setScore(0)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
      setShowFunFact(false)
      setTimeLeft(30)
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Brain className="w-8 h-8 text-purple-500" />
            Brain Trivia Challenge
          </h2>
          <p className="text-muted-foreground">
            Test your knowledge about the amazing human brain!
          </p>
          <div className="mt-2 text-sm font-medium">
            Score: {score}/{triviaQuestions.length}
          </div>
        </motion.div>

        <Card className="p-6 relative overflow-hidden">
          <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src={triviaQuestions[currentQuestion].image}
              alt={triviaQuestions[currentQuestion].question}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-yellow-500" : ""}
              >
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                {triviaQuestions[currentQuestion].category}
              </div>
              <div className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                {triviaQuestions[currentQuestion].difficulty}
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span className="text-sm">{timeLeft}s</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold">
                {triviaQuestions[currentQuestion].question}
              </h3>

              <div className="grid gap-4">
                {triviaQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={option}
                    variant={selectedAnswer === null ? "outline" : 
                            index === triviaQuestions[currentQuestion].answer ? "default" :
                            selectedAnswer === index ? "destructive" : "outline"}
                    className="w-full text-left justify-start h-auto py-4 px-6"
                    onClick={() => selectedAnswer === null && handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              <AnimatePresence>
                {showFunFact && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg mt-4"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                      <p className="text-sm">
                        {triviaQuestions[currentQuestion].funFact}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={selectedAnswer === null && !showFunFact}
            >
              {currentQuestion === triviaQuestions.length - 1 ? 'Restart' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
} 