"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X, HelpCircle } from "lucide-react"
import Image from "next/image"
type Step = {
  title: string
  content: string
  image?: string
  emoji?: string
}

type TutorialPopupProps = {
  steps: Step[]
  gameName: string
  autoShowOnce?: boolean
}

export function TutorialPopup({ steps, gameName, autoShowOnce = true }: TutorialPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasShown, setHasShown] = useState(false)

  // Check if we've shown this tutorial before
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem(`tutorial-${gameName}`) === "seen"

    if (autoShowOnce && !hasSeenTutorial && !hasShown) {
      // Wait a moment before showing the tutorial
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem(`tutorial-${gameName}`, "seen")
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [autoShowOnce, gameName, hasShown])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsOpen(false)
      setCurrentStep(0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const closePopup = () => {
    setIsOpen(false)
    setCurrentStep(0)
  }

  const openPopup = () => {
    setIsOpen(true)
  }

  return (
    <>
      {/* Help button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-40 rounded-full h-12 w-12 bg-primary text-primary-foreground shadow-lg border-2 border-white dark:border-gray-800"
        onClick={openPopup}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      {/* Tutorial popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Close only if clicking the overlay itself, not its children
              if (e.target === e.currentTarget) {
                closePopup()
              }
            }}
          >
            <motion.div
              className="w-full max-w-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Card
                className="relative overflow-hidden border-4 border-primary rounded-xl bg-card shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 z-10 rounded-full"
                  onClick={closePopup}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: `${(currentStep / steps.length) * 100}%` }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="p-6 pt-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        {steps[currentStep].emoji && <span className="text-2xl">{steps[currentStep].emoji}</span>}
                        <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
                      </div>

                      {steps[currentStep].image && (
                        <div className="rounded-lg overflow-hidden border-2 border-muted">
                          <Image
                            src={steps[currentStep].image || "/placeholder.svg"}
                            alt={steps[currentStep].title}
                            className="w-full h-auto"
                          />
                        </div>
                      )}

                      <p className="text-foreground/80">{steps[currentStep].content}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 border-t border-border">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {steps.length}
                  </span>

                  <Button onClick={nextStep} className="gap-1 bg-primary text-primary-foreground">
                    {currentStep === steps.length - 1 ? "Finish" : "Next"}
                    {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

