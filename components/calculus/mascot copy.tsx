"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Settings, Book, Lightbulb, ChevronLeft } from "lucide-react"

type MascotProps = {
  message?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  character?: "newton" | "leibniz" | "euler"
}

type DictionaryEntry = {
  term: string
  definition: string
}

type MascotSettings = {
  character: "newton" | "leibniz" | "euler"
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  showTips: boolean
}

export function Mascot({
  message = "Hi there! Need help with calculus?",
  position = "bottom-right",
  character = "newton",
}: MascotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible] = useState(true)
  const [activeFeature, setActiveFeature] = useState<"main" | "dictionary" | "hint" | "settings">("main")
  const [settings, setSettings] = useState<MascotSettings>({
    character,
    position,
    showTips: true,
  })

  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Dictionary entries for calculus terms
  const dictionaryEntries: DictionaryEntry[] = [
    { term: "Derivative", definition: "A measure of how a function changes as its input changes." },
    { term: "Integral", definition: "The area under a curve, which can be used to find displacement from velocity." },
    { term: "Limit", definition: "The value a function approaches as the input approaches some value." },
    { term: "Function", definition: "A relation between inputs and outputs where each input has exactly one output." },
    {
      term: "Tangent Line",
      definition: "A line that touches a curve at a single point and has the same slope as the curve at that point.",
    },
    { term: "Rate of Change", definition: "How quickly one quantity changes with respect to another quantity." },
    { term: "Infinite Series", definition: "The sum of infinitely many terms that follow a specific pattern." },
    { term: "Calculus", definition: "The mathematical study of continuous change." },
  ]

  // Hints for different calculus topics
  const hints = [
    "When finding a derivative, remember that it represents the slope of the tangent line at a point.",
    "Integration is the opposite of differentiation. Think of it as finding the area under a curve.",
    "When approaching a limit, try substituting values closer and closer to see what value the function approaches.",
    "The Power Rule: The derivative of x^n is n*x^(n-1).",
    "The Chain Rule helps you find the derivative of composite functions.",
    "The Fundamental Theorem of Calculus connects differentiation and integration.",
    "When solving area problems, break complex shapes into simpler ones.",
    "Derivatives can help you find maximum and minimum values of functions.",
  ]

  const positionClasses = {
    "bottom-right": "fixed bottom-4 right-4",
    "bottom-left": "fixed bottom-4 left-4",
    "top-right": "fixed top-4 right-4",
    "top-left": "fixed top-4 left-4",
  }

  const characterImages = {
    newton: "🧙‍♂️",
    leibniz: "🧠",
    euler: "👨‍🔬",
  }

  const characterNames = {
    newton: "Newton",
    leibniz: "Leibniz",
    euler: "Euler",
  }

  const characterColors = {
    newton: "from-blue-500 to-teal-500",
    leibniz: "from-indigo-500 to-violet-500",
    euler: "from-sky-500 to-cyan-500",
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    setActiveFeature("main")
  }

  const getRandomHint = () => {
    const randomIndex = Math.floor(Math.random() * hints.length)
    return hints[randomIndex]
  }

  const [currentHint, setCurrentHint] = useState(getRandomHint())
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDictionary = dictionaryEntries.filter(
    (entry) =>
      entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const updateSettings = (newSettings: Partial<MascotSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)

    // Apply the new settings
    if (newSettings.character) {
      character = newSettings.character
    }
    if (newSettings.position) {
      position = newSettings.position
    }
  }

  if (!isVisible) return null

  return (
    <div className={`${positionClasses[settings.position]} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4 p-4 bg-background/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg max-w-xs border-2 border-primary"
          >
            {activeFeature === "main" && (
              <>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{characterImages[settings.character]}</span>
                    <span className="font-bold">{characterNames[settings.character]}</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm">{message}</p>

                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <button
                    onClick={() => setActiveFeature("dictionary")}
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Book size={12} />
                    <span>Dictionary</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentHint(getRandomHint())
                      setActiveFeature("hint")
                    }}
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Lightbulb size={12} />
                    <span>Hint</span>
                  </button>
                  <button
                    onClick={() => setActiveFeature("settings")}
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Settings size={12} />
                    <span>Settings</span>
                  </button>
                </div>
              </>
            )}

            {activeFeature === "dictionary" && (
              <>
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => setActiveFeature("main")}
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                  <h3 className="font-bold text-sm">Calculus Dictionary</h3>
                  <div className="w-5"></div> {/* Spacer for alignment */}
                </div>

                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 mb-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-800"
                />

                <div className="max-h-60 overflow-y-auto">
                  {filteredDictionary.length > 0 ? (
                    filteredDictionary.map((entry, index) => (
                      <div
                        key={index}
                        className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <h4 className="font-bold text-xs">{entry.term}</h4>
                        <p className="text-xs">{entry.definition}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No matching terms found.</p>
                  )}
                </div>
              </>
            )}

            {activeFeature === "hint" && (
              <>
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => setActiveFeature("main")}
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                  <h3 className="font-bold text-sm">Calculus Hint</h3>
                  <div className="w-5"></div> {/* Spacer for alignment */}
                </div>

                <div className="p-2 bg-primary/10 rounded-lg mb-2">
                  <p className="text-xs">{currentHint}</p>
                </div>

                <button
                  onClick={() => setCurrentHint(getRandomHint())}
                  className="w-full text-xs py-1 px-2 bg-primary/20 hover:bg-primary/30 rounded text-primary-foreground transition-colors"
                >
                  Get Another Hint
                </button>
              </>
            )}

            {activeFeature === "settings" && (
              <>
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => setActiveFeature("main")}
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                  <h3 className="font-bold text-sm">Mascot Settings</h3>
                  <div className="w-5"></div> {/* Spacer for alignment */}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Character</label>
                    <div className="flex gap-2">
                      {(Object.keys(characterNames) as Array<"newton" | "leibniz" | "euler">).map((char) => (
                        <button
                          key={char}
                          onClick={() => updateSettings({ character: char })}
                          className={`p-2 rounded-lg flex flex-col items-center ${
                            settings.character === char
                              ? "bg-primary/20 border border-primary/50"
                              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span className="text-xl">{characterImages[char]}</span>
                          <span className="text-xs">{characterNames[char]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Position</label>
                    <select
                      value={settings.position}
                      onChange={(e) =>
                        updateSettings({
                          position: e.target.value as "bottom-right" | "bottom-left" | "top-right" | "top-left",
                        })
                      }
                      className="w-full p-1 text-xs rounded border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-800"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showTips"
                      checked={settings.showTips}
                      onChange={(e) => updateSettings({ showTips: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="showTips" className="text-xs">
                      Show random tips
                    </label>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`w-14 h-14 rounded-full bg-gradient-to-r ${characterColors[settings.character]} text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
        }}
      >
        {isOpen ? <X size={24} /> : <span className="text-2xl">{characterImages[settings.character]}</span>}
      </motion.button>
    </div>
  )
}
  
