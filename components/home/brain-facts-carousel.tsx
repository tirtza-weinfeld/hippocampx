"use client"

import { useState, startTransition, ViewTransition } from "react"
import { ChevronLeft, ChevronRight, Brain, Cpu, Lightbulb, Sparkles, Zap, Activity } from "lucide-react"

type ColorKey = "violet" | "amber" | "yellow" | "teal" | "pink" | "indigo" | "emerald" | "blue"

const brainFacts: { icon: typeof Brain; title: string; fact: string; color: ColorKey }[] = [
  {
    icon: Brain,
    title: "86 Billion Neurons",
    fact: "Your brain contains about 86 billion neurons, each connected to thousands of others — more connections than stars in the Milky Way.",
    color: "violet",
  },
  {
    icon: Zap,
    title: "2.5 Petabytes",
    fact: "The human brain can store approximately 2.5 petabytes of data — enough to hold 3 million hours of TV shows.",
    color: "amber",
  },
  {
    icon: Lightbulb,
    title: "20 Watts of Power",
    fact: "Your brain runs on about 20 watts — less than a dim lightbulb, yet it outperforms any supercomputer at pattern recognition.",
    color: "yellow",
  },
  {
    icon: Cpu,
    title: "AI Inspiration",
    fact: "Neural networks in AI are inspired by the brain. GPT-4 has ~1.8 trillion parameters — still 50x fewer connections than your brain.",
    color: "teal",
  },
  {
    icon: Sparkles,
    title: "Neuroplasticity",
    fact: "Your brain rewires itself constantly. Learning something new creates physical changes in neural pathways.",
    color: "pink",
  },
  {
    icon: Activity,
    title: "The Hippocampus",
    fact: "Named after the Greek word for 'seahorse', the hippocampus converts short-term memories into long-term ones.",
    color: "indigo",
  },
  {
    icon: Cpu,
    title: "AI & Memory",
    fact: "Unlike your hippocampus, AI models don't truly 'remember' — they learn statistical patterns. Your brain does both, plus imagination.",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Speed of Thought",
    fact: "Information travels through your brain at up to 268 mph. AI processes faster, but your brain does it while keeping you alive.",
    color: "blue",
  },
]

const colorMap: Record<ColorKey, { bg: string; text: string; glow: string }> = {
  violet: { bg: "bg-violet-500", text: "text-violet-500", glow: "shadow-violet-500/20" },
  amber: { bg: "bg-amber-500", text: "text-amber-500", glow: "shadow-amber-500/20" },
  yellow: { bg: "bg-yellow-500", text: "text-yellow-500", glow: "shadow-yellow-500/20" },
  teal: { bg: "bg-teal-500", text: "text-teal-500", glow: "shadow-teal-500/20" },
  pink: { bg: "bg-pink-500", text: "text-pink-500", glow: "shadow-pink-500/20" },
  indigo: { bg: "bg-indigo-500", text: "text-indigo-500", glow: "shadow-indigo-500/20" },
  emerald: { bg: "bg-emerald-500", text: "text-emerald-500", glow: "shadow-emerald-500/20" },
  blue: { bg: "bg-blue-500", text: "text-blue-500", glow: "shadow-blue-500/20" },
}

export function BrainFactsCarousel() {
  const [current, setCurrent] = useState(0)

  const handlePrev = () => {
    startTransition(() => {
      setCurrent((prev) => (prev - 1 + brainFacts.length) % brainFacts.length)
    })
  }

  const handleNext = () => {
    startTransition(() => {
      setCurrent((prev) => (prev + 1) % brainFacts.length)
    })
  }

  const fact = brainFacts[current]
  const Icon = fact.icon
  const colors = colorMap[fact.color]

  return (
    <div className="w-full max-w-md mx-auto px-2">
      {/* Card container */}
      <div className="group/card relative">
        {/* Glow effect */}
        <div className={`absolute -inset-1 rounded-2xl ${colors.bg} opacity-0 blur-xl transition-opacity duration-500 group-hover/card:opacity-20`} />

        {/* Main card */}
        <div className="relative overflow-hidden rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-xl transition-all duration-300 group-hover/card:border-border group-hover/card:shadow-2xl">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--color-primary)/5,transparent_50%)]" />
          <div className="absolute top-0 right-0 size-32 bg-linear-to-bl from-primary/5 to-transparent rounded-bl-full" />

          <ViewTransition>
            <div key={current} className="relative p-6 sm:p-8">
              {/* Icon with glow */}
              <div className="relative mb-4 inline-block">
                <div className={`absolute inset-0 ${colors.bg} blur-lg opacity-30`} />
                <div className={`relative size-12 rounded-xl ${colors.bg} flex items-center justify-center shadow-lg ${colors.glow}`}>
                  <Icon className="size-6 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Title */}
              <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${colors.text}`}>
                {fact.title}
              </h3>

              {/* Fact text */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {fact.fact}
              </p>

              {/* Counter */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-muted-foreground/50 font-mono">
                  {String(current + 1).padStart(2, "0")} / {String(brainFacts.length).padStart(2, "0")}
                </span>

                {/* Nav buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:scale-95"
                    aria-label="Previous fact"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:scale-95"
                    aria-label="Next fact"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </ViewTransition>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex gap-1">
        {brainFacts.map((f, i) => {
          const c = colorMap[f.color]
          return (
            <button
              key={i}
              onClick={() => startTransition(() => setCurrent(i))}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i === current ? c.bg : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
              }`}
              aria-label={`Go to fact ${i + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}
