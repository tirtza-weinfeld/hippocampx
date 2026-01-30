"use client"

import { motion } from "motion/react"

export type IllustrationSize = "sm" | "md" | "lg"
export const sizeClasses: Record<IllustrationSize, string> = {
  sm: "w-32", // 128px
  md: "w-40", // 160px
  lg: "w-52", // 208px
}

type Props = {
  step: number
  totalSteps: number
  playing: boolean
  onStep: (step: number) => void
  onPlayingChange: (playing: boolean) => void
}

export const IllustrationControls = ({ step, totalSteps, playing, onStep, onPlayingChange }: Props) => {
  const prev = () => {
    onPlayingChange(false)
    onStep((step - 1 + totalSteps) % totalSteps)
  }

  const next = () => {
    onPlayingChange(false)
    onStep((step + 1) % totalSteps)
  }

  const goTo = (i: number) => {
    onPlayingChange(false)
    onStep(i)
  }

  return (
    <div className="flex items-center gap-1.5">
      <button onClick={prev} className="grid size-5 place-items-center rounded-full bg-current/5 hover:bg-current/10">
        <svg width="8" height="8" viewBox="0 0 10 10" className="opacity-50">
          <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex">
        {Array.from({ length: totalSteps }, (_, i) => (
          <button key={i} onClick={() => goTo(i)} className="px-0.5 py-1">
            <motion.span className="block size-1.5 rounded-full bg-current" initial={{ opacity: 0.25 }} animate={{ opacity: i === step ? 1 : 0.25 }} />
          </button>
        ))}
      </div>

      <button onClick={next} className="grid size-5 place-items-center rounded-full bg-current/5 hover:bg-current/10">
        <svg width="8" height="8" viewBox="0 0 10 10" className="opacity-50">
          <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button onClick={() => onPlayingChange(!playing)} className="grid size-5 place-items-center rounded-full bg-current/5 hover:bg-current/10">
        {playing ? (
          <svg width="8" height="8" viewBox="0 0 10 10" className="opacity-50">
            <rect x="2" y="1.5" width="2" height="7" rx="0.5" fill="currentColor" />
            <rect x="6" y="1.5" width="2" height="7" rx="0.5" fill="currentColor" />
          </svg>
        ) : (
          <svg width="8" height="8" viewBox="0 0 10 10" className="opacity-50">
            <path d="M2.5 1.5l6 3.5-6 3.5z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  )
}
