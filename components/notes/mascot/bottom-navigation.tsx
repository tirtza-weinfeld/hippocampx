"use client"

import { motion } from "framer-motion"
import { Search, BookOpen, FileText, Settings } from "lucide-react"

type ActiveFeature = "search" | "dictionary" | "problems" | "settings"

interface BottomNavigationProps {
  activeFeature: ActiveFeature
  onFeatureChange: (feature: ActiveFeature) => void
}

export function BottomNavigation({ activeFeature, onFeatureChange }: BottomNavigationProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/80 p-2 h-[60px] flex items-center">
      <div className="flex items-center justify-center gap-1 w-full">
        <motion.button
          onClick={() => onFeatureChange("search")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeFeature === "search"
              ? "bg-blue-500/30 text-blue-700 dark:text-blue-300"
              : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search size={14} />
          <span>Search</span>
        </motion.button>

        <motion.button
          onClick={() => onFeatureChange("problems")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeFeature === "problems"
              ? "bg-green-500/30 text-green-700 dark:text-green-300"
              : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText size={14} />
          <span>Problems</span>
        </motion.button>

        <motion.button
          onClick={() => onFeatureChange("dictionary")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeFeature === "dictionary"
              ? "bg-purple-500/30 text-purple-700 dark:text-purple-300"
              : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BookOpen size={14} />
          <span>Dictionary</span>
        </motion.button>

        <motion.button
          onClick={() => onFeatureChange("settings")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeFeature === "settings"
              ? "bg-orange-500/30 text-orange-700 dark:text-orange-300"
              : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={14} />
          <span>Settings</span>
        </motion.button>
      </div>
    </div>
  )
}