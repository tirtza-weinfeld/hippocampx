"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card as UICard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { PieChart } from "@/components/calculus/data-visualization"
import { PageTransition } from "@/components/calculus/page-transition"

// Card types
type Suit = "hearts" | "diamonds" | "clubs" | "spades"
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K"
type Card = {
  suit: Suit
  rank: Rank
  color: string
}

export default function CardProbabilityPage() {
  const [deck, setDeck] = useState<Card[]>([])
  const [drawnCards, setDrawnCards] = useState<Card[]>([])
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState("experiment")
  const [prediction, setPrediction] = useState<"red" | "black" | null>(null)
  const [correctPredictions, setCorrectPredictions] = useState(0)
  const [totalPredictions, setTotalPredictions] = useState(0)

  // Initialize deck
  useEffect(() => {
    resetDeck()
  }, [])

  const resetDeck = () => {
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
    setDrawnCards([])
    setCurrentCard(null)
  }

  // Draw a card
  const drawCard = () => {
    if (isDrawing || deck.length === 0) return

    setIsDrawing(true)

    // Animate card drawing
    setTimeout(() => {
      const card = deck[0]
      const newDeck = [...deck.slice(1)]

      setCurrentCard(card)
      setDeck(newDeck)
      setDrawnCards((prev) => [...prev, card])

      // Check prediction
      if (prediction) {
        setTotalPredictions((prev) => prev + 1)
        if (card.color === prediction) {
          setCorrectPredictions((prev) => prev + 1)
          if (drawnCards.length % 10 === 9) {
            // Every 10 cards
            // setShowReward(true)
            setShowConfetti(true)
          }
        }
      }

      setIsDrawing(false)
      setPrediction(null)
    }, 500)
  }

  // Calculate statistics
  // const totalCards = 52
  const remainingCards = deck.length
  const drawnCardsCount = drawnCards.length

  const redCards = drawnCards.filter((card) => card.color === "red").length
  const blackCards = drawnCards.filter((card) => card.color === "black").length

  const redPercentage = drawnCardsCount > 0 ? (redCards / drawnCardsCount) * 100 : 0
  const blackPercentage = drawnCardsCount > 0 ? (blackCards / drawnCardsCount) * 100 : 0

  // Remaining probabilities
  const remainingRedCards = 26 - redCards
  const remainingBlackCards = 26 - blackCards

  const redProbability = remainingCards > 0 ? (remainingRedCards / remainingCards) * 100 : 0
  const blackProbability = remainingCards > 0 ? (remainingBlackCards / remainingCards) * 100 : 0

  // Chart data
  const pieChartData = [
    { name: "Red", value: redCards },
    { name: "Black", value: blackCards },
  ]

  // Get card symbol
  const getCardSymbol = (suit: Suit) => {
    switch (suit) {
      case "hearts":
        return "♥"
      case "diamonds":
        return "♦"
      case "clubs":
        return "♣"
      case "spades":
        return "♠"
    }
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Card Probability!",
      content: "This experiment helps you understand probability using a deck of cards.",
      emoji: "🃏",
    },
    {
      title: "Make a Prediction",
      content: "Before drawing a card, predict whether it will be red or black.",
      emoji: "🔮",
    },
    {
      title: "Draw a Card",
      content: "Click the 'Draw Card' button to draw a card from the deck.",
      emoji: "👆",
    },
    {
      title: "Changing Probabilities",
      content: "As you draw cards, the probability of drawing red or black changes based on what's left in the deck.",
      emoji: "📊",
    },
    {
      title: "Analyze the Results",
      content: "Switch to the 'Data' tab to see statistics about the cards you've drawn.",
      emoji: "📈",
    },
  ]

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:py-12">
        <TutorialPopup steps={tutorialSteps} gameName="card-probability" />
        <Confetti trigger={showConfetti} count={100} />
        {/* <RewardBadge
          title="Card Shark!"
          description={`You've drawn ${drawnCardsCount} cards with ${correctPredictions} correct predictions!`}
          icon="award"
          color="green"
          show={showReward}
          onClose={() => setShowReward(false)}
        /> */}

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-transparent bg-clip-text">
              Card Probability Experiment
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Draw cards from a deck to explore changing probabilities
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="experiment">Experiment</TabsTrigger>
              <TabsTrigger value="data">Data & Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="experiment" className="mt-6">
              <UICard className="border-2 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Card Drawing Experiment</CardTitle>
                  <CardDescription>Draw cards from a deck and observe how probabilities change</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Card display */}
                  <div className="flex justify-center">
                    <div className="relative h-64 w-48">
                      {/* Deck */}
                      <motion.div
                        className="absolute inset-0 bg-green-800 rounded-lg border-2 border-white dark:border-gray-800 shadow-lg"
                        style={{
                          zIndex: 1,
                          opacity: deck.length > 0 ? 1 : 0.3,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-2xl font-bold">{deck.length}</div>
                            <div className="text-sm">cards left</div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Current card */}
                      <AnimatePresence>
                        {currentCard && (
                          <motion.div
                            className={`absolute inset-0 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg flex flex-col items-center justify-center`}
                            initial={{ x: 0, y: 0, opacity: 0, rotateY: -90 }}
                            animate={{ x: 60, y: -20, opacity: 1, rotateY: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ zIndex: 2 }}
                          >
                            <div
                              className={`text-4xl font-bold ${currentCard.color === "red" ? "text-red-500" : "text-black dark:text-white"}`}
                            >
                              {currentCard.rank}
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

                  {/* Prediction buttons */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Predict the next card:</label>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant={prediction === "red" ? "default" : "outline"}
                        className={`border-2 ${prediction === "red" ? "bg-red-500 text-white" : "text-red-500 border-red-200"}`}
                        onClick={() => setPrediction("red")}
                        disabled={isDrawing || deck.length === 0}
                      >
                        Red Card
                      </Button>
                      <Button
                        variant={prediction === "black" ? "default" : "outline"}
                        className={`border-2 ${prediction === "black" ? "bg-gray-800 text-white" : "text-gray-800 dark:text-gray-200 border-gray-200"}`}
                        onClick={() => setPrediction("black")}
                        disabled={isDrawing || deck.length === 0}
                      >
                        Black Card
                      </Button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={drawCard}
                      disabled={isDrawing || deck.length === 0}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    >
                      Draw Card
                    </Button>
                    <Button variant="outline" onClick={resetDeck}>
                      Reset Deck
                    </Button>
                  </div>

                  {/* Results */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Cards Drawn: {drawnCardsCount} of 52</p>
                        <p className="text-sm font-medium">
                          Correct Predictions: {correctPredictions} of {totalPredictions}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Accuracy:{" "}
                          {totalPredictions > 0
                            ? ((correctPredictions / totalPredictions) * 100).toFixed(1) + "%"
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Current probabilities */}
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Current Probabilities:</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Red Card:</p>
                          <p className="text-lg font-bold text-red-500">{redProbability.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">
                            {remainingRedCards} of {remainingCards} cards
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Black Card:</p>
                          <p className="text-lg font-bold">{blackProbability.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">
                            {remainingBlackCards} of {remainingCards} cards
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recent draws */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Recent Draws:</h3>
                      <div className="flex flex-wrap gap-2">
                        {drawnCards.slice(-10).map((card, index) => (
                          <div
                            key={index}
                            className={`w-8 h-12 rounded-md flex flex-col items-center justify-center text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
                              card.color === "red" ? "text-red-500" : "text-black dark:text-white"
                            }`}
                          >
                            <span>{card.rank}</span>
                            <span>{getCardSymbol(card.suit)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </UICard>
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <UICard className="border-2 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Data Analysis</CardTitle>
                  <CardDescription>Visualize and analyze your card drawing results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {drawnCardsCount === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Draw some cards to see data analysis</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Cards Drawn</h3>
                          <PieChart data={pieChartData} />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Statistics</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground">Red Cards</p>
                              <p className="text-2xl font-bold text-red-500">{redPercentage.toFixed(1)}%</p>
                              <p className="text-sm text-muted-foreground">
                                {redCards} of {drawnCardsCount} cards
                              </p>
                              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${redPercentage}%` }} />
                              </div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800/40 p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground">Black Cards</p>
                              <p className="text-2xl font-bold">{blackPercentage.toFixed(1)}%</p>
                              <p className="text-sm text-muted-foreground">
                                {blackCards} of {drawnCardsCount} cards
                              </p>
                              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gray-800 dark:bg-gray-200"
                                  style={{ width: `${blackPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {totalPredictions > 0
                                ? ((correctPredictions / totalPredictions) * 100).toFixed(1) + "%"
                                : "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {correctPredictions} correct of {totalPredictions} predictions
                            </p>
                            {totalPredictions > 0 && (
                              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${(correctPredictions / totalPredictions) * 100}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">What&apos;s happening here?</h3>
                        <p className="text-sm">
                          In a standard deck of cards, there are 26 red cards and 26 black cards, giving each color a
                          50% probability initially. However, as you draw cards, these probabilities change based on
                          what&apos;s left in the deck.
                        </p>
                        <p className="text-sm mt-2">
                          This is called <strong>conditional probability</strong> - the probability of an event changes
                          based on previous events. Unlike coin flips or dice rolls, card draws are{" "}
                          <strong>dependent events</strong> because each draw affects future probabilities.
                        </p>
                        {drawnCardsCount > 10 && Math.abs(redProbability - blackProbability) > 10 && (
                          <p className="text-sm mt-2 text-green-600 dark:text-green-400">
                            Notice how the probabilities have shifted! The color with fewer cards remaining has a lower
                            probability of being drawn next.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("experiment")} className="w-full">
                    Back to Experiment
                  </Button>
                </CardFooter>
              </UICard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  )
}

