"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import BinaryMascot from "./binary-mascot"
import { ArrowRight, ArrowDown, Info, ChevronLeft, ChevronRight } from "lucide-react"
// Replace the "Show Steps" buttons with FunButton components
import { FunButton } from "./fun-button"
// First, import the Popover components at the top of the file with the other imports
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function BinaryExplanation() {
  const [decimalValue, setDecimalValue] = useState(13)
  const [binaryValue, setBinaryValue] = useState("1101")
  const [showDecimalSteps, setShowDecimalSteps] = useState(false)
  const [showBinarySteps, setShowBinarySteps] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  // const totalSteps = 4
  // const [decimalStepIndex, setDecimalStepIndex] = useState(0)
  // const totalDecimalSteps = 4
  // Add state to track if the walkthrough popover is open
  // const [walkthroughOpen, setWalkthroughOpen] = useState(false)
  const [gameMode, setGameMode] = useState("decimal-to-binary")

  // Generate steps for decimal to binary conversion
  const generateDecimalToBinarySteps = (decimal: number) => {
    const steps = []
    let value = decimal
    let result = ""

    while (value > 0) {
      const remainder = value % 2
      steps.push({
        value,
        division: Math.floor(value / 2),
        remainder,
      })
      result = remainder + result
      value = Math.floor(value / 2)
    }

    return { steps, result }
  }

  // Generate steps for binary to decimal conversion
  const generateBinaryToDecimalSteps = (binary: string) => {
    const steps = []
    let result = 0

    for (let i = 0; i < binary.length; i++) {
      const position = binary.length - 1 - i
      const bit = Number.parseInt(binary[i])
      const value = bit * Math.pow(2, position)

      steps.push({
        bit,
        position,
        powerOfTwo: Math.pow(2, position),
        value,
      })

      result += value
    }

    return { steps, result }
  }

  const decimalToBinarySteps = generateDecimalToBinarySteps(decimalValue)
  const binaryToDecimalSteps = generateBinaryToDecimalSteps(binaryValue)

  return (
    <Card className="w-full border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
            >
              <BinaryMascot emotion="thinking" size="sm" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-center ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
              Binary Conversion Guide
            </h2>
          </div>

          <Tabs defaultValue="decimal-to-binary" className="w-full max-w-3xl" onValueChange={setGameMode}>
            <div className="relative mb-12">
              {/* Fun background elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-300/30 dark:bg-blue-600/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-violet-300/30 dark:bg-violet-600/20 rounded-full blur-xl"></div>
              </div>

              {/* Binary particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-sm font-mono font-bold text-primary/20 dark:text-primary/10"
                    initial={{
                      x: Math.random() * 100 - 50 + "%",
                      y: -20,
                      opacity: 0,
                      scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                      y: ["0%", "100%"],
                      opacity: [0, 0.8, 0],
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: Math.random() * 20 + 15,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 10,
                      ease: "linear",
                    }}
                  >
                    {Math.random() > 0.5 ? "1" : "0"}
                  </motion.div>
                ))}
              </div>

              {/* Conversion Machine UI */}
              <div className="flex flex-col items-center">
                <motion.div
                  className="mb-4 bg-gradient-to-r from-violet-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  <h3 className="text-lg font-bold">Choose Your Conversion</h3>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
                  {/* Decimal to Binary Converter */}
                  <motion.div
                    className={`flex-1 relative overflow-hidden rounded-2xl shadow-lg ${
                      gameMode === "decimal-to-binary"
                        ? "ring-4 ring-blue-500 dark:ring-blue-400"
                        : "ring-1 ring-slate-200 dark:ring-slate-700"
                    }`}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setGameMode("decimal-to-binary")}
                  >
                    <div
                      className={`absolute inset-0 ${
                        gameMode === "decimal-to-binary"
                          ? "bg-gradient-to-br from-blue-500/20 to-violet-500/20 dark:from-blue-500/30 dark:to-violet-500/30"
                          : "bg-white/80 dark:bg-slate-800/80"
                      } backdrop-blur-sm transition-all duration-300`}
                    ></div>

                    <div className="relative p-6 flex flex-col items-center">
                      <div className="absolute top-2 right-2">
                        {gameMode === "decimal-to-binary" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                          >
                            Selected
                          </motion.div>
                        )}
                      </div>

                      <div className="mb-4 text-center">
                        <h3
                          className={`text-xl font-bold mb-1 ${
                            gameMode === "decimal-to-binary" ? "text-blue-600 dark:text-blue-300" : ""
                          }`}
                        >
                          Numbers to Binary
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Convert regular numbers to binary code
                        </p>
                      </div>

                      {/* Interactive Example */}
                      <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 shadow-inner mb-4">
                        <div className="flex items-center justify-center gap-4">
                          <motion.div
                            className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
                            animate={
                              gameMode === "decimal-to-binary"
                                ? {
                                    scale: [1, 1.1, 1],
                                    boxShadow: [
                                      "0px 4px 8px rgba(0,0,0,0.1)",
                                      "0px 8px 16px rgba(0,0,0,0.2)",
                                      "0px 4px 8px rgba(0,0,0,0.1)",
                                    ],
                                  }
                                : {}
                            }
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                          >
                            13
                          </motion.div>

                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                          >
                            <div className="relative">
                              <div className="w-20 h-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center">
                                <ArrowRight className="h-6 w-6 text-slate-400" />
                              </div>
                              {gameMode === "decimal-to-binary" && (
                                <motion.div
                                  className="absolute inset-0 flex items-center justify-center"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold">→</span>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>

                          <motion.div
                            className="w-24 h-16 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl font-mono font-bold shadow-md"
                            animate={
                              gameMode === "decimal-to-binary"
                                ? {
                                    scale: [1, 1.1, 1],
                                    boxShadow: [
                                      "0px 4px 8px rgba(0,0,0,0.1)",
                                      "0px 8px 16px rgba(0,0,0,0.2)",
                                      "0px 4px 8px rgba(0,0,0,0.1)",
                                    ],
                                  }
                                : {}
                            }
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.3 }}
                          >
                            1101
                          </motion.div>
                        </div>
                      </div>

                      {/* Mascot */}
                      <div className="absolute -bottom-6 -right-6">
                        <motion.div
                          animate={gameMode === "decimal-to-binary" ? { y: [0, -10, 0], rotate: [0, 5, -5, 0] } : {}}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                        >
                          <BinaryMascot emotion={gameMode === "decimal-to-binary" ? "excited" : "thinking"} size="sm" />
                        </motion.div>
                      </div>

                      {/* Try Me Button */}
                      <motion.button
                        className={`mt-2 px-4 py-2 rounded-full text-sm font-medium ${
                          gameMode === "decimal-to-binary"
                            ? "bg-blue-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGameMode("decimal-to-binary")}
                      >
                        {gameMode === "decimal-to-binary" ? "Selected!" : "Try Me!"}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Binary to Decimal Converter */}
                  <motion.div
                    className={`flex-1 relative overflow-hidden rounded-2xl shadow-lg ${
                      gameMode === "binary-to-decimal"
                        ? "ring-4 ring-green-500 dark:ring-green-400"
                        : "ring-1 ring-slate-200 dark:ring-slate-700"
                    }`}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setGameMode("binary-to-decimal")}
                  >
                    <div
                      className={`absolute inset-0 ${
                        gameMode === "binary-to-decimal"
                          ? "bg-gradient-to-br from-green-500/20 to-teal-500/20 dark:from-green-500/30 dark:to-teal-500/30"
                          : "bg-white/80 dark:bg-slate-800/80"
                      } backdrop-blur-sm transition-all duration-300`}
                    ></div>

                    <div className="relative p-6 flex flex-col items-center">
                      <div className="absolute top-2 right-2">
                        {gameMode === "binary-to-decimal" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                          >
                            Selected
                          </motion.div>
                        )}
                      </div>

                      <div className="mb-4 text-center">
                        <h3
                          className={`text-xl font-bold mb-1 ${
                            gameMode === "binary-to-decimal" ? "text-green-600 dark:text-green-300" : ""
                          }`}
                        >
                          Binary to Numbers
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Convert binary code to regular numbers
                        </p>
                      </div>

                      {/* Interactive Example */}
                      <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 shadow-inner mb-4">
                        <div className="flex items-center justify-center gap-4">
                          <motion.div
                            className="w-24 h-16 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl font-mono font-bold shadow-md"
                            animate={
                              gameMode === "binary-to-decimal"
                                ? {
                                    scale: [1, 1.1, 1],
                                    boxShadow: [
                                      "0px 4px 8px rgba(0,0,0,0.1)",
                                      "0px 8px 16px rgba(0,0,0,0.2)",
                                      "0px 4px 8px rgba(0,0,0,0.1)",
                                    ],
                                  }
                                : {}
                            }
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                          >
                            1101
                          </motion.div>

                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                          >
                            <div className="relative">
                              <div className="w-20 h-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center">
                                <ArrowRight className="h-6 w-6 text-slate-400" />
                              </div>
                              {gameMode === "binary-to-decimal" && (
                                <motion.div
                                  className="absolute inset-0 flex items-center justify-center"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold">→</span>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>

                          <motion.div
                            className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
                            animate={
                              gameMode === "binary-to-decimal"
                                ? {
                                    scale: [1, 1.1, 1],
                                    boxShadow: [
                                      "0px 4px 8px rgba(0,0,0,0.1)",
                                      "0px 8px 16px rgba(0,0,0,0.2)",
                                      "0px 4px 8px rgba(0,0,0,0.1)",
                                    ],
                                  }
                                : {}
                            }
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.3 }}
                          >
                            13
                          </motion.div>
                        </div>
                      </div>

                      {/* Mascot */}
                      <div className="absolute -bottom-6 -left-6">
                        <motion.div
                          animate={gameMode === "binary-to-decimal" ? { y: [0, -10, 0], rotate: [0, -5, 5, 0] } : {}}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                        >
                          <BinaryMascot emotion={gameMode === "binary-to-decimal" ? "excited" : "thinking"} size="sm" />
                        </motion.div>
                      </div>

                      {/* Try Me Button */}
                      <motion.button
                        className={`mt-2 px-4 py-2 rounded-full text-sm font-medium ${
                          gameMode === "binary-to-decimal"
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGameMode("binary-to-decimal")}
                      >
                        {gameMode === "binary-to-decimal" ? "Selected!" : "Try Me!"}
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <TabsContent value="binary-to-decimal" className="space-y-6">
              {/* Main explanation content - the popover walkthrough provides an alternative focused view of this content */}
              <div className="bg-gradient-to-br from-green-100/80 to-teal-100/80 dark:from-green-900/30 dark:to-teal-900/30 p-6 rounded-xl shadow-md overflow-hidden relative">
                {/* Animated binary background */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10 overflow-hidden pointer-events-none">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [-500, 0] }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="text-3xl font-mono font-bold text-green-900 dark:text-green-300 whitespace-pre-wrap"
                  >
                    {"10101010\n01010101\n11001100\n00110011\n10101010\n01010101\n11001100\n00110011"}
                  </motion.div>
                </div>

                <div className="relative z-10">
                  <motion.div
                    className="flex items-center mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }} transition={{ duration: 0.5 }}>
                      <Info className="mr-3 h-6 w-6 text-green-500 bg-green-100 dark:bg-green-900/50 p-1 rounded-full" />
                    </motion.div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">
                      How to Convert Binary to Decimal
                    </h3>
                  </motion.div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-900/70 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Example: Converting {binaryValue} to Decimal</h3>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                  <motion.div
                    className="text-3xl font-mono font-bold bg-gradient-to-br from-violet-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-md"
                    whileHover={{ scale: 1.05 }}
                  >
                    {binaryValue}
                  </motion.div>

                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="h-8 w-8 text-blue-500" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    className="block md:hidden"
                  >
                    <ArrowDown className="h-8 w-8 text-blue-500" />
                  </motion.div>

                  <motion.div
                    className="text-3xl font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-md"
                    whileHover={{ scale: 1.05 }}
                  >
                    {binaryToDecimalSteps.result}
                  </motion.div>
                </div>

                {/* Replace the second "Show Steps" button */}
                <div className="flex justify-center mb-6 gap-4">
                  <FunButton 
                    onClick={() => setShowBinarySteps(!showBinarySteps)} 
                    variant="secondary" 
                    bubbles={true}
                    size="lg"
                    className="px-6 py-4 text-lg font-bold"
                  >
                    {showBinarySteps ? "Hide Steps" : "Show Steps"}
                  </FunButton>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FunButton 
                        variant="outline" 
                        bubbles={true}
                        size="lg"
                        className="px-6 py-4 text-lg font-bold"
                      >
                        Walkthrough
                      </FunButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-md p-0 border-0 shadow-xl" align="center">
                      <div className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg">
                        <h3 className="text-lg font-bold mb-4 text-center">Binary to Decimal Conversion</h3>
                        {(() => {
                          // Define the steps array directly in the popover
                          const popoverBinarySteps = [
                            {
                              title: "Step 1: Identify Bit Positions",
                              content: (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  className="flex flex-col items-center bg-white/70 dark:bg-slate-800/70 p-4 rounded-lg shadow-md"
                                >
                                  <p className="text-center mb-4">
                                    Start by identifying the position of each bit, from right to left, starting with
                                    position 0.
                                  </p>
                                  <div className="flex flex-col items-center space-y-4">
                                    <div className="flex space-x-1">
                                      {["1", "1", "0", "1"].map((bit, index) => (
                                        <div
                                          key={index}
                                          className="w-12 h-12 bg-green-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md"
                                        >
                                          {bit}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="h-8 border-l-2 border-dashed border-green-500"></div>
                                    <div className="flex space-x-2">
                                      {[3, 2, 1, 0].map((position, index) => (
                                        <div
                                          key={index}
                                          className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md"
                                        >
                                          {position}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="text-center mt-2 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                      <p className="font-medium">Position numbers (right to left)</p>
                                      <p className="text-sm mt-1">Each position represents a power of 2</p>
                                    </div>
                                  </div>
                                </motion.div>
                              ),
                            },
                            {
                              title: "Step 2: Calculate Values for Each Position",
                              content: (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  className="flex flex-col items-center bg-white/70 dark:bg-slate-800/70 p-4 rounded-lg shadow-md"
                                >
                                  <p className="text-center mb-4">
                                    For each position, calculate the value using the formula: 2<sup>position</sup>
                                  </p>
                                  <div className="grid grid-cols-2 gap-4">
                                    {[
                                      { position: 3, value: 8, formula: "2³ = 8" },
                                      { position: 2, value: 4, formula: "2² = 4" },
                                      { position: 1, value: 2, formula: "2¹ = 2" },
                                      { position: 0, value: 1, formula: "2⁰ = 1" },
                                    ].map((item, index) => (
                                      <div key={index} className="flex flex-col items-center">
                                        <div className="text-sm text-center mb-1">Position {item.position}</div>
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md">
                                          {item.value}
                                        </div>
                                        <div className="mt-2 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                                          {item.formula}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              ),
                            },
                            {
                              title: "Step 3: Multiply Each Bit by Its Position Value",
                              content: (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  className="flex flex-col items-center bg-white/70 dark:bg-slate-800/70 p-4 rounded-lg shadow-md"
                                >
                                  <p className="text-center mb-4">
                                    Multiply each bit (0 or 1) by the value of its position. Bits that are 0 contribute
                                    nothing.
                                  </p>
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-center space-x-2">
                                      <div className="w-12 h-12 bg-green-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        1
                                      </div>
                                      <span className="text-xl">×</span>
                                      <div className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        8
                                      </div>
                                      <span className="text-xl">=</span>
                                      <div className="w-12 h-12 bg-purple-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        8
                                      </div>
                                    </div>
                                    <div className="text-center text-sm">Position 3: 1 × 2³ = 8</div>

                                    <div className="flex items-center justify-center space-x-2">
                                      <div className="w-12 h-12 bg-green-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        1
                                      </div>
                                      <span className="text-xl">×</span>
                                      <div className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        4
                                      </div>
                                      <span className="text-xl">=</span>
                                      <div className="w-12 h-12 bg-purple-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        4
                                      </div>
                                    </div>
                                    <div className="text-center text-sm">Position 2: 1 × 2² = 4</div>
                                  </div>
                                </motion.div>
                              ),
                            },
                            {
                              title: "Step 4: Add All Values Together",
                              content: (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  className="flex flex-col items-center bg-white/70 dark:bg-slate-800/70 p-4 rounded-lg shadow-md"
                                >
                                  <p className="text-center mb-4">
                                    Add up all the values from positions with a bit value of 1 to get the decimal
                                    result.
                                  </p>
                                  <div className="flex flex-col items-center space-y-6">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-12 h-12 bg-purple-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        8
                                      </div>
                                      <span className="text-2xl">+</span>
                                      <div className="w-12 h-12 bg-purple-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        4
                                      </div>
                                      <span className="text-2xl">+</span>
                                      <div className="w-12 h-12 bg-purple-500 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        1
                                      </div>
                                      <span className="text-2xl">=</span>
                                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-md flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        13
                                      </div>
                                    </div>

                                    <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg max-w-md text-center mt-4">
                            <p className="font-bold text-lg">1101₂ = 13₁₀</p>
                            <p className="mt-2">8 + 4 + 0 + 1 = 13</p>
                            <p className="mt-2 text-sm">The binary number 1101 equals 13 in decimal</p>
                          </div>
                                  </div>
                                </motion.div>
                              ),
                            },
                          ]

                          return (
                            <div className="relative">
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={currentStep}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="mb-4 bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                                    <h4 className="font-bold text-center">{popoverBinarySteps[currentStep].title}</h4>
                                  </div>
                                  {popoverBinarySteps[currentStep].content}
                                </motion.div>
                              </AnimatePresence>

                              {/* Update the walkthrough navigation buttons to be more kid-friendly */}
                              <div className="flex justify-between items-center mt-6">
                                <FunButton
                                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                                  disabled={currentStep === 0}
                                  variant={currentStep === 0 ? "ghost" : "outline"}
                                  icon={<ChevronLeft className="h-4 w-4" />}
                                  iconPosition="left"
                                  bubbles={currentStep !== 0}
                                  size="sm"
                                  className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                                >
                                  <span className="sm:inline hidden">Prev</span>
                                </FunButton>

                                <div className="flex space-x-2 items-center">
                                  {popoverBinarySteps.map((_, index) => (
                                    <motion.button
                                      key={index}
                                      className={`h-2.5 w-2.5 rounded-full ${
                                        currentStep === index ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                                      }`}
                                      onClick={() => setCurrentStep(index)}
                                      animate={currentStep === index ? { scale: [1, 1.5, 1] } : {}}
                                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                                    />
                                  ))}
                                </div>

                                <FunButton
                                  onClick={() =>
                                    setCurrentStep((prev) => Math.min(popoverBinarySteps.length - 1, prev + 1))
                                  }
                                  disabled={currentStep === popoverBinarySteps.length - 1}
                                  variant={currentStep === popoverBinarySteps.length - 1 ? "ghost" : "default"}
                                  icon={<ChevronRight className="h-4 w-4" />}
                                  iconPosition="right"
                                  bubbles={currentStep !== popoverBinarySteps.length - 1}
                                  size="sm"
                                  className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                                >
                                  <span className="sm:inline hidden">Next</span>
                                </FunButton>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <AnimatePresence>
                  {showBinarySteps && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-inner">
                        <div className="grid grid-cols-4 gap-2 font-mono text-center font-bold mb-2 text-sm">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Bit</div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Position</div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Value (2^Position)</div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Contribution</div>
                        </div>

                        {binaryToDecimalSteps.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="grid grid-cols-4 gap-2 font-mono text-center mb-2"
                          >
                            <div
                              className={`p-2 rounded font-bold ${
                                step.bit === 1
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : "bg-slate-100 dark:bg-slate-700"
                              }`}
                            >
                              {step.bit}
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.position}</div>
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                              2<sup>{step.position}</sup> = {step.powerOfTwo}
                            </div>
                            <div
                              className={`p-2 rounded font-bold ${
                                step.bit === 1
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                              }`}
                            >
                              {step.bit === 1 ? step.value : 0}
                            </div>
                          </motion.div>
                        ))}

                        <div className="mt-4 p-3 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 rounded-lg">
                          <p className="font-medium text-center">
                            Sum of all contributions:
                            <span className="font-mono font-bold ml-2">
                              {binaryToDecimalSteps.steps
                                .filter((step) => step.bit === 1)
                                .map((step) => step.value)
                                .join(" + ")}{" "}
                              = {binaryToDecimalSteps.result}
                            </span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-3">Try Different Values:</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["101", "1010", "1101", "10101", "101010"].map((value) => (
                    <motion.button
                      key={value}
                      onClick={() => setBinaryValue(value)}
                      className={`px-4 py-2 rounded-lg font-mono font-medium ${
                        binaryValue === value
                          ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white"
                          : "bg-white dark:bg-slate-800"
                      } shadow-sm`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {value}
                    </motion.button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="decimal-to-binary" className="space-y-6">
              <div className="bg-gradient-to-br from-blue-100/80 to-violet-100/80 dark:from-blue-900/30 dark:to-violet-900/30 p-6 rounded-xl shadow-md relative overflow-hidden">
                {/* Animated binary background */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10 overflow-hidden pointer-events-none">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [-500, 0] }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="text-3xl font-mono font-bold text-blue-900 dark:text-blue-300 whitespace-pre-wrap"
                  >
                    {"10101010\n01010101\n11001100\n00110011\n10101010\n01010101\n11001100\n00110011"}
                  </motion.div>
                </div>

                <div className="relative z-10">
                  <motion.div
                    className="flex items-center mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }} transition={{ duration: 0.5 }}>
                      <Info className="mr-3 h-6 w-6 text-blue-500 bg-blue-100 dark:bg-blue-900/50 p-1 rounded-full" />
                    </motion.div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                      How to Convert Decimal to Binary
                    </h3>
                  </motion.div>

                  <p className="mb-4">
                    To convert decimal numbers to binary, we divide the number by 2 repeatedly until we reach 0,
                    noting the remainder each time. Then we read the remainders from bottom to top.
                  </p>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-900/70 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Example: Converting {decimalValue} to Binary</h3>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                  <motion.div
                    className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white px-6 py-3 rounded-xl shadow-md"
                    whileHover={{ scale: 1.05 }}
                  >
                    {decimalValue}
                  </motion.div>

                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="h-8 w-8 text-blue-500" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    className="block md:hidden"
                  >
                    <ArrowDown className="h-8 w-8 text-blue-500" />
                  </motion.div>

                  <motion.div
                    className="text-3xl font-mono font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-md"
                    whileHover={{ scale: 1.05 }}
                  >
                    {decimalToBinarySteps.result}
                  </motion.div>
                </div>

                <div className="flex justify-center mb-6 gap-3">
                  <FunButton onClick={() => setShowDecimalSteps(!showDecimalSteps)} variant="secondary" bubbles={true}>
                    {showDecimalSteps ? "Hide Steps" : "Show Steps"}
                  </FunButton>
                </div>

                <AnimatePresence>
                  {showDecimalSteps && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-inner">
                        <div className="grid grid-cols-3 gap-2 font-mono text-center font-bold mb-2 text-sm">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Division</div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Quotient</div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Remainder</div>
                        </div>

                        {decimalToBinarySteps.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="grid grid-cols-3 gap-2 font-mono text-center mb-2"
                          >
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.value} ÷ 2</div>
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.division}</div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded font-bold">{step.remainder}</div>
                          </motion.div>
                        ))}

                        <div className="flex flex-col items-center mt-6 p-3 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 rounded-lg">
                          <p className="font-medium mb-3">Reading remainders from bottom to top:</p>

                          <div className="flex flex-col items-center">
                            <div className="flex space-x-1 mb-2">
                              {decimalToBinarySteps.steps.map((step, index) => (
                                <motion.div
                                  key={index}
                                  className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm"
                                  whileHover={{ scale: 1.1, backgroundColor: "#93c5fd" }}
                                >
                                  {step.remainder}
                                </motion.div>
                              )).reverse()}
                            </div>

                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className="text-xl font-mono font-bold"
                            >
                              {decimalValue}<sub>10</sub> = {decimalToBinarySteps.result}<sub>2</sub>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-3">Try Different Values:</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[7, 10, 13, 21, 42].map((value) => (
                    <motion.button
                      key={value}
                      onClick={() => setDecimalValue(value)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        decimalValue === value
                          ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                          : "bg-white dark:bg-slate-800"
                      } shadow-sm`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {value}
                    </motion.button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 w-full max-w-3xl">
            <Card className="bg-gradient-to-br from-violet-50/70 to-blue-50/70 dark:from-violet-900/20 dark:to-blue-900/20 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <BinaryMascot emotion="excited" size="sm" />
                  <h3 className="text-xl font-bold ml-2">Quick Reference: Powers of 2</h3>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
                  {[7, 6, 5, 4, 3, 2, 1, 0].map((position) => (
                    <motion.div
                      key={position}
                      className="text-center"
                      whileHover={{ scale: 1.1, y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (7 - position) * 0.1 }}
                    >
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md">
                        <div className="text-xs mb-1">Position</div>
                        <div className="font-bold text-lg">{position}</div>
                        <div className="text-xs mt-1">Value</div>
                        <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                          {Math.pow(2, position)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center text-sm bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg shadow-sm">
                  <p>
                    Each position in a binary number represents a power of 2, reading from right to left, starting with
                    2<sup>0</sup> (which equals 1) at the rightmost position.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>

          
        </CardContent>
      </Card>
    );
}

