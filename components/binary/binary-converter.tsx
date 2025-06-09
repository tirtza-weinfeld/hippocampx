"use client"

import type React from "react"

import { useState, useEffect, startTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion, AnimatePresence } from "framer-motion"
import BinaryMascot from "./binary-mascot"
import { Sparkles } from "lucide-react"

export default function BinaryConverter() {
  const [binary, setBinary] = useState("1010")
  const [decimal, setDecimal] = useState(10)
  const [mode, setMode] = useState("binary-to-decimal")
  const [error, setError] = useState("")
  const [showSparkles, setShowSparkles] = useState(false)

  // Update the other value when one changes
  useEffect(() => {
    if (mode === "binary-to-decimal") {
      // Validate binary input
      if (!/^[01]*$/.test(binary)) {
        startTransition(() => {
          setError("Binary can only contain 0s and 1s!")
        })
        return
      }

      if (binary === "") {
        startTransition(() => {
          setDecimal(0)
          setError("")
        })
        return
      }

      startTransition(() => {
        setError("")
        setDecimal(Number.parseInt(binary, 2))

        // Show sparkles animation on successful conversion
        if (binary.length > 0) {
          setShowSparkles(true)
          setTimeout(() => setShowSparkles(false), 1000)
        }
      })
    } else {
      // Validate decimal input
      if (isNaN(decimal) || decimal < 0 || decimal > 255) {
        startTransition(() => {
          setError("Please enter a number between 0 and 255")
        })
        return
      }

      startTransition(() => {
        setError("")
        setBinary(decimal.toString(2))

        // Show sparkles animation on successful conversion
        if (decimal > 0) {
          setShowSparkles(true)
          setTimeout(() => setShowSparkles(false), 1000)
        }
      })
    }
  }, [binary, decimal, mode])

  const handleBinaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setBinary(e.target.value)
    })
  }

  const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setDecimal(Number.parseInt(e.target.value) || 0)
    })
  }

  const toggleMode = () => {
    startTransition(() => {
      setMode(mode === "binary-to-decimal" ? "decimal-to-binary" : "binary-to-decimal")
      setError("")
    })
  }

  return (
    <Card className="w-full border-0 shadow-xl  backdrop-blur-sm rounded-2xl overflow-hidden ">
      <CardContent className="pt-6 max-w-4xl mx-auto">

        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
            >
              <BinaryMascot emotion="thinking" size="sm" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-center ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
              Binary Converter
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 ">
              Convert numbers between binary and decimal with our interactive tool.
            </p>
          </div>

          {/* Add a fun toggle button for the mode switch */}
          <motion.div
            className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-2 mb-8 bg-blue-50/70 dark:bg-slate-800/70 p-4 rounded-full shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <Label
              htmlFor="conversion-mode"
              className={`${mode === "decimal-to-binary" ? "font-bold text-lg bg-gradient-to-r from-violet-500 to-blue-500 text-transparent bg-clip-text" : "text-base"} px-3 transition-all duration-300`}
            >
              Decimal to Binary
            </Label>
            <Switch
              id="conversion-mode"
              checked={mode === "binary-to-decimal"}
              onCheckedChange={toggleMode}
              className="
           
               h-8 w-14"
            />
            <Label
              htmlFor="conversion-mode"
              className={`${mode === "binary-to-decimal" ? "font-bold text-lg bg-gradient-to-r from-violet-500 to-blue-500 text-transparent bg-clip-text" : "text-base"} px-3 transition-all duration-300`}
            >
              Binary to Decimal
            </Label>
          </motion.div>

          <div className="w-full  space-y-8 ">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm"
              >
                {mode === "binary-to-decimal" ? (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="binary-input" className="text-lg flex items-center">
                        <span className="mr-2">Binary Number:</span>
                        <motion.span
                          className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full shadow-sm"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                        >
                          Only 0s and 1s
                        </motion.span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="binary-input"
                          value={binary}
                          onChange={handleBinaryChange}
                          className="text-xl font-mono text-center h-14 sm:h-16 border-3 border-blue-200 dark:border-blue-900 focus:border-blue-500 focus:ring-3 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl shadow-sm transition-all duration-300"
                          placeholder="Enter 0s and 1s"
                          maxLength={8}
                        />
                        {showSparkles && mode === "binary-to-decimal" && (
                          <motion.div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <Sparkles className="h-6 w-6" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Update the arrow styling to use blue/violet instead of pink */}
                    <div className="flex justify-center my-6">
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full shadow-md"
                      >
                        <div className="relative">
                          <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500">
                            ↓
                          </span>
                          <motion.div
                            className="absolute -right-3 -top-3"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <span className="text-sm">✨</span>
                          </motion.div>
                          <motion.div
                            className="absolute -left-3 -top-2"
                            animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <span className="text-sm">💫</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="decimal-output" className="text-lg">
                        Decimal Number:
                      </Label>
                      <div className="h-14 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center text-2xl font-bold relative shadow-inner">
                        {error ? (
                          <span className="text-red-500 text-base px-4 text-center">{error}</span>
                        ) : (
                          <motion.span
                            key={decimal}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500"
                          >
                            {decimal}
                          </motion.span>
                        )}
                        {showSparkles && mode === "binary-to-decimal" && !error && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div
                              className="absolute top-0 left-1/4"
                              animate={{ y: [0, -20], opacity: [1, 0] }}
                              transition={{ duration: 1 }}
                            >
                              ✨
                            </motion.div>
                            <motion.div
                              className="absolute top-0 right-1/4"
                              animate={{ y: [0, -20], opacity: [1, 0] }}
                              transition={{ duration: 1, delay: 0.2 }}
                            >
                              ✨
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="decimal-input" className="text-lg flex items-center">
                        <span className="mr-2">Decimal Number:</span>
                        <motion.span
                          className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full shadow-sm"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                        >
                          0-255
                        </motion.span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="decimal-input"
                          type="number"
                          value={decimal}
                          onChange={handleDecimalChange}
                          className="text-xl text-center h-14 sm:h-16 border-3 border-blue-200 dark:border-blue-900 focus:border-blue-500 focus:ring-3 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl shadow-sm"
                          min={0}
                          max={255}
                        />
                        {showSparkles && mode === "decimal-to-binary" && (
                          <motion.div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <Sparkles className="h-6 w-6" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center my-6">
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full shadow-md"
                      >
                        <div className="relative">
                          <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500">
                            ↓
                          </span>
                          <motion.div
                            className="absolute -right-3 -top-3"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <span className="text-sm">✨</span>
                          </motion.div>
                          <motion.div
                            className="absolute -left-3 -top-2"
                            animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <span className="text-sm">💫</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="binary-output" className="text-lg">
                        Binary Number:
                      </Label>
                      <div className="h-14 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center text-2xl font-mono font-bold relative shadow-inner">
                        {error ? (
                          <span className="text-red-500 text-base px-4 text-center">{error}</span>
                        ) : (
                          <motion.span
                            key={binary}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500"
                          >
                            {binary}
                          </motion.span>
                        )}
                        {showSparkles && mode === "decimal-to-binary" && !error && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div
                              className="absolute top-0 left-1/4"
                              animate={{ y: [0, -20], opacity: [1, 0] }}
                              transition={{ duration: 1 }}
                            >
                              ✨
                            </motion.div>
                            <motion.div
                              className="absolute top-0 right-1/4"
                              animate={{ y: [0, -20], opacity: [1, 0] }}
                              transition={{ duration: 1, delay: 0.2 }}
                            >
                              ✨
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 w-full ">
            <Card className="bg-blue-50/70 dark:bg-slate-800/70 border-0 shadow-lg">
              <CardContent className="pt-4 bg-gradient-to-br from-blue-50/80 to-violet-50/80 dark:from-blue-900/30 dark:to-violet-900/30 rounded-xl border border-blue-100/50 dark:border-blue-800/50">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <motion.span
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    className="mr-2"
                  >
                    🔍
                  </motion.span>
                  Binary Bits Visualization
                </h3>
                <div className="grid grid-cols-8 gap-2 mb-4">
                  {[128, 64, 32, 16, 8, 4, 2, 1].map((value, index) => (
                    <motion.div key={index} className="text-center" whileHover={{ scale: 1.1, y: -5 }}>
                      <motion.div
                        className={`w-full h-12 rounded-lg flex items-center justify-center font-bold ${binary.padStart(8, "0")[index] === "1"
                          ? "bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 text-white shadow-md"
                          : "bg-white dark:bg-slate-700 shadow-inner"
                          }`}
                        animate={
                          binary.padStart(8, "0")[index] === "1"
                            ? {
                              y: [0, -5, 0],
                              boxShadow: [
                                "0px 0px 0px rgba(59, 130, 246, 0)",
                                "0px 5px 15px rgba(59, 130, 246, 0.5)",
                                "0px 0px 0px rgba(59, 130, 246, 0)",
                              ],
                            }
                            : {}
                        }
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: index * 0.1 }}
                      >
                        {binary.padStart(8, "0")[index]}
                      </motion.div>
                      <div className="flex flex-col items-center mt-2">
                        <motion.div
                          className="text-xs font-medium "
                          animate={
                            binary.padStart(8, "0")[index] === "1"
                              ? {
                                scale: [1, 1.2, 1],
                                color: ["inherit", "rgb(59, 130, 246)", "inherit"],
                              }
                              : {}
                          }
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: index * 0.1 }}
                        >
                          {value}
                        </motion.div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          2<sup className=" bg-accent/20 dark:bg-accent/70 px-1 rounded-md">{7 - index}</sup>
                          <span className="text-accent hidden md:inline"> = {value}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-4 text-sm text-center bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex flex-row place-content-center gap-4">
                    <span className="text-accent">Each position represents a power of 2:</span>
                    <span>{[7, 6, 5].map((value, index) => (
                      <span key={index}>
                        2<sup className="bg-accent/20 dark:bg-accent/70 px-1 rounded-md">{value}</sup>,
                      </span>
                    ))}
                      ... down to 2
                      <sup className="text-accent">0</sup>
                      <span className="text-accent">=1</span>
                    </span>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

