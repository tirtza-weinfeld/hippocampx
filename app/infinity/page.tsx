"use client"

import { InfinityExplorer } from "@/components/infinity/infinity-explorer"
import { InfinityLogo } from "@/components/infinity/icons/infinity-logo"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen  transition-colors duration-300">
      <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 relative">
   
        <div className="pt-16 pb-6 text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <InfinityLogo className="h-20 sm:h-24 w-auto animate-bounce-rotate motion-safe" />
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 px-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-fun-purple via-fun-pink to-fun-orange text-transparent bg-clip-text">
              The Amazing World of Infinity!
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-primary-600 dark:text-primary-300 max-w-2xl mx-auto px-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Discover how some infinities are bigger than others in this interactive journey through the endless!
          </motion.p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <InfinityExplorer />
      </main>

    </div>
  )
}
