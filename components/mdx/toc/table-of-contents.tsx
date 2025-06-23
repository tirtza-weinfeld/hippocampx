"use client"

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ExpandCollapseIcon, ChevronIcon } from '@/components/svgs/toc-icons'

interface TocHeading {
  text: string
  id: string
  level: number
}

interface TableOfContentsProps {
  headings: TocHeading[] | string // Can be an array or a JSON string
  className?: string
  maxHeight?: string // Optional prop to control max height
  onHeadingClick?: () => void // Optional callback for mobile close behavior
}



export function TableOfContents({ headings: rawHeadings, className, maxHeight = "calc(100vh - 200px)", onHeadingClick }: TableOfContentsProps) {
  const pathname = usePathname()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [isAllExpanded, setIsAllExpanded] = useState(true)

  // Memoize headings to prevent unnecessary re-renders
  const headings = useMemo(() => {
    let result: TocHeading[] = []

    // Handle both array and JSON string props
    if (typeof rawHeadings === 'string') {
      try {
        const parsed = JSON.parse(rawHeadings)
        if (Array.isArray(parsed)) {
          result = parsed
        }
      } catch (e) {
        console.error("Failed to parse TOC headings from JSON string:", e)
      }
    } else if (Array.isArray(rawHeadings)) {
      result = rawHeadings
    }

    return result
  }, [rawHeadings])

  // Group headings by h2 sections
  const groupHeadingsByH2 = (headings: TocHeading[]) => {
    const groups: { h2: TocHeading; children: TocHeading[] }[] = []
    let currentH2: TocHeading | null = null
    let currentChildren: TocHeading[] = []

    headings.forEach((heading) => {
      if (heading.level === 2) {
        // Save previous group if exists
        if (currentH2) {
          groups.push({ h2: currentH2, children: currentChildren })
        }
        // Start new group
        currentH2 = heading
        currentChildren = []
      } else if (heading.level > 2 && currentH2) {
        // Add as child of current h2
        currentChildren.push(heading)
      } else if (heading.level === 1) {
        // h1 headings are standalone
        groups.push({ h2: heading, children: [] })
      }
    })

    // Add the last group
    if (currentH2) {
      groups.push({ h2: currentH2, children: currentChildren })
    }

    return groups
  }

  const headingGroups = groupHeadingsByH2(headings)

  // Toggle collapse state for a section
  const toggleSection = (headingId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(headingId)) {
        newSet.delete(headingId)
      } else {
        newSet.add(headingId)
      }
      return newSet
    })
  }

  // Toggle all sections
  const toggleAllSections = () => {
    if (isAllExpanded) {
      // Collapse all sections with children
      const sectionsToCollapse = headingGroups
        .filter(group => group.children.length > 0)
        .map(group => group.h2.id)
      setCollapsedSections(new Set(sectionsToCollapse))
    } else {
      // Expand all sections
      setCollapsedSections(new Set())
    }
    setIsAllExpanded(!isAllExpanded)
  }

  // Intersection Observer to track which heading is in view
  useEffect(() => {
    if (headings.length === 0) return

    const observerOptions = {
      rootMargin: '-20% 0px -35% 0px', // Adjust these values to control when a heading is considered "active"
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id)
        }
      })
    }, observerOptions)

    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [headings])

  // Auto-scroll TOC to keep active heading visible
  useEffect(() => {
    if (!activeHeading || !scrollContainerRef.current) return

    const activeElement = scrollContainerRef.current.querySelector(`[data-heading-id="${activeHeading}"]`)
    if (activeElement) {
      const container = scrollContainerRef.current
      const elementRect = activeElement.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // Check if element is outside the visible area
      if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        })
      }
    }
  }, [activeHeading])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      container.scrollTop += e.deltaY
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Update the URL to include the heading's slug
      const newUrl = `${pathname}#${id}`
      window.history.pushState(null, '', newUrl)

      // Scroll the element into view with better offset for fixed headers
      const headerOffset = 80 // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      // On small screens, we need to handle the scroll differently since TOC slides over content
      if (onHeadingClick && window.innerWidth < 768) {
        // First scroll to the position
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })

        // Then close the TOC after the scroll animation completes
        // Use a longer delay to ensure scroll completes
        setTimeout(() => {
          onHeadingClick()
        }, 500) // Increased delay to ensure scroll completes
      } else {
        // On desktop, normal behavior
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleHeadingClick(id)
    }
  }

  // Helper function to check if a heading should be highlighted (including parent highlighting)
  const getHeadingHighlightState = (heading: TocHeading) => {
    const isActive = activeHeading === heading.id
    const activeHeadingData = headings.find(h => h.id === activeHeading)

    if (isActive) {
      return { isActive: true, isParent: false }
    }

    // Check if this heading is a parent of the active heading
    if (activeHeadingData && heading.level < activeHeadingData.level) {
      // Find if this heading is actually a parent by checking the hierarchy
      const activeIndex = headings.findIndex(h => h.id === activeHeading)
      const currentIndex = headings.findIndex(h => h.id === heading.id)

      if (currentIndex < activeIndex) {
        // Check if there's no other heading of the same level between current and active
        for (let i = currentIndex + 1; i < activeIndex; i++) {
          if (headings[i].level <= heading.level) {
            return { isActive: false, isParent: false }
          }
        }
        return { isActive: false, isParent: true }
      }
    }

    return { isActive: false, isParent: false }
  }

  // Check if there are any sections with children to show the toggle
  const hasCollapsibleSections = headingGroups.some(group => group.children.length > 0)

  // Ensure headings is an array and has content
  if (headings.length === 0) {
    return (
      <nav className={cn("space-y-2", className)} aria-label="Table of Contents">
        <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 text-foreground">Table of Contents</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">No headings found</p>
      </nav>
    )
  }

  return (
    <nav className={cn("space-y-1 sm:space-y-2 ", className)} aria-label="Table of Contents">
      <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
        <h3 className={cn("font-semibold text-sm sm:text-base lg:text-lg",
          "text-toc-gradient",
          "hover:animate-gradient-hover"
        )}>Table of Contents</h3>

        {/* Collapse/Expand All Toggle */}
        {hasCollapsibleSections && (
          <button
            onClick={toggleAllSections}
            className={cn(
              "transition-all duration-300 ease-out",
              "flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm",
              "text-muted-foreground hover:text-foreground",
              "rounded-lg transition-all duration-300 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "relative overflow-hidden group",
              // Background gradient that animates
              "bg-gradient-to-r from-blue-500/10 via-sky-400/10 to-sky-300/40",
              // Animated background position
              "hover:bg-gradient-to-l",
              // Subtle glow effect
              // Border animation
              "[&>*]:text-toc-gradient",
              "[&>svg]:text-sky-400",
              "[&>svg]:group-hover:text-blue-400"
            )}
            aria-label={isAllExpanded ? 'Collapse all sections' : 'Expand all sections'}
          >
            <ExpandCollapseIcon isExpanded={isAllExpanded} />
            <span className="hidden sm:inline ">
              {isAllExpanded ? 'Collapse' : 'Expand'}
            </span>
          </button>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
        style={{ maxHeight }}
      >
        <ul className="space-y-0.5 sm:space-y-1 pr-2" role="list">
          {headingGroups.map(({ h2, children }) => {
            const { isActive: isH2Active, isParent: isH2Parent } = getHeadingHighlightState(h2)
            const isCollapsed = collapsedSections.has(h2.id)
            const hasChildren = children.length > 0

            return (
              <li key={h2.id} className="space-y-0.5 sm:space-y-1 relative">

                <div
                  data-heading-id={h2.id}
                  className={cn(
                    
                    "flex items-center gap-2 text-xs sm:text-sm lg:text-base transition-all duration-200 ease-in-out",
                    "focus-within:text-foreground",
                    "cursor-pointer rounded-xl px-2 py-0.5 sm:py-1",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "active:bg-toc-gradient",
                    "relative group",
                    (isH2Active||   isH2Parent) && "bg-toc-gradient  hover:animate-gradient-hover",
                    (isH2Active && !isH2Parent) && "border-b-1 border-sky-500 border-dashed",
                    // isH2Parent &&"text-red-200",

                    // isH2Active && "bg-toc-gradient  hover:animate-gradient-hover",
                    // isH2Parent && `bg-toc-gradient hover:animate-gradient-hover`,
                    // h2.level === 1 && !isH2Active && "font-medium text-foreground",
                    // h2.level === 2 && !isH2Active && "text-muted-foreground",

                  )}
                  onClick={() => handleHeadingClick(h2.id)}
                  onKeyDown={(e) => handleKeyDown(e, h2.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Jump to ${h2.text}`}
                  aria-current={isH2Active ? 'location' : undefined}
                >
                  {/* Toggle button for h2 with children */}
                  {h2.level === 2 && hasChildren && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSection(h2.id)
                      }}
                      className={cn(
                        "p-1 rounded-lg transition-all duration-300 ease-out flex-shrink-0",
                        "hover:scale-105 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "relative overflow-hidden group",
                        // Background gradient that animates 
                        "bg-toc-gradient",
                        "hover:animate-gradient-hover",

                        // Subtle glow effect
                        "hover:shadow-lg hover:shadow-blue-500/20",
                        // Border animation
                        // "border border-transparent hover:border-blue-500/30",


                      )}
                      aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
                    >
                      <ChevronIcon isOpen={!isCollapsed} />
                    </button>
                  )}
                  <span className={cn(
                    "flex-1 min-w-0 transition-all duration-200 ease-in-out relative",
                    "px-1"

                  )}>
                    <span className={cn(
                      "inline-block relative",
                      // Add underline animation for non-active, non-parent headings
                      !isH2Active && !isH2Parent && `group-hover:before:absolute group-hover:before:bottom-0
                       group-hover:before:left-0 group-hover:before:h-0.5 group-hover:before:w-full
                       group-hover:before:bg-toc-underline-gradient
                       group-hover:before:animate-underline-slide`
                    )}>
                      <span className={cn(
                        isH2Active || isH2Parent && "text-toc-gradient",
                        "group-hover:text-toc-gradient",

                      )}>{h2.text}</span>
                    </span>
                  </span>
                </div>

                {/* Children (h3, h4, etc.) */}
                {hasChildren && (
                  <div className={cn(
                    "grid transition-all duration-500 ease-out",
                    isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                  )}>
                    <div className="overflow-hidden">
                      <ul className="space-y-0.5 sm:space-y-1 ml-3 sm:ml-4 lg:ml-8 pb-1">
                        {children.map((child) => {
                          const { isActive, isParent } = getHeadingHighlightState(child)
                          return (
                            <li
                              key={child.id}
                              data-heading-id={child.id}
                              className={cn(
                                "text-xs sm:text-sm lg:text-base transition-all duration-200 ease-in-out group",
                                "focus-within:text-foreground",
                                "cursor-pointer rounded-xl px-2 py-0.5 sm:py-1",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                "active:bg-toc-gradient",
                                "relative",
                                // Active heading: a soft, glowing, inset pill
                                // isActive && "bg-toc-gradient text-toc-mix hover:animate-gradient-hover",
                                isActive && "bg-toc-gradient hover:animate-gradient-hover",
                                // Parent heading: colored text, no background
                                isParent && `bg-toc-gradient hover:animate-gradient-hover`,
                                (isActive && !isParent) && "border-b-1 border-sky-500 border-dashed",
                                "w-fit"

                              )}
                              onClick={() => handleHeadingClick(child.id)}
                              onKeyDown={(e) => handleKeyDown(e, child.id)}
                              tabIndex={0}
                              role="button"
                              aria-label={`Jump to ${child.text}`}
                              aria-current={isActive ? 'location' : undefined}
                            >
                              <span className={cn(
                                "transition-all duration-200 ease-in-out relative px-1",
                           

                              )}>
                                <span className={cn(
                                  "inline-block relative",
                                  // Add underline animation for non-active, non-parent headings
                                  !isActive && !isParent && `group-hover:before:absolute group-hover:before:bottom-0 group-hover:before:left-0 group-hover:before:h-0.5 group-hover:before:w-full
                                   group-hover:before:bg-gradient-to-r group-hover:before:from-blue-500 group-hover:before:via-sky-400 group-hover:before:to-blue-400
                                   group-hover:before:animate-underline-slide`
                                )}>
                                  <span className={cn(
                                
                                    isActive && "text-toc-gradient",
                                    "group-hover:text-toc-gradient"
                                  )}>{child.text}</span>
                                </span>
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}