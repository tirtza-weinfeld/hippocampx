"use client"

import BinaryMascot from "@/components/old/binary/binary-mascot"
import dynamic from "next/dynamic"

const BinaryExplanation = dynamic(() => import("@/components/old/binary/binary-explanation"), {
  loading: () => (
    <div
      className="w-full h-[500px] flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-2xl animate-pulse"
      aria-label="Loading learning content"
      role="status"
    >
      <div className="flex flex-col items-center">
        <BinaryMascot emotion="thinking" size="md" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading learning materials...</p>
      </div>
    </div>
  ),
  ssr: true,
})

export default function LearnPage() {
  return (
    <>
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
            Learn Binary
          </span>
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          Master binary numbers through interactive lessons and examples.
        </p>
      </header>

      <BinaryExplanation />
    </>
  )
} 