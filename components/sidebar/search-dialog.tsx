"use client"

import * as React from "react"
import { Command } from "cmdk"
import { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Clock,
  Compass,
  FileText,
  Flame,
  Home,
  Layers,
  Search,
  Settings,
  Star,
  Users,
  Zap,
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
  onNavigate: (href: string, parentHref?: string) => void
}

type CategoryType = "all" | "pages" | "recent" | "favorites"

type SearchItem = {
  title: string
  href: string
  parent?: string
  parentHref?: string
  icon?: React.ComponentType<{ className?: string }> | LucideIcon
  color?: string
  bgColor?: string
}

export function SearchDialog({ isOpen, onClose, navigationItems, onNavigate }: SearchDialogProps) {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState<CategoryType>("all")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  // [todo:]store Recent searches in in localStorage
  const recentSearches: SearchItem[] = React.useMemo(
    () => [
      { title: "Calculus Overview", href: "/calculus", parent: "Calculus" },
      { title: "AI Overview", href: "/ai", parent: "AI" },
    ],
    [],
  )

  // Favorites (would normally be stored in user preferences)
  const favorites: SearchItem[] = React.useMemo(
    () => [
      { title: "Calculus Overview", href: "/calculus", parent: "Calculus" },
      { title: "AI Overview", href: "/ai", parent: "AI" },
    ],
    [],
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
    let results = allItems

    if (search) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.parent && item.parent.toLowerCase().includes(search.toLowerCase())),
      )
    }

    if (category === "recent") {
      return recentSearches
    }

    if (category === "favorites") {
      return favorites
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
        onNavigate(selectedItem.href, selectedItem.parentHref ?? undefined)
        onClose()
      }
    },
    [filteredItems, selectedIndex, onNavigate, onClose],
  )

  // Get icon for result
  const getIconForResult = (item: SearchItem): LucideIcon => {
    if (item.icon && typeof item.icon !== 'string') {
      return item.icon as LucideIcon
    }

    if (item.href.includes("dashboard")) return Home
    if (item.href.includes("project")) return Layers
    if (item.href.includes("team")) return Users
    if (item.href.includes("performance")) return Zap
    if (item.href.includes("settings")) return Settings

    return FileText
  }

  // Get color for result
  const getColorForResult = (item: (typeof filteredItems)[0]) => {
    if (item.color) return item.color

    if (item.href.includes("dashboard")) return "text-pink-500"
    if (item.href.includes("project")) return "text-violet-500"
    if (item.href.includes("team")) return "text-blue-500"
    if (item.href.includes("performance")) return "text-amber-500"
    if (item.href.includes("settings")) return "text-emerald-500"

    return "text-gray-500"
  }

  // Get background color for result
  const getBgColorForResult = (item: (typeof filteredItems)[0]) => {
    if (item.bgColor) return item.bgColor

    if (item.href.includes("dashboard")) return "bg-pink-500/10"
    if (item.href.includes("project")) return "bg-violet-500/10"
    if (item.href.includes("team")) return "bg-blue-500/10"
    if (item.href.includes("performance")) return "bg-amber-500/10"
    if (item.href.includes("settings")) return "bg-emerald-500/10"

    return "bg-gray-500/10"
  }

  // Define renderSearchItem function before using it
  const renderSearchItem = (item: (typeof filteredItems)[0], index: number) => {
    const Icon = getIconForResult(item as SearchItem)
    const color = getColorForResult(item)
    const bgColor = getBgColorForResult(item)

    return (
      <Command.Item
        key={item.href}
        value={item.href}
        onSelect={() => {
          onNavigate(item.href, item.parentHref)
          onClose()
        }}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
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
          {category === "favorites" && <Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />}
          <div className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Command.Item>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl overflow-hidden gap-0 border-none shadow-2xl">
        <Command
          className="flex flex-col h-[80vh] max-h-[600px] rounded-xl border bg-background shadow-xl"
          onKeyDown={handleKeyDown}
        >
          <div className="border-b px-3">
            <div className="flex items-center gap-2 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Command.Input
                ref={inputRef}
                value={search}
                onValueChange={setSearch}
                placeholder="Search for pages, features, or help..."
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex items-center gap-1">
                <SearchShortcut keys={["ESC"]} />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="border-b px-2 py-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <SearchCategory
                title="All"
                count={allItems.length}
                color="bg-primary"
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

          <Command.List className="flex-1 overflow-y-auto p-2">
            {filteredItems.length === 0 && search && (
              <Command.Empty>
                <SearchEmptyState />
              </Command.Empty>
            )}

            {filteredItems.length === 0 && !search && (
              <div className="p-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Compass className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Search for anything</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start typing to search across pages, settings, and more
                </p>
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground">Try searching for</div>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {[
                      "Calculus",
                      "AI",
                      "Hadestown",
                      "Binary",
                      "Infinity",
                    ].map((suggestion) => (
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
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Recent Searches</span>
                      </div>
                    }
                  >
                    {filteredItems.map((item, index) => renderSearchItem(item, index))}
                  </Command.Group>
                )}

                {category === "favorites" && (
                  <Command.Group
                    heading={
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>Favorites</span>
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
          <div className="border-t px-3 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
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
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>
                  Pro Tip: Press <SearchShortcut keys={["/"]} /> anywhere to open search
                </span>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
