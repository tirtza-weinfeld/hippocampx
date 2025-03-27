"use client"

import { useState, useEffect, useRef, startTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowDown, Lightbulb, RefreshCw, ChevronLeft, ChevronRight, Binary } from "lucide-react"
// Replace the "Show Steps" buttons with FunButton components
import { FunButton } from "./fun-button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export default function BinaryExplanation() {
  // Ensure consistent colors and better layout for mobile
  // Define a consistent color scheme at the top of the component
  const COLORS = {
    binary: {
      bg: "from-violet-500 to-blue-500",
      light: "from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30",
      highlight: "bg-blue-100 dark:bg-blue-900/30",
      bit: {
        one: "from-violet-500 to-blue-600",
        zero: "bg-slate-200 dark:bg-slate-700",
      },
    },
    decimal: {
      bg: "from-green-500 to-teal-500",
      light: "from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30",
      highlight: "bg-green-100 dark:bg-green-900/30",
    },
  }
  // State for the conversion values
  const [decimalValue, setDecimalValue] = useState(13)
  const [binaryValue, setBinaryValue] = useState("1101")

  // State for showing steps
  const [showDecimalSteps, setShowDecimalSteps] = useState(false)
  const [showBinarySteps, setShowBinarySteps] = useState(false)

  // State for the walkthrough
  const [activeTab, setActiveTab] = useState("decimal-to-binary")

  // State for animation control
  const [animateConversion, setAnimateConversion] = useState(false)
  const [highlightedBit, setHighlightedBit] = useState<number | null>(null)
  const [highlightedStep, setHighlightedStep] = useState<number | null>(null)

  // State for interactive binary builder
  const [customDecimal, setCustomDecimal] = useState(0)
  const [customBinary, setCustomBinary] = useState("")
  const [binaryBits, setBinaryBits] = useState([0, 0, 0, 0, 0, 0, 0, 0])

  // Simplify the step-by-step navigation and make it more intuitive
  const [isStepByStep, setIsStepByStep] = useState(false)
  const [runningAnimation, setRunningAnimation] = useState(false)

  // Replace the single currentStepIndex with separate step indices for each conversion type
  const [decimalToBinaryStepIndex, setDecimalToBinaryStepIndex] = useState(0)
  const [binaryToDecimalStepIndex, setBinaryToDecimalStepIndex] = useState(0)

  // Ref to store animation timeouts
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([])

  // Reset step indices when tab changes
  useEffect(() => {
    // Clear any running animation timeouts
    animationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    animationTimeoutsRef.current = []

    setAnimateConversion(false)
    setHighlightedBit(null)
    setHighlightedStep(null)
    setShowDecimalSteps(false)
    setShowBinarySteps(false)
    setDecimalToBinaryStepIndex(0)
    setBinaryToDecimalStepIndex(0)
  }, [activeTab])

  // Update custom binary when bits change
  useEffect(() => {
    const binaryString = binaryBits.join("")
    setCustomBinary(binaryString)
    setCustomDecimal(Number.parseInt(binaryString, 2) || 0)
  }, [binaryBits])

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

    return { steps, result: result || "0" }
  }

  // Generate steps for binary to decimal conversion
  const generateBinaryToDecimalSteps = (binary: string) => {
    if (!binary || binary === "0") {
      return { steps: [], result: 0 }
    }

    const steps = []
    let result = 0

    for (let i = 0; i < binary.length; i++) {
      const position = binary.length - 1 - i
      const bit = Number.parseInt(binary[i], 10)
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

  // Function to toggle a bit in the interactive binary builder
  const toggleBit = (index: number) => {
    startTransition(() => {
      const newBits = [...binaryBits]
      newBits[index] = newBits[index] === 0 ? 1 : 0
      setBinaryBits(newBits)
    })
  }

  // Function to reset the interactive binary builder
  const resetBits = () => {
    startTransition(() => {
      setBinaryBits([0, 0, 0, 0, 0, 0, 0, 0])
    })
  }

  // Function to set a random binary number
  const setRandomBinary = () => {
    startTransition(() => {
      const randomBits = Array.from({ length: 8 }, () => Math.round(Math.random()))
      setBinaryBits(randomBits)
    })
  }

  // Update the startConversionAnimation function
  // const   startConversionAnimation = () => {
  //   // Clear any existing timeouts
  //   animationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
  //   animationTimeoutsRef.current = []

  //   // Wrap all state updates in startTransition
  //   startTransition(() => {
  //     // Reset animation state
  //     setHighlightedBit(null)
  //     setHighlightedStep(null)
  //     setDecimalToBinaryStepIndex(0)
  //     setBinaryToDecimalStepIndex(0)
  //     setRunningAnimation(false)
  //     setIsStepByStep(true)

  //     // Show the steps
  //     if (activeTab === "binary-to-decimal") {
  //       setShowBinarySteps(true)
  //     } else {
  //       setShowDecimalSteps(true)
  //     }
  //   })
  // }

  // Update the goToNextStep function to use the appropriate step index
  const goToNextStep = () => {
    const steps = activeTab === "binary-to-decimal" ? binaryToDecimalSteps.steps : decimalToBinarySteps.steps

    // Wrap state updates in startTransition
    startTransition(() => {
      setIsStepByStep(true)

      // Stop animation if it's running
      if (runningAnimation) {
        // Clear all timeouts
        animationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
        animationTimeoutsRef.current = []
        setRunningAnimation(false)
      }

      if (activeTab === "binary-to-decimal") {
        if (binaryToDecimalStepIndex < steps.length - 1) {
          const nextIndex = binaryToDecimalStepIndex + 1
          setBinaryToDecimalStepIndex(nextIndex)
          setHighlightedStep(nextIndex)
          setHighlightedBit(nextIndex)
        }
      } else {
        if (decimalToBinaryStepIndex < steps.length - 1) {
          const nextIndex = decimalToBinaryStepIndex + 1
          setDecimalToBinaryStepIndex(nextIndex)
          setHighlightedStep(nextIndex)
        }
      }
    })
  }

  // Update the goToPrevStep function to use the appropriate step index
  const goToPrevStep = () => {
    // Wrap state updates in startTransition
    startTransition(() => {
      setIsStepByStep(true)

      // Stop animation if it's running
      if (runningAnimation) {
        // Clear all timeouts
        animationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
        animationTimeoutsRef.current = []
        setRunningAnimation(false)
      }

      if (activeTab === "binary-to-decimal") {
        if (binaryToDecimalStepIndex > 0) {
          const prevIndex = binaryToDecimalStepIndex - 1
          setBinaryToDecimalStepIndex(prevIndex)
          setHighlightedStep(prevIndex)
          setHighlightedBit(prevIndex)
        }
      } else {
        if (decimalToBinaryStepIndex > 0) {
          const prevIndex = decimalToBinaryStepIndex - 1
          setDecimalToBinaryStepIndex(prevIndex)
          setHighlightedStep(prevIndex)
        }
      }
    })
  }

  return (
    <Card className="w-full border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
              className="bg-gradient-to-r from-violet-500 to-blue-500 p-2 rounded-full text-white"
            >
              <Binary className="h-6 w-6" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-center ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
              Binary Number Magic! ✨
            </h2>
          </div>

          <div className="w-full max-w-3xl">
            <div className="grid grid-cols-2 mb-8 p-1.5 bg-blue-100/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm overflow-hidden relative">
              {/* Animated background for active tab */}
              <motion.div
                className="absolute h-[calc(100%-0.75rem)] top-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 shadow-md z-0 pointer-events-none"
                layoutId="activeTabBackground"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                style={{
                  width: `calc(100% / 2)`,
                  left: activeTab === "decimal-to-binary" ? "0%" : "50%",
                }}
              />

              <motion.button
                onClick={() => setActiveTab("decimal-to-binary")}
                className={`relative z-10 py-2 transition-colors duration-300 ${
                  activeTab === "decimal-to-binary" ? "text-white font-bold" : "text-slate-700 dark:text-slate-300"
                }`}
                whileHover={{ scale: activeTab !== "decimal-to-binary" ? 1.05 : 1 }}
                whileTap={{ scale: activeTab !== "decimal-to-binary" ? 0.95 : 1 }}
              >
                <motion.span
                  initial={false}
                  animate={{
                    scale: activeTab === "decimal-to-binary" ? 1.05 : 1,
                    color: activeTab === "decimal-to-binary" ? "#ffffff" : "",
                  }}
                >
                  Decimal to Binary
                </motion.span>
              </motion.button>

              <motion.button
                onClick={() => setActiveTab("binary-to-decimal")}
                className={`relative z-10 py-2 transition-colors duration-300 ${
                  activeTab === "binary-to-decimal" ? "text-white font-bold" : "text-slate-700 dark:text-slate-300"
                }`}
                whileHover={{ scale: activeTab !== "binary-to-decimal" ? 1.05 : 1 }}
                whileTap={{ scale: activeTab !== "binary-to-decimal" ? 0.95 : 1 }}
              >
                <motion.span
                  initial={false}
                  animate={{
                    scale: activeTab === "binary-to-decimal" ? 1.05 : 1,
                    color: activeTab === "binary-to-decimal" ? "#ffffff" : "",
                  }}
                >
                  Binary to Decimal
                </motion.span>
              </motion.button>
            </div>

            {/* DECIMAL TO BINARY CONTENT */}
            <AnimatePresence mode="wait">
              <motion.div
                key="decimal-to-binary"
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: activeTab === "decimal-to-binary" ? 1 : 0,
                  x: activeTab === "decimal-to-binary" ? 0 : -20,
                }}
                exit={{ opacity: 0, x: 20 }}
                style={{ display: activeTab === "decimal-to-binary" ? "block" : "none" }}
              >
                {/* Introduction Card */}

                <Card className="bg-gradient-to-br from-blue-100/80 to-violet-100/80 dark:from-blue-900/30 dark:to-violet-900/30 border-0 shadow-lg overflow-hidden relative group">
                  <CardContent className="pt-6 relative z-10">
                    <motion.div
                      className="flex items-center mb-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }} transition={{ duration: 0.5 }}>
                        <Lightbulb className="mr-3 h-6 w-6 text-blue-500 bg-blue-100 dark:bg-blue-900/50 p-1 rounded-full" />
                      </motion.div>
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                        Turning Regular Numbers into Computer Code!
                      </h3>
                    </motion.div>

                    <div className="space-y-4">
                      <p className="relative">
                        Ever wondered how computers store numbers? They use something called &quot;binary,&quot; which is all
                        about 0s and 1s! Converting from our everyday numbers (called &quot;decimal&quot;) to binary is like
                        translating into a secret code.
                      </p>

                      <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-xl shadow-inner">
                        <h4 className="font-bold mb-2 text-center">Here&apos;s the Secret:</h4>
                        <ol className="list-decimal pl-6 space-y-2">
                          <motion.li
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring" }}
                            className={cn(
                              (isStepByStep)
                                ? "bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded-lg font-medium"
                                : "",
                            )}
                          >
                            We keep dividing the number by 2
                          </motion.li>
                          <motion.li
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring" }}
                            className={cn(
                              (isStepByStep)
                                ? "bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded-lg font-medium"
                                : "",
                            )}
                          >
                            We write down the remainder (it&apos;s either 0 or 1)
                          </motion.li>
                          <motion.li
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring" }}
                            className={cn(
                              (isStepByStep)
                                ? "bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded-lg font-medium"
                                : "",
                            )}
                          >
                            We repeat until we can&apos;t divide anymore
                          </motion.li>
                          <motion.li
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring" }}
                            className={cn(
                              isStepByStep
                                ? "bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded-lg font-medium"
                                : "",
                            )}
                          >
                            Then we read the remainders from bottom to top - that&apos;s our binary code!
                          </motion.li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>

                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: [-500, 0] }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="text-3xl font-mono font-bold text-blue-900 dark:text-blue-300 whitespace-pre-wrap"
                    >
                      {"10101010 01010101 11001100 00110011"}
                    </motion.div>
                  </div>
                </Card>

                {/* Interactive Example Card */}

                <Card className="bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4 text-center">Example: Converting {decimalValue} to Binary</h3>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                      <motion.div
                        className="text-3xl font-mono font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white px-6 py-3 rounded-full shadow-md w-32 sm:w-auto text-center min-h-[64px] flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        animate={animateConversion ? { scale: [1, 1.2, 1], y: [0, -10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {decimalValue}
                      </motion.div>

                      <motion.div
                        animate={animateConversion ? { x: [0, 20, 0], opacity: [0.5, 1, 0.5] } : { x: 0 }}
                        transition={{ repeat: animateConversion ? 3 : 0, duration: 1 }}
                        className="hidden md:block"
                      >
                        <ArrowRight className="h-8 w-8 text-blue-500" />
                      </motion.div>

                      <motion.div
                        animate={animateConversion ? { y: [0, 20, 0], opacity: [0.5, 1, 0.5] } : { y: 0 }}
                        transition={{ repeat: animateConversion ? 3 : 0, duration: 1 }}
                        className="block md:hidden"
                      >
                        <ArrowDown className="h-8 w-8 text-blue-500" />
                      </motion.div>

                      <motion.div
                        className="text-3xl font-mono font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white px-6 py-3 rounded-full shadow-md w-32 sm:w-auto text-center min-h-[64px] flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        animate={animateConversion ? { scale: [1, 1.2, 1], y: [0, -10, 0] } : {}}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {decimalToBinarySteps.result}
                      </motion.div>
                    </div>

                    {/* Improved button section with better mobile layout */}
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <FunButton
                        onClick={() => startTransition(() => setShowDecimalSteps(!showDecimalSteps))}
                        variant={showDecimalSteps ? "secondary" : "outline"}
                        bubbles={true}
                        icon={
                          showDecimalSteps ? (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          ) : (
                            <Lightbulb className="h-4 w-4 mr-2" />
                          )
                        }
                        iconPosition="left"
                        className="min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
                      >
                        {showDecimalSteps ? "Hide Steps" : "Show Steps"}
                      </FunButton>
                    </div>

                    <AnimatePresence>
                      {showDecimalSteps ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-inner min-h-[300px]">
                            {/* Completely redesigned step navigation */}
                            <div className="flex justify-center mb-6">
                              <div className="bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 rounded-full p-1 flex items-center shadow-md">
                                <motion.button
                                  onClick={goToPrevStep}
                                  disabled={decimalToBinaryStepIndex === 0}
                                  className={`relative rounded-full p-3 ${
                                    decimalToBinaryStepIndex === 0
                                      ? "opacity-50 cursor-not-allowed"
                                      : "bg-white dark:bg-slate-800 shadow-md hover:shadow-lg"
                                  }`}
                                  whileHover={decimalToBinaryStepIndex === 0 ? {} : { scale: 1.1 }}
                                  whileTap={decimalToBinaryStepIndex === 0 ? {} : { scale: 0.9 }}
                                  aria-label="Previous step"
                                >
                                  <ChevronLeft
                                    className={`h-6 w-6 ${decimalToBinaryStepIndex === 0 ? "text-gray-400" : "text-blue-500"}`}
                                  />

                                  {/* Add bubbles for fun effect */}
                                  {decimalToBinaryStepIndex > 0 && (
                                    <motion.div
                                      className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"
                                      animate={{
                                        y: [0, -10],
                                        opacity: [1, 0],
                                        scale: [0.8, 1.2],
                                      }}
                                      transition={{
                                        duration: 1,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                      }}
                                    />
                                  )}
                                </motion.button>

                                <div className="px-4 mx-2">
                                  <div className="flex items-center">
                                    <motion.div
                                      className="w-12 h-12 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
                                      animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0],
                                      }}
                                      transition={{
                                        duration: 3,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                      }}
                                    >
                                      {decimalToBinaryStepIndex + 1}
                                    </motion.div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Step</div>
                                      <div className="text-xs text-blue-500 dark:text-blue-300">
                                        of {decimalToBinarySteps.steps.length}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <motion.button
                                  onClick={goToNextStep}
                                  disabled={decimalToBinaryStepIndex >= decimalToBinarySteps.steps.length - 1}
                                  className={`relative rounded-full p-3 ${
                                    decimalToBinaryStepIndex >= decimalToBinarySteps.steps.length - 1
                                      ? "opacity-50 cursor-not-allowed"
                                      : "bg-white dark:bg-slate-800 shadow-md hover:shadow-lg"
                                  }`}
                                  whileHover={
                                    decimalToBinaryStepIndex >= decimalToBinarySteps.steps.length - 1
                                      ? {}
                                      : { scale: 1.1 }
                                  }
                                  whileTap={
                                    decimalToBinaryStepIndex >= decimalToBinarySteps.steps.length - 1
                                      ? {}
                                      : { scale: 0.9 }
                                  }
                                  aria-label="Next step"
                                >
                                  <ChevronRight
                                    className={`h-6 w-6 ${
                                      decimalToBinaryStepIndex >= decimalToBinarySteps.steps.length - 1
                                        ? "text-gray-400"
                                        : "text-blue-500"
                                    }`}
                                  />

                                  {/* Add bubbles for fun effect */}
                                  {decimalToBinaryStepIndex < decimalToBinarySteps.steps.length - 1 && (
                                    <motion.div
                                      className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"
                                      animate={{
                                        y: [0, -10],
                                        opacity: [1, 0],
                                        scale: [0.8, 1.2],
                                      }}
                                      transition={{
                                        duration: 1,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                      }}
                                    />
                                  )}
                                </motion.button>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 font-mono text-center font-bold mb-2 text-sm">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Division</div>
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Quotient</div>
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Remainder</div>
                            </div>

                            {/* Update the decimal-to-binary steps to highlight the current step better */}
                            {decimalToBinarySteps.steps.map((step, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  scale: highlightedStep === index ? 1.05 : 1,
                                  backgroundColor:
                                    highlightedStep === index ? "rgba(59, 130, 246, 0.2)" : "transparent",
                                }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                  "grid grid-cols-3 gap-2 font-mono text-center mb-2 rounded-lg p-1",
                                  highlightedStep === index
                                    ? "bg-blue-100/80 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800"
                                    : "",
                                )}
                              >
                                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.value} ÷ 2</div>
                                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.division}</div>
                                <motion.div
                                  className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded font-bold"
                                  animate={
                                    highlightedStep === index
                                      ? {
                                          scale: [1, 1.2, 1],
                                          backgroundColor: [
                                            "rgba(59, 130, 246, 0.2)",
                                            "rgba(59, 130, 246, 0.4)",
                                            "rgba(59, 130, 246, 0.2)",
                                          ],
                                        }
                                      : {}
                                  }
                                  transition={{ repeat: highlightedStep === index ? 1 : 0, duration: 0.5 }}
                                >
                                  {step.remainder}
                                </motion.div>
                              </motion.div>
                            ))}

                            <div className="flex flex-col items-center mt-6 p-3 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 rounded-lg">
                              <p className="font-medium mb-3">Reading remainders from bottom to top:</p>

                              <div className="flex flex-col items-center">
                                <div className="flex space-x-1 mb-2">
                                  {decimalToBinarySteps.steps.map((   _, index, array) => {
                                    // Reverse the array to display remainders from bottom to top
                                    const reverseIndex = array.length - 1 - index
                                    return (
                                      <motion.div
                                        key={reverseIndex}
                                        className={cn(
                                          "w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
                                          highlightedStep !== null &&
                                            array.length - 1 - highlightedStep === reverseIndex
                                            ? "bg-blue-300 dark:bg-blue-700"
                                            : "bg-slate-100 dark:bg-slate-700",
                                        )}
                                        whileHover={{ scale: 1.1, backgroundColor: "#93c5fd" }}
                                        animate={
                                          highlightedStep !== null &&
                                          array.length - 1 - highlightedStep === reverseIndex
                                            ? { scale: [1, 1.2, 1], y: [0, -5, 0] }
                                            : {}
                                        }
                                        transition={{ duration: 0.5 }}
                                      >
                                        {array[reverseIndex].remainder}
                                      </motion.div>
                                    )
                                  })}
                                </div>

                                <motion.div
                                  initial={{ scale: 0.9 }}
                                  animate={{ scale: 1 }}
                                  className="text-xl font-mono font-bold"
                                >
                                  {decimalValue}
                                  <sub>10</sub> = {decimalToBinarySteps.result}
                                  <sub>2</sub>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-6"></div> // Small spacer when closed
                      )}
                    </AnimatePresence>
                    {/* Add a step explanation box for decimal-to-binary */}
                    {showDecimalSteps && isStepByStep && (
                      <div className="mt-4 mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-md">
                        <h4 className="font-bold mb-2 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                          Step {decimalToBinaryStepIndex + 1} Explanation:
                        </h4>
                        <p>
                          {decimalToBinaryStepIndex === 0 ? (
                            <>
                              We start by dividing <strong>{decimalValue}</strong> by 2. The result is{" "}
                              <strong>{Math.floor(decimalValue / 2)}</strong> with a remainder of{" "}
                              <strong>{decimalValue % 2}</strong>. This remainder (<strong>{decimalValue % 2}</strong>)
                              is our first binary digit.
                            </>
                          ) : decimalToBinaryStepIndex < decimalToBinarySteps.steps.length - 1 ? (
                            <>
                              Now we divide{" "}
                              <strong>{decimalToBinarySteps.steps[decimalToBinaryStepIndex].value}</strong> by 2. The
                              result is <strong>{decimalToBinarySteps.steps[decimalToBinaryStepIndex].division}</strong>{" "}
                              with a remainder of{" "}
                              <strong>{decimalToBinarySteps.steps[decimalToBinaryStepIndex].remainder}</strong>. This
                              remainder is our next binary digit.
                            </>
                          ) : (
                            <>
                              Finally, we divide{" "}
                              <strong>{decimalToBinarySteps.steps[decimalToBinaryStepIndex].value}</strong> by 2. The
                              result is <strong>{decimalToBinarySteps.steps[decimalToBinaryStepIndex].division}</strong>{" "}
                              with a remainder of{" "}
                              <strong>{decimalToBinarySteps.steps[decimalToBinaryStepIndex].remainder}</strong>. This is
                              our last binary digit.
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Try Different Values Card */}

                <Card className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">Try Different Values:</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[7, 10, 13, 21, 42, 100].map((value) => (
                        <motion.button
                          key={value}
                          onClick={() => startTransition(() => setDecimalValue(value))}
                          className={`px-4 py-2 rounded-full font-medium ${
                            decimalValue === value
                              ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                              : "bg-white dark:bg-slate-800"
                          } shadow-sm min-w-[60px] touch-manipulation`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {value}
                        </motion.button>
                      ))}
                    </div>

                    {/* Interactive Decimal Slider */}
                    <div className="mt-6 bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl shadow-inner">
                      <h4 className="font-bold mb-3 text-center">Or Try the Slider:</h4>
                      <Slider
                        value={[decimalValue]}
                        max={255}
                        step={1}
                        onValueChange={(value) =>
                          startTransition(() => {
                            setDecimalValue(value[0])
                            setBinaryValue(value[0].toString(2))
                          })
                        }
                        className="mb-4"
                      />
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-500">0</div>
                        <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                          {decimalValue}
                        </div>
                        <div className="text-sm text-slate-500">255</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Improved Interactive Binary Builder with better mobile layout */}
                <Card className="bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
                  <CardContent className="pt-6 pb-8">
                    <h3 className="text-xl font-bold mb-4 text-center">Build Your Own Binary Number!</h3>

                    <p className="text-center mb-6 px-4">
                      Tap the bits to flip between 0 and 1, and watch the decimal number change!
                    </p>

                    <div className="flex flex-col items-center gap-8">
                      {/* Binary Bits - improved layout for mobile */}
                      <div className="flex flex-col items-center w-full max-w-md mx-auto">
                        <div className="flex justify-center space-x-1 sm:space-x-2 mb-4 w-full">
                          {binaryBits.map((bit, index) => (
                            <motion.button
                              key={index}
                              onClick={() => toggleBit(index)}
                              className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-xl font-mono font-bold shadow-md ${
                                bit === 1
                                  ? `bg-gradient-to-br ${COLORS.binary.bit.one} text-white`
                                  : COLORS.binary.bit.zero + " text-slate-500"
                              }`}
                              whileHover={{ scale: 1.1, y: -5 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {bit}
                            </motion.button>
                          ))}
                        </div>

                        {/* Position Values - improved for mobile */}
                        <div className="grid grid-cols-8 gap-1 sm:gap-2 mb-6 w-full text-center">
                          {binaryBits.map((_, index) => (
                            <div key={index} className="text-[8px] sm:text-xs">
                              2<sup>{7 - index}</sup> = {Math.pow(2, 7 - index)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Result Display - improved layout */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-xl w-full max-w-md mx-auto">
                        <div className="text-center flex-1">
                          <div className="text-sm mb-2 font-medium">Binary</div>
                          <div className="text-xl font-mono font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white px-4 py-3 rounded-full shadow-md">
                            {customBinary || "00000000"}
                          </div>
                        </div>

                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                          className="hidden sm:block" // Hide arrow on mobile
                        >
                          <ArrowRight className="h-6 w-6 text-blue-500" />
                        </motion.div>

                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                          className="block sm:hidden my-2" // Show down arrow on mobile
                        >
                          <ArrowDown className="h-6 w-6 text-blue-500" />
                        </motion.div>

                        <div className="text-center flex-1">
                          <div className="text-sm mb-2 font-medium">Decimal</div>
                          <div className="text-xl font-mono font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white px-4 py-3 rounded-full shadow-md">
                            {customDecimal}
                          </div>
                        </div>
                      </div>

                      {/* Control Buttons - improved layout */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
                        <FunButton onClick={resetBits} variant="outline" bubbles={true} className="flex-1 py-3">
                          Start Over
                        </FunButton>

                        <FunButton onClick={setRandomBinary} variant="secondary" bubbles={true} className="flex-1 py-3">
                          Random Number!
                        </FunButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* BINARY TO DECIMAL CONTENT */}
            <AnimatePresence mode="wait">
              <motion.div
                key="binary-to-decimal"
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: activeTab === "binary-to-decimal" ? 1 : 0,
                  x: activeTab === "binary-to-decimal" ? 0 : 20,
                }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: activeTab === "binary-to-decimal" ? "block" : "none" }}
              >
                {/* Introduction Card */}

                <Card className="bg-gradient-to-br from-green-100/80 to-teal-100/80 dark:from-green-900/30 dark:to-teal-900/30 border-0 shadow-lg overflow-hidden relative group">
                  <CardContent className="pt-6 relative z-10">
                    <motion.div
                      className="flex items-center mb-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }} transition={{ duration: 0.5 }}>
                        <Lightbulb className="mr-3 h-6 w-6 text-green-500 bg-green-100 dark:bg-green-900/50 p-1 rounded-full" />
                      </motion.div>
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">
                        How to Convert Binary to Decimal
                      </h3>
                    </motion.div>

                    <div className="space-y-4">
                      <p className="relative">
                        To convert binary to decimal, we multiply each digit by its position value (powers of 2) and add
                        them all together. Each position represents a power of 2, starting from the right with 2⁰ (which
                        equals 1).
                      </p>

                      <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-xl shadow-inner">
                        <h4 className="font-bold mb-2 text-center">The Process:</h4>
                        <ol className="list-decimal pl-6 space-y-2">
                          <motion.li whileHover={{ x: 5 }} transition={{ type: "spring" }}>
                            Start from the rightmost bit
                          </motion.li>
                          <motion.li whileHover={{ x: 5 }} transition={{ type: "spring" }}>
                            Multiply the bit by 2<sup>position</sup>
                          </motion.li>
                          <motion.li whileHover={{ x: 5 }} transition={{ type: "spring" }}>
                            Add up all the results
                          </motion.li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>

                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: [-500, 0] }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="text-3xl font-mono font-bold text-green-900 dark:text-green-300 whitespace-pre-wrap"
                    >
                      {"01010101 10101010 00110011 11001100"}
                    </motion.div>
                  </div>
                </Card>

                {/* Interactive Example Card */}

                <Card className="bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4 text-center">Example: Converting {binaryValue} to Decimal</h3>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                      <motion.div
                        className="text-3xl font-mono font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white px-6 py-3 rounded-full shadow-md w-32 sm:w-auto text-center min-h-[64px] flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        animate={animateConversion ? { scale: [1, 1.2, 1], y: [0, -10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {binaryValue}
                      </motion.div>

                      <motion.div
                        animate={animateConversion ? { x: [0, 20, 0], opacity: [0.5, 1, 0.5] } : { x: 0 }}
                        transition={{ repeat: animateConversion ? 3 : 0, duration: 1 }}
                        className="hidden md:block"
                      >
                        <ArrowRight className="h-8 w-8 text-green-500" />
                      </motion.div>

                      <motion.div
                        animate={animateConversion ? { y: [0, 20, 0], opacity: [0.5, 1, 0.5] } : { y: 0 }}
                        transition={{ repeat: animateConversion ? 3 : 0, duration: 1 }}
                        className="block md:hidden"
                      >
                        <ArrowDown className="h-8 w-8 text-green-500" />
                      </motion.div>

                      <motion.div
                        className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white px-6 py-3 rounded-full shadow-md w-32 sm:w-auto text-center min-h-[64px] flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        animate={animateConversion ? { scale: [1, 1.2, 1], y: [0, -10, 0] } : {}}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {binaryToDecimalSteps.result}
                      </motion.div>
                    </div>

                    {/* Improved button section with better mobile layout */}
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <FunButton
                        onClick={() => startTransition(() => setShowBinarySteps(!showBinarySteps))}
                        variant={showBinarySteps ? "secondary" : "outline"}
                        bubbles={true}
                        icon={
                          showBinarySteps ? (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          ) : (
                            <Lightbulb className="h-4 w-4 mr-2" />
                          )
                        }
                        iconPosition="left"
                        className="min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
                      >
                        {showBinarySteps ? "Hide Steps" : "Show Steps"}
                      </FunButton>
                    </div>

                    <AnimatePresence>
                      {showBinarySteps ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-inner min-h-[300px]">
                            {/* Completely redesigned step navigation for binary-to-decimal */}
                            <div className="flex justify-center mb-6">
                              <div className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-full p-1 flex items-center shadow-md">
                                <motion.button
                                  onClick={goToPrevStep}
                                  disabled={binaryToDecimalStepIndex === 0}
                                  className={`relative rounded-full p-3 ${
                                    binaryToDecimalStepIndex === 0
                                      ? "opacity-50 cursor-not-allowed"
                                      : "bg-white dark:bg-slate-800 shadow-md hover:shadow-lg"
                                  }`}
                                  whileHover={binaryToDecimalStepIndex === 0 ? {} : { scale: 1.1 }}
                                  whileTap={binaryToDecimalStepIndex === 0 ? {} : { scale: 0.9 }}
                                  aria-label="Previous step"
                                >
                                  <ChevronLeft
                                    className={`h-6 w-6 ${binaryToDecimalStepIndex === 0 ? "text-gray-400" : "text-green-500"}`}
                                  />

                                  {/* Add bubbles for fun effect */}
                                  {binaryToDecimalStepIndex > 0 && (
                                    <motion.div
                                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                                      animate={{
                                        y: [0, -10],
                                        opacity: [1, 0],
                                        scale: [0.8, 1.2],
                                      }}
                                      transition={{
                                        duration: 1,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                      }}
                                    />
                                  )}
                                </motion.button>

                                <div className="px-4 mx-2">
                                  <div className="flex items-center">
                                    <motion.div
                                      className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
                                      animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0],
                                      }}
                                      transition={{
                                        duration: 3,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                      }}
                                    >
                                      {binaryToDecimalStepIndex + 1}
                                    </motion.div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-green-600 dark:text-green-400">Step</div>
                                      <div className="text-xs text-green-500 dark:text-green-300">
                                        of {binaryToDecimalSteps.steps.length}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <motion.button
                                  onClick={goToNextStep}
                                  disabled={binaryToDecimalStepIndex >= binaryToDecimalSteps.steps.length - 1}
                                  className={`relative rounded-full p-3 ${
                                    binaryToDecimalStepIndex >= binaryToDecimalSteps.steps.length - 1
                                      ? "opacity-50 cursor-not-allowed"
                                      : "bg-white dark:bg-slate-800 shadow-md hover:shadow-lg"
                                  }`}
                                  whileHover={
                                    binaryToDecimalStepIndex >= binaryToDecimalSteps.steps.length - 1
                                      ? {}
                                      : { scale: 1.1 }
                                  }
                                  whileTap={
                                    binaryToDecimalStepIndex >= binaryToDecimalSteps.steps.length - 1
                                      ? {}
                                      : { scale: 0.9 }
                                  }
                                  aria-label="Next step"
                                >
                                  <ChevronRight
                                    className={`h-6 w-6 ${
                                      binaryToDecimalStepIndex >= binaryToDecimalSteps.steps.length - 1
                                        ? "text-gray-400"
                                        : "text-green-500"
                                    }`}
                                  />

                                  {/* Add bubbles for fun effect */}
                                  {binaryToDecimalStepIndex < binaryToDecimalSteps.steps.length - 1 && (
                                    <motion.div
                                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                                      animate={{
                                        y: [0, -10],
                                        opacity: [1, 0],
                                        scale: [0.8, 1.2],
                                      }}
                                      transition={{
                                        duration: 1,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                      }}
                                    />
                                  )}
                                </motion.button>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 font-mono text-center font-bold mb-2 text-sm">
                              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Bit</div>
                              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Position</div>
                              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                                2<sup>Position</sup>
                              </div>
                              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Value</div>
                            </div>

                            {/* Update the binary-to-decimal steps to highlight the current step better */}
                            {binaryToDecimalSteps.steps.map((step, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  scale: highlightedBit === index || highlightedStep === index ? 1.05 : 1,
                                  backgroundColor:
                                    highlightedBit === index || highlightedStep === index
                                      ? "rgba(74, 222, 128, 0.2)"
                                      : "transparent",
                                }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                  "grid grid-cols-4 gap-2 font-mono text-center mb-2 rounded-lg p-1",
                                  highlightedBit === index || highlightedStep === index
                                    ? "bg-green-100/80 dark:bg-green-900/40 border border-green-200 dark:border-green-800"
                                    : "",
                                )}
                              >
                                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.bit}</div>
                                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.position}</div>
                                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                                  2<sup>{step.position}</sup>
                                </div>
                                <motion.div
                                  className={`p-2 rounded font-bold ${
                                    step.bit === 1
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                      : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                                  }`}
                                  animate={
                                    highlightedBit === index || highlightedStep === index
                                      ? {
                                          scale: [1, 1.2, 1],
                                          backgroundColor: [
                                            "rgba(74, 222, 128, 0.2)",
                                            "rgba(74, 222, 128, 0.4)",
                                            "rgba(74, 222, 128, 0.2)",
                                          ],
                                        }
                                      : {}
                                  }
                                  transition={{
                                    repeat: highlightedBit === index || highlightedStep === index ? 1 : 0,
                                    duration: 0.5,
                                  }}
                                >
                                  {step.value}
                                </motion.div>
                              </motion.div>
                            ))}

                            {/* Update the sum display in binary-to-decimal to highlight active values */}
                            <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg">
                              <p className="font-medium text-center">
                                Sum of all contributions:
                                <span className="font-mono font-bold ml-2">
                                  {binaryToDecimalSteps.steps
                                    .filter((step) => step.bit === 1)
                                    .map((step, idx) => (
                                      <span
                                        key={idx}
                                        className={cn(
                                          "inline-block mx-1",
                                          isStepByStep &&
                                            binaryToDecimalStepIndex >=
                                              binaryToDecimalSteps.steps.findIndex(
                                                (s) => s.position === step.position,
                                              ) &&
                                            "bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded",
                                        )}
                                      >
                                        {step.value}
                                        {idx < binaryToDecimalSteps.steps.filter((s) => s.bit === 1).length - 1
                                          ? " + "
                                          : ""}
                                      </span>
                                    ))}{" "}
                                  = {binaryToDecimalSteps.result}
                                </span>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-6"></div> // Small spacer when closed
                      )}
                    </AnimatePresence>
                    {/* Add a step explanation box for binary-to-decimal */}
                    {showBinarySteps && isStepByStep && (
                      <div className="mt-4 mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl shadow-md">
                        <h4 className="font-bold mb-2 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                          Step {binaryToDecimalStepIndex + 1} Explanation:
                        </h4>
                        <p>
                          {binaryToDecimalSteps.steps[binaryToDecimalStepIndex].bit === 1 ? (
                            <>
                              The digit at position {binaryToDecimalSteps.steps[binaryToDecimalStepIndex].position} is{" "}
                              <strong>1</strong>. So we multiply 1 × 2
                              <sup>{binaryToDecimalSteps.steps[binaryToDecimalStepIndex].position}</sup> ={" "}
                              <strong>{binaryToDecimalSteps.steps[binaryToDecimalStepIndex].value}</strong>. This value
                              will be added to our total.
                            </>
                          ) : (
                            <>
                              The digit at position {binaryToDecimalSteps.steps[binaryToDecimalStepIndex].position} is{" "}
                              <strong>0</strong>. So we multiply 0 × 2
                              <sup>{binaryToDecimalSteps.steps[binaryToDecimalStepIndex].position}</sup> ={" "}
                              <strong>0</strong>. This adds nothing to our total.
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Try Different Values Card */}

                <Card className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">Try Different Values:</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[7, 10, 13, 21, 42, 100].map((value) => (
                        <motion.button
                          key={value}
                          onClick={() =>
                            startTransition(() => {
                              setDecimalValue(value)
                              setBinaryValue(value.toString(2))
                            })
                          }
                          className={`px-4 py-2 rounded-full font-medium ${
                            decimalValue === value
                              ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                              : "bg-white dark:bg-slate-800"
                          } shadow-sm`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {value}
                        </motion.button>
                      ))}
                    </div>

                    {/* Interactive Decimal Slider */}
                    <div className="mt-6 bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl shadow-inner">
                      <h4 className="font-bold mb-3 text-center">Or Try the Slider:</h4>
                      <Slider
                        value={[decimalValue]}
                        max={255}
                        step={1}
                        onValueChange={(value) =>
                          startTransition(() => {
                            setDecimalValue(value[0])
                            setBinaryValue(value[0].toString(2))
                          })
                        }
                        className="mb-4"
                      />
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-500">0</div>
                        <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                          {decimalValue} → {decimalValue.toString(2)}
                        </div>
                        <div className="text-sm text-slate-500">255</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Improved Interactive Binary Builder with better mobile layout */}
                <Card className="bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
                  <CardContent className="pt-6 pb-8">
                    <h3 className="text-xl font-bold mb-4 text-center">Build Your Own Binary Number!</h3>

                    <p className="text-center mb-6 px-4">
                      Tap the bits to flip between 0 and 1, and watch the decimal number change!
                    </p>

                    <div className="flex flex-col items-center gap-8">
                      {/* Binary Bits - improved layout for mobile */}
                      <div className="flex flex-col items-center w-full max-w-md mx-auto">
                        <div className="flex justify-center space-x-1 sm:space-x-2 mb-4 w-full">
                          {binaryBits.map((bit, index) => (
                            <motion.button
                              key={index}
                              onClick={() => toggleBit(index)}
                              className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-xl font-mono font-bold shadow-md ${
                                bit === 1
                                  ? `bg-gradient-to-br ${COLORS.binary.bit.one} text-white`
                                  : COLORS.binary.bit.zero + " text-slate-500"
                              }`}
                              whileHover={{ scale: 1.1, y: -5 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {bit}
                            </motion.button>
                          ))}
                        </div>

                        {/* Position Values - improved for mobile */}
                        <div className="grid grid-cols-8 gap-1 sm:gap-2 mb-6 w-full text-center">
                          {binaryBits.map((_, index) => (
                            <div key={index} className="text-[8px] sm:text-xs">
                              2<sup>{7 - index}</sup> = {Math.pow(2, 7 - index)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Result Display - improved layout */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-xl w-full max-w-md mx-auto">
                        <div className="text-center flex-1">
                          <div className="text-sm mb-2 font-medium">Binary</div>
                          <div className="text-xl font-mono font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white px-4 py-3 rounded-full shadow-md">
                            {customBinary || "00000000"}
                          </div>
                        </div>

                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                          className="hidden sm:block" // Hide arrow on mobile
                        >
                          <ArrowRight className="h-6 w-6 text-blue-500" />
                        </motion.div>

                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                          className="block sm:hidden my-2" // Show down arrow on mobile
                        >
                          <ArrowDown className="h-6 w-6 text-blue-500" />
                        </motion.div>

                        <div className="text-center flex-1">
                          <div className="text-sm mb-2 font-medium">Decimal</div>
                          <div className="text-xl font-mono font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white px-4 py-3 rounded-full shadow-md">
                            {customDecimal}
                          </div>
                        </div>
                      </div>

                      {/* Control Buttons - improved layout */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
                        <FunButton onClick={resetBits} variant="outline" bubbles={true} className="flex-1 py-3">
                          Start Over
                        </FunButton>

                        <FunButton onClick={setRandomBinary} variant="secondary" bubbles={true} className="flex-1 py-3">
                          Random Number!
                        </FunButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

