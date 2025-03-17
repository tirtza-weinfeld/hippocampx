"use client"

import React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MusicIcon, BookIcon, PencilIcon, FlowerIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// Character data
const CHARACTERS = [
  {
    name: "Orpheus",
    role: "Music Guide",
    description: "The hopeful poet and musician who will teach you about lyrics and melody",
    iconColor: "amber",
    icon: <MusicIcon className="h-10 w-10" />,
    fullDescription:
      "Orpheus is a talented musician whose music is so beautiful it can charm all living things. In Hadestown, he falls in love with Eurydice and journeys to the underworld to bring her back.",
    funFacts: [
      "Orpheus's lyre was said to be given to him by Apollo",
      "His music could make rocks and trees dance",
      "He's known for his unwavering hope and optimism",
    ],
  },
  {
    name: "Eurydice",
    role: "Word Explorer",
    description: "The practical survivor who will help expand your vocabulary",
    iconColor: "red",
    icon: <BookIcon className="h-10 w-10" />,
    fullDescription:
      "Eurydice is a practical young woman who chooses to go to Hadestown during hard times. Her journey represents the difficult choices we sometimes make for survival.",
    funFacts: [
      "Eurydice is known for her resilience and practicality",
      "In the musical, she signs a contract with Hades",
      "Her name has Greek origins meaning 'wide justice'",
    ],
  },
  {
    name: "Hermes",
    role: "Storyteller",
    description: "The messenger of the gods who narrates your journey",
    iconColor: "blue",
    icon: <PencilIcon className="h-10 w-10" />,
    fullDescription:
      "Hermes is the messenger of the gods and the narrator of the Hadestown story. He guides souls to the underworld and serves as a bridge between worlds.",
    funFacts: [
      "Hermes is known as the god of boundaries and transitions",
      "He carries a staff called a caduceus",
      "In the musical, he's portrayed as a charismatic storyteller",
    ],
  },
  {
    name: "Persephone",
    role: "Season Guardian",
    description: "The goddess of spring who brings color and life",
    iconColor: "green",
    icon: <FlowerIcon className="h-10 w-10" />,
    fullDescription:
      "Persephone is the goddess of spring who spends half the year in the underworld with her husband Hades. Her comings and goings create the changing seasons.",
    funFacts: [
      "Persephone's return to the surface brings spring and summer",
      "Her departure to the underworld brings fall and winter",
      "She's known for her love of celebration and life",
    ],
  },
]

