"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MascotSwitch from "./mascot-switch"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { use } from "react"
import { Settings, Sparkles } from "lucide-react"
import { MascotSettingsContext } from "./mascot-settings-context"
import { MascotIcon } from "./mascot-types"
import { cn } from "@/lib/utils"
// import { MascotTooltip } from "./mascot-tooltip"
import {
  TuringIcon,
  LovelaceIcon,
  KnuthIcon,
  DijkstraIcon,
  HopperIcon,
  BernersLeeIcon
} from "./cs-legend-icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"


export const CS_LEGENDS: Record<MascotIcon, {
  id: MascotIcon
  name: string
  fullName: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  achievement: string
  era: string
  color: string
  gradient: {
    light: string
    dark: string
  }
  specialty: string
}> = {
  turing: {
    id: "turing",
    name: "Turing",
    fullName: "Alan Turing",
    icon: TuringIcon,
    description: "Father of Computer Science & AI",
    achievement: "Turing Machine & Breaking Enigma",
    era: "1912-1954",
    color: "blue",
    gradient: {
      light: "from-blue-500 via-blue-600 to-indigo-700",
      dark: "from-blue-400 via-blue-500 to-indigo-600"
    },
    specialty: "Theoretical Computing"
  },
  lovelace: {
    id: "lovelace",
    name: "Lovelace",
    fullName: "Ada Lovelace",
    icon: LovelaceIcon,
    description: "First Computer Programmer",
    achievement: "Analytical Engine & First Algorithm",
    era: "1815-1852",
    color: "purple",
    gradient: {
      light: "from-purple-500 via-violet-600 to-pink-700",
      dark: "from-purple-400 via-violet-500 to-pink-600"
    },
    specialty: "Programming Foundations"
  },
  knuth: {
    id: "knuth",
    name: "Knuth",
    fullName: "Donald Knuth",
    icon: KnuthIcon,
    description: "Algorithm Analysis Pioneer",
    achievement: "The Art of Computer Programming",
    era: "1938-present",
    color: "orange",
    gradient: {
      light: "from-orange-500 via-amber-600 to-yellow-700",
      dark: "from-orange-400 via-amber-500 to-yellow-600"
    },
    specialty: "Algorithm Design"
  },
  dijkstra: {
    id: "dijkstra",
    name: "Dijkstra",
    fullName: "Edsger Dijkstra",
    icon: DijkstraIcon,
    description: "Graph Algorithms Master",
    achievement: "Shortest Path Algorithm",
    era: "1930-2002",
    color: "cyan",
    gradient: {
      light: "from-cyan-500 via-teal-600 to-emerald-700",
      dark: "from-cyan-400 via-teal-500 to-emerald-600"
    },
    specialty: "Graph Theory"
  },
  hopper: {
    id: "hopper",
    name: "Hopper",
    fullName: "Grace Hopper",
    icon: HopperIcon,
    description: "Compiler Pioneer & Bug Hunter",
    achievement: "First Compiler & COBOL",
    era: "1906-1992",
    color: "teal",
    gradient: {
      light: "from-teal-500 via-emerald-600 to-green-700",
      dark: "from-teal-400 via-emerald-500 to-green-600"
    },
    specialty: "Language Design"
  },
  "berners-lee": {
    id: "berners-lee",
    name: "Berners-Lee",
    fullName: "Tim Berners-Lee",
    icon: BernersLeeIcon,
    description: "Inventor of the World Wide Web",
    achievement: "HTTP, HTML, URLs & WWW",
    era: "1955-present",
    color: "pink",
    gradient: {
      light: "from-pink-500 via-rose-600 to-red-700",
      dark: "from-pink-400 via-rose-500 to-red-600"
    },
    specialty: "Web Technologies"
  }
} as const



