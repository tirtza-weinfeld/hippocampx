"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  RefreshCwIcon,
  CheckIcon,
  XIcon,
  FlowerIcon,
  SunIcon,
  LeafIcon,
  SnowflakeIcon,
  HelpCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

// Season data with items that belong to each season
const SEASONS = [
  {
    id: "spring",
    name: "Spring",
    description: "When Persephone returns to the world above",
    color: "bg-gradient-to-br from-green-400 to-green-500",
    icon: <FlowerIcon className="h-6 w-6" />,
    items: [
      { id: "flowers", name: "Flowers", emoji: "🌸" },
      { id: "rain", name: "Rain Showers", emoji: "🌧️" },
      { id: "butterfly", name: "Butterflies", emoji: "🦋" },
      { id: "nest", name: "Bird Nests", emoji: "🪺" },
      { id: "sprout", name: "Sprouts", emoji: "🌱" },
      { id: "rainbow", name: "Rainbows", emoji: "🌈" },
    ],
  },
  {
    id: "summer",
    name: "Summer",
    description: "The warmest time in the world above",
    color: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    icon: <SunIcon className="h-6 w-6" />,
    items: [
      { id: "sun", name: "Bright Sun", emoji: "☀️" },
      { id: "beach", name: "Beach Days", emoji: "🏖️" },
      { id: "icecream", name: "Ice Cream", emoji: "🍦" },
      { id: "watermelon", name: "Watermelon", emoji: "🍉" },
      { id: "swimming", name: "Swimming", emoji: "🏊" },
      { id: "sunflower", name: "Sunflowers", emoji: "🌻" },
    ],
  },
  {
    id: "fall",
    name: "Fall",
    description: "When Persephone begins her journey below",
    color: "bg-gradient-to-br from-orange-400 to-orange-500",
    icon: <LeafIcon className="h-6 w-6" />,
    items: [
      { id: "leaves", name: "Falling Leaves", emoji: "🍂" },
      { id: "pumpkin", name: "Pumpkins", emoji: "🎃" },
      { id: "apple", name: "Apples", emoji: "🍎" },
      { id: "scarecrow", name: "Scarecrows", emoji: "🧶" },
      { id: "acorn", name: "Acorns", emoji: "🌰" },
      { id: "wind", name: "Windy Days", emoji: "🍃" },
    ],
  },
  {
    id: "winter",
    name: "Winter",
    description: "When Persephone stays in the underworld",
    color: "bg-gradient-to-br from-blue-400 to-blue-500",
    icon: <SnowflakeIcon className="h-6 w-6" />,
    items: [
      { id: "snow", name: "Snowflakes", emoji: "❄️" },
      { id: "mittens", name: "Mittens", emoji: "🧤" },
      { id: "hotchocolate", name: "Hot Chocolate", emoji: "☕" },
      { id: "snowman", name: "Snowman", emoji: "⛄" },
      { id: "icicle", name: "Icicles", emoji: "🧊" },
      { id: "scarf", name: "Warm Scarves", emoji: "🧣" },
    ],
  },
]

type Item = {
  id: string;
  name: string;
  emoji: string;
  seasonId: string;
  seasonName: string;
};

// // Create a flat array of all items with their correct season
// const ALL_ITEMS = SEASONS.flatMap((season) =>
//   season.items.map((item) => ({
//     ...item,
//     seasonId: season.id,
//     seasonName: season.name,
//   })),
// )


