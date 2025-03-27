"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Award, Brain, ChevronRight, History, Lightbulb, Rotate3dIcon as Rotate, Trophy } from "lucide-react"
import confetti from "canvas-confetti"

// Trivia questions about famous calculus mathematicians
const triviaQuestions = [
  {
    id: 1,
    question: "Who is credited with developing calculus independently of Newton?",
    options: ["Gottfried Wilhelm Leibniz", "Leonhard Euler", "Joseph-Louis Lagrange", "Bernhard Riemann"],
    correctAnswer: "Gottfried Wilhelm Leibniz",
    fact: "Leibniz developed calculus independently of Newton in the 1670s. His notation (dy/dx) is the one we primarily use today.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <circle cx="100" cy="80" r="40" fill="#f0e6d2" stroke="#6b7280" strokeWidth="1" />
        <ellipse cx="100" cy="70" rx="30" ry="35" fill="#f0e6d2" />
        <path d="M70 80 Q100 120 130 80" fill="none" stroke="#6b7280" strokeWidth="1" />
        <path d="M60 60 Q100 110 140 60" fill="none" stroke="#6b7280" strokeWidth="1" />
        <path d="M80 120 C 90 140, 110 140, 120 120" fill="none" stroke="#6b7280" strokeWidth="2" />
        <circle cx="85" cy="75" r="5" fill="#6b7280" />
        <circle cx="115" cy="75" r="5" fill="#6b7280" />
        <path d="M70 40 C 80 20, 120 20, 130 40" fill="none" stroke="#6b7280" strokeWidth="2" />
        <path d="M60 140 C 80 180, 120 180, 140 140" fill="#6b7280" />
        <text x="100" y="190" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          G.W. Leibniz
        </text>
      </svg>
    ),
  },
  {
    id: 2,
    question: "Which mathematician is known for his 'Method of Fluxions' - an early form of calculus?",
    options: ["Isaac Newton", "Blaise Pascal", "René Descartes", "Pierre de Fermat"],
    correctAnswer: "Isaac Newton",
    fact: "Newton developed his 'Method of Fluxions' (calculus) in the 1660s, though he didn't publish it until much later. He used it to solve problems in physics and astronomy.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <circle cx="100" cy="80" r="40" fill="#f0e6d2" stroke="#6b7280" strokeWidth="1" />
        <path d="M60 80 C 70 130, 130 130, 140 80" fill="#f0e6d2" stroke="#6b7280" strokeWidth="1" />
        <path d="M70 50 C 80 30, 120 30, 130 50" fill="none" stroke="#6b7280" strokeWidth="2" />
        <ellipse cx="100" cy="70" rx="30" ry="35" fill="#f0e6d2" />
        <path d="M80 120 C 90 140, 110 140, 120 120" fill="none" stroke="#6b7280" strokeWidth="2" />
        <circle cx="85" cy="75" r="5" fill="#6b7280" />
        <circle cx="115" cy="75" r="5" fill="#6b7280" />
        <path d="M60 140 C 80 180, 120 180, 140 140" fill="#6b7280" />
        <path d="M70 90 Q 100 100 130 90" fill="none" stroke="#6b7280" strokeWidth="1" />
        <path d="M60 60 Q 100 90 140 60" fill="none" stroke="#6b7280" strokeWidth="1" />
        <text x="100" y="190" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          Isaac Newton
        </text>
      </svg>
    ),
  },
  {
    id: 3,
    question: "Which mathematician's name is associated with the number 'e' (approximately 2.71828)?",
    options: ["Leonhard Euler", "Carl Friedrich Gauss", "Pierre-Simon Laplace", "Jakob Bernoulli"],
    correctAnswer: "Leonhard Euler",
    fact: "Euler introduced the constant 'e' in the 1720s. He made significant contributions to calculus, including work on differential equations and the calculus of variations.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <circle cx="100" cy="80" r="40" fill="#f0e6d2" stroke="#6b7280" strokeWidth="1" />
        <path d="M60 80 C 70 130, 130 130, 140 80" fill="#f0e6d2" stroke="#6b7280" strokeWidth="1" />
        <ellipse cx="100" cy="70" rx="30" ry="35" fill="#f0e6d2" />
        <path d="M80 120 C 90 140, 110 140, 120 120" fill="none" stroke="#6b7280" strokeWidth="2" />
        <circle cx="85" cy="75" r="5" fill="#6b7280" />
        <circle cx="115" cy="75" r="5" fill="#6b7280" />
        <path d="M60 140 C 80 180, 120 180, 140 140" fill="#6b7280" />
        <path d="M70 90 Q 100 100 130 90" fill="none" stroke="#6b7280" strokeWidth="1" />
        <path d="M60 40 Q 100 20 140 40" fill="none" stroke="#6b7280" strokeWidth="2" />
        <text x="100" y="190" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          Leonhard Euler
        </text>
        <text x="100" y="60" textAnchor="middle" fill="#6b7280" fontFamily="serif" fontSize="24">
          e
        </text>
      </svg>
    ),
  },
  {
    id: 4,
    question: "Who developed the concept of 'differentials' in calculus?",
    options: ["Gottfried Wilhelm Leibniz", "Isaac Newton", "Maria Agnesi", "Guillaume de l'Hôpital"],
    correctAnswer: "Gottfried Wilhelm Leibniz",
    fact: "Leibniz introduced the concept of differentials (dx, dy) and the integral sign ∫ that we still use today. His approach to calculus was more focused on formalism than Newton's.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <text x="100" y="100" textAnchor="middle" fill="#6b7280" fontFamily="serif" fontSize="72">
          ∫
        </text>
        <text x="140" y="80" textAnchor="middle" fill="#6b7280" fontFamily="serif" fontSize="24">
          dx
        </text>
        <text x="100" y="150" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          Leibniz Notation
        </text>
      </svg>
    ),
  },
  {
    id: 5,
    question:
      "Which mathematician wrote 'Philosophiæ Naturalis Principia Mathematica', using calculus to explain the laws of motion and gravitation?",
    options: ["Isaac Newton", "Gottfried Wilhelm Leibniz", "Leonhard Euler", "Joseph-Louis Lagrange"],
    correctAnswer: "Isaac Newton",
    fact: "Newton's 'Principia' (1687) is considered one of the most important works in the history of science. In it, he used his calculus to derive his laws of motion and universal gravitation.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <circle cx="100" cy="50" r="30" fill="#f0e6d2" stroke="#6b7280" strokeWidth="1" />
        <circle cx="100" cy="140" r="40" fill="#d1d5db" stroke="#6b7280" strokeWidth="1" />
        <line x1="100" y1="80" x2="100" y2="100" stroke="#6b7280" strokeWidth="2" />
        <path d="M70 100 Q 100 180 130 100" fill="none" stroke="#6b7280" strokeWidth="2" />
        <text x="100" y="50" textAnchor="middle" fill="#6b7280" fontFamily="serif" fontSize="12">
          F=ma
        </text>
        <text x="100" y="190" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          Principia Mathematica
        </text>
      </svg>
    ),
  },
  {
    id: 6,
    question: "Who is known for the 'Witch of Agnesi' curve and wrote one of the first calculus textbooks?",
    options: ["Maria Gaetana Agnesi", "Sophie Germain", "Émilie du Châtelet", "Ada Lovelace"],
    correctAnswer: "Maria Gaetana Agnesi",
    fact: "Maria Agnesi (1718-1799) wrote 'Analytical Institutions', an important early calculus textbook. The 'Witch of Agnesi' is a cubic curve that appears in her work.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <line x1="20" y1="100" x2="180" y2="100" stroke="#6b7280" strokeWidth="1" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="#6b7280" strokeWidth="1" />
        <path d="M20 100 Q 100 20, 180 100" fill="none" stroke="#9c4221" strokeWidth="2" />
        <text x="150" y="50" fill="#9c4221" fontFamily="serif" fontSize="12">
          Witch of Agnesi
        </text>
        <text x="100" y="190" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          Maria Gaetana Agnesi
        </text>
      </svg>
    ),
  },
  {
    id: 7,
    question: "Which mathematician is known for his work on the calculus of variations?",
    options: ["Joseph-Louis Lagrange", "Pierre de Fermat", "Blaise Pascal", "Carl Friedrich Gauss"],
    correctAnswer: "Joseph-Louis Lagrange",
    fact: "Lagrange (1736-1813) developed the calculus of variations and made significant contributions to the understanding of differential equations and mechanics.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <path d="M40 120 C 60 80, 140 80, 160 120" fill="none" stroke="#6b7280" strokeWidth="2" />
        <path d="M40 120 C 60 160, 140 160, 160 120" fill="none" stroke="#6b7280" strokeWidth="2" />
        <path d="M40 120 L 160 120" stroke="#6b7280" strokeWidth="1" strokeDasharray="4,4" />
        <text x="100" y="70" textAnchor="middle" fill="#6b7280" fontFamily="serif" fontSize="16">
          δ∫L(q,q̇,t)dt = 0
        </text>
        <text x="100" y="190" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          Joseph-Louis Lagrange
        </text>
      </svg>
    ),
  },
  {
    id: 8,
    question: "Who formulated the 'Fundamental Theorem of Calculus' that connects differentiation and integration?",
    options: ["Isaac Barrow", "James Gregory", "Both of them independently", "Bernhard Riemann"],
    correctAnswer: "Both of them independently",
    fact: "Isaac Barrow and James Gregory both formulated versions of the Fundamental Theorem of Calculus in the 1660s, before Newton and Leibniz fully developed calculus.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <path d="M40 150 C 60 50, 140 50, 160 150" fill="none" stroke="#6b7280" strokeWidth="2" />
        <path d="M40 150 L 160 150" stroke="#6b7280" strokeWidth="1" />
        <path d="M40 150 L 40 50" stroke="#6b7280" strokeWidth="1" />
        <path d="M40 150 C 60 50, 140 50, 160 150" fill="#6b7280" fillOpacity="0.2" />
        <text x="30" y="40" fill="#6b7280" fontFamily="serif" fontSize="16">
          ∫
        </text>
        <text x="170" y="150" fill="#6b7280" fontFamily="serif" fontSize="16">
          d/dx
        </text>
        <text x="100" y="190" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          Fundamental Theorem
        </text>
      </svg>
    ),
  },
  {
    id: 9,
    question: "Which mathematician introduced the δ-ε (delta-epsilon) definition of limits?",
    options: ["Augustin-Louis Cauchy", "Karl Weierstrass", "Bernhard Riemann", "Georg Cantor"],
    correctAnswer: "Augustin-Louis Cauchy",
    fact: "Cauchy introduced the δ-ε definition of limits in the 1820s, which helped place calculus on a rigorous foundation. Weierstrass later refined this approach.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <line x1="20" y1="100" x2="180" y2="100" stroke="#6b7280" strokeWidth="1" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="#6b7280" strokeWidth="1" />
        <path
          d="M20 120 C 60 120, 90 50, 100 50 C 110 50, 140 120, 180 120"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <line x1="90" y1="50" x2="110" y2="50" stroke="#6b7280" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="100" y1="40" x2="100" y2="60" stroke="#6b7280" strokeWidth="1" strokeDasharray="2,2" />
        <text x="90" y="40" fill="#6b7280" fontFamily="serif" fontSize="16">
          δ
        </text>
        <text x="110" y="70" fill="#6b7280" fontFamily="serif" fontSize="16">
          ε
        </text>
        <text x="100" y="190" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          Cauchy&apos;s Limit Definition
        </text>
      </svg>
    ),
  },
  {
    id: 10,
    question: "Who translated and expanded upon Newton's work, helping to spread calculus throughout Europe?",
    options: ["Émilie du Châtelet", "Leonhard Euler", "Joseph-Louis Lagrange", "Pierre-Simon Laplace"],
    correctAnswer: "Émilie du Châtelet",
    fact: "Émilie du Châtelet (1706-1749) translated Newton's Principia into French and added her own commentary, helping to spread calculus throughout Europe. She was one of the few women in science during her time.",
    image: (
      <svg viewBox="0 0 200 200" className="h-40 w-40 mx-auto my-4">
        <circle cx="100" cy="70" r="30" fill="#f0e6d2" stroke="#6b7280" strokeWidth="1" />
        <path d="M70 70 C 80 130, 120 130, 130 70" fill="#f0e6d2" stroke="#6b7280" strokeWidth="1" />
        <path d="M70 130 C 80 180, 120 180, 130 130" fill="#6b7280" />
        <circle cx="90" cy="65" r="3" fill="#6b7280" />
        <circle cx="110" cy="65" r="3" fill="#6b7280" />
        <path d="M90 80 Q 100 85 110 80" fill="none" stroke="#6b7280" strokeWidth="1" />
        <path d="M70 50 C 80 30, 120 30, 130 50" fill="none" stroke="#6b7280" strokeWidth="2" />
        <text x="100" y="190" textAnchor="middle" fill="#4b5563" fontFamily="serif" fontSize="12">
          Émilie du Châtelet
        </text>
      </svg>
    ),
  },
]