export function SettingsView() {
  const { selectedIcon, stayOpen, setSelectedIcon, setStayOpen } = use(MascotSettingsContext)
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="space-y-8 p-2 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-linear-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-linear-to-br from-pink-400 to-rose-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-linear-to-br from-cyan-400 to-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Section */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: shouldReduceMotion ? 0 : 0.3 }}
      >
       
        <div>
          <div className="flex items-center justify-center gap-2 group/header">
          <h2 className="text-3xl font-bold bg-linear-to-r group-hover/header:bg-linear-to-l from-sky-600 to-blue-600 via-teal-600
           dark:from-sky-400 dark:via-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
            Mascot Settings
          </h2>
          <div className=" relative inline-flex items-center justify-center w-12 h-12 bg-linear-135 from-sky-500/20 via-blue-500/20 to-teal-500/20 dark:from-sky-400/30 dark:via-blue-400/30 dark:to-teal-400/30 rounded-3xl mb-3 shadow-xl shadow-sky-500/10 dark:shadow-sky-400/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
            <Settings className="w-10 h-10 text-sky-600 dark:text-sky-400" />
            <Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400 absolute -top-1 -right-1 
            transition-all duration-300 group-hover/header:animate-mascot-dance" />
        </div>
        </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
            Choose your AI learning companion and customize preferences
          </p>
        </div>
      </motion.div>

      {/* Stay Open Toggle */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        <Card className="border-0 bg-linear-to-br from-white via-emerald-50/30 to-teal-50/50 dark:from-gray-900 dark:via-emerald-950/20 dark:to-teal-950/30 shadow-xl shadow-emerald-500/5 dark:shadow-emerald-400/5 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 transition-all duration-300 backdrop-blur-sm border border-emerald-100/50 dark:border-emerald-800/30">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold bg-linear-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                  Keep Mascot Open
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Prevent the mascot from closing when clicking outside or pressing escape
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between p-4 bg-linear-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-100/30 dark:border-emerald-800/20">
              <Label htmlFor="stay-open" className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {stayOpen ? "Enabled" : "Disabled"}
              </Label>
              <MascotSwitch
                id="stay-open"
                checked={stayOpen}
                onCheckedChange={setStayOpen}
                // className="data-[state=checked]:bg-linear-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Icon Selection */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        <Card className="border-0 bg-linear-to-br from-white via-violet-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-violet-950/20 dark:to-indigo-950/30 shadow-xl shadow-violet-500/5 dark:shadow-violet-400/5 hover:shadow-2xl hover:shadow-violet-500/10 dark:hover:shadow-violet-400/10 transition-all duration-300 backdrop-blur-sm border border-violet-100/50 dark:border-violet-800/30">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-violet-400 to-indigo-500 dark:from-violet-500 dark:to-indigo-400 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                <KnuthIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold bg-linear-to-r from-violet-700 to-indigo-700 dark:from-violet-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  Mascot Icon
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Choose your AI learning companion
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(CS_LEGENDS).map(([iconId, legend], index) => {
                const isSelected = selectedIcon === iconId
                const IconComponent = legend.icon

                return (
                  <Tooltip key={iconId}>
                    <TooltipTrigger asChild className={cn(`bg-${legend.color}-500`)}>
                      <motion.button
                        key={iconId}
                        onClick={() => setSelectedIcon(iconId as MascotIcon)}
                        className={`
                      relative group flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 overflow-visible
                      ${isSelected
                            ? `border-transparent bg-linear-to-br ${legend.gradient.light} dark:${legend.gradient.dark} shadow-xl shadow-${legend.color}-500/20 dark:shadow-${legend.color}-400/20`
                            : "border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg backdrop-blur-sm"
                          }
                    `}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: shouldReduceMotion ? 0 : index * 0.05, duration: shouldReduceMotion ? 0 : 0.3 }}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        whileFocus={{ outline: "2px solid rgb(99 102 241)", outlineOffset: "2px" }}
                      >
                        <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg
                      ${isSelected
                            ? "bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300"
                            // `:bg-linear-to-r from-${legend.color}-500/30 to-${legend.color}-600/30
                            //      dark:from-${legend.color}-400/30 dark:to-${legend.color}-500/30 text-white`
                            : `bg-linear-to-br ${legend.gradient.light} dark:${legend.gradient.dark} text-white`
                          }
                    `}>
                          <IconComponent className="w-7 h-7 fill-white " />
                        </div>

                        <div className="text-center space-y-1">
                          <span className={`
                        text-sm font-semibold transition-colors duration-300 block
                        ${isSelected
                              ? "text-white dark:text-gray-200"
                              : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                            }
                      `}>
                            {legend.name}
                          </span>
                          <span className={`
                        text-xs transition-colors duration-300 block font-medium
                        ${isSelected
                              ? "text-white/80 dark:text-gray-300/80"
                              : "text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                            }
                      `}>
                            {/* {legend.specialty} */}
                          </span>
                        </div>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: shouldReduceMotion ? 0 : 0.2, type: "spring", stiffness: 400 }}
                              className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-xl border-2 border-white dark:border-gray-900"
                            >
                              <div className={cn(`w-3 h-3 bg-${legend.color}-500 rounded-full animate-pulse`)} />
                            </motion.div>
                          )}
                        </AnimatePresence>







                        {/* gradient={legend.gradient.light} */}

                      </motion.button>
                    </TooltipTrigger>
                  

                      <TooltipContent className={cn("flex flex-col gap-2 ", 
                        `bg-linear-to-br ${legend.gradient.light} dark:${legend.gradient.dark} text-white`
                      )} >
                        <div className="font-bold text-center" >{legend.fullName} </div>

                        <div> {legend.description} </div>
                        {/* <div className="" > {legend.specialty} </div> */}
                        <div className="" > {legend.era} </div>

                      </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  )
}

// Export the constants for use in other components
