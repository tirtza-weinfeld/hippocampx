"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { cn } from "@/lib/utils"

// Context to manage tab state
type TabsContextType = {
  selectedTab: string
  setSelectedTab: (id: string) => void
  registerTab: (id: string, label: string) => void
  tabsIds: string[]
  tabsLabels: Record<string, string>
}

const TabsContext = createContext<TabsContextType | null>(null)

export function useTabs() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a TabsProvider")
  }
  return context
}

// Main Tabs container
interface TabsProps {
  selectedTab: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  id?: string
}

export function AnimatedTabs({ selectedTab, onValueChange, children, className, id = "tabs" }: TabsProps) {
  const [tabsIds, setTabsIds] = useState<string[]>([])
  const [tabsLabels, setTabsLabels] = useState<Record<string, string>>({})

  // Handle external value changes
  const handleTabChange = useCallback(
    (value: string) => {
      if (onValueChange) {
        onValueChange(value)
      }
    },
    [onValueChange],
  )

  // Register a new tab
  const registerTab = useCallback((id: string, label: string) => {
    setTabsIds((prev) => {
      if (!prev.includes(id)) {
        return [...prev, id]
      }
      return prev
    })
    setTabsLabels((prev) => ({ ...prev, [id]: label }))
  }, [])

  // Ensure a tab is selected when tabs are registered
  useEffect(() => {
    if (tabsIds.length > 0 && (!selectedTab || !tabsIds.includes(selectedTab))) {
      // If no tab is selected or the selected tab is not in the list, select the first tab
      handleTabChange(tabsIds[0])
    }
  }, [tabsIds, selectedTab, handleTabChange])

  return (
    <TabsContext.Provider
      value={{
        selectedTab,
        setSelectedTab: handleTabChange,
        registerTab,
        tabsIds,
        tabsLabels,
      }}
    >
      <MotionConfig reducedMotion="user">
        <div className={cn("w-full", className)} id={id}>
          {children}
        </div>
      </MotionConfig>
    </TabsContext.Provider>
  )
}

// TabsList component
interface TabsListProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "underline" | "pills"
}

export function AnimatedTabsList({ children, className, variant = "default" }: TabsListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const { selectedTab, setSelectedTab, tabsIds } = useTabs()

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = tabsIds.indexOf(selectedTab)

    if (e.key === "ArrowRight") {
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % tabsIds.length
      setSelectedTab(tabsIds[nextIndex])
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      const prevIndex = (currentIndex - 1 + tabsIds.length) % tabsIds.length
      setSelectedTab(tabsIds[prevIndex])
    }
  }

  const variantClasses = {
    default:
      "bg-gradient-to-br from-secondary/90 to-secondary/80 border border-primary/20 dark:from-gray-800/90 dark:to-gray-900 dark:border-amber-600/40 p-1 rounded-lg shadow-lg",
    underline: "border-b border-primary/20 dark:border-amber-600/40",
    pills: "bg-transparent gap-2",
  }

  return (
    <div className="relative mb-2 p-1 rounded-lg ">
      <div
        className="absolute inset-0 bg-gradient-to-r from-amber-400 via-red-500 to-amber-600 rounded-lg opacity-30 dark:opacity-50"
        style={{ filter: "blur(8px)" }}
        aria-hidden="true"
      ></div>
      <div
        ref={listRef}
        role="tablist"
        className={cn(
          "relative [&>*]:hover:bg-amber-100/50 [&>*]:hover:text-amber-700 grid grid-flow-col auto-cols-fr text-center overflow-hidden w-full [&>*]:cursor-pointer",
          variantClasses[variant],
          className,
        )}
        onKeyDown={handleKeyDown}
        aria-label="Song selection tabs"
      >
        {children}
      </div>
    </div>
  )
}

// Tab component
interface TabProps {
  id: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
  icon?: React.ReactNode
}

export function AnimatedTab({ id, children, className, disabled = false, icon }: TabProps) {
  const { selectedTab, setSelectedTab, registerTab, tabsIds } = useTabs()
  const isSelected = id === selectedTab
  const defaultValue = tabsIds[0]

  // Register this tab with the context
  useEffect(() => {
    const label = typeof children === "string" ? children : id
    registerTab(id, label)
  }, [id, children, registerTab])

  useEffect(() => {
    // If this is the default tab and no tab is currently selected, select it
    if (id === defaultValue && !selectedTab) {
      setSelectedTab(id)
    }
  }, [id, defaultValue, selectedTab, setSelectedTab])

  return (
    <motion.button
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-selected={isSelected}
      aria-controls={`tabpanel-${id}`}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setSelectedTab(id)}
      className={cn(
        "relative py-2 px-3 rounded-md font-medium transition-all duration-300 ease-in-out outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>

      {/* Active indicator */}
      {isSelected && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-500 
          dark:from-amber-600 dark:to-amber-700 rounded-md"
          initial={false}
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          style={{ zIndex: -1 }}
        />
      )}

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-primary/10 dark:bg-amber-500/20 rounded-md pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: disabled ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}

// TabsContent component
interface TabsContentProps {
  id: string
  children: React.ReactNode
  className?: string
  forceMount?: boolean
}

export function AnimatedTabsContent({ id, children, className, forceMount = false }: TabsContentProps) {
  const { selectedTab } = useTabs()
  const isSelected = selectedTab === id

  // If forceMount is true, render the content but hide it
  if (forceMount) {
    return (
      <div
        role="tabpanel"
        id={`tabpanel-${id}`}
        aria-labelledby={`tab-${id}`}
        hidden={!isSelected}
        className={cn("outline-none", className)}
        tabIndex={0}
      >
        {children}
      </div>
    )
  }

  // Otherwise, only render when selected
  return (
    <AnimatePresence mode="wait" initial={false}>
      {isSelected && (
        <motion.div
          key={id}
          role="tabpanel"
          id={`tabpanel-${id}`}
          aria-labelledby={`tab-${id}`}
          className={cn("outline-none min-h-[50px]", className)}
          tabIndex={0}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

