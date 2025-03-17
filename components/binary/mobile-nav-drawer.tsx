"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Calculator, HelpCircle, Dumbbell, Lightbulb, Gamepad2, X } from "lucide-react"
import BinaryMascot, { type MascotEmotion } from "./binary-mascot"
import { FunButton } from "./fun-button"

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MobileNavDrawer({ isOpen, onClose, activeTab, setActiveTab }: MobileNavDrawerProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when drawer is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  const navItems = [
    {
      id: "learn",
      label: "Learn",
      icon: <BookOpen className="h-5 w-5 mr-2" />,
      gradient: "from-violet-500 to-blue-500",
      mascotEmotion: "happy",
    },
    {
      id: "convert",
      label: "Convert",
      icon: <Calculator className="h-5 w-5 mr-2" />,
      gradient: "from-blue-500 to-indigo-500",
      mascotEmotion: "thinking",
    },
    {
      id: "explain",
      label: "How To",
      icon: <HelpCircle className="h-5 w-5 mr-2" />,
      gradient: "from-indigo-500 to-blue-500",
      mascotEmotion: "thinking",
    },
    {
      id: "practice",
      label: "Practice",
      icon: <Dumbbell className="h-5 w-5 mr-2" />,
      gradient: "from-blue-500 to-cyan-500",
      mascotEmotion: "excited",
    },
    {
      id: "fun",
      label: "Fun Facts",
      icon: <Lightbulb className="h-5 w-5 mr-2" />,
      gradient: "from-violet-500 to-indigo-500",
      mascotEmotion: "celebrating",
    },
    {
      id: "play",
      label: "Play",
      icon: <Gamepad2 className="h-5 w-5 mr-2" />,
      gradient: "from-blue-500 to-violet-500",
      mascotEmotion: "excited",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[80vw] max-w-[380px] bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 z-50 shadow-2xl overflow-auto"
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-8">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                  >
                    <BinaryMascot emotion="happy" size="sm" />
                  </motion.div>
                  <h2 className="text-xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
                    Navigation
                  </h2>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <FunButton
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full hover:bg-white/20 dark:hover:bg-white/10 h-14 w-14"
                    aria-label="Close navigation"
                    icon={<X className="h-6 w-6" />}
                    bubbles={false}
                  >
                    <span className="sr-only">Close</span>
                  </FunButton>
                </motion.div>
              </div>

              {/* Navigation items */}
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                {navItems.map((navItem) => (
                  <motion.div key={navItem.id} variants={item}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        x: 5,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FunButton
                        variant={activeTab === navItem.id ? "default" : "ghost"}
                        className={`w-full justify-start text-lg h-16 rounded-xl ${
                          activeTab === navItem.id
                            ? `bg-gradient-to-r ${navItem.gradient} text-white shadow-lg`
                            : "bg-white/20 dark:bg-white/5 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-white/10"
                        }`}
                        onClick={() => {
                          setActiveTab(navItem.id)
                          onClose()
                        }}
                        bubbles={activeTab === navItem.id}
                        size="lg"
                      >
                        <div className="flex items-center w-full">
                          {navItem.icon}
                          <span className="flex-1 truncate text-lg font-bold">{navItem.label}</span>
                          {activeTab === navItem.id && (
                            <motion.div
                              className="flex-shrink-0 ml-2"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
                            >
                              <BinaryMascot emotion={navItem.mascotEmotion as MascotEmotion} size="sm" />
                            </motion.div>
                          )}
                        </div>
                      </FunButton>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Footer tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-auto pt-6 border-t border-white/20 dark:border-white/10"
              >
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  <motion.div
                    className="p-4 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur-sm shadow-sm"
                    whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.4)" }}
                  >
                    <h3 className="font-bold mb-2 flex items-center">
                      <span className="mr-2">✨</span>
                      Quick Tips
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">👆</span>
                        <span>Swipe left or right to navigate between tabs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">🌙</span>
                        <span>Tap the theme icon to toggle dark mode</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

