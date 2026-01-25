"use client"

import { useState } from "react"
import Link from "next/link"
import { Command } from "cmdk"
import { Compass, Search, Star, X, ArrowDownAZ, Clock, GripVertical } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { SearchEmptyState } from "./search-dialog/search-empty-state"
import { SearchShortcut } from "./search-dialog/search-shortcut"
import { routes } from "@/lib/routes"
import { SortableList } from "@/components/ui/sortable-list"
import { Route } from "next"
import { useShallow } from "zustand/shallow"
import { useSearchStore, type SearchItem, type FavoriteItem } from "./search-dialog/use-search-store"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (href: string, parentHref?: string, shouldNavigate?: boolean) => void
}

// Build allItems from routes - outside component to avoid recreation
const allItems: SearchItem[] = routes.flatMap((route) =>
  route.children
    ? route.children.map((child) => ({
        title: child.title,
        href: child.href,
        parent: route.title,
        parentHref: route.href,
        icon: child.icon,
        color: child.color,
        bgColor: child.bgColor,
      }))
    : [{
        title: route.title,
        href: route.href,
        icon: route.icon,
        color: route.color,
        bgColor: route.bgColor,
      }]
)

const suggestions = routes.map(route => route.title)

export function SearchDialog({ isOpen, onClose, onNavigate }: SearchDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden gap-0 border-none shadow-2xl z-[200] rounded-xl">
        <DialogTitle className="sr-only">Search</DialogTitle>
        {/* Key resets SearchContent state when dialog reopens */}
        <SearchContent key={String(isOpen)} onClose={onClose} onNavigate={onNavigate} />
      </DialogContent>
    </Dialog>
  )
}

