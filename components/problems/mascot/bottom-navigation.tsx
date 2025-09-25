"use client"

import { motion } from "motion/react"
import { List, Book, Settings } from "lucide-react"
import { ActiveFeature } from "./mascot-types"

interface BottomNavigationProps {
  activeFeature: ActiveFeature
  onFeatureChange: (feature: ActiveFeature) => void
}

export function BottomNavigation({ activeFeature, onFeatureChange }: BottomNavigationProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/80 p-2 h-[60px] flex items-center">
      <div className="flex items-center justify-center gap-2 w-full">
        <motion.button
          onClick={() => onFeatureChange("main")}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs transition-colors
            hover:shadow-lg hover:shadow-blue-500 dark:hover:shadow-blue-700 ${
            activeFeature === "main"
              ? "bg-blue-500/30 text-blue-700 dark:text-blue-300"
              : "hover:bg-blue-500/30 dark:hover:bg-blue-700 text-gray-600 dark:text-gray-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <List size={14} />
          <span>Problems</span>
        </motion.button>

        {/* <motion.button
          onClick={() => onFeatureChange("dictionary")}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs transition-colors
            hover:shadow-lg hover:shadow-purple-500 dark:hover:shadow-purple-700 ${
            activeFeature === "dictionary"
              ? "bg-purple-500/30 text-purple-700 dark:text-purple-300"
              : "hover:bg-purple-500/30 dark:hover:bg-purple-700 text-gray-600 dark:text-gray-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Book size={14} />
          <span>Dictionary</span>
        </motion.button> */}

        <motion.button
          onClick={() => onFeatureChange("settings")}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs transition-colors
            hover:shadow-lg hover:shadow-green-500 dark:hover:shadow-green-700 ${
            activeFeature === "settings"
              ? "bg-green-500/30 text-green-700 dark:text-green-300"
              : "hover:bg-green-500/30 dark:hover:bg-green-700 text-gray-600 dark:text-gray-400"    
          }
          `}
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