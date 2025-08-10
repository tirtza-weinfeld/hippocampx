"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { NotesMascotCharacter, MascotPosition, MascotSettings } from "./mascot/notes-data"
import { characterImages, characterColors } from "./mascot/notes-data"
import { NotesSearchView } from "./mascot/notes-search-view"
import { DictionaryView } from "./mascot/dictionary-view"
import { ProblemsView } from "./mascot/problems-view"
import { BottomNavigation } from "./mascot/bottom-navigation"

type NotesMascotProps = {
  message?: string
  position?: MascotPosition
  character?: NotesMascotCharacter
}

type ActiveFeature = "search" | "dictionary" | "problems" | "settings"

export function NotesMascot({
  message = "Hi! Need help finding notes or algorithms?",
  position = "bottom-right", 
  character = "ada",
}: NotesMascotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>("search")
  const [settings, setSettings] = useState<MascotSettings>({
    character,
    position,
    showTips: true,
  })

  const containerRef = useRef<HTMLDivElement>(null)

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("notes-mascot-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        console.error("Failed to parse mascot settings:", error)
      }
    }
  }, [])

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem("notes-mascot-settings", JSON.stringify(settings))
  }, [settings])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const updateSettings = (newSettings: Partial<MascotSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 z-50 ">
      {/* Mascot Button */}
      <button
        className={`w-14 h-14 rounded-full bg-gradient-to-r ${characterColors[settings.character]} text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 hover:shadow-xl transition-shadow`}
        onClick={toggleOpen}
      >
        <span className="text-2xl">{characterImages[settings.character]}</span>
      </button>

      {/* Floating tooltip */}
      {settings.showTips && !isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-full right-0 mb-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-2 max-w-48 shadow-lg"
        >
          {message}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </motion.div>
      )}

      {/* Dialog - Absolute Positioning relative to mascot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15 }}
            className=" bottom-10 right-3 mr-4 bg-background/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border-2 border-primary/50 overflow-hidden w-[95vw] sm:w-[420px] h-[90vh] sm:h-[520px] max-w-[420px] max-h-[520px]"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'manipulation',
              transform: 'translate3d(0,0,0)',
              position: 'fixed',
              zIndex: 9999,
            }}
          >
            {/* Header with Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg">
                {activeFeature === "search" && "🔍 Search Notes"}
                {activeFeature === "problems" && "🧩 LeetCode Problems"}
                {activeFeature === "dictionary" && "📚 Dictionary"}
                {activeFeature === "settings" && "⚙️ Settings"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              >
                ✕
              </button>
            </div>

            {/* Main Content Area */}
            <div className="p-4 h-[calc(100%-120px)] overflow-hidden flex flex-col" style={{ WebkitOverflowScrolling: 'touch' }}>
              {activeFeature === "search" && (
                <NotesSearchView />
              )}

              {activeFeature === "problems" && (
                <ProblemsView />
              )}

              {activeFeature === "dictionary" && (
                <DictionaryView />
              )}

              {activeFeature === "settings" && (
                <div className="flex flex-col h-full">
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Character</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["ada", "turing", "dijkstra", "knuth"] as const).map((char) => (
                          <button
                            key={char}
                            onClick={() => updateSettings({ character: char })}
                            className={`p-2 rounded-lg border text-sm ${
                              settings.character === char
                                ? "border-primary bg-primary/10"
                                : "border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                            }`}
                          >
                            {characterImages[char]} {char}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Show Tips</span>
                      <button
                        onClick={() => updateSettings({ showTips: !settings.showTips })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.showTips ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            settings.showTips ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation
                activeFeature={activeFeature}
                onFeatureChange={setActiveFeature}
              />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}