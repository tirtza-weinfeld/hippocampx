"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Award, Brain, Share } from "lucide-react"
import { Confetti } from "@/components/calculus/confetti"
import { shareText } from "@/components/calculus/utility/share-utils"

export function MathChallengeOfDay() {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [shareError, setShareError] = useState<string | null>(null)

  const challenges = [
    {
      question: "If f(x) = x² and g(x) = 2x+1, what is f(g(3))?",
      hint: "First calculate g(3), then apply f to that result.",
      answer: "49",
      explanation: "g(3) = 2×3+1 = 7. Then f(g(3)) = f(7) = 7² = 49",
    },
    {
      question: "What is the derivative of f(x) = x³?",
      hint: "Use the power rule: the derivative of xⁿ is n×xⁿ⁻¹",
      answer: "3x²",
      explanation: "Using the power rule: d/dx(x³) = 3×x²",
    },
    {
      question: "The tangent line to y = x² at x = 2 has what slope?",
      hint: "The slope of the tangent line is given by the derivative evaluated at x = 2.",
      answer: "4",
      explanation: "The derivative of x² is 2x. At x = 2, the slope is 2×2 = 4.",
    },
    {
      question: "What is ∫(2x + 3) dx?",
      hint: "Integrate each term separately using the power rule for integration.",
      answer: "x² + 3x + C",
      explanation: "∫(2x + 3) dx = 2∫x dx + 3∫dx = 2(x²/2) + 3x + C = x² + 3x + C",
    },
    {
      question: "If the derivative of f(x) is 3x² and f(0) = 5, what is f(x)?",
      hint: "First integrate the derivative, then use f(0) = 5 to find the constant of integration.",
      answer: "x³ + 5",
      explanation: "∫3x² dx = x³ + C. Since f(0) = 5, we have 0³ + C = 5, so C = 5. Therefore f(x) = x³ + 5.",
    },
    {
      question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
      hint: "Try factoring the numerator to eliminate the zero in the denominator.",
      answer: "2",
      explanation:
        "(x² - 1)/(x - 1) = (x - 1)(x + 1)/(x - 1) = x + 1 for x ≠ 1. As x approaches 1, this approaches 1 + 1 = 2.",
    },
    {
      question: "Find the area under the curve y = x² from x = 0 to x = 2.",
      hint: "Use the definite integral: ∫₀² x² dx",
      answer: "8/3",
      explanation: "∫₀² x² dx = [x³/3]₀² = 2³/3 - 0³/3 = 8/3 - 0 = 8/3",
    },
  ]

  // Get today's challenge based on date
  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setChallengeIndex(dayOfYear % challenges.length)
  }, [challenges.length])

  const currentChallenge = challenges[challengeIndex]

  const revealAnswer = () => {
    setShowAnswer(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 100)
  }

  const handleShare = async () => {
    setShareError(null)
    try {
      // Ensure this is triggered by a user action (the button click)
      const result = await shareText({
        title: "Daily Math Challenge from CalKids",
        text: `Today's challenge: ${currentChallenge.question}\nCan you solve it? #CalKids #MathChallenge`,
      })

      if (!result) {
        setShareError("Unable to share. The content has been copied to your clipboard instead.")
      }
    } catch (error) {
      console.error("Error sharing challenge:", error)
      setShareError("Unable to share. Please try again.")
    }
  }

  return (
    <section className="py-8">
      <Confetti trigger={showConfetti} count={75} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-2 border-border overflow-hidden bg-background/60 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600/10 to-teal-600/10 pb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <CardTitle>Today&apos;s Calculus Challenge</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="space-y-4">
                <div className="text-xl font-medium">{currentChallenge.question}</div>

                {!showAnswer && (
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
                    <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium mb-1">Hint:</div>
                      <p>{currentChallenge.hint}</p>
                    </div>
                  </div>
                )}

                {showAnswer ? (
                  <motion.div
                    className="p-4 rounded-md bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-green-600 dark:text-green-400 mb-1">
                          Answer: {currentChallenge.answer}
                        </div>
                        <p className="text-sm">{currentChallenge.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={revealAnswer}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                    >
                      Reveal Answer
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare} className="gap-1 w-full md:w-auto">
                      <Share className="h-3 w-3" />
                      Share
                    </Button>

                    {shareError && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{shareError}</p>}
                  </div>
                )}
              </div>

              <div className="hidden md:flex items-center justify-center">
                <div className="w-40 h-40 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{showAnswer ? currentChallenge.answer : "?"}</div>
                    <div className="text-sm mt-2 text-foreground/60">Today&apos;s Challenge</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