export function CharacterGuides() {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)

  // Handle modal open/close
  const openModal = (index: number) => setSelectedCharacter(index)
  const closeModal = () => setSelectedCharacter(null)

  return (
    <div className="py-16 relative overflow-hidden rounded-2xl shadow-lg border border-primary/20 dark:border-amber-700/30">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 to-amber-100/70 dark:from-gray-800/90 dark:to-gray-900/70"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-amber-800/20 dark:to-amber-900/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/20 to-accent/5 dark:from-amber-700/20 dark:to-amber-800/5 rounded-full translate-x-1/4 translate-y-1/4 animate-pulse"></div>
        <div className="railroad-pattern absolute inset-0 opacity-10"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-block relative mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-500 dark:to-amber-600 blur-lg opacity-30 rounded-full"></div>
            <h2 className="text-3xl md:text-5xl font-bold relative text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-500">
              Meet Your Guides
            </h2>
          </motion.div>

          <p className="max-w-xl mx-auto mb-10 text-lg text-muted-foreground dark:text-amber-300/90">
            These characters from the world of Hadestown will accompany you on your learning journey
          </p>
        </motion.div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {CHARACTERS.map((character, index) => (
            <motion.div
              key={character.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CharacterCard character={character} onClick={() => openModal(index)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCharacter !== null && (
          <CharacterModal character={CHARACTERS[selectedCharacter]} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  )
}

function CharacterCard({
  character,
  onClick,
}: {
  character: (typeof CHARACTERS)[number]
  onClick: () => void
}) {
  const gradientClass =
    character.iconColor === "amber"
      ? "bg-gradient-to-br from-amber-400 to-amber-500"
      : character.iconColor === "red"
        ? "bg-gradient-to-br from-red-400 to-red-500"
        : character.iconColor === "blue"
          ? "bg-gradient-to-br from-blue-400 to-blue-500"
          : "bg-gradient-to-br from-green-400 to-green-500"

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 h-full bg-white/80 dark:bg-gray-800/50 border border-primary/30 shadow-lg dark:border-amber-600/50 dark:shadow-amber-900/20 hover:shadow-xl dark:hover:shadow-amber-900/30"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Learn more about ${character.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick()
          e.preventDefault()
        }
      }}
    >
      <div className={`relative h-32 overflow-hidden ${gradientClass}`}>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/20 shadow-inner">
            {React.cloneElement(character.icon as React.ReactElement, {
              className: "h-10 w-10 text-white",
            })}
          </div>
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-500">
          {character.name}
        </h3>
        <p className="text-sm mb-3 text-muted-foreground dark:text-amber-300/90">{character.role}</p>
        <p className="text-sm mb-4 text-foreground dark:text-amber-100">{character.description}</p>

        <div className="mt-auto pt-2 border-t border-primary/20 dark:border-amber-700/30">
          <Button variant="ghost" size="sm" className="w-full text-primary dark:text-amber-400">
            Learn More
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function CharacterModal({
  character,
  onClose,
}: {
  character: (typeof CHARACTERS)[number]
  onClose: () => void
}) {
  const gradientClass =
    character.iconColor === "amber"
      ? "bg-gradient-to-br from-amber-400 to-amber-500"
      : character.iconColor === "red"
        ? "bg-gradient-to-br from-red-400 to-red-500"
        : character.iconColor === "blue"
          ? "bg-gradient-to-br from-blue-400 to-blue-500"
          : "bg-gradient-to-br from-green-400 to-green-500"

  const accentBgClass =
    character.iconColor === "amber"
      ? "bg-amber-500/20"
      : character.iconColor === "red"
        ? "bg-red-500/20"
        : character.iconColor === "blue"
          ? "bg-blue-500/20"
          : "bg-green-500/20"

  const accentTextClass =
    character.iconColor === "amber"
      ? "text-amber-500"
      : character.iconColor === "red"
        ? "text-red-500"
        : character.iconColor === "blue"
          ? "text-blue-500"
          : "text-green-500"

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 backdrop-blur-sm bg-black/70 z-[1000]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none p-4 overflow-y-auto">
        <div className="my-auto mt-16 mb-8 w-full max-w-md">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${character.name}-title`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="rounded-xl shadow-xl w-full max-w-md pointer-events-auto overflow-hidden bg-white dark:bg-gray-800 text-foreground dark:text-amber-100 border border-primary/10 dark:border-amber-700/20 backdrop-blur-sm"
          >
            {/* Header with gradient background */}
            <div className={`relative overflow-hidden rounded-t-xl ${gradientClass}`}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white z-10"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="pt-8 pb-6 px-6 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20 shadow-inner backdrop-blur-sm border border-white/30">
                  {React.cloneElement(character.icon as React.ReactElement, {
                    className: "h-8 w-8 text-white",
                  })}
                </div>
                <h2 id={`${character.name}-title`} className="text-xl font-bold text-white mb-1">
                  {character.name}
                </h2>
                <p className="text-sm text-white/90">{character.role}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-3 flex items-center text-primary dark:text-amber-400`}>
                  <span
                    className={`inline-block w-8 h-1 mr-2 rounded-full ${character.iconColor === "amber" ? "bg-amber-500" : character.iconColor === "red" ? "bg-red-500" : character.iconColor === "blue" ? "bg-blue-500" : "bg-green-500"}`}
                  ></span>
                  About
                </h3>
                <p className="text-base leading-relaxed text-foreground dark:text-amber-100">
                  {character.fullDescription}
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 flex items-center text-primary dark:text-amber-400`}>
                  <span
                    className={`inline-block w-8 h-1 mr-2 rounded-full ${character.iconColor === "amber" ? "bg-amber-500" : character.iconColor === "red" ? "bg-red-500" : character.iconColor === "blue" ? "bg-blue-500" : "bg-green-500"}`}
                  ></span>
                  Fun Facts
                </h3>
                <ul className="space-y-3">
                  {character.funFacts.map((fact, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-800/30 border border-primary/20 dark:border-amber-700/30 shadow-sm"
                    >
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5 ${accentBgClass} ${accentTextClass}`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-foreground dark:text-amber-100">{fact}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 flex justify-end border-t border-primary/20 dark:border-amber-700/30">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700 dark:text-gray-900 dark:hover:from-amber-500 dark:hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

