"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
// Import the new CardFlip component
import { Card, CardFlip } from "@/components/old/hadestown/card"
import { RefreshCwIcon, TimerIcon, TrophyIcon, BookOpenIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import confetti from "canvas-confetti"

// Game vocabulary words and definitions
const VOCABULARY_PAIRS = [
  {
    word: "Tragedy",
    definition: "A play or story that ends sadly, often with the death of the main character",
  },
  {
    word: "Lyre",
    definition: "A stringed instrument like a small U-shaped harp used in ancient Greece",
  },
  {
    word: "Melody",
    definition: "A sequence of musical notes that form a satisfying pattern",
  },
  {
    word: "Harmony",
    definition: "The combination of musical notes to produce a pleasing effect",
  },
  {
    word: "Persevere",
    definition: "To continue doing something despite difficulties",
  },
  {
    word: "Underworld",
    definition: "The world of the dead, located beneath the world of the living",
  },
  {
    word: "Ancient",
    definition: "Belonging to the very distant past and no longer in existence",
  },
  {
    word: "Hellhound",
    definition: "A mythical dog associated with the underworld",
  },
  {
    word: "Abandonment",
    definition: "The action of leaving someone or something behind",
  },
  {
    word: "Mighty",
    definition: "Possessing great and impressive power or strength",
  },
  {
    word: "Beneath",
    definition: "In or to a lower position than; under",
  },
  {
    word: "Echo",
    definition: "A sound that is reflected back to its source",
  },
]

// Card types
type CardType = {
  id: number
  content: string
  type: "word" | "definition"
  matched: boolean
  flipped: boolean
  matchId: number
}

// Custom mouse cursor component with click animation
function MouseCursor({ animate = true }: { animate?: boolean }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      initial={animate ? { x: -50, y: 0, scale: 0.8 } : { scale: 0.8 }}
      animate={
        animate
          ? {
            x: [0, 40],
            y: [0, -20],
            scale: [0.8, 1, 0.8],
          }
          : {}
      }
      transition={{
        duration: 2,
        repeat: animate ? Number.POSITIVE_INFINITY : 0,
        repeatType: "reverse",
      }}
    >
      <div className="relative">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3L19 12L12 13L9 20L5 3Z" fill="white" stroke="#000000" strokeWidth="1.5" />
        </svg>
        <motion.div
          className="absolute -right-1 -bottom-1 w-4 h-4 bg-amber-500 dark:bg-amber-500 rounded-full"
          animate={animate ? { scale: [0, 1, 0] } : {}}
          transition={{ duration: 2, repeat: animate ? Number.POSITIVE_INFINITY : 0, repeatType: "loop", delay: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

// Replace the InstructionsCarousel component with this improved version that includes mouse animations
function InstructionsCarousel({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Word Memory!",
      content: "Match words with their definitions in this fun memory game.",
      icon: (
        <div className="relative w-full h-full flex items-center justify-center">
          <BookOpenIcon className="h-16 w-16 text-amber-600 dark:text-amber-400" />
        </div>
      ),
    },
    {
      title: "Step 1: Flip a Card",
      content: "Click on any card to flip it over and see what's underneath.",
      icon: (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: [0, -180] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", repeatDelay: 0.5 }}
            className="w-16 h-20 bg-gradient-to-br from-amber-500/90 to-amber-600/70 dark:from-amber-600 dark:to-amber-700 rounded-lg flex items-center justify-center backface-hidden origin-bottom"
            style={{ transformStyle: "preserve-3d" }}
          >
            <BookOpenIcon className="h-8 w-8 text-white dark:text-gray-900" />
          </motion.div>
          <MouseCursor />
        </div>
      ),
    },
    {
      title: "Step 2: Find a Match",
      content: "Flip another card to try to find its matching pair. Words match with their definitions!",
      icon: (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="flex gap-4">
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: [0, -180] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", repeatDelay: 1 }}
              className="w-16 h-20 bg-gradient-to-br from-white/90 to-gray-100/80 border-2 border-amber-500/30 rounded-lg flex items-center justify-center text-xs text-center p-1 backface-hidden origin-bottom"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="text-amber-600 dark:text-amber-400 font-bold">Melody</span>
            </motion.div>
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: [0, -180] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                repeatDelay: 1,
                delay: 0.75,
              }}
              className="w-16 h-20 bg-gradient-to-br from-gray-100/80 to-gray-200/60 border-2 border-amber-500/20 rounded-lg flex items-center justify-center text-xs text-center p-1 backface-hidden origin-bottom"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="text-foreground dark:text-amber-100">Musical pattern</span>
            </motion.div>
          </div>
          <MouseCursor />
        </div>
      ),
    },
    {
      title: "Step 3: Remember Locations",
      content: "If the cards don't match, they'll flip back over. Try to remember where each word and definition is!",
      icon: (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="relative"
          >
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-400/80 to-yellow-500/80 rounded-full flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Step 4: Complete the Game",
      content: "Find all the matching pairs to win! In Easy mode, there's no timer so you can take your time.",
      icon: (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <TrophyIcon className="h-16 w-16 text-yellow-500" />
          </motion.div>
          <motion.div
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [-20, -40, -60, -80],
              x: [-20, -10, 10, 20],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          >
            <span className="text-2xl">✨</span>
          </motion.div>
          <motion.div
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [-20, -40, -60, -80],
              x: [20, 10, -10, -20],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
              delay: 0.5,
            }}
          >
            <span className="text-2xl">🎉</span>
          </motion.div>
        </div>
      ),
    },
  ]

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">{steps[step].title}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-gray-500 hover:text-foreground dark:text-amber-300 dark:hover:text-amber-100"
        >
          <span className="sr-only">Close</span>✕
        </Button>
      </div>

      {/* Fixed height container for the instruction content */}
      <div className="h-[240px] mb-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center"
          >
            <div className="h-[140px] w-full flex items-center justify-center mb-4">{steps[step].icon}</div>
            <p className="text-foreground dark:text-amber-100 text-lg px-4">{steps[step].content}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          className="border-amber-500 text-amber-600 dark:border-amber-600 dark:text-amber-400"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Previous
        </Button>

        <div className="flex gap-1">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${i === step ? "bg-amber-600 dark:bg-amber-400" : "bg-gray-100 dark:bg-gray-700"}`}
              animate={i === step ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
          ))}
        </div>

        <Button
          className={
            step === steps.length - 1
              ? "bg-gradient-to-r from-amber-500 to-amber-500/90 text-white dark:from-amber-600 dark:to-amber-700 dark:text-gray-900"
              : "border-amber-500 text-amber-600 dark:border-amber-600 dark:text-amber-400"
          }
          variant={step === steps.length - 1 ? "default" : "outline"}
          onClick={() => {
            if (step < steps.length - 1) {
              setStep(step + 1)
            } else {
              onClose()
            }
          }}
        >
          {step === steps.length - 1 ? "Start Playing" : "Next"}
        </Button>
      </div>
    </div>
  )
}

export default function WordMemoryGame() {
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameComplete, setGameComplete] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(0)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [showInstructions, setShowInstructions] = useState<boolean>(true)

  // Helper to generate cards for a given difficulty
  function generateCards(diff: "easy" | "medium" | "hard"): CardType[] {
    let numPairs = 6
    if (diff === "easy") numPairs = 4
    if (diff === "hard") numPairs = 8

    const shuffledPairs = [...VOCABULARY_PAIRS].sort(() => Math.random() - 0.5).slice(0, numPairs)
    const newCards: CardType[] = []

    shuffledPairs.forEach((pair, index) => {
      newCards.push({
        id: index * 2,
        content: pair.word,
        type: "word",
        matched: false,
        flipped: false,
        matchId: index,
      })
      newCards.push({
        id: index * 2 + 1,
        content: pair.definition,
        type: "definition",
        matched: false,
        flipped: false,
        matchId: index,
      })
    })

    return newCards.sort(() => Math.random() - 0.5)
  }

  // Initialize game - called from event handlers, not effects
  function initializeGame(diff: "easy" | "medium" | "hard" = difficulty) {
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimer(0)
    setGameComplete(false)
    setGameStarted(false)
    setCards(generateCards(diff))
  }

  // Change difficulty and reinitialize
  function changeDifficulty(newDifficulty: "easy" | "medium" | "hard") {
    setDifficulty(newDifficulty)
    initializeGame(newDifficulty)
  }

  // Initialize cards on first render using useState initializer
  const [cards, setCards] = useState<CardType[]>(() => generateCards("medium"))

  // Update the timer logic to exclude it from Easy mode
  // In the Timer effect, modify the condition to not start timer in Easy mode
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameStarted && !gameComplete && difficulty !== "easy") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStarted, gameComplete, difficulty])



  // Handle card click
  const handleCardClick = (id: number) => {
    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true)
    }

    // Ignore click if card is already flipped, matched, or if two cards are already flipped
    const clickedCard = cards.find((card) => card.id === id)
    if (!clickedCard || clickedCard.flipped || clickedCard.matched || flippedCards.length >= 2) {
      return
    }

    // Flip the card
    setCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, flipped: true } : card)))

    // Add to flipped cards
    setFlippedCards((prev) => [...prev, id])

    // If this is the second card flipped, check for a match
    if (flippedCards.length === 1) {
      setMoves((prev) => prev + 1)

      const firstCardId = flippedCards[0]
      const firstCard = cards.find((card) => card.id === firstCardId)
      const secondCard = clickedCard

      if (firstCard && secondCard && firstCard.matchId === secondCard.matchId) {
        // Match found
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) => (card.id === firstCardId || card.id === id ? { ...card, matched: true } : card)),
          )
          setFlippedCards([])
          setMatchedPairs((prev) => {
            const newMatchedPairs = prev + 1
            // Check if game is complete
            if (newMatchedPairs === cards.length / 2) {
              setGameComplete(true)
              // Trigger confetti with error handling
              try {
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                })
              } catch (error) {
                console.error("Confetti error:", error instanceof Error ? error.message : String(error))
              }
            }
            return newMatchedPairs
          })
        }, 500)
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) => (card.id === firstCardId || card.id === id ? { ...card, flipped: false } : card)),
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const resetGame = () => {
    initializeGame()
    setGameComplete(false)
  }

  // Improve the drag and drop functionality
  // const handleDragStart = (e: React.DragEvent, id: number) => {
  //   if (flippedCards.length >= 2) return

  //   const card = cards.find((c) => c.id === id)
  //   if (card?.matched) return

  //   e.dataTransfer.setData("text/plain", id.toString())

  //   // Add visual feedback
  //   if (e.currentTarget.classList) {
  //     e.currentTarget.classList.add("opacity-70", "scale-105", "shadow-lg", "z-50")
  //   }
  // }

  // const handleDrop = (e: React.DragEvent, targetId: number) => {
  //   e.preventDefault()
  //   e.currentTarget.classList.remove("ring-2", "ring-amber-500", "bg-amber-50/30", "dark:bg-amber-900/30")

  //   if (flippedCards.length >= 2) return

  //   const targetCard = cards.find((c) => c.id === targetId)
  //   if (targetCard?.matched || targetCard?.flipped) return

  //   const draggedId = Number.parseInt(e.dataTransfer.getData("text/plain"))
  //   const draggedCard = cards.find((c) => c.id === draggedId)

  //   if (draggedCard && !draggedCard.matched && draggedCard.id !== targetId) {
  //     // Handle as if both cards were clicked
  //     handleCardClick(draggedId)
  //     handleCardClick(targetId)
  //   }
  // }

  return (
    <main className="min-h-screen py-8">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-amber-800/30 dark:via-gray-900 dark:to-red-800/30 animate-gradient"></div>
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/30 dark:to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-600/20 dark:to-transparent"></div>
        <div className="railroad-pattern absolute inset-0 opacity-10 dark:opacity-20"></div>
      </div>



      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-8">
          <h1 className="text-2xl font-bold text-center text-amber-600 dark:text-amber-400">Word Memory</h1>
        </div>

        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center gap-2 mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <BookOpenIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 to-accent bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-600">
              Word Memory Game
            </h1>
            <BookOpenIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </motion.div>
          <p className="text-gray-500 dark:text-amber-300 text-readable">
            Match each word with its definition. Find all pairs to complete the game!
          </p>
        </div>

        {/* Game Controls - Fixed width containers to prevent layout shifts */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* Fix the timer container to prevent layout shifts */}
          <Card className="p-4 bg-gradient-to-br from-white/90 to-gray-100/80 border-amber-500/30 dark:from-gray-900 dark:to-amber-950/50 dark:border-amber-700/60 w-[140px] h-[56px] flex items-center">
            <div className="flex items-center gap-2">
              <TimerIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="font-medium font-mono">
                {difficulty === "easy" ? "Easy Mode" : !gameStarted ? "Start Game" : `Time: ${formatTime(timer)}`}
              </span>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white/90 to-gray-100/80 border-amber-500/30 dark:from-gray-900 dark:to-amber-950/50 dark:border-amber-700/60 w-[140px] h-[56px] flex items-center">
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="font-medium">
                Pairs: {matchedPairs}/{cards.length / 2}
              </span>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white/90 to-gray-100/80 border-amber-500/30 dark:from-gray-900 dark:to-amber-950/50 dark:border-amber-700/60 w-[140px] h-[56px] flex items-center">
            <div className="flex items-center gap-2">
              <RefreshCwIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="font-medium">Moves: {moves}</span>
            </div>
          </Card>
        </div>

        {/* Difficulty Selection */}
        <div className="flex justify-center gap-2 mb-6 [&>*]:cursor-pointer 
        [&>*]:hover:scale-105 [&>*]:transition-all [&>*]:duration-300
        [&>*]:opacity-80
        [&>*]:hover:opacity-100
      
        [&>*]:rounded-full
        
        ">
          <Button
            variant={difficulty === "easy" ? "default" : "outline"}
            className={difficulty === "easy" ? `
              bg-gradient-to-r from-green-200 to-green-700 text-white dark:text-gray-900 
              
              dark:from-green-300 dark:to-green-600` : "dark:border-green-400/60 border-green-500/60"}
            onClick={() => changeDifficulty("easy")}
          >
            Easy
          </Button>
          <Button
            variant={difficulty === "medium" ? "default" : "outline"}
            className={difficulty === "medium" ? `
              bg-gradient-to-r from-orange-200 to-orange-700 text-white dark:text-gray-900 
              
              dark:from-orange-300 dark:to-orange-600` : " dark:border-orange-350/60 border-orange-500/60"}
            onClick={() => changeDifficulty("medium")}
          >
            Medium
          </Button>
          <Button
            variant={difficulty === "hard" ? "default" : "outline"}
            className={difficulty === "hard" ? `bg-gradient-to-r from-red-200 to-red-700 text-white dark:text-gray-900 
              
              dark:from-red-300 dark:to-red-600` : "dark:border-red-350/60 border-red-500/60"}
            onClick={() => changeDifficulty("hard")}
          >
            Hard
          </Button>
        </div>

        {/* Add a button to reopen instructions */}
        <div className="flex justify-center mb-6">
          <Button
            size="lg"
            onClick={() => initializeGame()}
            className="
               
               mr-4
               
      cursor-pointer 
       hover:scale-105
        transition-all duration-300
        bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-red-900 text-white text-base rounded-full
      touch-target
               
               "
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset Game
          </Button>

          {/* <Button

            size="lg"
            className="
      cursor-pointer 
       hover:scale-105
        transition-all duration-300
        bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-red-900 text-white text-base rounded-full
      touch-target"
            onClick={() => {
              resetGame()
            }}
          >
            <RefreshCwIcon className="mr-2 h-5 w-5" /> Reset
          </Button> */}


          <Button
            // variant="outline"
            className="            
               mr-4
               
      cursor-pointer 
       hover:scale-105
        transition-all duration-300
        bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-red-900 text-white text-base rounded-full
      touch-target"
            onClick={() => setShowInstructions(true)}
          >
            <BookOpenIcon className="mr-2 h-4 w-4" /> How to Play
          </Button>
        </div>

        {/* Game Board - Fixed card dimensions to prevent layout shifts */}
        <Card className="max-w-2xl mx-auto bg-gradient-card  border-none p-6 shadow-lg ember-glow">
          {/* Replace the card rendering with the new CardFlip component */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8  p-4 rounded-lg">
            {cards.map((card) => (
              <div key={card.id} className="aspect-[3/4] relative">
                <CardFlip
                  flipped={card.flipped || card.matched}
                  matched={card.matched}
                  onClick={() => handleCardClick(card.id)}
                  backContent={<BookOpenIcon className="h-10 w-10 text-white dark:text-gray-900" />}
                  frontContent={
                    <div className="text-sm md:text-base font-medium relative">
                      {card.content}

                    </div>
                  }
                // className={
                //   card.type === "definition"
                //     ? "bg-gradient-to-br from-gray-100/80 to-gray-200/60 border-2 border-amber-500/20 text-foreground dark:from-gray-700 dark:to-gray-800 dark:border-amber-500/30 dark:text-amber-100"
                //     :"bg-gradient-to-br from-gray-100/80 to-gray-200/60 border-2 border-amber-500/20 text-foreground dark:from-gray-700 dark:to-gray-800 dark:border-amber-500/30 dark:text-amber-100"
                // }
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Game Complete Modal */}
        <AnimatePresence>
          {gameComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
              onClick={() => setGameComplete(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-gradient-card p-6 rounded-xl max-w-md w-full text-center border-2 border-primary/30 shadow-xl ember-glow"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mx-auto mb-6"
                >
                  <TrophyIcon className="h-20 w-20 text-yellow-500" />
                </motion.div>

                <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">Congratulations!</h2>

                <p className="mb-4 text-foreground dark:text-amber-100">You&apos;ve completed the Word Memory Game!</p>

                <div className="space-y-2 mb-6 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-amber-300">Time:</span>
                    <span className="font-medium text-foreground dark:text-amber-100">{formatTime(timer)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-amber-300">Moves:</span>
                    <span className="font-medium text-foreground dark:text-amber-100">{moves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-amber-300">Pairs Found:</span>
                    <span className="font-medium text-foreground dark:text-amber-100">{matchedPairs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-amber-300">Difficulty:</span>
                    <span className="font-medium text-foreground dark:text-amber-100 capitalize">{difficulty}</span>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="border-amber-500 text-amber-600 dark:border-amber-600 dark:text-amber-400"
                    onClick={() => setGameComplete(false)}
                  >
                    Close
                  </Button>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mt-2">
                    <Button
                      onClick={resetGame}
                      className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                    >
                      <RefreshCwIcon className="mr-2 h-4 w-4" /> Play Again
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions Modal - Fixed dimensions to prevent layout shifts */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-[1001] bg-black/70 pt-16"
              onClick={(e) => e.target === e.currentTarget && setShowInstructions(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-gradient-to-br from-white to-gray-100/90 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl w-[400px] max-w-[95vw] border-2 border-amber-500/30 dark:border-amber-500/40 shadow-xl ember-glow"
                onClick={(e) => e.stopPropagation()}
              >
                <InstructionsCarousel onClose={() => setShowInstructions(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

