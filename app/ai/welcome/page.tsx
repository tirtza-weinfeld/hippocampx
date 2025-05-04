"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import WelcomeScreen from "@/components/ai/welcome-screen"

export default function WelcomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    localStorage.setItem("ai-kids-visited", "true")
    router.push("/what-is-ai")
  }

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem("ai-kids-visited")
    if (hasVisited) {
      router.push("/what-is-ai")
    }
  }, [router])

  return <WelcomeScreen onGetStarted={handleGetStarted} />
}
