"use client"

import { motion, AnimatePresence } from "motion/react"
import { X, Brain, BarChart, Sparkles, Bot, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileNavProps {
  isOpen: boolean
  activeTab: string
  onTabChange: (tab: string) => void
  onClose: () => void
}

export default function MobileNav({ isOpen, activeTab, onTabChange, onClose }: MobileNavProps) {
  const tabs = [
    {
      id: "what-is-ai",
      label: "What is AI?",
      icon: <Brain className="h-5 w-5" />,
      color: "from-blue-500 to-purple-500",
    },
    { id: "train-ml", label: "Train ML", icon: <BarChart className="h-5 w-5" />, color: "from-green-500 to-blue-500" },
    {
      id: "advanced",
      label: "Advanced AI",
      icon: <Sparkles className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "robot-friend",
      label: "Robot Friend",
      icon: <Bot className="h-5 w-5" />,
      color: "from-green-500 to-teal-500",
    },
    { id: "quiz", label: "Fun Quiz", icon: <BookOpen className="h-5 w-5" />, color: "from-orange-500 to-red-500" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-3/4 max-w-xs bg-white dark:bg-slate-800 z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                <h2 className="font-bold text-lg dark:text-white">Navigation</h2>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onTabChange(tab.id)}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                        : "hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                    aria-label={`Go to ${tab.label} section`}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    <span className="font-medium dark:text-gray-200">{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* <div className="p-4 border-t dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Swipe to navigate between sections
                </div>
              </div> */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

