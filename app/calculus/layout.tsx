import type React from "react"
import { Navigation } from "@/components/calculus/navigation"
import { Mascot } from "@/components/calculus/mascot"
import type { Metadata } from "next"
import { SparklesCore } from "@/components/calculus/ui/sparkles"

export const metadata: Metadata = {
  title: "CalKids - Calculus Adventures for Young Minds",
  description: "An interactive calculus learning app for curious kids aged 8-14",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" @container calculus min-h-screen bg-background">
      <div className="relative flex min-h-screen flex-col">
        <div className="fixed inset-0 -z-10">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={15}
            className="h-full w-full"
            particleColor="#7C3AED"
          />
        </div>
        <Navigation />
        {children}
        <Mascot
          message="Welcome to CalKids! I'm Newton, your calculus guide. Let's explore the fascinating world of change and motion together!"
          character="newton"
        />
      </div>
    </div>


  )
}

