"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LearnSection } from "./sections/learn-section"
import { CountingGame } from "./sections/counting-game"
import { HotelGame } from "./sections/hotel-game"
import { NumberLineGame } from "./sections/number-line-game"
import { InfinityComparison } from "./sections/infinity-comparison"
import { TransfiniteNumbers } from "./sections/transfinite-numbers"
import { AlephNumbers } from "./sections/aleph-numbers"
import { AbsoluteInfinite } from "./sections/absolute-infinite"
import {
  SparklesIcon,
  HashIcon,
  BuildingIcon,
  RulerIcon,
  ScaleIcon,
  InfinityIcon,
  VariableIcon,
  ZapIcon,
} from "./icons/tab-icons"

type Tab = "learn" | "counting" | "hotel" | "number-line" | "compare" | "transfinite" | "aleph" | "absolute"

export function InfinityExplorer() {
  const [activeTab, setActiveTab] = useState<Tab>("learn")
  const [contentHeight, setContentHeight] = useState<number>(600)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: "learn", label: "Learn", icon: SparklesIcon, color: "bg-fun-yellow", darkColor: "dark:bg-fun-yellow/80" },
    { id: "counting", label: "Counting", icon: HashIcon, color: "bg-fun-orange", darkColor: "dark:bg-fun-orange/80" },
    { id: "hotel", label: "Hotel", icon: BuildingIcon, color: "bg-fun-purple", darkColor: "dark:bg-fun-purple/80" },
    {
      id: "number-line",
      label: "Number Line",
      icon: RulerIcon,
      color: "bg-fun-green",
      darkColor: "dark:bg-fun-green/80",
    },
    { id: "compare", label: "Compare", icon: ScaleIcon, color: "bg-fun-teal", darkColor: "dark:bg-fun-teal/80" },
    {
      id: "transfinite",
      label: "Transfinite",
      icon: InfinityIcon,
      color: "bg-fun-pink",
      darkColor: "dark:bg-fun-pink/80",
    },
    { id: "aleph", label: "Aleph", icon: VariableIcon, color: "bg-fun-orange", darkColor: "dark:bg-fun-orange/80" },
    {
      id: "absolute",
      label: "Absolute",
      icon: ZapIcon,
      color: "bg-fun-yellow",
      darkColor: "dark:bg-fun-yellow/80",
    },
  ]

  // Measure content height to prevent layout shifts
  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Add a small buffer to prevent scrollbars
          setContentHeight(entry.contentRect.height + 20)
        }
      })

      resizeObserver.observe(contentRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [activeTab])

  // Close mobile menu when a tab is selected
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [activeTab])

  return (
    <div className="space-y-6">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <nav className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-2">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    ${
                    activeTab === tab.id
                      ? "text-white "
                      : "text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300"

                  }`}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabDesktop"
                      className={`absolute inset-0 ${tab.color} ${tab.darkColor} rounded-full shadow-md`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center">
                    <Icon className="w-5 h-5 mr-2" />
                    <span>{tab.label}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md">
          <div className="flex justify-between items-center p-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M4 6H20M4 12H20M4 18H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
            <div className="flex items-center justify-center">
              <div className="font-bold text-lg bg-gradient-to-r from-fun-purple via-fun-pink to-fun-orange text-transparent bg-clip-text">
                {tabs.find((tab) => tab.id === activeTab)?.label || "Explore Infinity"}
              </div>
            </div>
            <div className="w-10"></div> {/* Empty div for balance */}
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 p-3">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`relative px-3 py-3 rounded-full text-sm font-bold transition-all flex items-center ${
                          activeTab === tab.id
                            ? "text-white"
                            : "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        aria-current={activeTab === tab.id ? "page" : undefined}
                      >
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTabMobile"
                            className={`absolute inset-0 ${tab.color} ${tab.darkColor} rounded-full shadow-md`}
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <span className="relative flex items-center">
                          <Icon className="w-5 h-5 mr-2" />
                          <span>{tab.label}</span>
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative transition-all duration-300 ease-in-out" style={{ minHeight: contentHeight }}>
        <div ref={contentRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {activeTab === "learn" && <LearnSection onExplore={() => setActiveTab("counting")} />}
              {activeTab === "counting" && <CountingGame />}
              {activeTab === "hotel" && <HotelGame />}
              {activeTab === "number-line" && <NumberLineGame />}
              {activeTab === "compare" && <InfinityComparison />}
              {activeTab === "transfinite" && <TransfiniteNumbers />}
              {activeTab === "aleph" && <AlephNumbers />}
              {activeTab === "absolute" && <AbsoluteInfinite />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

