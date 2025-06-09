"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import BinaryMascot, { type MascotEmotion } from "./binary-mascot"
import { ChevronLeft, ChevronRight, Lightbulb, Share2, Copy } from "lucide-react"
import confetti from "canvas-confetti"

// Replace the Previous and Next buttons with FunButton components
import { FunButton } from "./fun-button"

export default function BinaryFunFacts() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [direction, setDirection] = useState(0) // 1 for forward, -1 for backward
  const [copied, setCopied] = useState(false)

  const funFacts = [
    {
      title: "The Binary System is Ancient!",
      content:
        "While we associate binary with modern computers, the concept dates back to ancient Egypt around 3000 BCE. The Chinese 'I Ching' from 1000 BCE also used a binary system of broken and unbroken lines.",
      mascot: "thinking",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "ASCII Art Uses Binary",
      content:
        "ASCII art, which creates images using text characters, is ultimately represented in binary. Each character in ASCII art is stored as an 8-bit binary number in a computer's memory.",
      mascot: "excited",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Binary Birthday Candles",
      content:
        "You can represent your age in binary with candles on a birthday cake! Each position represents a power of 2, and you only need log₂(age) + 1 candles instead of one candle per year.",
      mascot: "happy",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-green-400 to-green-600",
    },
    {
      title: "Binary Jokes",
      content:
        "There are 10 types of people in the world: those who understand binary and those who don't. (In binary, '10' is actually the number 2!)",
      mascot: "celebrating",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Binary in Music",
      content:
        "Some musicians have hidden binary messages in their music! The band 'Information Society' included binary code in their songs that, when decoded, revealed secret messages to fans.",
      mascot: "excited",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-pink-400 to-pink-600",
    },
    {
      title: "Binary Planets",
      content:
        "Binary star systems are common in our galaxy, where two stars orbit around their common center of mass. Similarly, Pluto and its moon Charon are sometimes considered a 'binary planet' system!",
      mascot: "thinking",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      title: "Binary in DNA",
      content:
        "DNA can be thought of as a quaternary (base-4) system with A, T, G, and C, but it can also be represented as binary code. Scientists have stored binary data in actual DNA molecules!",
      mascot: "excited",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-red-400 to-red-600",
    },
    {
      title: "Binary in Braille",
      content:
        "Braille, the writing system for visually impaired people, is essentially a binary system. Each Braille character consists of six dots arranged in a 2×3 grid, where each dot is either raised (1) or flat (0).",
      mascot: "happy",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-teal-400 to-teal-600",
    },
    {
      title: "Binary Morse Code Connection",
      content:
        "Morse code, with its dots and dashes, is similar to binary. In fact, it can be directly translated to binary where a dot is 0 and a dash is 1 (or vice versa).",
      mascot: "thinking",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "Binary in Art",
      content:
        "Some artists create binary art where pixels or elements are either 'on' or 'off'. The artist Ryoji Ikeda creates stunning visual and sound installations based on binary data.",
      mascot: "celebrating",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-violet-400 to-violet-600",
    },
  ]

  const currentFact = funFacts[currentFactIndex]

  const goToNextFact = () => {
    setDirection(1)
    setCurrentFactIndex((prev) => (prev + 1) % funFacts.length)
  }

  const goToPrevFact = () => {
    setDirection(-1)
    setCurrentFactIndex((prev) => (prev - 1 + funFacts.length) % funFacts.length)
  }

  const shareFact = () => {
    // Create the text to share
    const shareText = `${currentFact.title}: ${currentFact.content}`

    // Always use the clipboard method first as it's more reliable
    copyToClipboard(shareText)

    // Only try Web Share API if we're confident it will work
    if (navigator.share && window.isSecureContext) {
      try {
        // The share must be triggered by a user action (like a click)
        navigator
          .share({
            title: "Binary Fun Fact",
            text: shareText,
          })
          .catch((err) => {
            console.log("Share API error (expected):", err)
            // We already copied to clipboard above, so no need to do anything here
          })
      } catch (error) {
        console.log("Share API exception (expected):", error)
        // We already copied to clipboard above, so no need to do anything here
      }
    }
  }

  const copyToClipboard = (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          })
          .catch((err) => {
            console.error("Clipboard API error:", err)
            fallbackCopyToClipboard(text)
          })
      } else {
        fallbackCopyToClipboard(text)
      }
    } catch (error) {
      console.error("Clipboard API exception:", error)
      fallbackCopyToClipboard(text)
    }
  }

  // Fallback copy method for browsers without clipboard API
  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed" // Avoid scrolling to bottom
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
      if (successful) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error("Fallback: Could not copy text: ", err)
    }

    document.body.removeChild(textArea)
  }

  return (
    <Card className="w-full border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
            >
              <BinaryMascot emotion="excited" size="sm" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-center ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
              Binary Fun Facts
            </h2>

          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-8 text-center">
            Discover amazing and surprising facts about binary numbers!
          </p>

          <div className="w-full max-w-3xl relative bg-white/70 dark:bg-slate-800/70 p-6 rounded-xl shadow-lg backdrop-blur-sm 
          ">
            <div className=" h-[50vh] overflow-scroll ">
            <AnimatePresence mode="wait" >
              <motion.div
                key={currentFactIndex}
                initial={{ opacity: 0, x: direction >= 0 ? 150 : -150 }}
                // initial={{ opacity: 0,x: direction >= 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                // exit={{ opacity: 0, x: direction > 0 ? 150 : -150 }}
                // initial={{ opacity: 0, x: 50}}
                // exit={{ opacity: 0, x: -50 }}
                exit={{ opacity: 0, x:direction >= 0 ? -150 : 150 }}
                transition={{ duration: 0.5 }}
                className=""
                
              >
                <div className="flex flex-col md:flex-row gap-6 ">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <Lightbulb className={`h-6 w-6 mr-2 text-${currentFact.color.split("-")[1]}-500`} />
                      <h3 className="text-xl font-bold">{currentFact.title}</h3>
                    </div>
                    <p className="text-base mb-6">{currentFact.content}</p>


                    <div className="flex justify-end items-center mt-4">
                      {/* <div className="flex space-x-1">
                        {funFacts.map((_, i) => (
                          <motion.div
                            key={i}
                            className={`h-2 w-2 rounded-full ${i === currentFactIndex
                                ? `bg-${currentFact.color.split("-")[1]}-500`
                                : "bg-gray-300 dark:bg-gray-700"
                              }`}
                            animate={i === currentFactIndex ? { scale: [1, 1.5, 1] } : {}}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                          />
                        ))}
                      </div> */}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={copyToClipboard.bind(null, `${currentFact.title}: ${currentFact.content}`)}
                          className="rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                        >
                          {copied ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
                              <Copy className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="sr-only">Copy</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={shareFact}
                          className="rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/3 flex flex-col items-center justify-center hidden md:block">
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                    >
                      <BinaryMascot emotion={currentFact.mascot as MascotEmotion} size="lg" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-6 absolute bottom-2 left-5 right-5 ">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FunButton
                  onClick={goToPrevFact}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  iconPosition="left"
                  bubbles={true}
                  size="sm"
                  className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                >
                  <span className="sm:inline hidden">Prev</span>
                </FunButton>
              </motion.div>

              <div className="flex space-x-1">
                {funFacts.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentFactIndex ? 1 : -1)
                      setCurrentFactIndex(i)
                    }}
                    className={`h-2 w-2 rounded-full transition-all duration-300 hover:scale-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      i === currentFactIndex
                        ? `bg-${currentFact.color.split("-")[1]}-500`
                        : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                    }`}
                    animate={i === currentFactIndex ? { scale: [1, 1.5, 1] } : {}}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    aria-label={`Go to fact ${i + 1}`}
                  />
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FunButton
                  onClick={goToNextFact}
                  icon={<ChevronRight className="h-4 w-4" />}
                  iconPosition="right"
                  bubbles={true}
                  size="sm"
                  className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                >
                  <span className="sm:inline hidden">Next</span>
                </FunButton>
              </motion.div>
            </div>
          </div>

          <div className="mt-8 w-full max-w-3xl">
            <Card className="bg-gradient-to-br from-violet-50/70 to-blue-50/70 dark:from-violet-900/20 dark:to-blue-900/20 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <BinaryMascot emotion="happy" size="sm" />
                  <h3 className="text-xl font-bold ml-2">Did You Know?</h3>
                </div>

                <p className="text-base mb-4">
                  The word &quot;bit&quot; is a contraction of &quot;binary digit&quot; and was first used by statistician John Tukey in
                  1946.
                </p>

                {/* Update the "Celebrate Binary" button to be more kid-friendly */}
                <FunButton
                  onClick={() => {
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                    })
                  }}
                  variant="default"
                  bubbles={true}
                  size="xl"
                  className="px-8 py-5 text-xl font-bold h-10"
                >
                  <span className="relative z-10">Celebrate Binary!</span>
                </FunButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


