"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Trophy, ArrowRight, RotateCcw, Brain, Sparkles, Lightbulb, Check, X } from "lucide-react"
import { motion } from "framer-motion"

type Question = {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export default function AIQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const questions: Question[] = [
    {
      id: 1,
      text: "What does AI stand for?",
      options: ["Automatic Intelligence", "Artificial Intelligence", "Advanced Internet", "Automated Information"],
      correctAnswer: 1,
      explanation: "AI stands for Artificial Intelligence, which is teaching computers to think and learn like humans.",
    },
    {
      id: 2,
      text: "Which of these is an example of AI?",
      options: ["A regular calculator", "A simple website", "A voice assistant like Siri", "A keyboard"],
      correctAnswer: 2,
      explanation: "Voice assistants like Siri use AI to understand your voice and respond to your questions.",
    },
    {
      id: 3,
      text: "What does ML stand for in AI?",
      options: ["Multiple Languages", "Machine Learning", "Memory Logic", "Modern Listing"],
      correctAnswer: 1,
      explanation:
        "ML stands for Machine Learning, which is how computers learn from examples instead of being explicitly programmed.",
    },
    {
      id: 4,
      text: "How do computers 'learn' in machine learning?",
      options: ["By reading books", "By looking at lots of examples", "By talking to humans", "By watching videos"],
      correctAnswer: 1,
      explanation:
        "In machine learning, computers learn by analyzing patterns in lots of examples, just like how you might learn to recognize animals by seeing many pictures of them.",
    },
    {
      id: 5,
      text: "What is Generative AI used for?",
      options: [
        "Only for recognizing images",
        "Only for playing games",
        "Creating new content like art, music, and text",
        "Only for solving math problems",
      ],
      correctAnswer: 2,
      explanation:
        "Generative AI can create brand new content like images, stories, music, and more that never existed before!",
    },
    {
      id: 6,
      text: "What is a neural network inspired by?",
      options: ["Computer circuits", "The human brain", "Telephone networks", "Spider webs"],
      correctAnswer: 1,
      explanation:
        "Neural networks are inspired by how the human brain works, with interconnected 'neurons' that process information.",
    },
    {
      id: 7,
      text: "Which of these is NOT something AI can currently do well?",
      options: [
        "Recognize faces in photos",
        "Translate languages",
        "Understand human emotions perfectly",
        "Play chess",
      ],
      correctAnswer: 2,
      explanation:
        "While AI can recognize basic emotions from facial expressions, truly understanding human emotions perfectly is still very difficult for AI systems.",
    },
  ]

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = () => {
    if (selectedOption === null) return

    setIsAnswered(true)
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold gradient-text gradient-orange-red mb-4">Test Your AI Knowledge!</h2>
        <p className="text-lg dark:text-gray-300">Take this fun quiz to see how much you've learned about AI and ML!</p>
      </div>

      {!quizCompleted ? (
        <Card className="hover-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Brain className="h-6 w-6 mr-2" />
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <div className="text-lg font-medium bg-white text-orange-600 px-3 py-1 rounded-full">
                Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="text-xl font-medium dark:text-white">{currentQuestion.text}</div>

            <RadioGroup
              value={selectedOption?.toString()}
              onValueChange={(value) => setSelectedOption(Number.parseInt(value))}
              disabled={isAnswered}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => !isAnswered && setSelectedOption(index)}
                  className={`flex items-center space-x-2 p-4 rounded-lg border transition-all ${
                    isAnswered && index === currentQuestion.correctAnswer
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-sm"
                      : isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer
                        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  } ${!isAnswered ? "cursor-pointer" : ""}`}
                  role="button"
                  aria-disabled={isAnswered}
                  tabIndex={isAnswered ? -1 : 0}
                  onKeyDown={(e) => {
                    if (!isAnswered && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault()
                      setSelectedOption(index)
                    }
                  }}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${currentQuestion.id}-${index}`}
                    disabled={isAnswered}
                    className={isAnswered && index === currentQuestion.correctAnswer ? "text-green-600" : ""}
                    aria-labelledby={`label-${currentQuestion.id}-${index}`}
                  />
                  <Label
                    htmlFor={`option-${currentQuestion.id}-${index}`}
                    id={`label-${currentQuestion.id}-${index}`}
                    className="flex-1 cursor-pointer dark:text-gray-200"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {isAnswered && (
              <div
                className={`p-4 rounded-lg animate-fadeIn ${
                  selectedOption === currentQuestion.correctAnswer
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                }`}
              >
                <p className="font-medium text-lg mb-2 flex items-center">
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <>
                      <Check className="h-5 w-5 mr-2" /> Correct!
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5 mr-2" /> Not quite right.
                    </>
                  )}
                </p>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between p-6 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700">
            <Button variant="outline" onClick={restartQuiz} className="flex items-center" aria-label="Restart quiz">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>

            <div className="flex gap-2">
              {!isAnswered ? (
                <Button
                  onClick={handleAnswer}
                  disabled={selectedOption === null}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  aria-label="Check your answer"
                >
                  Check Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  aria-label={
                    currentQuestionIndex < questions.length - 1 ? "Go to next question" : "See your quiz results"
                  }
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    "See Results"
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="text-center hover-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 mr-2" />
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <Trophy className="h-24 w-24 text-yellow-500 animate-float" />
              </motion.div>
            </div>

            <div>
              <p className="text-4xl font-bold mb-3 gradient-text gradient-orange-red">
                Your Score: {score}/{questions.length}
              </p>
              <p className="text-xl dark:text-gray-300">
                {score === questions.length
                  ? "Perfect score! You're an AI expert!"
                  : score >= questions.length * 0.8
                    ? "Great job! You know a lot about AI!"
                    : score >= questions.length * 0.6
                      ? "Good effort! You're learning about AI!"
                      : "Keep learning about AI - you'll get better!"}
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800 text-left">
              <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                What to Learn Next
              </h4>
              <p className="dark:text-gray-300">
                There's so much more to discover about AI! You could learn about how AI is used in medicine, how
                self-driving cars work, or even try creating your own simple AI projects!
              </p>
            </div>
          </CardContent>
          <CardFooter className="justify-center p-6 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700">
            <Button
              onClick={restartQuiz}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              aria-label="Try the quiz again"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800 hover-card">
          <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-300 mb-3 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
            Fun AI Facts
          </h3>
          <ul className="list-disc list-inside space-y-2 dark:text-gray-300">
            <li>The term "Artificial Intelligence" was first used in 1956!</li>
            <li>AI can help scientists discover new medicines and treatments.</li>
            <li>Self-driving cars use AI to understand the road and make decisions.</li>
            <li>AI can create art, music, and even write stories!</li>
            <li>Some robots use AI to learn how to walk and move around obstacles.</li>
          </ul>
        </div>

        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 hover-card">
          <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            AI in Your Future
          </h3>
          <p className="mb-3 dark:text-gray-300">
            AI will be an important part of your future! Many jobs in the future will involve working with AI in some
            way, and understanding how it works will give you a head start.
          </p>
          <p className="dark:text-gray-300">
            Learning about AI now is like learning to read and write - it's a basic skill that will help you in many
            different areas of life!
          </p>
        </div>
      </div>
    </div>
  )
}

