import type React from "react"
import { Navigation } from "@/components/binary/navigation"
import type { Metadata } from "next"
import BinaryMascot from "@/components/binary/binary-mascot"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Binary Buddies - Learn Binary the Fun Way!",
  description: "An interactive binary learning app for curious kids aged 8-14",
}

export default function BinaryLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="binary @container px-4 py-12 mx-auto max-w-6xl">
      <Navigation />
      <header className="text-center mb-12 relative">
        <div className="absolute top-7 -left-2 md:left-1 lg:left-30 transform -translate-y-1/2 hidden md:block">
          <BinaryMascot emotion="happy" size="md" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-bounce-slow tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
            Binary Buddies
          </span>
        </h1>



      </header>
      <Suspense fallback={<div>Loading...</div>}>
      <>  
      
      {children}
      </>
      
      </Suspense>
    </div >
  )
}


