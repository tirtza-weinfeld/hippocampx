"use client"

import { motion } from "motion/react"
import { BookOpen, Calculator, HelpCircle, Dumbbell, Lightbulb, Gamepad2 } from "lucide-react"
import BinaryMascot from "./binary-mascot"
import { FunButton } from "./fun-button"

interface MobileNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const navItems = [
    { id: "learn", label: "Learn", icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { id: "convert", label: "Convert", icon: <Calculator className="h-5 w-5 mr-2" /> },
    { id: "explain", label: "How To", icon: <HelpCircle className="h-5 w-5 mr-2" /> },
    { id: "practice", label: "Practice", icon: <Dumbbell className="h-5 w-5 mr-2" /> },
    { id: "fun", label: "Fun Facts", icon: <Lightbulb className="h-5 w-5 mr-2" /> },
    { id: "play", label: "Play", icon: <Gamepad2 className="h-5 w-5 mr-2" /> },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300 } },
  }

  return (
    <div className="flex flex-col h-full py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
        >
          <BinaryMascot emotion="happy" size="sm" />
        </motion.div>
        <h2 className="text-xl font-bold ml-2">Navigation</h2>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        {navItems.map((navItem) => (
          <motion.div key={navItem.id} variants={item}>
            <motion.div whileHover={{ scale: 1.03, x: 5 }} whileTap={{ scale: 0.97 }}>
              <FunButton
                variant={activeTab === navItem.id ? "default" : "ghost"}
                className={`w-full justify-start text-lg ${
                  activeTab === navItem.id ? "bg-gradient-to-r from-violet-500 to-blue-500" : ""
                }`}
                onClick={() => {
                  setActiveTab(navItem.id)
                }}
                icon={navItem.icon}
                iconPosition="left"
                bubbles={activeTab === navItem.id}
              >
                <span className="truncate mr-2">{navItem.label}</span>
                {activeTab === navItem.id && (
                  <motion.div
                    className="ml-auto flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, type: "spring" as const, stiffness: 400 }}
                  >
                    <BinaryMascot emotion="excited" size="sm" />
                  </motion.div>
                )}
              </FunButton>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700"
      >
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <motion.p className="mb-2" whileHover={{ x: 3, color: "#6d28d9" }}>
            Tip: Swipe left or right to navigate between tabs
          </motion.p>
          <motion.p whileHover={{ x: 3, color: "#6d28d9" }}>Tap the theme icon to toggle dark mode</motion.p>
        </div>
      </motion.div>
    </div>
  )
}

