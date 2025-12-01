"use client"

// Add the file with gradient-based buttons using the CSS variables
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

const CATEGORIES = [
  {
    name: "Characters",
    words: ["Orpheus", "Eurydice", "Hades", "Persephone", "Hermes", "Fates"],
  },
  {
    name: "Places",
    words: ["Hadestown", "Railroad", "River Styx", "Underworld", "Factory"],
  },
  {
    name: "Themes",
    words: ["Love", "Hope", "Fate", "Industry", "Nature", "Seasons"],
  },
]

export function WordCategories() {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])

  const handleCategoryClick = (index: number) => {
    setSelectedCategory(index)
    setSelectedWords([])
  }

  const toggleWord = (word: string) => {
    setSelectedWords((prev) => (prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]))
  }

  return (
    <div className="p-6 rounded-xl bg-gradient-card border border-primary/20 ember-glow">
      <h2 className="text-2xl font-bold text-primary mb-4">Hadestown Vocabulary</h2>

      {/* Category buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((category, index) => (
          <Button
            key={index}
            onClick={() => handleCategoryClick(index)}
            className={`${
              selectedCategory === index
                ? "bg-gradient-primary text-primary-foreground"
                : "bg-gradient-primary-soft text-primary hover:text-primary-foreground"
            } ember-glow`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Words grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES[selectedCategory].words.map((word) => (
          <motion.div
            key={word}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: selectedWords.includes(word) ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-lg cursor-pointer text-center transition-all ${
              selectedWords.includes(word)
                ? "bg-gradient-primary text-primary-foreground shadow-lg"
                : "bg-gradient-card border border-primary/20 hover:border-primary"
            }`}
            onClick={() => toggleWord(word)}
          >
            {word}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

