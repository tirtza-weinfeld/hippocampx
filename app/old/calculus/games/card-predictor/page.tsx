"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Confetti } from "@/components/old/calculus/confetti"
import { TutorialPopup } from "@/components/old/calculus/tutorial-popup"
import { Timer, Heart, Diamond, Club, Spade } from "lucide-react"
import { PageTransition } from "@/components/old/calculus/page-transition"

// Card types
type Suit = "hearts" | "diamonds" | "clubs" | "spades"
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K"
type Card = {
  suit: Suit
  rank: Rank
  color: string
}

export default function CardPredictorPage() {
  const [gameState, setGameState] = useState<"ready" | "playing" | "result" | "finished">("ready")
  const [deck, setDeck] = useState<Card[]>([])
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [nextCard, setNextCard] = useState<Card | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [prediction, setPrediction] = useState<"higher" | "lower" | "same" | null>(null)
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [maxRounds] = useState(10)
  const [feedback, setFeedback] = useState("")
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // Card values for comparison
  const cardValues = useMemo<Record<Rank, number>>(() => ({
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  }), [])

  function resetDeck() {
    const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"]
    const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    const newDeck: Card[] = []

    for (const suit of suits) {
      for (const rank of ranks) {
        newDeck.push({
          suit,
          rank,
          color: suit === "hearts" || suit === "diamonds" ? "red" : "black",
        })
      }
    }

    // Shuffle the deck
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }

    setDeck(newDeck)
    setCurrentCard(null)
    setNextCard(null)
  }

  // Initialize deck
  useEffect(() => {
    resetDeck()
  }, [])

  const makePrediction = useCallback((pred: "higher" | "lower" | "same") => {
    if (gameState !== "playing" || !currentCard || isDrawing) return

    setIsDrawing(true)
    setPrediction(pred)
    setTimerActive(false)

    // Draw the next card
    setTimeout(() => {
      if (deck.length === 0) {
        setGameState("finished")
        return
      }

      const card = deck[0]
      const newDeck = [...deck.slice(1)]

      setNextCard(card)
      setDeck(newDeck)

      // Check if prediction is correct
      const currentValue = cardValues[currentCard.rank]
      const nextValue = cardValues[card.rank]

      let isCorrect = false
      if (pred === "higher" && nextValue > currentValue) isCorrect = true
      if (pred === "lower" && nextValue < currentValue) isCorrect = true
      if (pred === "same" && nextValue === currentValue) isCorrect = true

      if (isCorrect) {
        const roundScore = pred === "same" ? 30 : 10
        setScore((prev) => prev + roundScore)
        setStreak((prev) => prev + 1)
        if (streak + 1 > bestStreak) {
          setBestStreak(streak + 1)
          if (streak + 1 >= 3) {
            setShowConfetti(true)
          }
        }
        setFeedback(`Correct! You predicted ${pred} and the next card was ${pred}. +${roundScore} points.`)
      } else {
        setStreak(0)
        setFeedback(
          `Not quite! You predicted ${pred}, but the next card was ${
            nextValue > currentValue ? "higher" : nextValue < currentValue ? "lower" : "the same"
          }.`,
        )
      }

      setGameState("result")
      setIsDrawing(false)
    }, 1000)
  }, [gameState, currentCard, isDrawing, deck, streak, bestStreak, cardValues])

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)

      if (timeLeft === 1) {
        const options: ("higher" | "lower" | "same")[] = ["higher", "lower", "same"]
        const randomPrediction = options[Math.floor(Math.random() * options.length)]
        makePrediction(randomPrediction)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [timerActive, timeLeft, makePrediction])

  // Start a new game
  const startGame = () => {
    resetDeck()
    setGameState("playing")
    setScore(0)
    setRound(1)
    setStreak(0)
    setBestStreak(0)
    drawFirstCard()
  }

  // Draw the first card
  const drawFirstCard = () => {
    if (deck.length === 0) return

    const card = deck[0]
    const newDeck = [...deck.slice(1)]

    setCurrentCard(card)
    setDeck(newDeck)
    setTimeLeft(10)
    setTimerActive(true)
  }

  // Next round
  const nextRound = () => {
    if (round >= maxRounds) {
      setGameState("finished")
      // setShowReward(true)
      setShowConfetti(true)
    } else {
      setRound((prev) => prev + 1)
      setCurrentCard(nextCard)
      setNextCard(null)
      setGameState("playing")
      setPrediction(null)
      setFeedback("")
      setTimeLeft(10)
      setTimerActive(true)
    }
  }

  // Get card symbol
  const getCardSymbol = (suit: Suit) => {
    switch (suit) {
      case "hearts":
        return <Heart className="h-6 w-6 fill-current" />
      case "diamonds":
        return <Diamond className="h-6 w-6 fill-current" />
      case "clubs":
        return <Club className="h-6 w-6 fill-current" />
      case "spades":
        return <Spade className="h-6 w-6 fill-current" />
    }
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Card Predictor!",
      content: "Test your prediction skills with this fast-paced card game.",
      emoji: "🃏",
    },
    {
      title: "How to Play",
      content:
        "You'll be shown a card, and you need to predict if the next card will be higher, lower, or the same value.",
      emoji: "🔮",
    },
    {
      title: "Card Values",
      content: "Cards are ranked from 2 (lowest) to Ace (highest). The suit doesn't matter for comparison.",
      emoji: "👑",
    },
    {
      title: "Time Pressure",
      content: "You only have 10 seconds to make each prediction. If time runs out, a random prediction will be made!",
      emoji: "⏱️",
    },
    {
      title: "Let's Play!",
      content: "Click 'Start Game' to begin your card prediction challenge!",
      emoji: "🎮",
    },
  ]

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:py-12">
        <TutorialPopup steps={tutorialSteps} gameName="card-predictor" />
        <Confetti trigger={showConfetti} count={150} />
        {/* <RewardBadge
          title={gameState === "finished" ? "Card Predictor Master!" : "Prediction Streak!"}
          description={
            gameState === "finished"
              ? `You finished the game with ${score} points!`
              : `Amazing! You correctly predicted ${bestStreak} cards in a row!`
          }
          icon="trophy"
          color="green"
          show={showReward}
          onClose={() => setShowReward(false)}
        /> */}

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-transparent bg-clip-text">
              Card Predictor
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Predict if the next card will be higher, lower, or the same value!
            </p>
          </div>

          <UICard className="border-2 bg-background/60 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Game Progress</CardTitle>
                <div className="flex items-center gap-4">
                  <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">
                    Round: {round}/{maxRounds}
                  </span>
                  <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">
                    Score: {score}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{Math.round((round / maxRounds) * 100)}%</span>
                </div>
                <Progress value={(round / maxRounds) * 100} className="h-2" indicatorClassName="bg-green-500" />
              </div>
            </CardContent>
          </UICard>

          {/* Game content */}
          <UICard className="border-2 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {gameState === "ready"
                    ? "Ready to Play?"
                    : gameState === "playing"
                      ? "Make Your Prediction"
                      : gameState === "result"
                        ? "Result"
                        : "Game Complete!"}
                </CardTitle>
                {gameState === "playing" && (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Timer className="h-4 w-4" />
                    <span className={`${timeLeft <= 3 ? "text-red-500" : ""}`}>{timeLeft}s</span>
                  </div>
                )}
              </div>
              <CardDescription>
                {gameState === "ready"
                  ? "Test your prediction skills with this fast-paced card game"
                  : gameState === "playing"
                    ? "Will the next card be higher, lower, or the same value?"
                    : gameState === "result"
                      ? "Let's see if your prediction was correct"
                      : "Great job! Let's see how you did."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gameState === "ready" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-lg">Predict if the next card will be higher, lower, or the same value!</p>
                    <p className="text-sm text-muted-foreground">You have 10 seconds to make each prediction.</p>
                  </div>
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full"
                  >
                    Start Game
                  </Button>
                </div>
              )}

              {(gameState === "playing" || gameState === "result") && (
                <div className="space-y-6">
                  <div className="flex justify-center items-center gap-8 py-6">
                    {/* Current card */}
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-medium mb-2">Current Card</div>
                      <div className="relative h-48 w-32 md:h-64 md:w-44">
                        <AnimatePresence>
                          {currentCard && (
                            <motion.div
                              className={`absolute inset-0 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg flex flex-col items-center justify-center`}
                              initial={{ opacity: 0, rotateY: -90 }}
                              animate={{ opacity: 1, rotateY: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="absolute top-2 left-2 text-2xl font-bold">
                                <span
                                  className={
                                    currentCard.color === "red" ? "text-red-500" : "text-black dark:text-white"
                                  }
                                >
                                  {currentCard.rank}
                                </span>
                              </div>
                              <div className="absolute bottom-2 right-2 text-2xl font-bold">
                                <span
                                  className={
                                    currentCard.color === "red" ? "text-red-500" : "text-black dark:text-white"
                                  }
                                >
                                  {currentCard.rank}
                                </span>
                              </div>
                              <div
                                className={`text-6xl ${currentCard.color === "red" ? "text-red-500" : "text-black dark:text-white"}`}
                              >
                                {getCardSymbol(currentCard.suit)}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Next card (only shown in result state) */}
                    {gameState === "result" && (
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium mb-2">Next Card</div>
                        <div className="relative h-48 w-32 md:h-64 md:w-44">
                          <AnimatePresence>
                            {nextCard && (
                              <motion.div
                                className={`absolute inset-0 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg flex flex-col items-center justify-center`}
                                initial={{ opacity: 0, rotateY: -90 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="absolute top-2 left-2 text-2xl font-bold">
                                  <span
                                    className={nextCard.color === "red" ? "text-red-500" : "text-black dark:text-white"}
                                  >
                                    {nextCard.rank}
                                  </span>
                                </div>
                                <div className="absolute bottom-2 right-2 text-2xl font-bold">
                                  <span
                                    className={nextCard.color === "red" ? "text-red-500" : "text-black dark:text-white"}
                                  >
                                    {nextCard.rank}
                                  </span>
                                </div>
                                <div
                                  className={`text-6xl ${nextCard.color === "red" ? "text-red-500" : "text-black dark:text-white"}`}
                                >
                                  {getCardSymbol(nextCard.suit)}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Next card placeholder (only shown in playing state) */}
                    {gameState === "playing" && (
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium mb-2">Next Card</div>
                        <div className="relative h-48 w-32 md:h-64 md:w-44 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-4xl text-gray-300 dark:text-gray-700">?</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {gameState === "playing" && (
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => makePrediction("lower")}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full"
                      >
                        Lower
                      </Button>
                      <Button
                        onClick={() => makePrediction("same")}
                        className="bg-amber-500 hover:bg-amber-600 text-white rounded-full"
                      >
                        Same
                      </Button>
                      <Button
                        onClick={() => makePrediction("higher")}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                      >
                        Higher
                      </Button>
                    </div>
                  )}

                  {gameState === "result" && (
                    <>
                      <motion.div
                        className={`p-4 rounded-lg ${
                          (prediction === "higher" &&
                            cardValues[nextCard?.rank || "2"] > cardValues[currentCard?.rank || "2"]) ||
                          (prediction === "lower" &&
                            cardValues[nextCard?.rank || "2"] < cardValues[currentCard?.rank || "2"]) ||
                          (
                            prediction === "same" &&
                              cardValues[nextCard?.rank || "2"] === cardValues[currentCard?.rank || "2"]
                          )
                            ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                            : "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-center font-medium">{feedback}</p>
                      </motion.div>

                      <div className="flex justify-center">
                        <Button
                          onClick={nextRound}
                          size="lg"
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full"
                        >
                          {round >= maxRounds ? "See Final Results" : "Next Round"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {gameState === "finished" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-bold">🎉 Game Complete! 🎉</p>
                    <p className="text-lg">
                      You finished with a score of{" "}
                      <span className="font-bold text-green-600 dark:text-green-400">{score}</span> points!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Best streak: {bestStreak} correct predictions in a row
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg max-w-md">
                    <h3 className="font-medium mb-2 text-center">Card Predictor Ranks</h3>
                    <div className="space-y-2">
                      <div
                        className={`p-2 rounded ${score >= 200 ? "bg-green-100 dark:bg-green-900/30" : "opacity-50"}`}
                      >
                        <div className="flex justify-between">
                          <span>Psychic Card Reader</span>
                          <span>200+ points</span>
                        </div>
                      </div>
                      <div
                        className={`p-2 rounded ${score >= 150 && score < 200 ? "bg-green-100 dark:bg-green-900/30" : "opacity-50"}`}
                      >
                        <div className="flex justify-between">
                          <span>Card Prediction Expert</span>
                          <span>150-199 points</span>
                        </div>
                      </div>
                      <div
                        className={`p-2 rounded ${score >= 100 && score < 150 ? "bg-green-100 dark:bg-green-900/30" : "opacity-50"}`}
                      >
                        <div className="flex justify-between">
                          <span>Card Prediction Pro</span>
                          <span>100-149 points</span>
                        </div>
                      </div>
                      <div
                        className={`p-2 rounded ${score < 100 ? "bg-green-100 dark:bg-green-900/30" : "opacity-50"}`}
                      >
                        <div className="flex justify-between">
                          <span>Card Prediction Novice</span>
                          <span>0-99 points</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full"
                  >
                    Play Again
                  </Button>
                </div>
              )}
            </CardContent>
          </UICard>
        </div>
      </div>
    </PageTransition>
  )
}

