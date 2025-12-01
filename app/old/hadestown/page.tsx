"use client"

import React from "react"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  MusicIcon,
  BookIcon,
  PencilIcon,
  FlowerIcon,
  Flame,
  BookOpenIcon,
  PuzzleIcon,
  BookMarkedIcon,
} from "lucide-react"
import { CharacterGuides } from "@/components/old/hadestown/character-guide"
import { Route } from "next"

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".scroll-reveal")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    // <div className="min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground dark:from-gray-950 dark:to-amber-950/80">
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground">
      {/* Add animated gradient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-amber-800/30 dark:via-gray-900 dark:to-red-800/30 animate-gradient"></div>
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/30 dark:to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-600/20 dark:to-transparent"></div>
        <div className="railroad-pattern absolute inset-0 opacity-10 dark:opacity-20"></div>
      </div>



      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 railroad-pattern opacity-20"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              className="flex justify-center items-center gap-4 mb-4"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 8, ease: "easeInOut" }}
            >
              <Flame className="h-10 w-10 text-accent dark:text-amber-500 text-red-600" />
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-500 to-amber-600 bg-clip-text
               text-transparent dark:from-amber-400 dark:to-red-600">
                Hadestown
              </h1>
              <Flame className="h-10 w-10 text-accent dark:text-red-500 text-amber-600" />
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-500 dark:text-amber-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Vocabulary, Spelling & Writing Adventure
            </motion.p>

            <motion.div
              className="max-w-lg mx-auto rounded-lg p-4 bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm border border-amber-500/10 dark:border-amber-700/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-readable dark:text-amber-100">
                Join Orpheus, Eurydice, and Hermes on a musical journey through the underworld while learning new words,
                improving your spelling, and exploring lyrical writing!
              </p>
            </motion.div>
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            ref={scrollRef}
          >
            <GameCard
              title="Spelling Challenge"
              description="Drag and drop letters to spell Hadestown words"
              icon={<PencilIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />}
              href={"/old/hadestown/games/spelling" as Route}
              delay={0.2}
            />
            <GameCard
              title="Vocabulary Quest"
              description="Learn new words from the world of Hadestown"
              icon={<BookIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />}
              href={"/old/hadestown/games/vocabulary" as Route}
              delay={0.4}
            />
            <GameCard
              title="Lyric Challenge"
              description="Complete the missing lyrics from Hadestown songs"
              icon={<MusicIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />}
              href={"/old/hadestown/games/lyrics" as Route}
              delay={0.6}
            />
            {/* <GameCard
              title="Railroad Rhythms"
              description="Tap along to the rhythm of Hadestown songs"
              icon={<TrainTrackIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />}
              href="/old/hadestown/games/rhythms"
              delay={0.8}
            /> */}
            <GameCard
              title="Seasons Sorting"
              description="Help Persephone organize items for each season"
              icon={<FlowerIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />}
              href={"/old/hadestown/games/seasons" as Route}
              delay={1.0}
            />
            <GameCard
              title="Lyrics Explorer"
              description="Discover song meanings and vocabulary"
              icon={<BookOpenIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />}
              href={"/old/hadestown/lyrics-explorer" as Route}
              delay={1.2}
            />
            <GameCard
              title="Word Memory Game"
              description="Match words with their definitions"
              icon={<PuzzleIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />}
              href={"/old/hadestown/games/word-memory" as Route}
              delay={1.4}
            />
            <GameCard
              title="Hadestown Story"
              description="Read the magical tale of Orpheus and Eurydice"
              icon={<BookMarkedIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />}
              href={"/old/hadestown/story" as Route}
              delay={1.6}
            />
          </div>

          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 dark:bg-amber-800/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/5 dark:bg-amber-700/10 rounded-full translate-x-1/4 translate-y-1/4"></div>
              <div className="railroad-pattern absolute inset-0 opacity-10"></div>
            </div>

            {/* Character Guides Section */}
            <div className="relative z-10">
              <CharacterGuides />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function GameCard({
  title,
  description,
  icon,
  href,
  delay = 0,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: Route
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link href={href} className="block h-full">
        <div className="game-card rounded-lg p-6 flex flex-col items-center text-center h-full bg-gradient-to-br from-white to-white/90 border-amber-500/30 shadow-lg dark:from-gray-900 dark:to-amber-950/50 dark:border-amber-700/60 dark:shadow-amber-900/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-amber-900/40 ember-glow">
          <motion.div
            className="mb-4 relative"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
          >
            {/* Add glow effect behind icon */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-500/10 dark:from-amber-500/20 dark:to-amber-600/10 rounded-full blur-md"></div>
            {React.cloneElement(icon as React.ReactElement<{ className: string }>, {
              className: "h-12 w-12 text-amber-600 dark:text-amber-400 relative",
            })}
          </motion.div>
          <h3 className="text-xl font-bold mb-2 text-amber-600 dark:text-amber-400">{title}</h3>
          <p className="text-gray-500 dark:text-amber-300">{description}</p>
        </div>
      </Link>
    </motion.div>
  )
}