export default function SeasonsGamePage() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [availableItems, setAvailableItems] = useState<Item[]>([])
  const [seasonItems, setSeasonItems] = useState<Record<string, Item[]>>({
    spring: [],
    summer: [],
    fall: [],
    winter: [],
  })
  const [score, setScore] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [draggedItem, setDraggedItem] = useState<Item & { source: string } | null>(null)
  const [persephone, setPersephone] = useState<"above" | "below">("above")
  const [persephonePosition, setPersephonePosition] = useState({ x: 0, y: 0 })
  // Add a new state for the selected item
  const [selectedItem, setSelectedItem] = useState<{ item: Item; source: string } | null>(null)

  // Initialize game
  useEffect(() => {
    startLevel(currentLevel)
  }, [currentLevel])

  // Animate Persephone between worlds
  useEffect(() => {
    const interval = setInterval(() => {
      setPersephone((prev) => (prev === "above" ? "below" : "above"))

      // Random position within bounds
      setPersephonePosition({
        x: Math.random() * 80 - 40, // -40 to 40
        y: Math.random() * 40 - 20, // -20 to 20
      })
    }, 10000) // Change every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const startLevel = (level: number) => {
    // Reset state
    setSeasonItems({
      spring: [],
      summer: [],
      fall: [],
      winter: [],
    })
    setIsChecking(false)
    setGameComplete(false)

    // Determine how many items to show based on level
    const itemsPerSeason = Math.min(level + 1, 4) // 2 items in level 1, up to 4 items max

    // Select random items from each season
    const selectedItems = SEASONS.flatMap((season) => {
      const shuffled = [...season.items].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, itemsPerSeason).map((item) => ({
        ...item,
        seasonId: season.id,
        seasonName: season.name,
      }))
    })

    // Shuffle the items
    setAvailableItems(selectedItems.sort(() => Math.random() - 0.5))
  }

  // Handle drag start for desktop
  const handleDragStart = (item: Item, source = "available") => {
    setDraggedItem({ ...item, source })
  }

  // Handle drag end for desktop
  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  // Handle drop for desktop
  const handleDrop = (seasonId: string) => {
    if (!draggedItem) return

    // If the item is being dropped into the same container it came from, do nothing
    if (draggedItem.source === seasonId) return

    // Remove from source container (either available items or another season)
    if (draggedItem.source === "available") {
      setAvailableItems((prev) => prev.filter((item) => item.id !== draggedItem.id))
    } else {
      setSeasonItems((prev) => ({
        ...prev,
        [draggedItem.source]: prev[draggedItem.source].filter((i) => i.id !== draggedItem.id),
      }))
    }

    // Add to the destination season
    setSeasonItems((prev) => ({
      ...prev,
      [seasonId]: [...prev[seasonId], draggedItem],
    }))

    setDraggedItem(null)
  }

  // Handle dropping items back into the available pool
  const handleDropToAvailable = () => {
    if (!draggedItem || draggedItem.source === "available") return

    // Remove from season
    setSeasonItems((prev) => ({
      ...prev,
      [draggedItem.source]: prev[draggedItem.source].filter((i) => i.id !== draggedItem.id),
    }))

    // Add back to available items
    setAvailableItems((prev) => [...prev, draggedItem])

    setDraggedItem(null)
  }

  // Add a drag over handler for the available items pool
  const handleAvailableDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem && draggedItem.source !== "available") {
      e.currentTarget.classList.add("ring-2", "ring-amber-500", "bg-amber-500/10")
    }
  }

  // Add a drag leave handler for the available items pool
  const handleAvailableDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("ring-2", "ring-amber-500", "bg-amber-500/10")
  }

  // Enhance the handleDragOver function to show visual feedback
  const handleDragOver = (e: React.DragEvent, seasonId: string) => {
    e.preventDefault()
    if (draggedItem && draggedItem.source !== seasonId) {
      e.currentTarget.classList.add("ring-2", "ring-amber-500", "scale-105")
    }
  }

  // Add a drag leave handler for seasons
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("ring-2", "ring-amber-500", "scale-105")
  }

  // Touch handlers for mobile support
  // Replace the touch handlers with a simpler selection-based approach
  // Remove these handlers:

  // Add these new handlers instead:
  const handleItemSelect = (item: Item, source: string) => {
    if (isChecking) return

    // If already selected, deselect it
    if (selectedItem && selectedItem.item.id === item.id && selectedItem.source === source) {
      setSelectedItem(null)
      return
    }

    setSelectedItem({ item, source })
  }

  const handleSeasonSelect = (seasonId: string) => {
    if (!selectedItem || isChecking) return

    // Don't move to the same container
    if (selectedItem.source === seasonId) {
      setSelectedItem(null)
      return
    }

    // Remove from source
    if (selectedItem.source === "available") {
      setAvailableItems((prev) => prev.filter((item) => item.id !== selectedItem.item.id))
    } else {
      setSeasonItems((prev) => ({
        ...prev,
        [selectedItem.source]: prev[selectedItem.source].filter((item) => item.id !== selectedItem.item.id),
      }))
    }

    // Add to target season
    setSeasonItems((prev) => ({
      ...prev,
      [seasonId]: [...prev[seasonId], selectedItem.item],
    }))

    // Clear selection
    setSelectedItem(null)
  }

  const handleAvailableSelect = () => {
    if (!selectedItem || selectedItem.source === "available" || isChecking) return

    // Remove from season
    setSeasonItems((prev) => ({
      ...prev,
      [selectedItem.source]: prev[selectedItem.source].filter((item) => item.id !== selectedItem.item.id),
    }))

    // Add back to available items
    setAvailableItems((prev) => [...prev, selectedItem.item])

    // Clear selection
    setSelectedItem(null)
  }

  // const moveItemBack = (item: (typeof ALL_ITEMS)[0], seasonId: string) => {
  //   // Remove from season
  //   setSeasonItems((prev) => ({
  //     ...prev,
  //     [seasonId]: prev[seasonId].filter((i) => i.id !== item.id),
  //   }))

  //   // Add back to available items
  //   setAvailableItems((prev) => [...prev, item])
  // }

  const checkAnswers = () => {
    setIsChecking(true)
    let correctPlacements = 0
    let totalPlacements = 0

    // Check each season
    Object.entries(seasonItems).forEach(([seasonId, items]) => {
      items.forEach((item) => {
        totalPlacements++
        if (item.seasonId === seasonId) {
          correctPlacements++
        }
      })
    })

    // Calculate score as a percentage
    // const levelScore = Math.round((correctPlacements / totalPlacements) * 100)

    // If perfect score, add to total score and show celebration
    if (correctPlacements === totalPlacements && totalPlacements > 0) {
      setScore((prev) => prev + 1)

      // Show confetti for perfect score
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch (error) {
        console.error("Confetti error:", error instanceof Error ? error.message : String(error))
      }

      // If this was the last level, complete the game
      if (currentLevel >= 3) {
        setGameComplete(true)
      }
    }
  }

  const nextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel((prev) => prev + 1)
    } else {
      setGameComplete(true)
    }
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setScore(0)
    startLevel(1)
  }

  return (
    <main className="min-h-screen py-8 
    bg-gradient-to-b from-background to-background/90 text-foreground dark:from-gray-950 dark:to-amber-950/80 dark:text-amber-100">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-800/30 via-gray-900 to-red-800/30 animate-gradient"></div>
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-amber-700/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-amber-600/20 to-transparent"></div>
        <div className="railroad-pattern absolute inset-0 opacity-20"></div>
      </div>


      {/* Fixed navigation buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -5, 0] }}
          transition={{
            y: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 400, damping: 10 },
          }}
        >
          <Button
            onClick={() => setShowInstructions(true)}
            className="rounded-full w-12 h-12 shadow-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white dark:text-gray-900 ember-glow hover:shadow-amber-500/30 hover:shadow-xl"
            aria-label="Show instructions"
          >
            <HelpCircleIcon className="h-6 w-6" />
            <span className="sr-only">Help</span>
          </Button>
        </motion.div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center gap-2 mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <FlowerIcon className="h-6 w-6 text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Seasons Sorting
            </h1>
            <FlowerIcon className="h-6 w-6 text-amber-400" />
          </motion.div>
          <p className="text-amber-300 text-readable">Help Persephone organize items for each season</p>
        </div>

        {/* Level indicator */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-amber-400 font-medium">Level {currentLevel} of 3</span>
            <span className="text-amber-400 font-medium">Score: {score}</span>
          </div>
          <Progress
             value={(currentLevel / 3) * 100}
              className="h-3 bg-amber-100 dark:bg-gray-700"
              indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700"
            />
        </div>

        {/* Mobile instructions banner */}
        <div className="md:hidden max-w-4xl mx-auto mb-6 bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-3 rounded-lg border border-amber-500/30 text-center">
          <p className="text-amber-300 text-sm">
            <span className="font-bold">Tap an item</span> to select it, then{" "}
            <span className="font-bold">tap a season</span> to place it there
            {selectedItem && <span className="block mt-2 animate-pulse">Item selected! Tap a season to place it</span>}
          </p>
        </div>

        {/* Persephone character that moves between worlds */}
        <div className="relative max-w-4xl mx-auto mb-8 h-16">
          <motion.div
            className="absolute"
            animate={{
              y: persephone === "above" ? [0, -10, 0] : [0, 10, 0],
              x: persephonePosition.x,
            }}
            transition={{
              y: { repeat: Number.POSITIVE_INFINITY, duration: 3 },
              x: { duration: 2 },
            }}
            style={{
              left: "50%",
              top: persephone === "above" ? "0%" : "100%",
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Persephone */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-amber-500 flex items-center justify-center">
                  <span className="text-xl">👸</span>
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span className="text-xs">{persephone === "above" ? "☀️" : "🌙"}</span>
                </motion.div>
              </div>
              <motion.div
                className="mt-1 px-2 py-0.5 rounded-full bg-gradient-to-br from-green-400/80 to-amber-500/80 text-white text-xs"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                {persephone === "above" ? "Above ground" : "Underworld"}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Game board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Seasons containers */}
          {SEASONS.map((season) => (
            <div key={season.id} className="relative">
              <Card
                className={`p-4 ${season.color} text-white shadow-lg overflow-hidden transition-transform duration-300 ${
                  selectedItem && selectedItem.source !== season.id ? "cursor-pointer ring-2 ring-white/50" : ""
                }`}
                onDragOver={(e) => handleDragOver(e, season.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(season.id)}
                onClick={() => handleSeasonSelect(season.id)}
              >
                <div className="flex items-center gap-2 mb-3">
                  {season.icon}
                  <h2 className="text-xl font-bold">{season.name}</h2>
                </div>
                <p className="text-sm mb-4 text-white/90">{season.description}</p>

                {/* Items container */}
                <div className="min-h-[120px] p-3 rounded-md bg-white/20 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {seasonItems[season.id].map((item) => (
                    <motion.div
                      key={item.id}
                      className={`p-2 rounded-lg bg-white/30 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm shadow-md hover:shadow-lg transition-all ${
                        isChecking
                          ? item.seasonId === season.id
                            ? "ring-2 ring-green-500"
                            : "ring-2 ring-red-500"
                          : selectedItem && selectedItem.item.id === item.id && selectedItem.source === season.id
                            ? "ring-2 ring-white scale-105"
                            : "hover:bg-white/40"
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        rotate: [0, item.id.charCodeAt(0) % 2 === 0 ? 3 : -3, 0],
                        y: [0, -2, 0],
                      }}
                      transition={{
                        rotate: { repeat: Number.POSITIVE_INFINITY, duration: 2 + (item.id.charCodeAt(0) % 3) },
                        y: { repeat: Number.POSITIVE_INFINITY, duration: 3 + (item.id.charCodeAt(0) % 2) },
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!isChecking) {
                          handleItemSelect(item, season.id)
                        }
                      }}
                      draggable={!isChecking}
                      onDragStart={() => handleDragStart(item, season.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <span className="text-3xl mb-1 transform transition-transform">{item.emoji}</span>
                      <span className="text-xs text-center font-medium bg-white/30 px-2 py-1 rounded-full">
                        {item.name}
                      </span>
                      {isChecking && (
                        <div className="absolute -top-1 -right-1">
                          {item.seasonId === season.id ? (
                            <CheckIcon className="h-5 w-5 text-green-500 bg-white rounded-full p-0.5 shadow-md" />
                          ) : (
                            <XIcon className="h-5 w-5 text-red-500 bg-white rounded-full p-0.5 shadow-md" />
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Available items */}
        <Card
          className={`max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-br from-gray-100 to-amber-50/50 dark:from-gray-900 dark:to-amber-950/50 border-amber-200/60 dark:border-amber-700/60 transition-all duration-300 ${
            selectedItem && selectedItem.source !== "available" ? "cursor-pointer ring-2 ring-amber-500/50" : ""
          }`}
          onDragOver={handleAvailableDragOver}
          onDragLeave={handleAvailableDragLeave}
          onDrop={handleDropToAvailable}
          onClick={handleAvailableSelect}
        >
          <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-4 flex items-center">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              className="mr-2"
            >
              🗃️
            </motion.div>
            Items to Sort
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {availableItems.map((item) => (
              <motion.div
                key={item.id}
                className={`p-3 rounded-lg bg-gradient-to-br from-gray-100 to-amber-50/60 dark:from-gray-800 dark:to-amber-950/60 flex flex-col items-center justify-center cursor-pointer border border-transparent backdrop-blur-sm shadow-md hover:shadow-lg ${
                  selectedItem && selectedItem.item.id === item.id && selectedItem.source === "available"
                    ? "ring-2 ring-amber-500 scale-105 border-amber-500"
                    : "hover:border-amber-500/30"
                }`}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  rotate: [0, item.id.charCodeAt(0) % 2 === 0 ? 2 : -2, 0],
                  y: [0, -3, 0],
                }}
                transition={{
                  rotate: { repeat: Number.POSITIVE_INFINITY, duration: 3 + (item.id.charCodeAt(0) % 3) },
                  y: { repeat: Number.POSITIVE_INFINITY, duration: 4 + (item.id.charCodeAt(0) % 2) },
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isChecking) {
                    handleItemSelect(item, "available")
                  }
                }}
                draggable
                onDragStart={() => handleDragStart(item, "available")}
                onDragEnd={handleDragEnd}
              >
                <span className="text-4xl mb-2 transform transition-transform hover:scale-110">{item.emoji}</span>
                <span className="text-xs text-center font-medium bg-gray-200/50 dark:bg-gray-900/30 px-2 py-1 rounded-full text-gray-800 dark:text-amber-100">
                  {item.name}
                </span>
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0"
                  whileHover={{ opacity: 0.2 }}
                  style={{
                    background: `linear-gradient(45deg, ${item.seasonId === "spring" ? "var(--color-green-500)" : item.seasonId === "summer" ? "var(--color-yellow-500)" : item.seasonId === "fall" ? "var(--color-orange-500)" : "var(--color-blue-500)"}, transparent)`,
                  }}
                />
              </motion.div>
            ))}

            {availableItems.length === 0 && (
              <div className="col-span-full text-center p-4 text-amber-600/80 dark:text-amber-300/80">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  All items have been sorted! Check your answers.
                </motion.div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center mt-6 gap-4">
            <Button
              variant="outline"
              className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
              onClick={() => startLevel(currentLevel)}
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset Level
            </Button>

            <Button
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white dark:text-gray-900 hover:opacity-90"
              onClick={checkAnswers}
              disabled={availableItems.length > 0 || isChecking}
            >
              <CheckIcon className="mr-2 h-4 w-4" /> Check Answers
            </Button>

            {isChecking && (
              <Button
                className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90"
                onClick={nextLevel}
              >
                {currentLevel >= 3 ? "Complete Game" : "Next Level"}
              </Button>
            )}
          </div>
        </Card>

        {/* Mobile navigation buttons */}
        <div className="md:hidden flex justify-center gap-4 mt-8">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => currentLevel > 1 && setCurrentLevel(currentLevel - 1)}
              disabled={currentLevel <= 1}
              className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white"
              aria-label="Previous level"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={resetGame}
              className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white"
              aria-label="Reset game"
            >
              <RefreshCwIcon className="h-6 w-6" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => currentLevel < 3 && setCurrentLevel(currentLevel + 1)}
              disabled={currentLevel >= 3}
              className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white"
              aria-label="Next level"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1001] pt-16"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">How to Play</h2>

              <div className="space-y-4 mb-6">
                <p className="text-gray-700 dark:text-amber-100">
                  In Greek mythology, Persephone spends half the year in the world above (bringing Spring and Summer)
                  and half in the underworld (causing Fall and Winter).
                </p>

                <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-3 rounded-md">
                  <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-1">Game Rules:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-amber-100">
                    <li>Drag items from the bottom section to their correct season</li>
                    <li>Click on an item in a season to move it back</li>
                    <li>Sort all items, then check your answers</li>
                    <li>Complete all 3 levels to win!</li>
                  </ul>
                </div>

                <div className="flex items-center gap-2 text-gray-700 dark:text-amber-100">
                  <div className="flex gap-1">
                    {SEASONS.map((season) => (
                      <div
                        key={season.id}
                        className={`w-6 h-6 rounded-full ${season.color} flex items-center justify-center text-white text-xs`}
                      >
                        {season.icon}
                      </div>
                    ))}
                  </div>
                  <span>= The four seasons Persephone creates</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-gray-900"
                  onClick={() => setShowInstructions(false)}
                >
                  Start Playing
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Complete Modal */}
      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1001] pt-16"
            onClick={() => setGameComplete(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-100 to-amber-50/50 dark:from-gray-900 dark:to-amber-950/50 p-6 rounded-xl max-w-md w-full text-center shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-amber-600 flex items-center justify-center"
              >
                <span className="text-4xl">👸</span>
              </motion.div>

              <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">Congratulations!</h2>

              <p className="mb-6 text-gray-700 dark:text-amber-100">
                You&apos;ve helped Persephone organize all the seasons! Thanks to you, the world will enjoy Spring,
                Summer, Fall, and Winter in perfect harmony.
              </p>

              <div className="flex justify-center gap-4">
                <Button variant="outline" className="border-amber-600 text-amber-400" onClick={resetGame}>
                  Play Again
                </Button>

                <Button className="bg-gradient-to-r from-amber-600 to-amber-700 text-gray-900">Back to Home</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

