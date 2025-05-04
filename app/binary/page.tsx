"use client"

// Add missing imports
import { useState, useEffect, useTransition, Suspense, lazy } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileNavDrawer } from "@/components/binary/mobile-nav-drawer"
import { useSwipeable } from "@/hooks/use-swipeable"
import { Menu } from "lucide-react"
import { FunButton } from "@/components/binary/fun-button"
import { motion, AnimatePresence } from "framer-motion"
import BinaryMascot from "@/components/binary/binary-mascot"
import { useCallback } from "react" // Add missing import

// Lazy load components to improve initial load time
const BinaryIntroduction = lazy(() => import("@/components/binary/binary-introduction"))
const BinaryConverter = lazy(() => import("@/components/binary/binary-converter"))
const BinaryExplanation = lazy(() => import("@/components/binary/binary-explanation"))
const BinaryPractice = lazy(() => import("@/components/binary/binary-practice"))
const BinaryFunFacts = lazy(() => import("@/components/binary/binary-fun-facts"))
const BinaryGame = lazy(() => import("@/components/binary/binary-game"))

// Loading fallbacks for each component
const IntroductionFallback = () => (
  <div
    className="w-full h-[500px] flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-2xl animate-pulse"
    aria-label="Loading introduction content"
    role="status"
  >
    <div className="flex flex-col items-center">
      <BinaryMascot emotion="thinking" size="md" />
      <p className="mt-4 text-slate-600 dark:text-slate-400">Loading introduction...</p>
    </div>
  </div>
)

const ConverterFallback = () => (
  <div
    className="w-full h-[500px] flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-2xl animate-pulse"
    aria-label="Loading converter content"
    role="status"
  >
    <div className="flex flex-col items-center">
      <BinaryMascot emotion="thinking" size="md" />
      <p className="mt-4 text-slate-600 dark:text-slate-400">Loading converter...</p>
    </div>
  </div>
)

const ExplanationFallback = () => (
  <div
    className="w-full h-[500px] flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-2xl animate-pulse"
    aria-label="Loading explanation content"
    role="status"
  >
    <div className="flex flex-col items-center">
      <BinaryMascot emotion="thinking" size="md" />
      <p className="mt-4 text-slate-600 dark:text-slate-400">Loading explanation...</p>
    </div>
  </div>
)

const PracticeFallback = () => (
  <div
    className="w-full h-[500px] flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-2xl animate-pulse"
    aria-label="Loading practice exercises"
    role="status"
  >
    <div className="flex flex-col items-center">
      <BinaryMascot emotion="thinking" size="md" />
      <p className="mt-4 text-slate-600 dark:text-slate-400">Loading practice exercises...</p>
    </div>
  </div>
)

const FunFactsFallback = () => (
  <div
    className="w-full h-[500px] flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-2xl animate-pulse"
    aria-label="Loading fun facts content"
    role="status"
  >
    <div className="flex flex-col items-center">
      <BinaryMascot emotion="thinking" size="md" />
      <p className="mt-4 text-slate-600 dark:text-slate-400">Loading fun facts...</p>
    </div>
  </div>
)

const GameFallback = () => (
  <div
    className="w-full h-[500px] flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-2xl animate-pulse"
    aria-label="Loading game content"
    role="status"
  >
    <div className="flex flex-col items-center">
      <BinaryMascot emotion="thinking" size="md" />
      <p className="mt-4 text-slate-600 dark:text-slate-400">Loading game...</p>
    </div>
  </div>
)

