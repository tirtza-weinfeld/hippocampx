"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { MascotCharacter, MascotPosition, MascotSettings } from "./mascot/mascot-data"
import { characterImages, characterColors, positionClasses } from "./mascot/mascot-data"
import { MainView } from "./mascot/main-view"
import { DictionaryView } from "./mascot/dictionary-view"
import { GreekLettersView } from "./mascot/greek-letters-view"
import { SettingsView } from "./mascot/settings-view"
import { BottomNavigation } from "./mascot/bottom-navigation"

type MascotProps = {
  message?: string
  position?: MascotPosition
  character?: MascotCharacter
}

type ActiveFeature = "main" | "dictionary" | "greek" | "settings"

export function Mascot({
  message = "Hi there! Need help with calculus?",
  position = "bottom-right",
  character = "newton",
}: MascotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>("main")
  const [settings, setSettings] = useState<MascotSettings>({
    character,
    position,
    showTips: true,
  })

  const dialogRef = useRef<HTMLDivElement>(null)

  // Load saved active feature from localStorage
  useEffect(() => {
    const savedActiveFeature = localStorage.getItem("mascot-active-feature")
    if (savedActiveFeature && ["main", "dictionary", "greek", "settings"].includes(savedActiveFeature)) {
      setActiveFeature(savedActiveFeature as ActiveFeature)
    }
  }, [])

  // Save active feature to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("mascot-active-feature", activeFeature)
  }, [activeFeature])

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

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    // Don't reset to main when reopening - keep the saved active feature
  }

  const updateSettings = (newSettings: Partial<MascotSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const handleGreekClick = () => {
    setActiveFeature("greek")
  }

  return (
    <div className={`fixed ${positionClasses[settings.position]} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4 bg-background/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border-2 border-primary/50 overflow-hidden"
            style={{ width: "420px", height: "520px" }}
          >
            {/* Main Content Area */}
            <div className="p-4 h-[460px] overflow-hidden flex flex-col">
              {activeFeature === "main" && (
                <MainView character={settings.character} message={message} onClose={() => setIsOpen(false)} />
              )}

              {activeFeature === "dictionary" && (
                <DictionaryView onBack={() => setActiveFeature("main")} onClose={() => setIsOpen(false)} />
              )}

              {activeFeature === "greek" && (
                <GreekLettersView onBack={() => setActiveFeature("main")} onClose={() => setIsOpen(false)} />
              )}

              {activeFeature === "settings" && (
                <SettingsView
                  settings={settings}
                  onBack={() => setActiveFeature("main")}
                  onClose={() => setIsOpen(false)}
                  onUpdateSettings={updateSettings}
                />
              )}
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation
              activeFeature={activeFeature}
              onFeatureChange={setActiveFeature}
              onGreekClick={handleGreekClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Button */}
      <div className="relative">
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
          <span className="text-2xl">{characterImages[settings.character]}</span>
        </motion.button>
      </div>
    </div>
  )
}
