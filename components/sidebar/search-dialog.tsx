"use client"

import { useState, useCallback, useEffect, useRef, useMemo, type ElementType } from "react"
import Link from "next/link"
import { Command } from "cmdk"
import { Compass, Flame, Search, Star, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { SearchEmptyState } from "./search-dialog/search-empty-state"
import { SearchShortcut } from "./search-dialog/search-shortcut"
import { routes } from "@/lib/routes"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: {
    title: string
    href: string
    icon?: ElementType
    color: string
    bgColor: string
    children?: { title: string; href: string }[]
  }[]
  onNavigate: (href: string, parentHref?: string, shouldNavigate?: boolean) => void
  isMobile?: boolean
  isMobileOpen?: boolean
  setIsMobileOpen?: (open: boolean) => void
  setIsSearchOpen?: (open: boolean) => void
}


type SearchItem = {
  title: string
  href: string
  parent?: string
  parentHref?: string
  icon?: ElementType
  color?: string
  bgColor?: string
}

export function SearchDialog({
  isOpen,
  onClose,
  onNavigate,
}: SearchDialogProps) {
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Recent searches stored in localStorage
  const [recentSearches, setRecentSearches] = useState<
    Array<{
      title: string
      href: string
      parent?: string
      parentHref?: string
    }>
  >([])

  // Favorites (would normally be stored in user preferences)
  const [favorites, setFavorites] = useState<
    Array<{
      title: string
      href: string
      parent?: string
      parentHref?: string
    }>
  >([])

  // Flatten routes for search - use routes.ts data directly
  const allItems = useMemo(() => {
    const items: SearchItem[] = []

    routes.forEach((route) => {
      if (route.children) {
        // Add all children with parent info
        route.children.forEach((child) => {
          items.push({
            title: child.title,
            href: child.href,
            parent: route.title,
            parentHref: route.href,
            icon: child.icon,
            color: child.color,
            bgColor: child.bgColor,
          })
        })
      } else {
        // For items without children, add them directly
        items.push({
          title: route.title,
          href: route.href,
          icon: route.icon,
          color: route.color,
          bgColor: route.bgColor,
        })
      }
    })

    return items
  }, [])

  // Add validation function before the useEffects
  const isValidNavigationItem = useCallback(
    (item: { href: string }) => {
      // Check if the href exists in the current navigation structure
      return allItems.some((navItem) => navItem.href === item.href)
    },
    [allItems]
  )

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const storedSearches = localStorage.getItem("recentSearches")
      if (storedSearches) {
        const parsedSearches = JSON.parse(storedSearches)
        // Filter out invalid navigation items
        const validSearches = parsedSearches.filter(isValidNavigationItem)
        setRecentSearches(validSearches)
        // Update localStorage if items were filtered out
        if (validSearches.length !== parsedSearches.length) {
          localStorage.setItem("recentSearches", JSON.stringify(validSearches))
        }
      }
    } catch (error) {
      console.error("Error loading recent searches:", error)
    }
  }, [isValidNavigationItem])

  // Add this useEffect to load favorites from localStorage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites)
        // Filter out invalid navigation items
        const validFavorites = parsedFavorites.filter(isValidNavigationItem)
        setFavorites(validFavorites)
        // Update localStorage if items were filtered out
        if (validFavorites.length !== parsedFavorites.length) {
          localStorage.setItem("favorites", JSON.stringify(validFavorites))
        }
      } else {
        // Set default favorites if none exist
        const defaultFavorites = [
          { title: "Home", href: "/", parent: "Main", parentHref: "/" },
          { title: "Calculus Overview", href: "/calculus", parent: "Calculus", parentHref: "/calculus" },
          { title: "Hadestown", href: "/hadestown", parent: "Main", parentHref: "/hadestown" },
        ].filter(isValidNavigationItem) // Also validate default favorites
        setFavorites(defaultFavorites)
        localStorage.setItem("favorites", JSON.stringify(defaultFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }, [isValidNavigationItem])

  // Function to add a search to recent searches
  const addToRecentSearches = useCallback(
    (item: {
      title: string
      href: string
      parent?: string
      parentHref?: string
    }) => {
      setRecentSearches((prev) => {
        // Remove the item if it already exists to avoid duplicates
        const filtered = prev.filter((search) => search.href !== item.href)

        // Add the new item at the beginning and limit to 5 items
        const updated = [item, ...filtered].slice(0, 5)

        // Save to localStorage
        try {
          localStorage.setItem("recentSearches", JSON.stringify(updated))
        } catch (error) {
          console.error("Error saving recent searches:", error)
        }

        return updated
      })
    },
    [],
  )

  // Add this function to toggle favorites
  const toggleFavorite = useCallback(
    (item: {
      title: string
      href: string
      parent?: string
      parentHref?: string
    }) => {
      setFavorites((prev) => {
        // Check if the item is already in favorites
        const isFavorite = prev.some((fav) => fav.href === item.href)

        let updated
        if (isFavorite) {
          // Remove from favorites
          updated = prev.filter((fav) => fav.href !== item.href)
        } else {
          // Add to favorites
          updated = [...prev, item]
        }

        // Save to localStorage
        try {
          localStorage.setItem("favorites", JSON.stringify(updated))
        } catch (error) {
          console.error("Error saving recent searches:", error)
        }

        return updated
      })
    },
    [],
  )

  // Add this function to check if an item is a favorite
  const isFavorite = useCallback(
    (href: string) => {
      return favorites.some((fav) => fav.href === href)
    },
    [favorites],
  )

  // Modern search: show recent/favorites when empty, filter all items when typing
  const filteredItems = useMemo(() => {
    // If showing favorites only
    if (showFavoritesOnly) {
      if (!search.trim()) {
        return favorites
      }
      // Filter favorites by search
      const searchLower = search.toLowerCase()
      return favorites.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.href.toLowerCase().includes(searchLower) ||
          (item.parent && item.parent.toLowerCase().includes(searchLower))
      )
    }

    if (!search.trim()) {
      // When no search, show recent searches if any, otherwise show favorites, otherwise show all
      if (recentSearches.length > 0) {
        return recentSearches.slice(0, 5) // Limit recent items
      }
      if (favorites.length > 0) {
        return favorites.slice(0, 8) // Show some favorites
      }
      return allItems.slice(0, 10) // Show some top items
    }

    // When searching, filter all items by title, href, and parent
    const searchLower = search.toLowerCase()
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.href.toLowerCase().includes(searchLower) ||
        (item.parent && item.parent.toLowerCase().includes(searchLower))
    )
  }, [allItems, search, recentSearches, favorites, showFavoritesOnly])

  // Dynamic suggestions from routes
  const suggestions = useMemo(() => {
    return routes.map(route => route.title)
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setSearch("")
      setSelectedIndex(0)
      setShowFavoritesOnly(false)
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault()
        const selectedItem = filteredItems[selectedIndex]
        // Add to recent searches first
        addToRecentSearches({
          title: selectedItem.title,
          href: selectedItem.href,
          parent: selectedItem.parent,
          parentHref: selectedItem.parentHref,
        })

        // Close the dialog first
        onClose()

        // Navigate directly using window.location for keyboard navigation
        setTimeout(() => {
          window.location.href = selectedItem.href
        }, 100)
      }
    },
    [filteredItems, selectedIndex, onClose, addToRecentSearches],
  )


  // Define renderSearchItem function before using it
  const renderSearchItem = (item: SearchItem, index: number) => {
    const Icon = item.icon || Compass
    const color = item.color || "text-teal-500"
    const bgColor = item.bgColor || "bg-teal-500/10"

    const itemContent = (
      <>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", bgColor)}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{item.title}</span>
            {isFavorite(item.href) && (
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
            )}
          </div>
          {item.parent && (
            <p className="text-xs text-muted-foreground truncate">
              {/* {item.parent} */}
              {item.href.split("/").slice(1).join("/")}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite({
              title: item.title,
              href: item.href,
              parent: item.parent,
              parentHref: item.parentHref,
            })
          }}
          className={cn(
            "p-1 rounded transition-colors",
            isFavorite(item.href)
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Star className={cn("h-3 w-3", isFavorite(item.href) && "fill-current")} />
        </button>
      </>
    )

    // All items navigate consistently - no special parent category behavior
    return (
      <Command.Item
        key={item.href}
        value={item.href}
        asChild
        className={cn(
          "flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors",
          selectedIndex === index && "bg-teal-500/10 text-teal-600 ring-teal-500 focus:ring-teal-500",
          "hover:bg-sky-500/10 translate-x-1 my-1"
        )}
      >
        <Link
          href={item.href}
          onClick={() => {
            // Add to recent searches
            addToRecentSearches({
              title: item.title,
              href: item.href,
              parent: item.parent,
              parentHref: item.parentHref,
            })
            onNavigate(item.href, item.parentHref, true)
          }}
        >
          {itemContent}
        </Link>
      </Command.Item>
    )
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden gap-0 border-none shadow-2xl z-[200] rounded-xl">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command
          className="flex flex-col h-[80vh] max-h-[90vh] md:max-h-[600px] rounded-xl border bg-background shadow-xl overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <div className="border-b px-4 relative">
            <div className="flex items-center gap-3 py-3">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Command.Input
                ref={inputRef}
                value={search}
                onValueChange={setSearch}
                placeholder={showFavoritesOnly ? "Search favorites..." : "Search..."}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none ring-0 focus:ring-0 focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={cn(
                  "rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
                  showFavoritesOnly
                    ? "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/80 ring-yellow-500 focus:ring-yellow-500 "
                    : "bg-teal-500/10 text-teal-600 hover:bg-teal-500/50 hover:scale-105"
                )}
                aria-label={showFavoritesOnly ? "Show all items" : "Show favorites only"}
              >
                <Star className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
              </button>
              <button
                onClick={onClose}
                className="rounded-full w-8 h-8 flex items-center justify-center 
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                bg-teal-500/10 text-teal-600 hover:bg-teal-500/50 hover:scale-105
                "
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>


          <Command.List className="flex-1 overflow-y-auto p-3">
            {filteredItems.length === 0 && search && (
              <Command.Empty>
                <SearchEmptyState />
              </Command.Empty>
            )}

            {filteredItems.length === 0 && !search && (
              <div className="p-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/70">
                  {showFavoritesOnly ? (
                    <Star className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Compass className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-lg font-medium">
                  {showFavoritesOnly ? "No favorites yet" : "Search for anything"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {showFavoritesOnly
                    ? "Star items to add them to your favorites"
                    : "Start typing to search across pages, settings, and more"
                  }
                </p>
                {!showFavoritesOnly && (
                  <div className="mt-4">
                    <div className="text-xs text-muted-foreground">Try searching for</div>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          className="rounded-full border px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setSearch(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {filteredItems.length > 0 && (
              <>
                <Command.Group>
                  {filteredItems.map((item, index) => renderSearchItem(item, index))}
                </Command.Group>
              </>
            )}
          </Command.List>

          {/* Footer with keyboard shortcuts */}
          <div className="border-t px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="flex items-center gap-1">
                  <SearchShortcut keys={["↑"]} />
                  <SearchShortcut keys={["↓"]} />
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <SearchShortcut keys={["Enter"]} />
                  <span>Select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* <span className=""> */}
                  <span className="flex items-center gap-1">
                    {/* <Flame className="h-4 w-4 text-amber-500" /> */}
                    <SearchShortcut keys={["⌘", "K"]} />
                  </span>
                  Open Search
                {/* </span> */}
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
