import type React from "react"
import type { Metadata } from "next"

import { cn } from "@/lib/utils"

// Pre-compute random note positions at module level for pure rendering
const MUSICAL_NOTES = ["♪", "♫", "♩", "♬"]
const floatingNotes = Array.from({ length: 5 }, (_, i) => ({
  left: `${(i * 20 + 10) % 100}%`, // Deterministic spread instead of random
  duration: 5 + (i % 3) * 2.5, // Deterministic duration: 5, 7.5, 10, 5, 7.5
  note: MUSICAL_NOTES[i % 4],
}))

export const metadata: Metadata = {
  title: "Hadestown",
  description: "A fun educational game based on Hadestown themes",
}

export default function HadestownLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="@container  rounded-2xl  py-1 mb-2 h-screen hadestown  ">
      <div className="h-full overflow-y-auto ">

        <div className={cn("min-h-screen ",)}>
          {/* Decorative elements */}
          <div className="fixed pointer-events-none inset-0 z-[-1] opacity-10 dark:opacity-20">
            <div className="absolute top-0 left-0 w-full h-64 music-pattern-svg"></div>
            <div className="absolute bottom-0 left-0 w-full h-64 railroad-pattern-svg"></div>

            {/* Add Hadestown-themed decorative elements */}
            <div className="absolute top-20 right-20 w-16 h-16 opacity-20 dark:opacity-30 animate-lyre-strum">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-600 dark:text-amber-500"
              >
                <path d="M9 18V5l12-2v13"></path>
                <path d="M9 9c0 3.75 8 3.75 12 0"></path>
                <circle cx="5" cy="18" r="3"></circle>
                <circle cx="17" cy="16" r="3"></circle>
              </svg>
            </div>

            <div className="absolute bottom-20 left-20 w-16 h-16 opacity-20 dark:opacity-30 animate-railroad-light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-600 dark:text-amber-500"
              >
                <rect x="3" y="11" width="18" height="2"></rect>
                <rect x="3" y="16" width="18" height="2"></rect>
                <path d="M12 5v16"></path>
              </svg>
            </div>
          </div>

          {/* Musical notes that float up occasionally */}
          <div className="fixed pointer-events-none inset-0 z-[-1] overflow-hidden">
            {floatingNotes.map((note, i) => (
              <div
                key={i}
                className="absolute text-amber-500/20 dark:text-amber-400/20 text-2xl"
                style={{
                  left: note.left,
                  bottom: "-20px",
                  animation: `note-float ${note.duration}s ease-out ${i * 10}s infinite`,
                }}
              >
                {note.note}
              </div>
            ))}
          </div>

          {/* Navigation header with home button */}
          {/* <header className="fixed top-0 left-0 right-0 z-[100] py-3 px-4 bg-background/90 dark:bg-background/90 backdrop-blur-md border-b border-amber-500/10 dark:border-amber-700/20 shadow-sm">
            <div className="container mx-auto flex justify-between items-center">
              <Link
                href="/"
                className="flex items-center gap-2 text-amber-600 hover:text-amber-500 transition-all duration-300 py-2 px-3 rounded-full bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-amber-500/30 dark:border-amber-600/40 hover:border-amber-500/60 dark:hover:border-amber-500/60 shadow-sm hover:shadow group"
              >
                <HomeIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Home</span>
              </Link>

      
            </div>
          </header> */}

          {/* Add padding to account for the fixed header */}
          <div className="pt-16">{children}</div>
        </div>
      </div>
    </div>
  )
}


