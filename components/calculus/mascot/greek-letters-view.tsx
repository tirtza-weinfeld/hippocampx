"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, X, Heart, Filter, Volume2, BookOpen, Zap, Target, ArrowLeft, Minimize } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { greekLetters, type GreekLetter, type GreekLetterUsage, type DifficultyLevel } from "./mascot-data"

interface GreekLettersViewProps {
  onBack: () => void
  onClose: () => void
}

type UsageFilter = "all" | GreekLetterUsage
type DifficultyFilter = "all" | DifficultyLevel
type ViewMode = "scroll" | "focus"

// Custom Framer Motion Illustrations
const DifficultyIcon = ({ difficulty, size = 16 }: { difficulty: DifficultyLevel; size?: number }) => {
  const variants = {
    beginner: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
    },
    intermediate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
    },
    advanced: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
    },
  }

  const colors = {
    beginner: "#10b981", // emerald
    intermediate: "#f59e0b", // amber
    advanced: "#ef4444", // red
  }

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      animate={variants[difficulty]}
      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      {difficulty === "beginner" && (
        <motion.div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: colors.beginner }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="absolute inset-1 bg-white rounded-full"
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>
      )}
      {difficulty === "intermediate" && (
        <motion.div className="relative w-full h-full">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: colors.intermediate }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1 bg-white rounded-full"
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>
      )}
      {difficulty === "advanced" && (
        <motion.div className="relative w-full h-full">
          <motion.div
            className="w-full h-full"
            style={{ backgroundColor: colors.advanced }}
            animate={{
              clipPath: [
                "polygon(50% 0%, 0% 100%, 100% 100%)",
                "polygon(50% 20%, 20% 100%, 80% 100%)",
                "polygon(50% 0%, 0% 100%, 100% 100%)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

const UsageIcon = ({ usage, size = 16 }: { usage: GreekLetterUsage; size?: number }) => {
  const iconProps = { width: size, height: size }

  switch (usage) {
    case "change":
      return (
        <motion.svg {...iconProps} viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.svg>
      )
    case "limits":
      return (
        <motion.svg {...iconProps} viewBox="0 0 24 24" fill="none">
          <motion.circle
            cx="12"
            cy="12"
            r="8"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.circle
            cx="12"
            cy="12"
            r="3"
            fill="currentColor"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.svg>
      )
    case "angles":
      return (
        <motion.svg {...iconProps} viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M12 2L2 22H22L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.svg>
      )
    case "constants":
      return (
        <motion.svg {...iconProps} viewBox="0 0 24 24" fill="none">
          <motion.rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.path
            d="M9 9H15M9 15H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.svg>
      )
    case "functions":
      return (
        <motion.svg {...iconProps} viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M3 12C3 12 5.5 8 12 8S21 12 21 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.path
            d="M3 12C3 12 5.5 16 12 16S21 12 21 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.svg>
      )
    case "summation":
      return (
        <motion.svg {...iconProps} viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M6 4H18L12 12L18 20H6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.svg>
      )
    case "integration":
      return (
        <motion.svg {...iconProps} viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M8 2C8 2 4 6 4 12S8 22 8 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              d: ["M8 2C8 2 4 6 4 12S8 22 8 22", "M8 2C8 2 6 6 6 12S8 22 8 22", "M8 2C8 2 4 6 4 12S8 22 8 22"],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.path
            d="M16 2C16 2 20 6 20 12S16 22 16 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              d: [
                "M16 2C16 2 20 6 20 12S16 22 16 22",
                "M16 2C16 2 18 6 18 12S16 22 16 22",
                "M16 2C16 2 20 6 20 12S16 22 16 22",
              ],
            }}
            transition={{ duration: 2, delay: 0.3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.svg>
      )
    default:
      return (
        <motion.div
          className="w-full h-full bg-current rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      )
  }
}

const FloatingMathSymbol = ({ symbol, className }: { symbol: string; className?: string }) => (
  <motion.div
    className={`absolute text-white/10 font-bold select-none pointer-events-none ${className}`}
    animate={{
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  >
    {symbol}
  </motion.div>
)

export function GreekLettersView({ onBack, onClose }: GreekLettersViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("scroll")
  const [focusedLetter, setFocusedLetter] = useState<GreekLetter | null>(null)
  const [recentLetters, setRecentLetters] = useState<string[]>([])
  const [favoriteLetters, setFavoriteLetters] = useState<string[]>([])
  const [usageFilter, setUsageFilter] = useState<UsageFilter>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [lettersViewed, setLettersViewed] = useState(0)
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Load saved data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("mascot-favorite-letters")
    const savedRecent = localStorage.getItem("mascot-recent-letters")
    const savedViewed = localStorage.getItem("mascot-letters-viewed")

    if (savedFavorites) setFavoriteLetters(JSON.parse(savedFavorites))
    if (savedRecent) setRecentLetters(JSON.parse(savedRecent))
    if (savedViewed) setLettersViewed(Number.parseInt(savedViewed))
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("mascot-favorite-letters", JSON.stringify(favoriteLetters))
  }, [favoriteLetters])

  useEffect(() => {
    localStorage.setItem("mascot-recent-letters", JSON.stringify(recentLetters))
  }, [recentLetters])

  useEffect(() => {
    localStorage.setItem("mascot-letters-viewed", lettersViewed.toString())
  }, [lettersViewed])

  // Save scroll position when switching to focus mode
  useEffect(() => {
    if (viewMode === "focus" && scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollTop)
    }
  }, [viewMode])

  // Restore scroll position when returning to scroll mode
  useEffect(() => {
    if (viewMode === "scroll" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition
    }
  }, [viewMode, scrollPosition])

  const getFilteredLetters = () => {
    return greekLetters.filter((letter) => {
      const usageMatch = usageFilter === "all" || letter.usage.includes(usageFilter)
      const difficultyMatch = difficultyFilter === "all" || letter.difficulty === difficultyFilter
      return usageMatch && difficultyMatch
    })
  }

  const toggleFavorite = (letterId: string) => {
    setFavoriteLetters((prev) => (prev.includes(letterId) ? prev.filter((id) => id !== letterId) : [...prev, letterId]))
  }

  const focusOnLetter = (letter: GreekLetter) => {
    setFocusedLetter(letter)
    setViewMode("focus")

    // Update recent letters and viewed count
    setRecentLetters((prev) => [letter.id, ...prev.filter((id) => id !== letter.id).slice(0, 5)])
    setLettersViewed((prev) => prev + 1)
  }

  const shrinkLetter = () => {
    setViewMode("scroll")
  }

  // const getRandomLetter = () => {
  //   const filteredLetters = getFilteredLetters()
  //   const availableLetters = filteredLetters.filter((letter) => !recentLetters.includes(letter.id))

  //   if (availableLetters.length === 0) {
  //     setRecentLetters([])
  //     return filteredLetters[Math.floor(Math.random() * filteredLetters.length)]
  //   }

  //   return availableLetters[Math.floor(Math.random() * availableLetters.length)]
  // }

  const playPronunciation = (pronunciation: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(pronunciation)
      utterance.rate = 0.7
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const usageOptions: { value: UsageFilter; label: string }[] = [
    { value: "all", label: "All Uses" },
    { value: "change", label: "Change" },
    { value: "limits", label: "Limits" },
    { value: "angles", label: "Angles" },
    { value: "constants", label: "Constants" },
    { value: "functions", label: "Functions" },
    { value: "summation", label: "Summation" },
    { value: "integration", label: "Integration" },
  ]

  const difficultyOptions: { value: DifficultyFilter; label: string }[] = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm">Greek Letters</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>
      </div>

      {/* Filters - Only show in scroll mode */}
      {viewMode === "scroll" && (
        <div className="mb-4 flex-shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2"
          >
            <Filter size={14} />
            <span>Filters ({getFilteredLetters().length} letters)</span>
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 mb-3"
              >
                <div className="flex flex-wrap gap-1">
                  {usageOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setUsageFilter(option.value)}
                      className={`text-xs px-2 py-1 rounded-full transition-colors flex items-center gap-1 ${
                        usageFilter === option.value
                          ? "bg-purple-500/30 text-purple-700 dark:text-purple-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {option.value !== "all" && <UsageIcon usage={option.value as GreekLetterUsage} size={12} />}
                      {option.label}
                    </motion.button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {difficultyOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setDifficultyFilter(option.value)}
                      className={`text-xs px-2 py-1 rounded-full transition-colors flex items-center gap-1 ${
                        difficultyFilter === option.value
                          ? "bg-green-500/30 text-green-700 dark:text-green-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {option.value !== "all" && (
                        <DifficultyIcon difficulty={option.value as DifficultyLevel} size={12} />
                      )}
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "scroll" ? (
            <motion.div
              key="scroll-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {/* Scrollable Letters Grid */}
              <div
                ref={scrollRef}
                className="h-full overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                <AnimatePresence>
                  {getFilteredLetters().map((letter, index) => (
                    <motion.div
                      key={letter.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 bg-gradient-to-r ${letter.color} rounded-xl border border-white/30 cursor-pointer relative overflow-hidden group`}
                      onClick={() => focusOnLetter(letter)}
                      onMouseEnter={() => setHoveredLetter(letter.id)}
                      onMouseLeave={() => setHoveredLetter(null)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Animated background elements */}
                      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FloatingMathSymbol symbol="∂" className="text-3xl top-2 right-2" />
                      </div>

                      <div className="relative z-10 flex items-center gap-4">
                        <motion.div
                          className="text-center"
                          whileHover={{ scale: 1.1, rotateY: 180 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-3xl font-bold text-white mb-1">{letter.symbol}</div>
                          <div className="text-xs text-white/70 font-mono">
                            {letter.lowercase}/{letter.uppercase}
                          </div>
                        </motion.div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg text-white">{letter.name}</h4>
                            <div className="flex items-center gap-1">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  playPronunciation(letter.pronunciation)
                                }}
                                className="p-1 rounded-full text-white/70 hover:text-white transition-colors"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Volume2 size={14} />
                              </motion.button>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(letter.id)
                                }}
                                className={`p-1 rounded-full transition-colors ${
                                  favoriteLetters.includes(letter.id)
                                    ? "text-yellow-300"
                                    : "text-white/50 hover:text-yellow-300"
                                }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Heart size={14} fill={favoriteLetters.includes(letter.id) ? "currentColor" : "none"} />
                              </motion.button>
                            </div>
                          </div>

                          <div className="text-sm text-white/80 mb-2 font-medium">{letter.pronunciation}</div>

                          <div className="flex gap-1 flex-wrap mb-2">
                            {letter.usage.slice(0, 2).map((usage) => (
                              <span
                                key={usage}
                                className="text-xs px-2 py-1 rounded-full bg-white/20 text-white flex items-center gap-1"
                              >
                                <UsageIcon usage={usage} size={10} />
                                {usage}
                              </span>
                            ))}
                            {letter.usage.length > 2 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                                +{letter.usage.length - 2} more
                              </span>
                            )}
                            <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white flex items-center gap-1">
                              <DifficultyIcon difficulty={letter.difficulty} size={10} />
                              {letter.difficulty}
                            </span>
                          </div>

                          <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">{letter.calculusUse}</p>
                        </div>
                      </div>

                      {/* Hover indicator */}
                      <motion.div
                        className="absolute bottom-2 right-2 text-white/50 text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredLetter === letter.id ? 1 : 0 }}
                      >
                        Click to explore →
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="focus-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col"
            >
              {focusedLetter && (
                <>
                  {/* Focused Letter Content */}
                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <div
                      className={`p-6 bg-gradient-to-br ${focusedLetter.color} rounded-2xl mb-4 border border-white/30 relative overflow-hidden`}
                    >
                      {/* Shrink button */}
                      <motion.button
                        onClick={shrinkLetter}
                        className="absolute top-3 right-3 bg-white/30 hover:bg-white/40 text-white p-2 rounded-full z-20 shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Minimize size={18} />
                      </motion.button>

                      {/* Animated background elements */}
                      <FloatingMathSymbol symbol="∞" className="text-6xl top-4 right-4" />
                      <FloatingMathSymbol symbol="∫" className="text-4xl bottom-4 left-4" />
                      <FloatingMathSymbol symbol="∂" className="text-3xl top-1/2 left-1/4" />
                      <FloatingMathSymbol symbol="∑" className="text-5xl bottom-1/3 right-1/3" />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <motion.div
                              className="text-center"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <motion.div
                                className="text-6xl font-bold text-white mb-2"
                                animate={{ rotateY: [0, 360] }}
                                transition={{ duration: 2, delay: 0.5 }}
                              >
                                {focusedLetter.symbol}
                              </motion.div>
                              <div className="text-sm text-white/80 font-mono">
                                {focusedLetter.lowercase} / {focusedLetter.uppercase}
                              </div>
                            </motion.div>
                            <div>
                              <motion.h4
                                className="font-bold text-2xl text-white mb-2"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                {focusedLetter.name}
                              </motion.h4>
                              <motion.button
                                onClick={() => playPronunciation(focusedLetter.pronunciation)}
                                className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors bg-white/20 px-3 py-1 rounded-full"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Volume2 size={14} />
                                <span className="font-medium">{focusedLetter.pronunciation}</span>
                              </motion.button>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => toggleFavorite(focusedLetter.id)}
                            className={`p-2 rounded-full transition-colors ${
                              favoriteLetters.includes(focusedLetter.id)
                                ? "text-yellow-300 hover:text-yellow-200"
                                : "text-white/60 hover:text-yellow-300"
                            }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart
                              size={20}
                              fill={favoriteLetters.includes(focusedLetter.id) ? "currentColor" : "none"}
                            />
                          </motion.button>
                        </div>

                        <motion.div
                          className="flex gap-2 flex-wrap mb-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {focusedLetter.usage.map((usage, index) => (
                            <motion.span
                              key={usage}
                              className="text-sm px-3 py-1 rounded-full border bg-white/20 text-white font-medium flex items-center gap-2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                            >
                              <UsageIcon usage={usage} size={14} />
                              {usage}
                            </motion.span>
                          ))}
                          <motion.span
                            className="text-sm px-3 py-1 rounded-full bg-white/20 text-white font-medium flex items-center gap-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + focusedLetter.usage.length * 0.1 }}
                          >
                            <DifficultyIcon difficulty={focusedLetter.difficulty} size={14} />
                            {focusedLetter.difficulty}
                          </motion.span>
                        </motion.div>

                        <div className="space-y-4 text-white">
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <h5 className="font-semibold text-lg mb-2 flex items-center gap-2">
                              <BookOpen size={18} />
                              Used in Calculus:
                            </h5>
                            <p className="text-base leading-relaxed text-white/90 bg-white/10 p-3 rounded-lg">
                              {focusedLetter.calculusUse}
                            </p>
                          </motion.div>

                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <h5 className="font-semibold text-lg mb-2 flex items-center gap-2">
                              <Target size={18} />
                              Example:
                            </h5>
                            <div className="text-base leading-relaxed text-white/90 font-mono bg-white/10 p-3 rounded-lg border-l-4 border-white/30">
                              {focusedLetter.example}
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            <h5 className="font-semibold text-lg mb-2 flex items-center gap-2">
                              <Zap size={18} />
                              Fun Fact:
                            </h5>
                            <p className="text-base leading-relaxed text-white/90 bg-white/10 p-3 rounded-lg">
                              {focusedLetter.funFact}
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back to list button */}
                  <motion.button
                    onClick={shrinkLetter}
                    className="w-full py-2 mt-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <ArrowLeft size={14} />
                    Back to Letter List
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Stats - Only show in scroll mode */}
      {viewMode === "scroll" && (
        <motion.div
          className="mt-3 text-center flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-4">
            <span>📚 {getFilteredLetters().length} letters</span>
            <span>⭐ {favoriteLetters.length} favorites</span>
            <span>👁️ {lettersViewed} viewed</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
