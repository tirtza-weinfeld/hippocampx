"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import {
  MusicIcon,
  BookIcon,
  PencilIcon,
  Flower,
  Flame,
  BookOpenIcon,
  PuzzleIcon,
  BookMarkedIcon,
} from "lucide-react"
import { CharacterGuides } from "@/components/old/hadestown/character-guide"
import type { Route } from "next"
import type { ReactNode } from "react"

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
  tap: { scale: 0.98 },
}

const flameVariants = {
  animate: {
    rotate: [0, 5, 0, -5, 0],
    transition: { repeat: Infinity, duration: 8, ease: "easeInOut" as const },
  },
}

const floatVariants = {
  animate: {
    y: [0, -8, 0],
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const },
  },
}

type GameCardData = {
  title: string
  description: string
  icon: ReactNode
  href: Route
}

const GAME_CARDS: GameCardData[] = [
  {
    title: "Spelling Challenge",
    description: "Drag and drop letters to spell Hadestown words",
    icon: <PencilIcon className="h-12 w-12" />,
    href: "/old/hadestown/games/spelling" as Route,
  },
  {
    title: "Vocabulary Quest",
    description: "Learn new words from the world of Hadestown",
    icon: <BookIcon className="h-12 w-12" />,
    href: "/old/hadestown/games/vocabulary" as Route,
  },
  {
    title: "Lyric Challenge",
    description: "Complete the missing lyrics from Hadestown songs",
    icon: <MusicIcon className="h-12 w-12" />,
    href: "/old/hadestown/games/lyrics" as Route,
  },
  {
    title: "Seasons Sorting",
    description: "Help Persephone organize items for each season",
    icon: <Flower className="h-12 w-12" />,
    href: "/old/hadestown/games/seasons" as Route,
  },
  {
    title: "Lyrics Explorer",
    description: "Discover song meanings and vocabulary",
    icon: <BookOpenIcon className="h-12 w-12" />,
    href: "/old/hadestown/lyrics-explorer" as Route,
  },
  {
    title: "Word Memory Game",
    description: "Match words with their definitions",
    icon: <PuzzleIcon className="h-12 w-12" />,
    href: "/old/hadestown/games/word-memory" as Route,
  },
  {
    title: "Hadestown Story",
    description: "Read the magical tale of Orpheus and Eurydice",
    icon: <BookMarkedIcon className="h-12 w-12" />,
    href: "/old/hadestown/story" as Route,
  },
]

export default function HadestownPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground">
      <AnimatedBackground />
      <HeroSection />
      <GameCardsGrid />
      <CharacterSection />
    </div>
  )
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-amber-800/30 dark:via-gray-900 dark:to-red-800/30 animate-gradient" />
      <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/30 dark:to-transparent" />
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-600/20 dark:to-transparent" />
      <div className="railroad-pattern absolute inset-0 opacity-10 dark:opacity-20" />
    </div>
  )
}

function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 z-0 railroad-pattern opacity-20" />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="flex justify-center items-center gap-4 mb-4"
            variants={flameVariants}
            animate={shouldReduceMotion ? undefined : "animate"}
          >
            <Flame className="h-10 w-10 text-accent dark:text-amber-500 text-red-600" />
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-500 to-amber-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-red-600">
              Hadestown
            </h1>
            <Flame className="h-10 w-10 text-accent dark:text-red-500 text-amber-600" />
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-500 dark:text-amber-300"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: shouldReduceMotion ? 0 : 0.6 }}
          >
            Vocabulary, Spelling &amp; Writing Adventure
          </motion.p>

          <motion.div
            className="max-w-lg mx-auto rounded-lg p-4 bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm border border-amber-500/10 dark:border-amber-700/20"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: shouldReduceMotion ? 0 : 0.6 }}
          >
            <p className="text-readable dark:text-amber-100">
              Join Orpheus, Eurydice, and Hermes on a musical journey through the underworld while learning new words,
              improving your spelling, and exploring lyrical writing!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function GameCardsGrid() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {GAME_CARDS.map((card, index) => (
          <GameCard
            key={card.href}
            title={card.title}
            description={card.description}
            icon={card.icon}
            href={card.href}
            delay={shouldReduceMotion ? 0 : index * 0.2}
          />
        ))}
      </div>
    </div>
  )
}

type GameCardProps = {
  title: string
  description: string
  icon: ReactNode
  href: Route
  delay?: number
}

function GameCard({ title, description, icon, href, delay = 0 }: GameCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={shouldReduceMotion ? undefined : "hover"}
      whileTap={shouldReduceMotion ? undefined : "tap"}
      viewport={{ once: true }}
      transition={{ delay, duration: shouldReduceMotion ? 0 : 0.5 }}
      className="h-full"
    >
      <Link href={href} className="block h-full">
        <div className="game-card rounded-lg p-6 flex flex-col items-center text-center h-full bg-gradient-to-br from-white to-white/90 border-amber-500/30 shadow-lg dark:from-gray-900 dark:to-amber-950/50 dark:border-amber-700/60 dark:shadow-amber-900/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-amber-900/40 ember-glow">
          <motion.div
            className="mb-4 relative"
            variants={floatVariants}
            animate={shouldReduceMotion ? undefined : "animate"}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-500/10 dark:from-amber-500/20 dark:to-amber-600/10 rounded-full blur-md" />
            <div className="relative text-amber-600 dark:text-amber-400">
              {icon}
            </div>
          </motion.div>
          <h3 className="text-xl font-bold mb-2 text-amber-600 dark:text-amber-400">{title}</h3>
          <p className="text-gray-500 dark:text-amber-300">{description}</p>
        </div>
      </Link>
    </motion.div>
  )
}

function CharacterSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="mt-20 relative container mx-auto px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 dark:bg-amber-800/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/5 dark:bg-amber-700/10 rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="railroad-pattern absolute inset-0 opacity-10" />
      </div>

      <div className="relative z-10">
        <CharacterGuides />
      </div>
    </motion.div>
  )
}
