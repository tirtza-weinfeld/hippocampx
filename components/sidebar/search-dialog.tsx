"use client"

import { useState, useCallback, useEffect, useRef, useMemo, type ElementType } from "react"
import Link from "next/link"
import { Command } from "cmdk"
import {Clock, Compass,FileText,Flame,Home,Search,Star,X,Brain,Binary,Sparkles,Infinity as InfinityIcon,ChartNoAxesCombined as ChartNoAxesCombinedIcon,LucideIcon} from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { SearchCategory } from "./search-dialog/search-category"
import { SearchEmptyState } from "./search-dialog/search-empty-state"
import { SearchShortcut } from "./search-dialog/search-shortcut"
import { routes } from "@/lib/routes"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: {
    title: string
    href: string
    icon: ElementType
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

type CategoryType = "all" | "pages" | "recent" | "favorites"

type SearchItem = {
  title: string
  href: string
  parent?: string
  parentHref?: string
  icon?: LucideIcon
  color?: string
  bgColor?: string
}

export function SearchDialog({
  isOpen,
  onClose,
  navigationItems,
  onNavigate,
}: SearchDialogProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<CategoryType>("all")
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  // Flatten navigation items for search
  const allItems = useMemo(() => {
    const items: {
      title: string
      href: string
      parent?: string
      parentHref?: string
      icon?: ElementType
      color?: string
      bgColor?: string
    }[] = []

    navigationItems.forEach((item) => {
      // Don't add parent items directly since they're just containers now
      // Instead, add the Overview page which represents the parent section
      if (item.children) {
        const overviewPage = item.children.find((child) => child.title === "Overview")
        if (overviewPage) {
          items.push({
            title: `${item.title} Overview`,
            href: overviewPage.href,
            icon: item.icon,
            color: item.color,
            bgColor: item.bgColor,
          })
        }

        // Add all children (except Overview which we already added)
        item.children.forEach((child) => {
          if (child.title !== "Overview") {
            items.push({
              title: child.title,
              href: child.href,
              parent: item.title,
              parentHref: item.href,
              icon: item.icon,
              color: item.color,
              bgColor: item.bgColor,
            })
          }
        })
      } else {
        // For items without children, add them directly
        items.push({
          title: item.title,
          href: item.href,
          icon: item.icon,
          color: item.color,
          bgColor: item.bgColor,
        })
      }
    })

    return items
  }, [navigationItems])

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

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    if (category === "recent") {
      // For recent searches, we still want to apply the search filter
      return search
        ? recentSearches.filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              (item.parent && item.parent.toLowerCase().includes(search.toLowerCase())),
          )
        : recentSearches
    }

    if (category === "favorites") {
      return search
        ? favorites.filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              (item.parent && item.parent.toLowerCase().includes(search.toLowerCase())),
          )
        : favorites
    }

    // For "all" and other categories
    let results = allItems
    if (search) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.parent && item.parent.toLowerCase().includes(search.toLowerCase())),
      )
    }

    return results
  }, [allItems, search, category, recentSearches, favorites])

  // Dynamic suggestions from routes
  const suggestions = useMemo(() => {
    return routes.map(route => route.title)
  }, [])

  // Helper function to determine if an item is a parent category
  const isParentCategory = useCallback((href: string) => {
    return routes.some(route => route.href === href && route.children && route.children.length > 0)
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setSearch("")
      setCategory("all")
      setSelectedIndex(0)
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
        const isParent = isParentCategory(selectedItem.href)

        if (isParent) {
          // For parent categories, add to search instead of navigating
          setSearch(selectedItem.title)
        } else {
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
      }
    },
    [filteredItems, selectedIndex, onClose, addToRecentSearches, isParentCategory, setSearch],
  )

  // Get icon for result
  const getIconForResult = (item: SearchItem) => {
    if (item.icon) {
      return item.icon
    }

    if (item.href.includes("home")) return Home
    if (item.href.includes("calculus")) return ChartNoAxesCombinedIcon
    if (item.href.includes("hadestown")) return Sparkles
    if (item.href.includes("infinity")) return InfinityIcon
    if (item.href.includes("binary")) return Binary
    if (item.href.includes("ai")) return Brain

    return FileText
  }

  // Get color for result
  const getColorForResult = (item: SearchItem) => {
    if (item.color) return item.color

    if (item.href.includes("calculus")) return "text-blue-500"
    if (item.href.includes("hadestown")) return "text-green-500"
    if (item.href.includes("infinity")) return "text-yellow-500"
    if (item.href.includes("binary")) return "text-violet-500"
    if (item.href.includes("ai")) return "text-blue-500"

    return "text-gray-500"
  }

  // Get background color for result
  const getBgColorForResult = (item: SearchItem) => {
    if (item.bgColor) return item.bgColor

    if (item.href.includes("calculus")) return "bg-blue-500/10"
    if (item.href.includes("hadestown")) return "bg-green-500/10"
    if (item.href.includes("infinity")) return "bg-yellow-500/10"
    if (item.href.includes("binary")) return "bg-violet-500/10"
    if (item.href.includes("ai")) return "bg-blue-500/10"

    return "bg-gray-500/10"
  }

  // Define renderSearchItem function before using it
  const renderSearchItem = (item: SearchItem, index: number) => {
    const Icon = getIconForResult(item)
    const color = getColorForResult(item)
    const bgColor = getBgColorForResult(item)
    const isParent = isParentCategory(item.href)

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
              {item.parent}
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

    if (isParent) {
      // For parent categories, use a button that adds to search
      return (
        <Command.Item
          key={item.href}
          value={item.href}
          onSelect={() => {
            // Add parent title to search instead of navigating
            setSearch(item.title)
          }}
          className={cn(
            "flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors",
            selectedIndex === index
              ? "bg-accent text-accent-foreground"
              : "hover:bg-muted/50"
          )}
        >
          {itemContent}
        </Command.Item>
      )
    } else {
      // For actual pages, use Link with proper navigation
      return (
        <Command.Item
          key={item.href}
          value={item.href}
          asChild
          className={cn(
            "flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors",
            selectedIndex === index
              ? "bg-accent text-accent-foreground"
              : "hover:bg-muted/50"
          )}
        >
          <Link
            href={item.href}
            onClick={() => {
              // Add to recent searches
              // addToRecentSearches({
              //   title: item.title,
              //   href: item.href,
              //   parent: item.parent,
              //   parentHref: item.parentHref,
              // })

              // Close the dialog
              // onClose()
              onNavigate(item.href, item.parentHref, true)
            }}
          >
            {itemContent}
          </Link>
        </Command.Item>
      )
    }
  }

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    try {
      localStorage.removeItem("recentSearches")
    } catch (error) {
      console.error("Error clearing recent searches:", error)
    }
  }, [])

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
                placeholder="Search..."
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none ring-0 focus:ring-0 focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="border-b px-3 py-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <SearchCategory
                title="All"
                count={allItems.length}
                color="bg-teal-500"
                isActive={category === "all"}
                onClick={() => setCategory("all")}
              />
              <SearchCategory
                title="Pages"
                count={allItems.filter((item) => !item.parent).length}
                color="bg-violet-500"
                isActive={category === "pages"}
                onClick={() => setCategory("pages")}
              />
              <SearchCategory
                title="Recent"
                count={recentSearches.length}
                color="bg-blue-500"
                isActive={category === "recent"}
                onClick={() => setCategory("recent")}
              />
              <SearchCategory
                title="Favorites"
                count={favorites.length}
                color="bg-amber-500"
                isActive={category === "favorites"}
                onClick={() => setCategory("favorites")}
              />
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
                  <Compass className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Search for anything</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start typing to search across pages, settings, and more
                </p>
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
              </div>
            )}

            {filteredItems.length > 0 && (
              <>
                {category === "recent" && (
                  <Command.Group
                    heading={
                      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Recent Searches</span>
                        </div>
                        {recentSearches.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              clearRecentSearches()
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    }
                  >
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item, index) => renderSearchItem(item, index))
                    ) : (
                      <div className="px-2 py-3 text-sm text-muted-foreground">No recent searches</div>
                    )}
                  </Command.Group>
                )}

                {category === "favorites" && (
                  <Command.Group
                    heading={
                      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          <span>Favorites</span>
                        </div>
                        {favorites.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setFavorites([])
                              try {
                                localStorage.removeItem("favorites")
                              } catch (error) {
                                console.error("Error clearing favorites:", error)
                              }
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    }
                  >
                    {filteredItems.map((item, index) => renderSearchItem(item, index))}
                  </Command.Group>
                )}

                {category !== "recent" && category !== "favorites" && (
                  <Command.Group>{filteredItems.map((item, index) => renderSearchItem(item, index))}</Command.Group>
                )}
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
                <Flame className="h-4 w-4 text-amber-500" />
                <span className="hidden sm:inline">
                  Pro Tip: Press <SearchShortcut keys={["⌘", "K"]} /> anywhere to open search
                </span>
                <span className="sm:hidden">Press ⌘K to search</span>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