function SearchContent({ onClose, onNavigate }: { onClose: () => void; onNavigate: SearchDialogProps['onNavigate'] }) {
  const [search, setSearch] = useState("/")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const {
    favorites,
    recentSearches,
    showFavoritesOnly,
    favoritesSortOrder,
    toggleFavorite,
    addToRecentSearches,
    reorderFavorites,
    setShowFavoritesOnly,
    setFavoritesSortOrder,
    isFavorite,
    sortFavorites,
    enrichItemData,
  } = useSearchStore(
    useShallow((s) => ({
      favorites: s.favorites,
      recentSearches: s.recentSearches,
      showFavoritesOnly: s.showFavoritesOnly,
      favoritesSortOrder: s.favoritesSortOrder,
      toggleFavorite: s.toggleFavorite,
      addToRecentSearches: s.addToRecentSearches,
      reorderFavorites: s.reorderFavorites,
      setShowFavoritesOnly: s.setShowFavoritesOnly,
      setFavoritesSortOrder: s.setFavoritesSortOrder,
      isFavorite: s.isFavorite,
      sortFavorites: s.sortFavorites,
      enrichItemData: s.enrichItemData,
    }))
  )

  const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac')

  const getFilteredItems = (): SearchItem[] => {
    if (showFavoritesOnly) {
      const sortedFavorites = sortFavorites(favorites)
      if (!search.trim()) return sortedFavorites
      const searchLower = search.toLowerCase()
      return sortedFavorites.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.href.toLowerCase().includes(searchLower) ||
          (item.parent && item.parent.toLowerCase().includes(searchLower))
      )
    }

    if (!search.trim()) {
      if (recentSearches.length > 0) return recentSearches.slice(0, 5)
      if (favorites.length > 0) return sortFavorites(favorites).slice(0, 8)
      return allItems.slice(0, 10)
    }

    const searchLower = search.toLowerCase()
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.href.toLowerCase().includes(searchLower) ||
        (item.parent && item.parent.toLowerCase().includes(searchLower))
    )
  }

  const filteredItems = getFilteredItems()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault()
      const selectedItem = filteredItems[selectedIndex]
      addToRecentSearches({
        title: selectedItem.title,
        href: selectedItem.href,
        parent: selectedItem.parent,
        parentHref: selectedItem.parentHref,
      })
      onClose()
      setTimeout(() => { window.location.href = selectedItem.href }, 100)
    }
  }

  const cycleSortOrder = () => {
    const orders = ['date', 'alphabetical', 'custom'] as const
    const currentIndex = orders.indexOf(favoritesSortOrder)
    setFavoritesSortOrder(orders[(currentIndex + 1) % orders.length])
  }

  const renderSearchItem = (item: SearchItem, index: number) => {
    const enrichedItem = enrichItemData(item)
    const Icon = typeof enrichedItem.icon === 'function' ? enrichedItem.icon : Compass
    const color = enrichedItem.color || "text-teal-500"
    const bgColor = enrichedItem.bgColor || "bg-teal-500/10"
    const isItemFavorite = isFavorite(enrichedItem.href)

    return (
      <Command.Item
        key={enrichedItem.href}
        value={enrichedItem.href}
        asChild
        className={cn(
          "flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors",
          selectedIndex === index && "bg-teal-500/10 text-teal-600 ring-teal-500 focus:ring-teal-500",
          "hover:bg-sky-500/10 translate-x-1 my-1"
        )}
      >
        <Link
          href={enrichedItem.href as Route}
          onClick={() => {
            addToRecentSearches({
              title: enrichedItem.title,
              href: enrichedItem.href,
              parent: enrichedItem.parent,
              parentHref: enrichedItem.parentHref,
            })
            onNavigate(enrichedItem.href, enrichedItem.parentHref, true)
          }}
        >
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", bgColor)}>
            <Icon className={cn("h-5 w-5", color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{enrichedItem.title}</span>
              {isItemFavorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
            </div>
            {enrichedItem.parent && (
              <p className="text-xs text-muted-foreground truncate">
                {enrichedItem.href.split("/").slice(1).join("/")}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(enrichedItem)
            }}
            className={cn(
              "p-1 rounded transition-colors",
              isItemFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Star className={cn("h-3 w-3", isItemFavorite && "fill-current")} />
          </button>
        </Link>
      </Command.Item>
    )
  }

  return (
    <Command
      className="flex flex-col h-[80vh] max-h-[90vh] md:max-h-[600px] rounded-xl border bg-background shadow-xl overflow-hidden"
      onKeyDown={handleKeyDown}
    >
      <div className="border-b px-4 relative">
        <div className="flex items-center gap-3 py-3">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Command.Input
            autoFocus
            value={search}
            onValueChange={setSearch}
            placeholder={showFavoritesOnly ? "Search favorites..." : "Search..."}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none ring-0 focus:ring-0 focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          {showFavoritesOnly && (
            <button
              onClick={cycleSortOrder}
              className={cn(
                "rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
                "bg-teal-500/10 text-teal-600 hover:bg-teal-500/50 hover:scale-105"
              )}
              aria-label={`Sort by ${favoritesSortOrder}`}
              title={`Sort by ${favoritesSortOrder}`}
            >
              {favoritesSortOrder === 'date' && <Clock className="h-4 w-4" />}
              {favoritesSortOrder === 'alphabetical' && <ArrowDownAZ className="h-4 w-4" />}
              {favoritesSortOrder === 'custom' && <GripVertical className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              "rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
              showFavoritesOnly
                ? "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/80 ring-yellow-500 focus:ring-yellow-500"
                : "bg-teal-500/10 text-teal-600 hover:bg-teal-500/50 hover:scale-105"
            )}
            aria-label={showFavoritesOnly ? "Show all items" : "Show favorites only"}
          >
            <Star className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
          </button>
          <button
            onClick={onClose}
            className="rounded-full w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 bg-teal-500/10 text-teal-600 hover:bg-teal-500/50 hover:scale-105"
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
                : "Start typing to search across pages, settings, and more"}
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
            {showFavoritesOnly && favoritesSortOrder === 'custom' && !search.trim() ? (
              <SortableList
                items={filteredItems as FavoriteItem[]}
                onReorder={reorderFavorites}
                getItemId={(item) => item.href}
                showDragHandle={true}
              >
                {(item, index) => renderSearchItem(item, index)}
              </SortableList>
            ) : (
              <Command.Group>
                {filteredItems.map((item, index) => renderSearchItem(item, index))}
              </Command.Group>
            )}
          </>
        )}
      </Command.List>

      <div className="border-t px-4 py-3 hidden sm:block">
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
            <span className="flex items-center gap-1">
              <SearchShortcut keys={isMac ? ["⌘", "K"] : ["Ctrl", "K"]} />
            </span>
            Open Search
          </div>
        </div>
      </div>
    </Command>
  )
}
