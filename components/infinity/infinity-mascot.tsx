"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lightbulb, InfinityIcon, ChevronRight, ChevronLeft } from "lucide-react"

type MascotProps = {
  message?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  character?: "professor" | "explorer" | "astronaut"
}

type Fact = {
  title: string
  content: string
}

export function InfinityMascot({
  message = "Hi there! Ready to explore infinity?",
  position = "bottom-right",
  character = "professor",
}: MascotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible] = useState(true)
  const [currentFact, setCurrentFact] = useState(0)
  
  const dialogRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dialogRef.current && 
        !dialogRef.current.contains(event.target as Node) && 
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) && 
        isOpen
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Fun facts about infinity for kids
  const infinityFacts: Fact[] = [
    { 
      title: "Infinity Hotel", 
      content: "Imagine a hotel with infinite rooms. Even if it's full, you can always make room for more guests!" 
    },
    { 
      title: "Infinity Symbol", 
      content: "The infinity symbol (∞) looks like a sideways figure 8. It was first used in 1655!" 
    },
    { 
      title: "Counting Forever", 
      content: "If you tried to count to infinity, you'd never finish - even if you counted for your whole life!" 
    },
    { 
      title: "Infinite Universe?", 
      content: "Scientists aren't sure if the universe is infinite or not. It might go on forever!" 
    },
    { 
      title: "Different Sizes", 
      content: "Did you know there are different sizes of infinity? Some infinities are bigger than others!" 
    },
    { 
      title: "Infinity + 1", 
      content: "What's infinity plus one? Still infinity! You can't get 'beyond' infinity by adding." 
    },
  ]

  const positionClasses = {
    "bottom-right": "fixed bottom-4 right-4",
    "bottom-left": "fixed bottom-4 left-4",
    "top-right": "fixed top-4 right-4",
    "top-left": "fixed top-4 left-4",
  }

  const characterImages = {
    professor: "👨‍🏫",
    explorer: "🧭",
    astronaut: "👨‍🚀",
  }

  const characterNames = {
    professor: "Professor Infinity",
    explorer: "Explorer Endless",
    astronaut: "Captain Cosmos",
  }

  const characterColors = {
    professor: "from-purple-500 to-indigo-500",
    explorer: "from-amber-500 to-orange-500",
    astronaut: "from-blue-500 to-cyan-500",
  }

  const getNextFact = () => {
    setCurrentFact((prev) => (prev + 1) % infinityFacts.length)
  }

  const getPrevFact = () => {
    setCurrentFact((prev) => (prev - 1 + infinityFacts.length) % infinityFacts.length)
  }

  if (!isVisible) return null

  return (
    <div className={`${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className={`absolute ${
              position.includes("bottom") 
                ? "bottom-[calc(100%+1rem)]" 
                : "top-[calc(100%+1rem)]"
            } ${
              position.includes("right")
                ? "right-0"
                : "left-0"
            } p-4 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg w-[320px] h-[280px] border-2 border-primary`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{characterImages[character]}</span>
                <span className="font-bold">{characterNames[character]}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="mb-3">
              <p className="text-sm">{message}</p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg h-[140px] flex flex-col">
              <div className="flex items-start gap-2 flex-grow">
                <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm">{infinityFacts[currentFact].title}</h3>
                  <p className="text-xs mt-1">{infinityFacts[currentFact].content}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button 
                  onClick={getPrevFact}
                  className="flex items-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  aria-label="Previous fact"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-gray-500">
                  {currentFact + 1} / {infinityFacts.length}
                </span>
                <button 
                  onClick={getNextFact}
                  className="flex items-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  aria-label="Next fact"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`relative z-[51] flex items-center justify-center p-3 rounded-full shadow-lg bg-gradient-to-r ${characterColors[character]} text-white`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
        transition={{ 
          scale: { duration: 0.3 },
          rotate: { repeat: Infinity, repeatDelay: 5, duration: 0.5 }
        }}
      >
        <div className="relative">
          <InfinityIcon className="h-6 w-6" />
          <motion.div 
            className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1.5
            }}
          />
        </div>
      </motion.button>
    </div>
  )
} 