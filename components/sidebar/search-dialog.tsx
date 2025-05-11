"use client"

import * as React from "react"
import { Command } from "cmdk"
import {
  ArrowRight,
  Clock,
  Compass,
  FileText,
  Flame,
  Home,
  Search,
  Star,
  X,
  Brain,
  Binary,
  Sparkles,
  Infinity as InfinityIcon,
  ChartNoAxesCombined as ChartNoAxesCombinedIcon,
  LucideIcon,
} from "lucide-react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { SearchCategory } from "./search-dialog/search-category"
import { SearchEmptyState } from "./search-dialog/search-empty-state"
import { SearchResultIcon } from "./search-dialog/search-result-icon"
import { SearchShortcut } from "./search-dialog/search-shortcut"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: {
    title: string
    href: string
    icon: React.ElementType
    color: string
    bgColor: string
    children?: { title: string; href: string }[]
  }[]
  onNavigate: (href: string, parentHref?: string, isParentWithChildren?: boolean, shouldNavigate?: boolean) => void
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
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState<CategoryType>("all")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  // Recent searches stored in localStorage
  const [recentSearches, setRecentSearches] = React.useState<
    Array<{
      title: string
      href: string
      parent?: string
      parentHref?: string
    }>
  >([])

  // Load recent searches from localStorage on mount
  React.useEffect(() => {
    try {
      const storedSearches = localStorage.getItem("recentSearches")
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches))
      }
    } catch (error) {
      console.error("Error loading recent searches:", error)
    }
  }, [])

  // Function to add a search to recent searches
  const addToRecentSearches = React.useCallback(
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

  // Favorites (would normally be stored in user preferences)
  const [favorites, setFavorites] = React.useState<
    Array<{
      title: string
      href: string
      parent?: string
      parentHref?: string
    }>
  >([])

  // Add this useEffect to load favorites from localStorage
  React.useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      } else {
        // Set default favorites if none exist
        const defaultFavorites = [
          { title: "Home", href: "/", parent: "Main", parentHref: "/" },
          { title: "Calculus Overview", href: "/calculus", parent: "Calculus", parentHref: "/calculus" },
          { title: "Hadestown", href: "/hadestown", parent: "Main", parentHref: "/hadestown" },
        ]
        setFavorites(defaultFavorites)
        localStorage.setItem("favorites", JSON.stringify(defaultFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }, [])

  // Add this function to toggle favorites
  const toggleFavorite = React.useCallback(
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
  const isFavorite = React.useCallback(
    (href: string) => {
      return favorites.some((fav) => fav.href === href)
    },
    [favorites],
  )

  // Flatten navigation items for search
  const allItems = React.useMemo(() => {
    const items: {
      title: string
      href: string
      parent?: string
      parentHref?: string
      icon?: React.ElementType
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

  // Filter items based on search and category
  const filteredItems = React.useMemo(() => {
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

  // Focus input when dialog opens
  React.useEffect(() => {
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
  const handleKeyDown = React.useCallback(
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
        onNavigate(selectedItem.href, selectedItem.parentHref)
        onClose()
      }
    },
    [filteredItems, selectedIndex, onNavigate, onClose],
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

    return (
      <Command.Item
        key={item.href}
        value={item.href}
        onSelect={() => {
          // When an item is selected, ensure we pass both the href and parentHref
          onNavigate(item.href, item.parentHref)

          // Add to recent searches
          addToRecentSearches({
            title: item.title,
            href: item.href,
            parent: item.parent,
            parentHref: item.parentHref,
          })

          console.log("Added to recent searches:", item.title)

          // If we're not already in the recent category, switch to it to show the updated list
          if (category !== "recent") {
            setCategory("recent")
            // Don't close the dialog so user can see the updated recents
            return
          }

          onClose()
        }}
        className={cn(
          "flex cursor-pointer items-center gap-2 sm:gap-3 rounded-md px-2 sm:px-3 py-3 sm:py-2.5 text-sm transition-colors group",
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
          selectedIndex === index && "bg-accent text-accent-foreground",
        )}
      >
        <SearchResultIcon icon={Icon} color={color} bgColor={bgColor} />
        <div className="flex flex-col">
          <div className="font-medium">{item.title}</div>
          {item.parent && <div className="text-xs text-muted-foreground">{item.parent}</div>}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite({
                title: item.title,
                href: item.href,
                parent: item.parent,
                parentHref: item.parentHref,
              })
            }}
            className="opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 transition-opacity"
            aria-label={isFavorite(item.href) ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isFavorite(item.href) ? "text-amber-500 fill-amber-500" : "text-muted-foreground hover:text-amber-500",
              )}
            />
          </button>
          <div className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Command.Item>
    )
  }

  const clearRecentSearches = React.useCallback(() => {
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
                    {["Home", "Calculus", "Hadestown", "Infinity", "Binary", "AI"].map((suggestion) => (
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
                  Pro Tip: Press <SearchShortcut keys={["/"]} /> anywhere to open search
                </span>
                <span className="sm:hidden">Press / to search</span>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
