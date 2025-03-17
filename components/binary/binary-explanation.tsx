"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import BinaryMascot from "./binary-mascot"
import { ArrowRight, ArrowDown, Lightbulb, RefreshCw } from 'lucide-react'
// Replace the "Show Steps" buttons with FunButton components
import { FunButton } from "./fun-button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export default function BinaryExplanation() {
  // Ensure consistent colors and better layout for mobile
  // Define a consistent color scheme at the top of the component
  // const COLORS = {
  //   binary: {
  //     bg: "from-violet-500 to-blue-500",
  //     light: "from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30",
  //     highlight: "bg-blue-100 dark:bg-blue-900/30",
  //     bit: {
  //       one: "from-violet-500 to-blue-600",
  //       zero: "bg-slate-200 dark:bg-slate-700"
  //     }
  //   },
  //   decimal: {
  //     bg: "from-green-500 to-teal-500",
  //     light: "from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30",
  //     highlight: "bg-green-100 dark:bg-green-900/30",
  //   }
  // }
  // State for the conversion values
  const [decimalValue, setDecimalValue] = useState(13)
  const [binaryValue, setBinaryValue] = useState("1101")
  
  // State for showing steps
  const [showDecimalSteps, setShowDecimalSteps] = useState(false)
  const [showBinarySteps, setShowBinarySteps] = useState(false)
  
  // State for the walkthrough
  // const [currentStep, setCurrentStep] = useState(0)
  const [activeTab, setActiveTab] = useState("decimal-to-binary")
  
  // State for animation control
  const [animateConversion, setAnimateConversion] = useState(false)
  const [highlightedBit, setHighlightedBit] = useState<number | null>(null)
  const [highlightedStep, setHighlightedStep] = useState<number | null>(null)
  
  // State for interactive binary builder
  const [customDecimal, setCustomDecimal] = useState(0)
  const [customBinary, setCustomBinary] = useState("")
  const [binaryBits, setBinaryBits] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  
  // Reset animation state when tab changes
  useEffect(() => {
    setAnimateConversion(false)
    setHighlightedBit(null)
    setHighlightedStep(null)
    setShowDecimalSteps(false)
    setShowBinarySteps(false)
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
    const newBits = [...binaryBits]
    newBits[index] = newBits[index] === 0 ? 1 : 0
    setBinaryBits(newBits)
  }
  
  // Function to reset the interactive binary builder
  const resetBits = () => {
    setBinaryBits([0, 0, 0, 0, 0, 0, 0, 0])
  }
  
  // Function to set a random binary number
  const setRandomBinary = () => {
    const randomBinary = Math.floor(Math.random() * 256)
      .toString(2)
      .padStart(8, "0")
    const bits = randomBinary.split("").map(bit => Number.parseInt(bit, 10))
    setBinaryBits(bits)
  }
  
  // Replace the "Animate Conversion" button with kid-friendly wording
  const startConversionAnimation = () => {
    setAnimateConversion(true)
    setHighlightedBit(null)
    setHighlightedStep(null)
    
    // For binary to decimal, highlight each bit and its contribution sequentially
    if (activeTab === "binary-to-decimal") {
      setShowBinarySteps(true)
      const steps = binaryToDecimalSteps.steps
      
      steps.forEach((_, index) => {
        setTimeout(() => {
          setHighlightedBit(index)
          setHighlightedStep(index)
        }, index * 1000)
      })
      
      // Reset highlights after all steps
      setTimeout(() => {
        setHighlightedBit(null)
        setHighlightedStep(null)
      }, steps.length * 1000 + 500)
    } 
    // For decimal to binary, highlight each division step sequentially
    else {
      setShowDecimalSteps(true)
      const steps = decimalToBinarySteps.steps
      
      steps.forEach((_, index) => {
        setTimeout(() => {
          setHighlightedStep(index)
        }, index * 1000)
      })
      
      // Reset highlights after all steps
      setTimeout(() => {
        setHighlightedStep(null)
      }, steps.length * 1000 + 500)
    }
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
    <BinaryMascot emotion={"excited"} size="sm" />
  </motion.div>
  <h2 className="text-2xl md:text-3xl font-bold text-center ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
    Binary Number Magic! ✨
  </h2>
</div>

          <Tabs 
            defaultValue="decimal-to-binary" 
            className="w-full max-w-3xl" 
            onValueChange={(value) => {
              setActiveTab(value)
              // Reset animation states when changing tabs
              setAnimateConversion(false)
              setHighlightedBit(null)
              setHighlightedStep(null)
            }}
          >
            <TabsList className="grid grid-cols-2 mb-8 p-1.5 bg-blue-100/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm overflow-hidden relative h-13">
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
              
              <TabsTrigger 

                value="decimal-to-binary"
                className="cursor-pointer relative z-10 transition-colors duration-300 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:bg-transparent"
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
              </TabsTrigger>
              
              <TabsTrigger 
                value="binary-to-decimal"
                className="px-3 text-center cursor-pointer relative z-10 transition-colors duration-300 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:bg-transparent"
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
              </TabsTrigger>
            </TabsList>

            {/* DECIMAL TO BINARY CONTENT */}
            <TabsContent value="decimal-to-binary" className="space-y-6">
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
                      How to Convert Decimal to Binary
                    </h3>
                  </motion.div>

                  <div className="space-y-4">
                    <p className="relative">
                      To convert a decimal number to binary, we divide the number by 2 repeatedly and track the remainders.
                      Then we read the remainders from bottom to top to get our binary number!
                    </p>
                    
                    <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-xl shadow-inner">
                      <h4 className="font-bold mb-2 text-center">The Process:</h4>
                      <ol className="list-decimal pl-6 space-y-2">
                        <motion.li whileHover={{ x: 5 }} transition={{ type: "spring" }}>
                          Divide the decimal number by 2
                        </motion.li>
                        <motion.li whileHover={{ x: 5 }} transition={{ type: "spring" }}>
                          Write down the remainder (0 or 1)
                        </motion.li>
                        <motion.li whileHover={{ x: 5 }} transition={{ type: "spring" }}>
                          Repeat with the quotient until you reach 0
                        </motion.li>
                        <motion.li whileHover={{ x: 5 }} transition={{ type: "spring" }}>
                          Read the remainders from bottom to top
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
                    {"10101010\n01010101\n11001100\n00110011"}
                  </motion.div>
                </div>
              </Card>

              {/* Interactive Example Card */}
              <Card className="bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
                <CardContent className="pt-6">
                  
<h3 className="text-xl font-bold mb-4 text-center">
  Example: Converting {decimalValue} to Binary
</h3>

<div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
  <motion.div
    className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white px-6 py-3 rounded-xl shadow-md w-32 sm:w-auto text-center min-h-[64px] flex items-center justify-center"
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
    className="text-3xl font-mono font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-md w-32 sm:w-auto text-center min-h-[64px] flex items-center justify-center"
    whileHover={{ scale: 1.05 }}
    animate={animateConversion ? { scale: [1, 1.2, 1], y: [0, -10, 0] } : {}}
    transition={{ duration: 0.5, delay: 0.5 }}
  >
    {decimalToBinarySteps.result}
  </motion.div>
</div>

                  {/* Then update the button in both places
                  // First in the decimal-to-binary section */}
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <FunButton 
                      onClick={() => setShowDecimalSteps(!showDecimalSteps)} 
                      variant={showDecimalSteps ? "secondary" : "outline"}
                      bubbles={true}
                    >
                      {showDecimalSteps ? "Hide Steps" : "Show Steps"}
                    </FunButton>
                    
                    <FunButton 
                      onClick={startConversionAnimation} 
                      variant="default"
                      bubbles={true}
                      icon={<RefreshCw className="h-4 w-4 mr-2" />}
                      iconPosition="left"
                    >
                      Show Me How It Works!
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
                          <div className="grid grid-cols-3 gap-2 font-mono text-center font-bold mb-2 text-sm">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Division</div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Quotient</div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">Remainder</div>
                          </div>

                          {decimalToBinarySteps.steps.map((step, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ 
                                opacity: 1, 
                                y: 0,
                                scale: highlightedStep === index ? 1.05 : 1,
                                backgroundColor: highlightedStep === index ? "rgba(59, 130, 246, 0.1)" : "transparent"
                              }}
                              transition={{ delay: index * 0.1 }}
                              className={cn(
                                "grid grid-cols-3 gap-2 font-mono text-center mb-2 rounded-lg p-1",
                                highlightedStep === index ? "bg-blue-100/50 dark:bg-blue-900/20" : ""
                              )}
                            >
                              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.value} ÷ 2</div>
                              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.division}</div>
                              <motion.div 
                                className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded font-bold"
                                animate={highlightedStep === index ? { 
                                  scale: [1, 1.2, 1],
                                  backgroundColor: ["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.4)", "rgba(59, 130, 246, 0.2)"]
                                } : {}}
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
                                {decimalToBinarySteps.steps.map((step, index, array) => {
                                  // Reverse the array to display remainders from bottom to top
                                  const reverseIndex = array.length - 1 - index;
                                  return (
                                    <motion.div
                                      key={reverseIndex}
                                      className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
                                        highlightedStep !== null && array.length - 1 - highlightedStep === reverseIndex
                                          ? "bg-blue-300 dark:bg-blue-700"
                                          : "bg-slate-100 dark:bg-slate-700"
                                      )}
                                      whileHover={{ scale: 1.1, backgroundColor: "#93c5fd" }}
                                      animate={
                                        highlightedStep !== null && array.length - 1 - highlightedStep === reverseIndex
                                          ? { scale: [1, 1.2, 1], y: [0, -5, 0] }
                                          : {}
                                      }
                                      transition={{ duration: 0.5 }}
                                    >
                                      {array[reverseIndex].remainder}
                                    </motion.div>
                                  );
                                })}
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
                    ) : (
                      <div className="h-6"></div> // Small spacer when closed
                    )}
                  </AnimatePresence>
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
                        onClick={() => setDecimalValue(value)}
                        className={`px-4 py-2 rounded-lg font-medium ${
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
                      defaultValue={[decimalValue]}
                      max={255}
                      step={1}
                      onValueChange={(value) => setDecimalValue(value[0])}
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
            </TabsContent>

            {/* BINARY TO DECIMAL CONTENT */}
            <TabsContent value="binary-to-decimal" className="space-y-6">
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
                      To convert a binary number to decimal, we multiply each bit by 2 raised to the power of its position (starting from the right) and then add them up!
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
                    {"01010101\n10101010\n00110011\n11001100"}
                  </motion.div>
                </div>
              </Card>

              {/* Interactive Example Card */}
              <Card className="bg-white/70 dark:bg-slate-900/70 border-0 shadow-lg">
                <CardContent className="pt-6">
                  
<h3 className="text-xl font-bold mb-4 text-center">
  Example: Converting {binaryValue} to Decimal
</h3>

<div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
  <motion.div
    className="text-3xl font-mono font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-md w-32 sm:w-auto text-center min-h-[64px] flex items-center justify-center"
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
    className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white px-6 py-3 rounded-xl shadow-md w-32 sm:w-auto text-center min-h-[64px] flex items-center justify-center"
    whileHover={{ scale: 1.05 }}
    animate={animateConversion ? { scale: [1, 1.2, 1], y: [0, -10, 0] } : {}}
    transition={{ duration: 0.5, delay: 0.5 }}
  >
    {binaryToDecimalSteps.result}
  </motion.div>
</div>

                  {/* Then update the button in both places
                  // First in the binary-to-decimal section */}
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <FunButton 
                      onClick={() => setShowBinarySteps(!showBinarySteps)} 
                      variant={showBinarySteps ? "secondary" : "outline"}
                      bubbles={true}
                    >
                      {showBinarySteps ? "Hide Steps" : "Show Steps"}
                    </FunButton>
                    
                    <FunButton 
                      onClick={startConversionAnimation} 
                      variant="default"
                      bubbles={true}
                      icon={<RefreshCw className="h-4 w-4 mr-2" />}
                      iconPosition="left"
                    >
                      Show Me How It Works!
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
                          <div className="grid grid-cols-4 gap-2 font-mono text-center font-bold mb-2 text-sm">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Bit</div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Position</div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">2<sup>Position</sup></div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">Value</div>
                          </div>

                          {binaryToDecimalSteps.steps.map((step, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ 
                                opacity: 1, 
                                y: 0,
                                scale: highlightedBit === index ? 1.05 : 1,
                                backgroundColor: highlightedBit === index ? "rgba(74, 222, 128, 0.1)" : "transparent"
                              }}
                              transition={{ delay: index * 0.1 }}
                              className={cn(
                                "grid grid-cols-4 gap-2 font-mono text-center mb-2 rounded-lg p-1",
                                highlightedBit === index ? "bg-green-100/50 dark:bg-green-900/20" : ""
                              )}
                            >
                              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.bit}</div>
                              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">{step.position}</div>
                              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">2<sup>{step.position}</sup></div>
                              <motion.div 
                                className="bg-green-100 dark:bg-green-900/30 p-2 rounded font-bold"
                                animate={highlightedBit === index ? { 
                                  scale: [1, 1.2, 1],
                                  backgroundColor: ["rgba(74, 222, 128, 0.2)", "rgba(74, 222, 128, 0.4)", "rgba(74, 222, 128, 0.2)"]
                                } : {}}
                                transition={{ repeat: highlightedBit === index ? 1 : 0, duration: 0.5 }}
                              >
                                {step.value}
                              </motion.div>
                            </motion.div>
                          ))}

                          <div className="flex flex-col items-center mt-6 p-3 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg">
                            <p className="font-medium mb-3">Adding up all the values:</p>

                            <div className="flex flex-col items-center">
                              <div className="flex space-x-1 mb-2">
                                {binaryToDecimalSteps.steps.map((step, index) => (
                                  <motion.div
                                    key={index}
                                    className={cn(
                                      "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
                                      highlightedBit === index
                                        ? "bg-green-300 dark:bg-green-700"
                                        : "bg-slate-100 dark:bg-slate-700"
                                    )}
                                    whileHover={{ scale: 1.1, backgroundColor: "#a7f3d0" }}
                                    animate={
                                      highlightedBit === index
                                        ? { scale: [1, 1.2, 1], y: [0, -5, 0] }
                                        : {}
                                    }
                                    transition={{ duration: 0.5 }}
                                  >
                                    {step.value}
                                  </motion.div>
                                ))}
                              </div>

                              <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="text-xl font-mono font-bold"
                              >
                                {binaryValue}<sub>2</sub> = {binaryToDecimalSteps.result}<sub>10</sub>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-6"></div> // Small spacer when closed
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Try Different Values Card */}
              <Card className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-3">Try Different Values:</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["101", "1101", "10101", "110011", "1010101", "11111111"].map((value) => (
                      <motion.button
                        key={value}
                        onClick={() => setBinaryValue(value)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          binaryValue === value
                            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white"
                            : "bg-white dark:bg-slate-800"
                        } shadow-sm`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {value}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Interactive Binary Builder */}
                  <div className="mt-6 bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl shadow-inner">
                    <h4 className="font-bold mb-3 text-center">Or Build Your Own:</h4>
                    <div className="flex justify-center gap-2 mb-4">
                      {binaryBits.map((bit, index) => (
                        <motion.button
                          key={index}
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm font-bold",
                            bit === 1 ? "bg-gradient-to-r from-green-500 to-teal-500 text-white" : "bg-slate-100 dark:bg-slate-700"
                          )}
                          onClick={() => toggleBit(index)}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {bit}
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <FunButton onClick={resetBits} variant="outline">
                        Reset
                      </FunButton>
                      <FunButton onClick={setRandomBinary} variant="outline">
                        Random
                      </FunButton>
                    </div>
                    <div className="mt-4 flex justify-center items-center space-x-4">
                      <div className="text-lg font-mono font-bold">
                        {customBinary}<sub>2</sub> =
                      </div>
                      <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                        {customDecimal}<sub>10</sub>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
