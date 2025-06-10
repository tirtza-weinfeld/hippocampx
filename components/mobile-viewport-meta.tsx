"use client"

import { useEffect } from "react"

export function MobileViewportMeta() {
  useEffect(() => {
    // Get existing viewport meta tag or create a new one
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta') as HTMLMetaElement
      viewportMeta.name = "viewport"
      document.head.appendChild(viewportMeta)
    }

    // Set viewport meta content to prevent zooming
    viewportMeta.content = [
      "width=device-width",
      "initial-scale=1",
      "maximum-scale=1",
      "viewport-fit=cover"
    ].join(", ")

    // Cleanup function to restore original viewport meta
    return () => {
      if (viewportMeta) {
        viewportMeta.content = "width=device-width, initial-scale=1"
      }
    }
  }, [])

  return null
} 