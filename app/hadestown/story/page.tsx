"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react"
import { motion } from "framer-motion"

// Define the story pages
const STORY_PAGES = [
  {
    id: "intro",
    title: "Once Upon a Time",
    content:
      "Long ago, there was a world where the seasons changed because of a love story. A story about music, hope, and the warmth that comes when people care for each other.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        {/* Dynamic animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-amber-500/30 to-amber-600/20 dark:from-amber-600/30 dark:to-red-900/30"
          animate={{
            background: [
              "linear-gradient(to bottom, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.2))",
              "linear-gradient(to bottom, rgba(239, 68, 68, 0.2), rgba(217, 119, 6, 0.3))",
              "linear-gradient(to bottom, rgba(16, 185, 129, 0.2), rgba(245, 158, 11, 0.3))",
              "linear-gradient(to bottom, rgba(59, 130, 246, 0.2), rgba(217, 119, 6, 0.3))",
              "linear-gradient(to bottom, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.2))",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Animated sun with rays */}
        <motion.div
          className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-radial from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/50"
          animate={{
            y: [0, 5, 0],
            boxShadow: [
              "0 0 25px rgba(234, 179, 8, 0.6)",
              "0 0 40px rgba(234, 179, 8, 0.8)",
              "0 0 25px rgba(234, 179, 8, 0.6)",
            ],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          {/* Sun rays */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 h-1.5 bg-yellow-300 rounded-full origin-left"
              style={{
                width: "30px",
                transform: `rotate(${i * 30}deg) translateX(0)`,
                transformOrigin: "0 50%",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}
        </motion.div>

        {/* Floating musical notes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`note-${i}`}
            className="absolute text-2xl text-primary dark:text-amber-400"
            initial={{
              x: 50 + Math.random() * 200,
              y: 100 + Math.random() * 80,
              opacity: 0,
              rotate: Math.random() * 30 - 15,
            }}
            animate={{
              x: [null, -50 - Math.random() * 100],
              y: [null, 30 + Math.random() * 50],
              opacity: [0, 1, 0],
              rotate: [null, Math.random() * 360],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.8,
            }}
          >
            {["♪", "♫", "🎵", "🎶"][i % 4]}
          </motion.div>
        ))}

        {/* Seasons tree with animated elements */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center">
          <div className="relative">
            {/* Tree trunk with texture */}
            <motion.div
              className="w-10 h-40 bg-gradient-to-t from-yellow-900 to-yellow-800 mx-auto rounded-md"
              animate={{
                background: [
                  "linear-gradient(to top, #78350f, #92400e)",
                  "linear-gradient(to top, #854d0e, #a16207)",
                  "linear-gradient(to top, #78350f, #92400e)",
                ],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            >
              {/* Tree texture lines */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={`bark-${i}`}
                  className="absolute h-0.5 bg-yellow-950/40 rounded-full"
                  style={{
                    width: "60%",
                    left: "20%",
                    top: `${15 + i * 20}%`,
                  }}
                />
              ))}
            </motion.div>

            {/* Four seasons in the branches */}
            <div className="absolute -top-8 w-full">
              <div className="grid grid-cols-2 gap-3">
                {/* Spring */}
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-green-300 to-green-500 shadow-md shadow-green-500/30"
                  animate={{
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 4px 6px -1px rgba(74, 222, 128, 0.3)",
                      "0 8px 10px -1px rgba(74, 222, 128, 0.5)",
                      "0 4px 6px -1px rgba(74, 222, 128, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="absolute inset-2 flex items-center justify-center">
                    <motion.span
                      className="text-3xl"
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      🌱
                    </motion.span>
                  </div>
                </motion.div>

                {/* Summer */}
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-md shadow-yellow-500/30"
                  animate={{
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 4px 6px -1px rgba(234, 179, 8, 0.3)",
                      "0 8px 10px -1px rgba(234, 179, 8, 0.5)",
                      "0 4px 6px -1px rgba(234, 179, 8, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, delay: 0.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="absolute inset-2 flex items-center justify-center">
                    <motion.span
                      className="text-3xl"
                      animate={{
                        rotate: [0, 15, 0, -15, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      ☀️
                    </motion.span>
                  </div>
                </motion.div>

                {/* Fall */}
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 shadow-md shadow-orange-500/30"
                  animate={{
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 4px 6px -1px rgba(249, 115, 22, 0.3)",
                      "0 8px 10px -1px rgba(249, 115, 22, 0.5)",
                      "0 4px 6px -1px rgba(249, 115, 22, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, delay: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="absolute inset-2 flex items-center justify-center">
                    <motion.span
                      className="text-3xl"
                      animate={{
                        y: [0, -5, 0, -3, 0],
                        x: [0, 3, 0, -3, 0],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    >
                      🍂
                    </motion.span>
                  </div>
                </motion.div>

                {/* Winter */}
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-md shadow-blue-500/30"
                  animate={{
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                      "0 8px 10px -1px rgba(59, 130, 246, 0.5)",
                      "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, delay: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="absolute inset-2 flex items-center justify-center">
                    <motion.span
                      className="text-3xl"
                      animate={{
                        rotate: [0, 10, 0, -10, 0],
                        scale: [1, 0.9, 1, 0.9, 1],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    >
                      ❄️
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating hearts to represent love story */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-red-500 dark:text-red-400"
            style={{
              fontSize: `${1 + Math.random() * 0.5}rem`,
              left: `${10 + i * 20}%`,
              bottom: `${20 + Math.random() * 20}%`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 20],
              opacity: [0, 0.8, 0],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.7,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: "orpheus",
    title: "Orpheus, the Musician",
    content:
      "In this world lived a young musician named Orpheus. His songs were so beautiful they could make flowers bloom and stones dance. He played a special instrument called a lyre.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/40 to-amber-300/20 dark:from-amber-400/30 dark:to-amber-600/20"></div>

        {/* Orpheus silhouette */}
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 w-40 flex flex-col items-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          {/* Head */}
          <div className="w-16 h-16 rounded-full bg-amber-700 dark:bg-amber-800 relative">
            {/* Face features */}
            <div className="absolute top-4 left-3 w-2 h-1 bg-amber-900 rounded-full"></div>
            <div className="absolute top-4 right-3 w-2 h-1 bg-amber-900 rounded-full"></div>
            <div className="absolute top-7 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-900 rounded-full"></div>
          </div>

          {/* Body */}
          <div className="w-20 h-28 bg-amber-600 dark:bg-amber-700 rounded-md relative">
            {/* Lyre */}
            <motion.div
              className="absolute -right-10 top-5"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="w-16 h-20 relative">
                <div className="absolute left-0 top-0 w-4 h-20 bg-yellow-700 rounded-md"></div>
                <div className="absolute right-0 top-0 w-4 h-20 bg-yellow-700 rounded-md"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-700 rounded-md"></div>

                {/* Lyre strings */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-yellow-100 dark:bg-yellow-200"
                    style={{ marginLeft: (i - 2) * 5 }}
                    animate={{ scaleY: [1, 0.97, 1, 1.03, 1] }}
                    transition={{ duration: 0.8, delay: i * 0.15, repeat: Number.POSITIVE_INFINITY }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Music notes floating */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl text-primary dark:text-amber-400"
            initial={{
              x: 180 + Math.random() * 50,
              y: 120 + i * 15,
              opacity: 0,
            }}
            animate={{
              x: [null, 130 - i * 5],
              y: [null, 60 - i * 10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random(),
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.4,
            }}
          >
            {["♪", "♫", "🎵", "🎶"][i % 4]}
          </motion.div>
        ))}

        {/* Flowers blooming */}
        <div className="absolute bottom-0 left-0 w-full h-5 bg-green-700 dark:bg-green-800"></div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`flower-${i}`}
            className="absolute bottom-5"
            style={{ left: `${10 + i * 20}%` }}
            initial={{ y: 10, scale: 0 }}
            animate={{ y: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 1 + i * 0.3,
            }}
          >
            <span className="text-2xl">🌼</span>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: "eurydice",
    title: "Eurydice, the Wanderer",
    content:
      "One day, Orpheus met a girl named Eurydice who loved his music. Eurydice was kind and brave, but she had been traveling for a long time looking for a place to call home.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-red-100/30 to-red-300/20 dark:from-red-500/20 dark:to-red-700/20"></div>

        {/* Meadow background */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-green-600 dark:bg-green-700"></div>

        {/* Path */}
        <div className="absolute bottom-10 left-0 w-full h-3 bg-amber-300 dark:bg-amber-400"></div>

        {/* Orpheus */}
        <motion.div
          className="absolute bottom-13 left-1/4"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1.5 }}
        >
          <div className="relative w-16 flex flex-col items-center">
            {/* Head */}
            <div className="w-10 h-10 rounded-full bg-amber-700 dark:bg-amber-800"></div>
            {/* Body */}
            <div className="w-12 h-16 bg-amber-600 dark:bg-amber-700 rounded-md"></div>
          </div>
        </motion.div>

        {/* Eurydice */}
        <motion.div
          className="absolute bottom-13 right-1/4"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1.5 }}
        >
          <div className="relative w-16 flex flex-col items-center">
            {/* Head */}
            <div className="w-10 h-10 rounded-full bg-red-400 dark:bg-red-500"></div>
            {/* Body */}
            <div className="w-12 h-16 bg-red-500 dark:bg-red-600 rounded-md"></div>
          </div>
        </motion.div>

        {/* Heart forming between them */}
        <motion.div
          className="absolute bottom-30 left-1/2 -translate-x-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div
            className="text-4xl text-red-500 dark:text-red-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            ❤️
          </motion.div>
        </motion.div>

        {/* Background elements - journey symbols */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`journey-${i}`}
            className="absolute text-lg"
            style={{
              right: `${10 + i * 20}%`,
              top: `${20 + i * 10}%`,
              opacity: 0.7,
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {["🏠", "🌲", "⛰️", "🌊", "🏙️"][i]}
          </motion.div>
        ))}

        {/* Music notes from Orpheus */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`music-${i}`}
            className="absolute text-lg text-primary dark:text-amber-400"
            style={{
              left: "25%",
              bottom: 40,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: [0, 20 + i * 10],
              y: [-10, -30 - i * 5],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: 2 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          >
            {["♪", "♫", "🎵"][i]}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: "persephone",
    title: "Persephone and the Seasons",
    content:
      "In this world, the seasons changed because of a goddess named Persephone. She spent half the year in the sunny world above, bringing spring and summer. And half the year in the world below, causing fall and winter.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        {/* Split background for above/below */}
        <div className="absolute inset-0 flex flex-col">
          <motion.div
            className="h-1/2 bg-gradient-to-b from-blue-200 to-green-200 dark:from-blue-800/40 dark:to-green-800/40"
            animate={{ opacity: [1, 0.8, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          ></motion.div>
          <motion.div
            className="h-1/2 bg-gradient-to-b from-amber-800/40 to-red-900/40 dark:from-amber-800/50 dark:to-red-900/50"
            animate={{ opacity: [1, 0.8, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          ></motion.div>
        </div>

        {/* Dividing line */}
        <div className="absolute top-1/2 w-full h-1 bg-amber-600 dark:bg-amber-700"></div>

        {/* Sun and moon */}
        <motion.div
          className="absolute top-5 left-5 text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          ☀️
        </motion.div>

        <motion.div
          className="absolute bottom-5 right-5 text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          🌙
        </motion.div>

        {/* Persephone */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          animate={{
            y: [-40, 40, -40],
            rotateY: [0, 180, 0],
          }}
          transition={{
            y: { duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            rotateY: { duration: 0.5, delay: 1.9, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3.5 },
          }}
        >
          <div className="relative w-16 flex flex-col items-center">
            {/* Head with flower crown */}
            <div className="w-10 h-10 rounded-full bg-green-400 dark:bg-green-500 relative">
              {/* Flower crown */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={`flower-crown-${i}`}
                  className="absolute -top-2"
                  style={{
                    left: `${i * 20}%`,
                    transform: `rotate(${(i - 2) * 15}deg)`,
                  }}
                >
                  <span className="text-xs">🌸</span>
                </div>
              ))}
            </div>

            {/* Body with changing dress */}
            <motion.div
              className="w-14 h-18 rounded-md relative overflow-hidden"
              animate={{
                backgroundColor: ["#4ade80", "#f59e0b"],
              }}
              transition={{ duration: 2, delay: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            >
              {/* Dress pattern */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`dress-pattern-${i}`}
                  className="absolute h-1 rounded-full"
                  style={{
                    top: `${30 + i * 20}%`,
                    left: "0",
                    right: "0",
                  }}
                  animate={{
                    backgroundColor: ["#a3e635", "#fb923c"],
                  }}
                  transition={{ duration: 2, delay: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                ></motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Seasons indicators */}
        <motion.div
          className="absolute top-10 right-10 text-2xl"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
        >
          🌱🌞
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-10 text-2xl"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
        >
          🍂❄️
        </motion.div>
      </div>
    ),
  },
  {
    id: "hades",
    title: "Hades and His Kingdom",
    content:
      "In the world below lived Hades, who ruled over a kingdom that never saw the sun. It was full of gems and gold, but had no flowers or music. Hades was married to Persephone, and missed her terribly when she went to bring spring above.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        {/* Underground kingdom */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/80 to-amber-900/80 dark:from-gray-900 dark:to-amber-950"></div>

        {/* Underground cavern details */}
        <div className="absolute top-0 left-0 w-full h-5 bg-gray-900 dark:bg-black"></div>

        {/* Stalactites */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`stalactite-${i}`}
            className="absolute top-5 bg-gradient-to-b from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-b-lg"
            style={{
              left: `${i * 12 + 2}%`,
              height: `${10 + Math.sin(i) * 10}px`,
              width: "8px",
            }}
          ></div>
        ))}

        {/* Underground palace */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-60 h-30">
          {/* Main building */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-gradient-to-b from-gray-600 to-gray-800 dark:from-gray-700 dark:to-gray-900 rounded-t-lg"></div>

          {/* Columns */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`column-${i}`}
              className="absolute bottom-0 bg-gradient-to-b from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 rounded-t-lg"
              style={{
                left: `${(i * 10) - 5 + 50}%`,
                height: "30px",
                width: "6px",
                transform: "translateX(-50%)",
              }}
            ></div>
          ))}

          {/* Roof */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-b from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 rounded-t-lg"></div>
        </div>

        {/* Hades */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="relative w-16 flex flex-col items-center">
            {/* Crown */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`crown-spike-${i}`}
                  className="absolute bottom-0 w-2 bg-yellow-500 dark:bg-yellow-600 rounded-t-sm"
                  style={{
                    left: `${i * 25}%`,
                    height: `${6 + (i % 2 === 0 ? 4 : 0)}px`,
                  }}
                  animate={{ y: [0, -1, 0] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                ></motion.div>
              ))}
            </div>

            {/* Head */}
            <div className="w-10 h-10 rounded-full bg-blue-900 dark:bg-blue-950"></div>

            {/* Body */}
            <div className="w-14 h-18 bg-blue-800 dark:bg-blue-900 rounded-md"></div>
          </div>
        </motion.div>

        {/* Gems and treasures */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`gem-${i}`}
            className="absolute rounded-sm"
            style={{
              bottom: `${10 + Math.random() * 10}px`,
              left: `${5 + i * 8}%`,
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
              backgroundColor: ["#ef4444", "#f59e0b", "#84cc16", "#06b6d4", "#8b5cf6", "#ec4899"][i % 6],
              transform: `rotate(${Math.random() * 45}deg)`,
            }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          ></motion.div>
        ))}

        {/* Thought bubble with Persephone */}
        <motion.div
          className="absolute top-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
        >
          <div className="relative">
            {/* Thought bubble */}
            <div className="w-16 h-16 bg-white/30 dark:bg-white/20 rounded-full"></div>

            {/* Small bubbles */}
            <div className="absolute -bottom-2 right-2 w-4 h-4 bg-white/30 dark:bg-white/20 rounded-full"></div>
            <div className="absolute -bottom-4 right-0 w-2 h-2 bg-white/30 dark:bg-white/20 rounded-full"></div>

            {/* Persephone in thoughts */}
            <div className="absolute inset-3 text-center">
              <span className="text-xl">🌸</span>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "love-story",
    title: "A Promise of Love",
    content:
      "Orpheus and Eurydice fell deeply in love and promised to stay together forever. Orpheus played beautiful songs for Eurydice, and she danced and smiled, happy to have found a home at last.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-orange-100 dark:from-amber-800/30 dark:to-orange-900/30"></div>

        {/* Sun setting */}
        <motion.div
          className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-yellow-500"
          animate={{
            y: [0, 5],
            boxShadow: ["0 0 30px rgba(234, 179, 8, 0.8)", "0 0 50px rgba(234, 179, 8, 0.5)"],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        ></motion.div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-green-600 dark:bg-green-800"></div>

        {/* Orpheus and Eurydice dancing */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center">
          {/* Orpheus */}
          <motion.div
            className="relative mx-3"
            animate={{
              x: [0, 5, 0, -5, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-10 h-10 rounded-full bg-amber-700 dark:bg-amber-800"></div>
            <div className="w-12 h-18 bg-amber-600 dark:bg-amber-700 rounded-md"></div>

            {/* Lyre */}
            <motion.div
              className="absolute -right-10 top-10"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="w-10 h-14 relative">
                <div className="absolute left-0 top-0 w-2 h-14 bg-yellow-700 rounded-md"></div>
                <div className="absolute right-0 top-0 w-2 h-14 bg-yellow-700 rounded-md"></div>
                <div className="absolute top-0 left-0 w-10 h-2 bg-yellow-700 rounded-md"></div>

                {/* Lyre strings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-2 w-0.5 h-12 bg-yellow-100 dark:bg-yellow-200"
                    style={{ left: `${(i + 1) * 2.5}px` }}
                    animate={{ scaleY: [1, 0.97, 1, 1.03, 1] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Number.POSITIVE_INFINITY }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Eurydice */}
          <motion.div
            className="relative mx-3"
            animate={{
              x: [0, -5, 0, 5, 0],
              rotate: [0, -5, 0, 5, 0],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-10 h-10 rounded-full bg-red-400 dark:bg-red-500"></div>
            <div className="w-12 h-18 bg-red-500 dark:bg-red-600 rounded-md"></div>
          </motion.div>
        </div>

        {/* Music notes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`music-${i}`}
            className="absolute text-primary dark:text-amber-400"
            style={{
              left: `${35 + (i % 3) * 5}%`,
              bottom: 30,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-10, -40],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          >
            {["♪", "♫", "🎵", "🎶"][i % 4]}
          </motion.div>
        ))}

        {/* Hearts */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-red-500 dark:text-red-400"
            style={{
              left: `${42 + i * 5}%`,
              bottom: 60,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-5, -25],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: 1 + i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: "winter-coming",
    title: "The Cold Wind Blows",
    content:
      "But one day, as winter was approaching, a cold wind blew through the land. Eurydice got lost during a storm and found herself in the dark world below, in Hades' kingdom.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800"></div>

        {/* Stormy sky */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1/2"
          animate={{
            background: [
              "linear-gradient(to bottom, rgba(75, 85, 99, 0.7), rgba(55, 65, 81, 0.7))",
              "linear-gradient(to bottom, rgba(75, 85, 99, 0.9), rgba(55, 65, 81, 0.9))",
              "linear-gradient(to bottom, rgba(75, 85, 99, 0.7), rgba(55, 65, 81, 0.7))",
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          {/* Lightning */}
          <motion.div
            className="absolute inset-0 bg-white/0"
            animate={{ backgroundColor: ["rgba(255,255,255,0)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0)"] }}
            transition={{
              duration: 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 4,
              times: [0, 0.1, 0.2],
            }}
          ></motion.div>
        </motion.div>

        {/* Wind visualization */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`wind-${i}`}
            className="absolute h-1 bg-white/30 dark:bg-white/20 rounded-full"
            style={{
              top: `${10 + i * 8}%`,
              left: "100%",
              width: `${30 + Math.random() * 50}px`,
            }}
            animate={{ x: [0, -400] }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          ></motion.div>
        ))}

        {/* Falling leaves/snow */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            className="absolute text-sm"
            style={{
              top: "-10%",
              left: `${i * 7}%`,
            }}
            animate={{
              y: [0, 200],
              x: [0, Math.sin(i) * 30],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          >
            {i % 2 === 0 ? "❄️" : "🍂"}
          </motion.div>
        ))}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-gray-700 dark:bg-gray-900"></div>

        {/* Eurydice being blown away */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{
            x: [0, 100],
            y: [0, -20, 50],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-red-400 dark:bg-red-500"></div>
            <div className="w-12 h-16 bg-red-500 dark:bg-red-600 rounded-md"></div>
          </div>
        </motion.div>

        {/* Cracking ground to underworld */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0"
          animate={{
            width: [0, 80],
            height: [0, 20],
          }}
          transition={{
            duration: 2,
            delay: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 2,
          }}
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8))",
          }}
        ></motion.div>
      </div>
    ),
  },
  {
    id: "orpheus-journey",
    title: "Orpheus's Brave Journey",
    content:
      "Orpheus was heartbroken when he discovered Eurydice was gone. He decided to do something no one had done before: he would journey to the world below to find her and bring her home.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black"></div>

        {/* Path to underworld */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-full bg-gradient-to-b from-gray-600/50 to-amber-900/50 dark:from-gray-700/50 dark:to-amber-950/50"></div>

          {/* Path details */}
          {[...Array(10)].map((_, i) => (
            <div
              key={`path-detail-${i}`}
              className="absolute bg-gray-500/30 dark:bg-gray-600/30"
              style={{
                top: `${i * 10 + 5}%`,
                left: `${45 + (i % 2 === 0 ? 5 : -5)}%`,
                width: "5px",
                height: "2px",
              }}
            ></div>
          ))}
        </div>

        {/* Orpheus walking down */}
        <motion.div
          className="absolute top-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 160] }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Spotlight/light effect around Orpheus */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0) 70%)",
                width: "40px",
                height: "40px",
                transform: "translate(-25%, -25%) scale(2)",
              }}
              animate={{ opacity: [0.7, 0.9, 0.7] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>

            {/* Orpheus */}
            <div className="w-10 h-10 rounded-full bg-amber-700 dark:bg-amber-800"></div>
            <div className="w-12 h-16 bg-amber-600 dark:bg-amber-700 rounded-md"></div>

            {/* Lyre */}
            <div className="absolute -right-10 top-8">
              <div className="w-8 h-10 relative">
                <div className="absolute left-0 top-0 w-2 h-10 bg-yellow-700 rounded-sm"></div>
                <div className="absolute right-0 top-0 w-2 h-10 bg-yellow-700 rounded-sm"></div>
                <div className="absolute top-0 left-0 w-8 h-2 bg-yellow-700 rounded-sm"></div>

                {/* Strings */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`string-${i}`}
                    className="absolute top-2 bg-yellow-100 dark:bg-yellow-200"
                    style={{
                      left: `${(i + 1) * 2}px`,
                      width: "0.5px",
                      height: "8px",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Music notes following */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`music-journey-${i}`}
            className="absolute left-1/2 text-amber-400 dark:text-amber-300 opacity-0"
            style={{ translateX: "10px" }}
            animate={{
              y: [40 + i * 30, 20 + i * 30],
              opacity: [0, 1, 0],
              x: [0, i % 2 === 0 ? 20 : -20],
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            {["♪", "♫", "🎵"][i % 3]}
          </motion.div>
        ))}

        {/* Scary faces in the darkness */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`scary-${i}`}
            className="absolute text-lg opacity-0"
            style={{
              left: i === 0 ? "30%" : i === 1 ? "65%" : "45%",
              top: i === 0 ? "40%" : i === 1 ? "60%" : "75%",
            }}
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 3,
              delay: 1 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 4,
            }}
          >
            👁️
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: "music-power",
    title: "The Power of Music",
    content:
      "Orpheus played his saddest, most beautiful music as he journeyed to find Eurydice. His songs were so moving that even the stones wept, and Hades himself was touched by the melody.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black"></div>

        {/* Hades' throne room */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-amber-900/20 to-transparent dark:from-amber-950/20"></div>

        {/* Throne */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-40 h-30">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-16 bg-gradient-to-b from-gray-600 to-gray-800 dark:from-gray-700 dark:to-gray-900 rounded-t-lg"></div>
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-18 h-10 bg-gradient-to-b from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 rounded-sm"></div>
        </div>

        {/* Hades sitting */}
        <motion.div
          className="absolute bottom-15 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="relative">
            {/* Crown */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={`crown-spike-${i}`}
                  className="absolute bottom-0 w-1.5 bg-yellow-500 dark:bg-yellow-600 rounded-t-sm"
                  style={{
                    left: `${i * 25}%`,
                    height: `${4 + (i % 2 === 0 ? 2 : 0)}px`,
                  }}
                ></div>
              ))}
            </div>

            {/* Head */}
            <div className="w-10 h-10 rounded-full bg-blue-900 dark:bg-blue-950"></div>

            {/* Body sitting */}
            <div className="w-14 h-14 bg-blue-800 dark:bg-blue-900 rounded-md"></div>
          </div>
        </motion.div>

        {/* Orpheus playing */}
        <motion.div
          className="absolute bottom-10 left-1/4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="relative">
            {/* Orpheus */}
            <div className="w-10 h-10 rounded-full bg-amber-700 dark:bg-amber-800"></div>
            <div className="w-12 h-16 bg-amber-600 dark:bg-amber-700 rounded-md"></div>

            {/* Light aura */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0) 70%)",
                width: "100px",
                height: "100px",
                transform: "translate(-50%, -50%)",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>

            {/* Lyre with glowing strings */}
            <motion.div
              className="absolute -right-10 top-8"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="w-10 h-12 relative">
                <div className="absolute left-0 top-0 w-2 h-12 bg-yellow-700 rounded-sm"></div>
                <div className="absolute right-0 top-0 w-2 h-12 bg-yellow-700 rounded-sm"></div>
                <div className="absolute top-0 left-0 w-10 h-2 bg-yellow-700 rounded-sm"></div>

                {/* Glowing strings */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`glowing-string-${i}`}
                    className="absolute top-2"
                    style={{
                      left: `${2 + i * 2}px`,
                      width: "1px",
                      height: "10px",
                      background: "linear-gradient(to bottom, rgba(253, 224, 71, 1), rgba(253, 224, 71, 0.3))",
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      height: [10, 9, 10],
                      boxShadow: [
                        "0 0 2px rgba(253, 224, 71, 0.3)",
                        "0 0 5px rgba(253, 224, 71, 0.6)",
                        "0 0 2px rgba(253, 224, 71, 0.3)",
                      ],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  ></motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Music visualization */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`music-wave-${i}`}
            className="absolute left-1/3 h-1 rounded-full bg-amber-500/50 dark:bg-amber-400/40"
            style={{
              top: `${10 + i * 2}%`,
              width: "1px",
            }}
            animate={{
              width: [1, 20 + Math.sin(i) * 20, 1],
              opacity: [0, 0.8, 0],
              x: [0, 100, 200],
            }}
            transition={{
              duration: 2,
              delay: i * 0.08,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 0.5,
            }}
          ></motion.div>
        ))}

        {/* Eurydice in the background */}
        <motion.div
          className="absolute top-20 right-1/4 opacity-50"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-red-400/50 dark:bg-red-500/50"></div>
            <div className="w-10 h-14 bg-red-500/50 dark:bg-red-600/50 rounded-md"></div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "reunion",
    title: "A Second Chance",
    content:
      "Hades was so moved by Orpheus's music that he allowed Eurydice to return to the world above. But there was one important rule: Orpheus had to lead the way back, and he couldn't look behind him to make sure Eurydice was following until they reached the surface.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-700/90 via-gray-800/90 to-gray-700/90 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>

        {/* Path upward */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-full bg-gradient-to-t from-gray-600/50 to-amber-300/20 dark:from-gray-700/50 dark:to-amber-500/20"></div>
        </div>

        {/* Light at the end of tunnel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-yellow-400/30 dark:bg-yellow-500/20 blur-md"></div>

        {/* Orpheus walking up */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -100] }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Orpheus */}
            <div className="w-10 h-10 rounded-full bg-amber-700 dark:bg-amber-800"></div>
            <div className="w-12 h-16 bg-amber-600 dark:bg-amber-700 rounded-md"></div>

            {/* Lyre */}
            <div className="absolute -right-8 top-8">
              <div className="w-6 h-10 relative">
                <div className="absolute left-0 top-0 w-1 h-10 bg-yellow-700 rounded-sm"></div>
                <div className="absolute right-0 top-0 w-1 h-10 bg-yellow-700 rounded-sm"></div>
                <div className="absolute top-0 left-0 w-6 h-1 bg-yellow-700 rounded-sm"></div>

                {[...Array(3)].map((_, i) => (
                  <div
                    key={`string-${i}`}
                    className="absolute top-1 bg-yellow-100 dark:bg-yellow-200"
                    style={{
                      left: `${1.5 + i * 1.5}px`,
                      width: "0.5px",
                      height: "9px",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Eurydice following */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [40, -60] }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Eurydice */}
            <div className="w-10 h-10 rounded-full bg-red-400 dark:bg-red-500"></div>
            <div className="w-12 h-16 bg-red-500 dark:bg-red-600 rounded-md"></div>
          </div>
        </motion.div>

        {/* Do not look back rule visualization */}
        <motion.div
          className="absolute top-1/4 right-1/4 text-2xl"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          👁️❌
        </motion.div>
      </div>
    ),
  },
  {
    id: "happy-ending",
    title: "Together in Music",
    content:
      "Orpheus was patient and trusted that Eurydice was following. When they finally reached the sunlight, they were together again! Their story teaches us about the power of love, music, and trust. And now you know why the seasons change - because of Persephone's journey between two worlds, just like the story of Orpheus and Eurydice.",
    visualElement: (
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-green-200 dark:from-blue-700/50 dark:to-green-800/50"></div>

        {/* Sun */}
        <motion.div
          className="absolute top-5 right-10 w-16 h-16 rounded-full bg-yellow-400"
          animate={{
            y: [0, 5, 0],
            boxShadow: [
              "0 0 20px rgba(234, 179, 8, 0.6)",
              "0 0 30px rgba(234, 179, 8, 0.8)",
              "0 0 20px rgba(234, 179, 8, 0.6)",
            ],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        ></motion.div>

        {/* Ground with flowers */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-green-700 to-green-600 dark:from-green-900 dark:to-green-800"></div>

        {/* Flowers */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`flower-${i}`}
            className="absolute text-sm"
            style={{
              bottom: "20px",
              left: `${10 + i * 7}%`,
            }}
            animate={{
              y: [0, -3, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
            }}
          >
            {["🌼", "🌸", "🌻", "🌷"][i % 4]}
          </motion.div>
        ))}

        {/* Orpheus and Eurydice together */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="flex">
            {/* Orpheus */}
            <div className="mr-2">
              <div className="w-10 h-10 rounded-full bg-amber-700 dark:bg-amber-800"></div>
              <div className="w-12 h-16 bg-amber-600 dark:bg-amber-700 rounded-md"></div>

              {/* Lyre */}
              <motion.div
                className="absolute -left-8 top-8"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="w-8 h-10 relative">
                  <div className="absolute left-0 top-0 w-1.5 h-10 bg-yellow-700 rounded-sm"></div>
                  <div className="absolute right-0 top-0 w-1.5 h-10 bg-yellow-700 rounded-sm"></div>
                  <div className="absolute top-0 left-0 w-8 h-1.5 bg-yellow-700 rounded-sm"></div>
                </div>
              </motion.div>
            </div>

            {/* Eurydice */}
            <div className="ml-2">
              <div className="w-10 h-10 rounded-full bg-red-400 dark:bg-red-500"></div>
              <div className="w-12 h-16 bg-red-500 dark:bg-red-600 rounded-md"></div>
            </div>
          </div>
        </motion.div>

        {/* Heart between them */}
        <motion.div
          className="absolute bottom-30 left-1/2 -translate-x-1/2"
          animate={{ scale: [1, 1.2, 1], y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <motion.div
            className="text-3xl text-red-500 dark:text-red-400"
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            ❤️
          </motion.div>
        </motion.div>

        {/* Music notes and butterflies */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`ending-${i}`}
            className="absolute text-lg"
            style={{
              left: i % 2 === 0 ? "40%" : "60%",
              bottom: "40px",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-30 - i * 5],
              opacity: [0, 1, 0],
              x: [0, i % 2 === 0 ? -20 : 20],
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          >
            {i % 2 === 0 ? ["♪", "♫", "🎵", "🎶"][i % 4] : "🦋"}
          </motion.div>
        ))}

        {/* Four seasons symbols */}
        <div className="absolute top-10 left-10 flex gap-3">
          {[
            { emoji: "🌱", color: "from-green-400/70 to-green-500/50" },
            { emoji: "☀️", color: "from-yellow-400/70 to-yellow-500/50" },
            { emoji: "🍂", color: "from-orange-400/70 to-orange-500/50" },
            { emoji: "❄️", color: "from-blue-400/70 to-blue-500/50" },
          ].map((season, i) => (
            <motion.div
              key={`season-${i}`}
              className={`rounded-full p-1 bg-gradient-to-br ${season.color}`}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <span className="text-xl">{season.emoji}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
]

export default function StoryPage() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentPage = STORY_PAGES[currentPageIndex]

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentPageIndex < STORY_PAGES.length - 1) {
          setCurrentPageIndex(currentPageIndex + 1)
        } else {
          setIsAutoPlaying(false)
        }
      }, 10000) // 10 seconds per page
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isAutoPlaying, currentPageIndex])

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  // Navigation functions
  const goToNextPage = () => {
    if (currentPageIndex < STORY_PAGES.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  return (
    <main className="min-h-screen py-8 bg-gradient-to-b from-amber-50 to-orange-50 text-slate-800 dark:from-amber-950 dark:to-orange-950 dark:text-amber-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-amber-800/20 dark:via-gray-900 dark:to-red-800/20 animate-gradient"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-yellow-300/10 to-transparent dark:from-yellow-500/10"></div>
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-amber-200/20 to-transparent dark:from-amber-700/20"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-4xl opacity-20 dark:opacity-10">📚</div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-20 dark:opacity-10">🎭</div>
        <div className="absolute top-40 right-20 text-4xl opacity-20 dark:opacity-10">🎵</div>
      </div>


      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-primary hover:text-primary/80 dark:text-amber-400">
              <HomeIcon className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>

          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Button
              variant="outline"
              onClick={toggleAutoPlay}
              className="border-primary text-primary dark:border-amber-600 dark:text-amber-400"
            >
              {isAutoPlaying ? "Pause Story" : "Auto-Play Story"}
            </Button>
          </motion.div>
        </div>

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-orange-300 dark:to-amber-300">
            The Story of Hadestown
          </h1>
          <p className="text-slate-600 dark:text-amber-200/80 text-lg">A musical journey of love and seasons</p>
        </motion.div>

        {/* Story Card */}
        <motion.div
          key={currentPage.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto bg-white/90 dark:bg-gray-800/80 rounded-xl overflow-hidden shadow-xl border border-amber-200 dark:border-amber-700/50 backdrop-blur-sm mb-10"
        >
          <div className="p-6">
            {/* Page number and progress */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-medium text-slate-500 dark:text-amber-400/70">
                Page {currentPageIndex + 1} of {STORY_PAGES.length}
              </span>

              <div className="w-1/2 h-1.5 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPageIndex + 1) / STORY_PAGES.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>

            {/* Page title */}
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {currentPage.title}
            </motion.h2>

            {/* Visual element */}
            <motion.div
              className="mb-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentPage.visualElement}
            </motion.div>

            {/* Story text */}
            <motion.p
              className="text-lg text-slate-700 dark:text-amber-100 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentPage.content}
            </motion.p>
          </div>
        </motion.div>

        {/* Navigation arrows - fun, animated with gradients */}
        <div className="fixed bottom-6 right-6 flex flex-row gap-3 z-30">
          <motion.div
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.9, rotate: -10 }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              y: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 400, damping: 10 },
            }}
          >
            <Button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0}
              className={`rounded-full w-16 h-16 shadow-xl bg-gradient-to-br from-amber-400 to-red-500 text-white dark:from-amber-500 dark:to-red-600 dark:text-gray-900 ${currentPageIndex === 0 ? "opacity-50 cursor-not-allowed" : "ember-glow hover:shadow-amber-500/30 hover:shadow-xl"}`}
              aria-label="Previous page"
            >
              <ArrowLeftCircleIcon className="h-8 w-8" />
              <span className="sr-only">Previous</span>
            </Button>
          </motion.div>

          {/* Page indicator */}
          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg border border-amber-200 dark:border-amber-700/50 backdrop-blur-sm flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {currentPageIndex + 1} / {STORY_PAGES.length}
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9, rotate: 10 }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              y: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut", delay: 0.5 },
              scale: { type: "spring", stiffness: 400, damping: 10 },
            }}
          >
            <Button
              onClick={goToNextPage}
              disabled={currentPageIndex === STORY_PAGES.length - 1}
              className={`rounded-full w-16 h-16 shadow-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white dark:from-amber-500 dark:to-orange-600 dark:text-gray-900 ${currentPageIndex === STORY_PAGES.length - 1 ? "opacity-50 cursor-not-allowed" : "ember-glow hover:shadow-amber-500/30 hover:shadow-xl"}`}
              aria-label="Next page"
            >
              <ArrowRightCircleIcon className="h-8 w-8" />
              <span className="sr-only">Next</span>
            </Button>
          </motion.div>
        </div>

        {/* Page selector */}
        <div className="flex justify-center mt-10 gap-2">
          {STORY_PAGES.map((page, index) => (
            <motion.button
              key={page.id}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full ${
                index === currentPageIndex ? "bg-primary dark:bg-amber-500" : "bg-slate-300 dark:bg-gray-600"
              }`}
              onClick={() => setCurrentPageIndex(index)}
              aria-label={`Go to page ${index + 1}`}
              animate={index === currentPageIndex ? { scale: [1, 1.2, 1] } : {}}
              transition={index === currentPageIndex ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY } : {}}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

