"use client"

import { useEffect } from 'react'

export function HashScrollHandler() {
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash
      if (!hash) return

      const id = hash.slice(1)
      
      // Try to find the element
      const element = document.getElementById(id)
      if (element) {
        // Calculate offset for fixed header
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.scrollY - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }

    // Handle initial load with a small delay to ensure content is rendered
    const timer = setTimeout(handleHashScroll, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return null
} 