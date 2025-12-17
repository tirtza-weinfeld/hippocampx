"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, Type } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import { FONTS, type FontKey } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type HippoFeature = "left-ear" | "right-ear" | "left-eye" | "right-eye" | "nose" | "mouth" | "left-foot" | "right-foot" | "brain" | "body"

// Hippo positioning - UI-specific, maps fonts to hippo anatomy
const HIPPO_FEATURES: Record<FontKey, HippoFeature> = {
  inter: "left-ear",
  roboto: "right-ear",
  "open-sans": "left-eye",
  montserrat: "right-eye",
  "dancing-script": "nose",
  pacifico: "mouth",
  "great-vibes": "left-foot",
  satisfy: "right-foot",
  tangerine: "brain",
  allura: "brain",
  "kaushan-script": "body",
  sacramento: "body",
}

const fontKeys = Object.keys(FONTS) as FontKey[]

export function InfinityFontSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { font, setFont } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  // Close the font selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Add popup position state
  const [popupPosition, setPopupPosition] = useState({ bottom: 0, left: 0 })

  // Calculate position only when opening
  const updatePopupPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPopupPosition({
        bottom: window.innerHeight - rect.top + 10,
        left: rect.left + 100,
      })
    }
  }

  // Get position based on hippo feature
  const getHippoPosition = (fontKey: FontKey) => {
    const feature = HIPPO_FEATURES[fontKey]
    switch (feature) {
      case "left-ear": return { x: -85, y: -190 }
      case "right-ear": return { x: 85, y: -190 }
      case "left-eye": return { x: -45, y: -150 }
      case "right-eye": return { x: 45, y: -150 }
      case "nose": return { x: 0, y: -110 }
      case "mouth": return { x: 0, y: -70 }
      case "left-foot": return { x: -60, y: -30 }
      case "right-foot": return { x: 60, y: -30 }
      case "brain": return fontKey === "tangerine" ? { x: -30, y: -210 } : { x: 30, y: -210 }
      case "body": return fontKey === "kaushan-script" ? { x: -70, y: -90 } : { x: 70, y: -90 }
      default: return { x: 0, y: -140 }
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (!isOpen) {
                  updatePopupPosition()
                }
                setIsOpen(!isOpen)
              }}
              className={cn(
                "h-9 w-9 rounded-full transition-colors hover:bg-accent",
                isOpen && "bg-accent text-accent-foreground",
              )}
              aria-label="Font Settings"
            >
              <Type className="h-5 w-5 text-muted-foreground" />
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [0, 1.5, 1],
                      transition: { duration: 0.5, times: [0, 0.6, 1] },
                    }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 bg-primary/20 rounded-full"
                  />
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Font Settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-[110]"
            style={{
              bottom: `${popupPosition.bottom}px`,
              left: `${popupPosition.left}px`,
            }}
          >
            {/* Hippo body shape */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.15,
                scale: 1,
                transition: { delay: 0.1, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute"
              style={{
                width: 200,
                height: 220,
                bottom: 20,
                left: -100,
                background: "linear-gradient(135deg, #4fd1c5 0%, #2b6cb0 100%)", // Teal to blue gradient
                borderRadius: "60% 60% 50% 50% / 70% 70% 40% 40%",
                zIndex: 50,
              }}
            />

            {/* Brain top */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.2,
                scale: 1,
                transition: { delay: 0.15, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute"
              style={{
                width: 140,
                height: 70,
                bottom: 170,
                left: -70,
                background: "linear-gradient(135deg, #f687b3 0%, #ed64a6 100%)", // Pink gradient for brain
                borderRadius: "60% 60% 40% 40% / 60% 60% 40% 40%",
                zIndex: 51,
              }}
            />

            {/* Left ear */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.2,
                scale: 1,
                transition: { delay: 0.2, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute"
              style={{
                width: 40,
                height: 40,
                bottom: 200,
                left: -90,
                background: "linear-gradient(135deg, #4fd1c5 0%, #2b6cb0 100%)",
                borderRadius: "50%",
                zIndex: 52,
              }}
            />

            {/* Right ear */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.2,
                scale: 1,
                transition: { delay: 0.2, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute"
              style={{
                width: 40,
                height: 40,
                bottom: 200,
                left: 50,
                background: "linear-gradient(135deg, #4fd1c5 0%, #2b6cb0 100%)",
                borderRadius: "50%",
                zIndex: 52,
              }}
            />

            {/* Left eye */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.8,
                scale: 1,
                transition: { delay: 0.25, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bg-white rounded-full"
              style={{
                width: 34,
                height: 34,
                bottom: 150,
                left: -45,
                zIndex: 53,
                border: "2px solid rgba(0,0,0,0.2)",
              }}
            />

            {/* Right eye */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.8,
                scale: 1,
                transition: { delay: 0.25, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bg-white rounded-full"
              style={{
                width: 34,
                height: 34,
                bottom: 150,
                left: 11,
                zIndex: 53,
                border: "2px solid rgba(0,0,0,0.2)",
              }}
            />

            {/* Eye pupils */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.9,
                scale: 1,
                transition: { delay: 0.3, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bg-black rounded-full"
              style={{
                width: 12,
                height: 12,
                bottom: 150,
                left: -34,
                zIndex: 54,
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.9,
                scale: 1,
                transition: { delay: 0.3, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bg-black rounded-full"
              style={{
                width: 12,
                height: 12,
                bottom: 150,
                left: 22,
                zIndex: 54,
              }}
            />

            {/* Nose */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.7,
                scale: 1,
                transition: { delay: 0.3, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bg-gray-800 rounded-full"
              style={{
                width: 50,
                height: 35,
                bottom: 110,
                left: -25,
                borderRadius: "50% 50% 60% 60% / 50% 50% 70% 70%",
                zIndex: 54,
              }}
            />

            {/* Nostrils */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.8,
                scale: 1,
                transition: { delay: 0.35, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bg-black rounded-full"
              style={{
                width: 8,
                height: 10,
                bottom: 120,
                left: -15,
                zIndex: 55,
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.8,
                scale: 1,
                transition: { delay: 0.35, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bg-black rounded-full"
              style={{
                width: 8,
                height: 10,
                bottom: 120,
                left: 7,
                zIndex: 55,
              }}
            />

            {/* Mouth */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.7,
                scale: 1,
                transition: { delay: 0.3, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute"
              style={{
                width: 70,
                height: 40,
                bottom: 70,
                left: -35,
                borderBottom: "4px solid rgba(0,0,0,0.6)",
                borderLeft: "3px solid rgba(0,0,0,0.6)",
                borderRight: "3px solid rgba(0,0,0,0.6)",
                borderRadius: "0 0 50% 50%",
                zIndex: 54,
              }}
            />

            {/* Left foot */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.3,
                scale: 1,
                transition: { delay: 0.35, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bg-gray-700/20 rounded-full"
              style={{
                width: 30,
                height: 20,
                bottom: 40,
                left: -60,
                borderRadius: "50% 50% 0 0",
                zIndex: 55,
              }}
            />

            {/* Right foot */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.3,
                scale: 1,
                transition: { delay: 0.35, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bg-gray-700/20 rounded-full"
              style={{
                width: 30,
                height: 20,
                bottom: 40,
                left: 30,
                borderRadius: "50% 50% 0 0",
                zIndex: 55,
              }}
            />

            {/* Outline */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.4,
                scale: 1,
                transition: { delay: 0.1, duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute"
              style={{
                width: 200,
                height: 220,
                bottom: 20,
                left: -100,
                border: "2px dashed rgba(255,255,255,0.6)",
                borderRadius: "60% 60% 50% 50% / 70% 70% 40% 40%",
                zIndex: 56,
              }}
            />

            {fontKeys.map((fontKey, index) => {
              const position = getHippoPosition(fontKey)
              const fontConfig = FONTS[fontKey]
              const feature = HIPPO_FEATURES[fontKey]
              const isSelected = font === fontKey

              return (
                <motion.div
                  key={fontKey}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: position.x,
                    y: position.y,
                    scale: 1,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 300, damping: 20, delay: index * 0.03 },
                  }}
                  exit={{
                    x: 0, y: 0, scale: 0, opacity: 0,
                    transition: { type: "spring", stiffness: 400, damping: 20, delay: (fontKeys.length - index - 1) * 0.02 },
                  }}
                  className="absolute"
                  style={{ originX: "center", originY: "center", zIndex: 60 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="icon"
                          className={cn(
                            "h-10 w-10 rounded-full shadow-lg border-2",
                            isSelected && "border-primary",
                            "transition-all duration-300 hover:scale-110",
                            "bg-white/10 backdrop-blur-sm",
                            feature === "left-ear" && "bg-teal-500/20",
                            feature === "right-ear" && "bg-teal-500/20",
                            feature === "left-eye" && "bg-white/30",
                            feature === "right-eye" && "bg-white/30",
                            feature === "nose" && "bg-gray-700/20",
                            feature === "mouth" && "bg-pink-300/20",
                            feature === "left-foot" && "bg-teal-700/20",
                            feature === "right-foot" && "bg-teal-700/20",
                            feature === "brain" && "bg-pink-500/20",
                            feature === "body" && "bg-teal-400/20",
                          )}
                          onClick={() => {
                            setFont(fontKey)
                            setIsOpen(false)
                          }}
                        >
                          <span
                            className={cn("text-lg", isSelected && "text-primary-foreground")}
                            style={{ fontFamily: `var(--font-${fontKey})` }}
                          >
                            {fontConfig.label[0]}
                          </span>
                          {isSelected && <Check className="absolute top-0 right-0 h-3 w-3 text-primary-foreground" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p style={{ fontFamily: `var(--font-${fontKey})` }}>{fontConfig.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
