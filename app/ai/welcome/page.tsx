"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import WelcomeScreen from "@/components/ai/welcome-screen"

export default function WelcomePage() {
  const router = useRouter()

  function handleGetStarted() {
    localStorage.setItem("ai-kids-visited", "true")
    router.push("/ai/what-is-ai")
  }

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem("ai-kids-visited")
    if (hasVisited) {
      router.push("/ai/what-is-ai")
    }
  }, [router])

  return <WelcomeScreen onGetStarted={handleGetStarted} />
}
