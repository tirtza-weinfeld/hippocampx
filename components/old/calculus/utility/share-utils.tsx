"use client"

/**
 * Modern sharing utilities for 2025
 * With enhanced capabilities and robust fallbacks
 */

// Main text sharing function with advanced fallbacks
export async function shareText({ title, text, url }: { title: string; text: string; url?: string }): Promise<boolean> {
  // Combine text for fallback methods
  const fullText = `${title}\n\n${text}\n\n${url || (typeof window !== "undefined" ? window.location.href : "")}`

  try {
    // Check for modern Web Share API (2025 version supports more features)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: url || window.location.href,
        })
        return true
      } catch (error: unknown) {
        // Handle specific error types with appropriate fallbacks
        if (error instanceof Error && "name" in error && error.name === "AbortError") {
          // User cancelled, no fallback needed
          return false
        } else if (error instanceof Error && "name" in error && error.name === "NotAllowedError") {
          console.log("Share permission denied, falling back to clipboard")
          return await copyToClipboard(fullText, "Share permission denied. Content copied to clipboard instead!")
        } else {
          console.log("Web Share API failed, falling back to clipboard", error)
          return await copyToClipboard(fullText)
        }
      }
    } else {
      // Web Share API not available, use enhanced clipboard
      return await copyToClipboard(
        fullText,
        "Sharing not supported in this browser. Content copied to clipboard instead!",
      )
    }
  } catch (error) {
    console.error("Share error:", error)
    // Ultimate fallback - alert with text
    if (typeof window !== "undefined") {
      window.alert(`Please copy and share this text:\n\n${fullText}`)
    }
    return false
  }
}

// Modern clipboard function with enhanced capabilities for 2025
async function copyToClipboard(
  text: string,
  message = "Content copied to clipboard! You can now paste and share it.",
): Promise<boolean> {
  try {
    // Try modern clipboard API with async/await
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        if (typeof window !== "undefined") {
          window.alert(message)
        }
        return true
      } catch (err) {
        console.error("Clipboard API failed:", err)
        return await fallbackCopyToClipboard(text, message)
      }
    } else {
      // Use fallback for browsers without clipboard API
      return await fallbackCopyToClipboard(text, message)
    }
  } catch (error) {
    console.error("Copy to clipboard error:", error)
    return await fallbackCopyToClipboard(text, message)
  }
}

// Enhanced fallback clipboard method for 2025
async function fallbackCopyToClipboard(
  text: string,
  message = "Content copied to clipboard! You can now paste and share it.",
): Promise<boolean> {
  if (typeof document === "undefined") return false

  try {
    // Create temporary textarea with improved positioning
    const textArea = document.createElement("textarea")
    textArea.value = text

    // Modern styling to ensure it's hidden but accessible
    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"
    textArea.style.opacity = "0"
    textArea.style.pointerEvents = "none"
    textArea.setAttribute("aria-hidden", "true")

    document.body.appendChild(textArea)

    // Use modern selection API
    if (window.getSelection && document.createRange) {
      const range = document.createRange()
      range.selectNodeContents(textArea)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
        textArea.select()
      }
    } else {
      // Fallback for older browsers
      textArea.select()
    }

    // Execute copy command
    const successful = document.execCommand("copy")
    document.body.removeChild(textArea)

    if (successful) {
      window.alert(message)
      return true
    } else {
      window.alert(`Please copy this text manually:\n\n${text}`)
      return false
    }
  } catch (error) {
    console.error("Fallback clipboard error:", error)
    window.alert(`Please copy this text manually:\n\n${text}`)
    return false
  }
}

// Enhanced function to download a canvas as an image for 2025
export function downloadCanvasAsImage(
  canvas: HTMLCanvasElement | null,
  filename = "calculus-app-download.png",
): boolean {
  if (!canvas) {
    console.error("No canvas provided for download")
    return false
  }

  try {
    // Use modern approach with promises
    const link = document.createElement("a")
    link.download = filename

    // Use higher quality settings for 2025 displays
    link.href = canvas.toDataURL("image/png", 1.0)

    // Modern way to trigger downloads
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()

    // Use setTimeout to ensure the browser has time to process
    setTimeout(() => {
      document.body.removeChild(link)
    }, 100)

    return true
  } catch (error) {
    console.error("Error downloading canvas:", error)
    window.alert("Failed to download the image. Please try taking a screenshot instead.")
    return false
  }
}

// Modern function to share canvas as image with enhanced capabilities for 2025
export async function shareCanvas(
  canvas: HTMLCanvasElement | null,
  options: {
    title: string
    text: string
    filename?: string
  },
): Promise<boolean> {
  if (!canvas) {
    console.error("No canvas provided for sharing")
    return await shareText(options) // Fall back to sharing just the text
  }

  try {
    // Get canvas as blob with modern promise handling
    const getCanvasBlob = async (): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        try {
          // Use higher quality for 2025 displays
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error("Could not create image blob"))
            },
            "image/png",
            1.0,
          )
        } catch (error) {
          reject(error)
        }
      })
    }

    // Try to get the blob with proper error handling
    let blob: Blob
    try {
      blob = await getCanvasBlob()
    } catch (error) {
      console.error("Error creating blob from canvas:", error)
      return await shareText(options) // Fall back to sharing just the text
    }

    // Check if Web Share API with files is supported (widely available in 2025)
    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare) {
      const file = new File([blob], options.filename || `calculus-app-${new Date().toISOString().slice(0, 10)}.png`, {
        type: "image/png",
      })

      const shareData = {
        title: options.title,
        text: options.text,
        files: [file],
      }

      // Check if we can share files
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData)
          return true
        } catch (error: unknown) {
          // Handle specific error types
          if (error instanceof Error && "name" in error && error.name === "AbortError") {
            // User cancelled, no fallback needed
            return false
          } else if (error instanceof Error && "name" in error && error.name === "NotAllowedError") {
            console.log("Share permission denied, trying without files")
            // Try sharing without files
            try {
              await navigator.share({
                title: options.title,
                text: options.text,
                url: window.location.href,
              })
              return true
            } catch (innerError: unknown) {
              if (innerError instanceof Error && "name" in innerError && innerError.name !== "AbortError") {
                console.error("Sharing without files failed:", innerError)
                // Use data URL as fallback
                // const dataUrl = canvas.toDataURL("image/png", 1.0)
                const fullText = `${options.title}\n\n${options.text}\n\n(Image was not shared due to browser restrictions)`
                return await copyToClipboard(fullText, "Share permission denied. Content copied to clipboard instead!")
              }
              return false // User cancelled
            }
          } else {
            console.log("Sharing with files failed, trying without files", error)
            // Try sharing without files
            try {
              await navigator.share({
                title: options.title,
                text: options.text,
                url: window.location.href,
              })
              return true
            } catch (innerError: unknown) {
              if (innerError instanceof Error && "name" in innerError && innerError.name !== "AbortError") {
                console.error("Sharing without files failed:", innerError)
                return await shareText(options) // Fall back to text sharing
              }
              return false // User cancelled
            }
          }
        }
      } else {
        console.log("Cannot share files, falling back to text sharing")
        return await shareText(options)
      }
    }

    // If we can't share with files, try just the text
    return await shareText(options)
  } catch (error) {
    console.error("Error in shareCanvas:", error)
    return await shareText(options) // Final fallback
  }
}