export default function Home() {
  const [activeTab, setActiveTab] = useState("learn")
  const [isMobile, setIsMobile] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Add startTransition to handleTabChange
  const handleTabChange = useCallback(
    (tab: string) => {
      startTransition(() => {
        setActiveTab(tab)
      })
    },
    [startTransition],
  )



  // Fix the useEffect for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      startTransition(() => {
        setIsMobile(window.innerWidth < 768)
      })
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle swipe gestures for mobile
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const tabs = ["learn", "convert", "explain", "practice", "fun", "play"]
      const currentIndex = tabs.indexOf(activeTab)
      if (currentIndex < tabs.length - 1) {
        handleTabChange(tabs[currentIndex + 1])
      }
    },
    onSwipedRight: () => {
      const tabs = ["learn", "convert", "explain", "practice", "fun", "play"]
      const currentIndex = tabs.indexOf(activeTab)
      if (currentIndex > 0) {
        handleTabChange(tabs[currentIndex - 1])
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  })

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900"
      {...handlers}
    >
      <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
        {isMobile && (
          <FunButton
            variant="outline"
            size="icon"
            onClick={() => setNavOpen(true)}
            className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md md:hidden hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 h-14 w-14"
            icon={<Menu className="h-6 w-6" />}
            bubbles={true}
          />
        )}
      </div>

      {/* Custom Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <header className="text-center mb-12 relative">
          <div className="absolute top-7 -left-2 md:left-10 lg:left-45 transform -translate-y-1/2 hidden md:block">
            <BinaryMascot emotion="happy" size="md" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-bounce-slow tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
              Binary Buddies
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 animate-fade-in max-w-2xl mx-auto">
            Join Bitsy and friends on a binary adventure! Learn the language of computers through fun and play.
          </p>

          {isMobile && (
            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 animate-fade-in">
              <p>Swipe left or right to navigate between tabs</p>
              <p className="mt-2 font-medium">
                Tap the{" "}
                <span className="inline-flex items-center bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-full text-xs shadow-sm">
                  <Menu className="h-3 w-3 mr-1" /> Menu
                </span>{" "}
                button to see all sections
              </p>
            </div>
          )}
        </header>

        <div className="relative z-10 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 rounded-2xl shadow-xl border border-white/20 dark:border-slate-800/50 p-4 md:p-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="sticky top-10 z-50 mb-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm -mx-4 md:-mx-8 px-4 md:px-8">
              <TabsList className="h-13 hidden md:flex w-full flex-wrap md:flex-nowrap p-1.5 bg-blue-100/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm overflow-hidden relative">
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
                    width: `calc(100% / 6)`,
                    left: `calc((100% / 6) * ${["learn", "convert", "explain", "practice", "fun", "play"].indexOf(activeTab)})`,
                  }}
                />

                {[
                  { value: "learn", label: "Learn" },
                  { value: "convert", label: "Convert" },
                  { value: "explain", label: "How To" },
                  { value: "practice", label: "Practice" },
                  { value: "fun", label: "Fun Facts" },
                  { value: "play", label: "Play" },
                ].map((tab) => (
                  <motion.div
                    key={tab.value}
                    className="flex-1 min-w-[80px]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: ["learn", "convert", "explain", "practice", "fun", "play"].indexOf(tab.value) * 0.05,
                      duration: 0.3,
                    }}
                    whileHover={{
                      scale: activeTab !== tab.value ? 1.05 : 1,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: { duration: 0.1 },
                    }}
                  >
                    <TabsTrigger
                      value={tab.value}
                      className={`w-full h-12 md:h-14 text-base md:text-lg font-medium rounded-lg relative z-10 transition-colors duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none ${isPending ? "opacity-70" : ""}`}
                      onClick={() => {
                        if (activeTab !== tab.value) {
                          handleTabChange(tab.value)

                          // Add subtle scale animation on click
                          const element = document.querySelector(`[data-value="${tab.value}"]`)
                          if (element) {
                            element.animate([{ transform: "scale(0.95)" }, { transform: "scale(1)" }], {
                              duration: 200,
                              easing: "ease-out",
                            })
                          }
                        }
                      }}
                      data-value={tab.value}
                      style={{
                        // Override any default background styles
                        background: tab.value === activeTab ? "transparent" : undefined
                      }}
                      disabled={isPending}
                      aria-label={`Switch to ${tab.label} tab`} // Add aria-label for accessibility
                    >
                      <motion.span
                        className="relative z-10 block"
                        initial={false}
                        animate={{
                          y: activeTab === tab.value ? 0 : 0,
                          scale: activeTab === tab.value ? 1.05 : 1,
                          color: activeTab === tab.value ? "#ffffff" : "",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        {tab.label}

                        {/* Subtle underline animation for active tab */}
                        {activeTab === tab.value && (
                          <motion.div
                            className="absolute -bottom-1 left-0 right-0 h-1 bg-white/70 rounded-full"
                            layoutId="activeTabUnderline"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.span>
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {["learn", "convert", "explain", "practice", "fun", "play"].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }} // Faster exit
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.3, // Faster entry
                    }}
                  >
                    {tabValue === "learn" && (
                      <Suspense fallback={<IntroductionFallback />}>
                        <BinaryIntroduction />
                      </Suspense>
                    )}
                    {tabValue === "convert" && (
                      <Suspense fallback={<ConverterFallback />}>
                        <BinaryConverter />
                      </Suspense>
                    )}
                    {tabValue === "explain" && (
                      <Suspense fallback={<ExplanationFallback />}>
                        <BinaryExplanation />
                      </Suspense>
                    )}
                    {tabValue === "practice" && (
                      <Suspense fallback={<PracticeFallback />}>
                        <BinaryPractice />
                      </Suspense>
                    )}
                    {tabValue === "fun" && (
                      <Suspense fallback={<FunFactsFallback />}>
                        <BinaryFunFacts />
                      </Suspense>
                    )}
                    {tabValue === "play" && (
                      <Suspense fallback={<GameFallback />}>
                        <BinaryGame />
                      </Suspense>
                    )}
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </div>

     
      </div>

      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 left-1/2 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
      </div>
    </main>
  )
}