export default function CalculusLegendsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [isAnswered, setIsAnswered] = useState(false)
  const [streak, setStreak] = useState(0)
  const [highestStreak, setHighestStreak] = useState(0)

  const handleAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer)
    setIsAnswered(true)

    const correct = answer === triviaQuestions[currentQuestion].correctAnswer

    if (correct) {
      setScore(score + timeLeft * 10)
      setStreak(streak + 1)
      if (streak + 1 > highestStreak) {
        setHighestStreak(streak + 1)
      }

      // Trigger confetti for correct answers
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } else {
      setStreak(0)
    }

    setShowResult(true)
  }, [currentQuestion, score, timeLeft, streak, highestStreak])

  useEffect(() => {
    if (!isAnswered && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered && !gameOver) {
      handleAnswer("")
    }
  }, [timeLeft, isAnswered, gameOver, handleAnswer])

  const nextQuestion = () => {
    setShowResult(false)
    setIsAnswered(false)
    setSelectedAnswer("")
    setTimeLeft(20)

    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setGameOver(true)
    }
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setScore(0)
    setShowResult(false)
    setGameOver(false)
    setTimeLeft(20)
    setIsAnswered(false)
    setStreak(0)
  }

  const getScoreMessage = () => {
    if (score >= 1500) return "Calculus Legend! You're a mathematical genius!"
    if (score >= 1000) return "Calculus Master! Impressive knowledge!"
    if (score >= 500) return "Calculus Scholar! Well done!"
    return "Calculus Apprentice! Keep learning!"
  }

  const getScoreColor = () => {
    if (score >= 1500) return "text-amber-500"
    if (score >= 1000) return "text-violet-500"
    if (score >= 500) return "text-blue-500"
    return "text-green-500"
  }

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-transparent bg-clip-text">
          Calculus Legends Trivia
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Test your knowledge about the brilliant minds behind calculus
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-500" />
          <span className="font-bold">Streak: {streak}</span>
        </div>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-500" />
          <span className="font-bold">Best Streak: {highestStreak}</span>
        </div>
      </div>

      {!gameOver ? (
        <Card className="border-2 border-border shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                Question {currentQuestion + 1} of {triviaQuestions.length}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${timeLeft < 5 ? "text-red-500" : timeLeft < 10 ? "text-amber-500" : "text-green-500"}`}
                >
                  {timeLeft}s
                </span>
              </div>
            </div>
            <Progress value={(timeLeft / 20) * 100} className="h-2" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-xl font-medium mb-6">{triviaQuestions[currentQuestion].question}</div>

            {triviaQuestions[currentQuestion].image}

            <div className="grid gap-3 mt-4">
              {triviaQuestions[currentQuestion].options.map((option) => (
                <Button
                  key={option}
                  variant={
                    showResult
                      ? option === triviaQuestions[currentQuestion].correctAnswer
                        ? "default"
                        : option === selectedAnswer
                          ? "destructive"
                          : "outline"
                      : selectedAnswer === option
                        ? "default"
                        : "outline"
                  }
                  className={`justify-start text-left h-auto py-3 px-4 ${
                    isAnswered && option !== triviaQuestions[currentQuestion].correctAnswer && option !== selectedAnswer
                      ? "opacity-50"
                      : ""
                  }`}
                  onClick={() => !isAnswered && handleAnswer(option)}
                  disabled={isAnswered}
                >
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="mt-6 p-4 rounded-lg bg-muted">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                  <p className="text-sm">{triviaQuestions[currentQuestion].fact}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {showResult && (
              <Button
                onClick={nextQuestion}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              >
                Next Question <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-2 border-border shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Game Complete!</CardTitle>
            <CardDescription>You&apos;ve completed the Calculus Legends Trivia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6">
              <Trophy className="h-20 w-20 text-amber-500 mb-4" />
              <h3 className="text-3xl font-bold">{getScoreMessage()}</h3>
              <p className={`text-2xl font-bold mt-2 ${getScoreColor()}`}>Final Score: {score}</p>
              <p className="text-muted-foreground mt-1">Highest Streak: {highestStreak}</p>
            </div>

            <div className="p-4 rounded-lg bg-muted text-left">
              <div className="flex items-start gap-2">
                <Brain className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  Calculus was developed independently by Isaac Newton and Gottfried Wilhelm Leibniz in the late 17th
                  century. Newton developed his &quot;method of fluxions&quot; to solve problems in physics, while Leibniz focused
                  more on the formalism and notation (like the integral symbol ∫) that we still use today.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={restartGame} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Rotate className="mr-2 h-4 w-4" /> Play Again
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

