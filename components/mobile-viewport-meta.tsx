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
      "user-scalable=no",
      "viewport-fit=cover"
    ].join(", ")

    // Add style to prevent content shifting on keyboard appearance
    const style = document.createElement('style')
    style.textContent = `
      @media screen and (max-width: 768px) {
        .keyboard-open {
          height: 100%;
          min-height: 100%;
          position: fixed;
          width: 100%;
          overscroll-behavior: none;
        }
        .keyboard-open #__next,
        .keyboard-open main {
          height: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
      }
    `
    document.head.appendChild(style)

    // Function to handle input focus/blur
    const handleFocus = () => document.documentElement.classList.add('keyboard-open')
    const handleBlur = () => document.documentElement.classList.remove('keyboard-open')

    // Add event listeners to all input and textarea elements
    document.addEventListener('focus', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        handleFocus()
      }
    }, true)

    document.addEventListener('blur', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        handleBlur()
      }
    }, true)

    // Cleanup function to restore original viewport meta and remove style
    return () => {
      if (viewportMeta) {
        viewportMeta.content = "width=device-width, initial-scale=1"
      }
      style.remove()
      document.documentElement.classList.remove('keyboard-open')
      document.removeEventListener('focus', handleFocus, true)
      document.removeEventListener('blur', handleBlur, true)
    }
  }, [])

  return null
} 