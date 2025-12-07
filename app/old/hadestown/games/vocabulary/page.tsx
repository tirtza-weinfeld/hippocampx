"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { BookIcon, ListTodoIcon, PuzzleIcon, ShuffleIcon, HelpCircleIcon, XIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { QuizGame, MatchingGame, FillBlanksGame, CategorySortGame } from "@/components/old/hadestown/games"
import { HADESTOWN_VOCABULARY, HADESTOWN_GAME_GUIDES, HADESTOWN_THEME } from "@/lib/data/vocabulary"

type TabId = "quiz" | "matching" | "fillBlanks" | "categories"

const TABS: { id: TabId; label: string; icon: typeof ListTodoIcon }[] = [
  { id: "quiz", label: "Quiz", icon: ListTodoIcon },
  { id: "matching", label: "Matching", icon: PuzzleIcon },
  { id: "fillBlanks", label: "Fill Blanks", icon: BookIcon },
  { id: "categories", label: "Categories", icon: ShuffleIcon },
]

export default function VocabularyGamesPage() {
  const shouldReduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<TabId>("quiz")
  const [showGuide, setShowGuide] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  function handleGameComplete() {
    setShowCelebration(true)
  }

  return (
    <main className="hadestown @container min-h-screen py-8 bg-gradient-to-b from-amber-50/30 to-amber-100/20 dark:from-gray-900 dark:to-amber-950/30 text-foreground">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 dark:from-amber-500/10 dark:to-amber-500/10" />
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/10" />
        <div className="railroad-pattern absolute inset-0 opacity-5 dark:opacity-10" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <PageHeader
          title={HADESTOWN_THEME.title}
          subtitle={HADESTOWN_THEME.subtitle}
          badges={HADESTOWN_THEME.badges}
          shouldReduceMotion={shouldReduceMotion}
        />

        {/* How to Play button */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={() => setShowGuide(true)}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all text-game-primary border border-game-border"
          >
            <HelpCircleIcon className="h-5 w-5" />
            <span>How to Play</span>
          </motion.button>
        </div>

        {/* Game container */}
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg border-none">
          {/* Tabs */}
          <GameTabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Content */}
          <CardContent className="p-6 bg-game-surface min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === "quiz" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="h-full"
                >
                  <QuizGame
                    items={HADESTOWN_VOCABULARY.quiz}
                    onComplete={handleGameComplete}
                  />
                </motion.div>
              )}

              {activeTab === "matching" && (
                <motion.div
                  key="matching"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                >
                  <MatchingGame
                    pairs={HADESTOWN_VOCABULARY.matching}
                    onComplete={handleGameComplete}
                  />
                </motion.div>
              )}

              {activeTab === "fillBlanks" && (
                <motion.div
                  key="fillBlanks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                >
                  <FillBlanksGame
                    sentences={HADESTOWN_VOCABULARY.fillBlanks}
                    onComplete={handleGameComplete}
                  />
                </motion.div>
              )}

              {activeTab === "categories" && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                >
                  <CategorySortGame
                    categories={HADESTOWN_VOCABULARY.categories}
                    onComplete={handleGameComplete}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <GameGuideModal
            guide={HADESTOWN_GAME_GUIDES[activeTab]}
            onClose={() => setShowGuide(false)}
          />
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationModal
            message={HADESTOWN_THEME.celebrationMessage}
            onClose={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

type PageHeaderProps = {
  title: string
  subtitle: string
  badges: string[]
  shouldReduceMotion: boolean | null
}

function PageHeader({ title, subtitle, badges, shouldReduceMotion }: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <motion.div
        className="inline-block relative mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-game-primary/20 via-game-primary-dark/20 to-game-primary/20 rounded-lg blur-md" />
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-8 py-4 shadow-lg">
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={shouldReduceMotion ? undefined : { rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <BookIcon className="h-8 w-8 text-game-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-game-gradient">
              {title}
            </h1>
            <motion.div
              animate={shouldReduceMotion ? undefined : { rotate: [0, -10, 0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <BookIcon className="h-8 w-8 text-game-primary" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.p
        className="text-lg text-game-text-muted max-w-xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
      >
        {subtitle}
      </motion.p>

      <motion.div
        className="flex justify-center gap-2 mt-3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.5 }}
      >
        {badges.map((badge, i) => (
          <motion.span
            key={badge}
            className="text-xs font-bold game-primary-soft text-game-primary px-2 py-1 rounded-full"
            animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          >
            {badge}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

type GameTabsProps = {
  tabs: typeof TABS
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

function GameTabs({ tabs, activeTab, onTabChange }: GameTabsProps) {
  return (
    <div className="flex overflow-x-auto snap-x scrollbar-hide rounded-t-lg bg-gradient-to-r from-game-primary/40 to-game-primary-dark/50">
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-1 min-w-[100px] flex items-center justify-center gap-2 py-4 px-3 transition-all duration-300 ${
              isActive
                ? "text-white"
                : "text-gray-500 hover:text-game-primary dark:text-gray-400"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="tab-background"
                className="absolute inset-0 bg-game-gradient"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

type GameGuideModalProps = {
  guide: { title: string; steps: string[] }
  onClose: () => void
}

function GameGuideModal({ guide, onClose }: GameGuideModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-game-surface rounded-xl p-6 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-game-primary">
            How to Play: {guide.title}
          </h2>
          <button
            onClick={onClose}
            className="text-game-text-muted hover:text-game-text"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {guide.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full game-primary-soft text-game-primary flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <p className="text-game-text">{step}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-game-gradient text-white rounded-full shadow-md"
            onClick={onClose}
          >
            Got it!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

type CelebrationModalProps = {
  message: string
  onClose: () => void
}

function CelebrationModal({ message, onClose }: CelebrationModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-game-surface rounded-xl p-6 max-w-md w-full shadow-2xl text-center"
        onClick={e => e.stopPropagation()}
      >
        <motion.div
          animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-4 text-6xl"
        >
          ⭐
        </motion.div>
        <h2 className="text-2xl font-bold text-game-primary mb-4">
          Congratulations!
        </h2>
        <p className="text-game-text mb-6">{message}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-game-gradient text-white rounded-full shadow-md"
          onClick={onClose}
        >
          Continue Learning
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
