import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { routes } from '@/lib/routes'
import type { ElementType } from 'react'

type SearchItem = {
  title: string
  href: string
  parent?: string
  parentHref?: string
  icon?: ElementType
  color?: string
  bgColor?: string
}

type FavoriteItem = SearchItem & {
  addedAt: number
  customOrder?: number
}

type RecentItem = {
  title: string
  href: string
  parent?: string
  parentHref?: string
}

type FavoritesSortOrder = 'date' | 'alphabetical' | 'custom'

type SearchState = {
  favorites: FavoriteItem[]
  recentSearches: RecentItem[]
  showFavoritesOnly: boolean
  favoritesSortOrder: FavoritesSortOrder
}

type SearchActions = {
  toggleFavorite: (item: SearchItem) => void
  addToRecentSearches: (item: RecentItem) => void
  reorderFavorites: (items: FavoriteItem[]) => void
  setShowFavoritesOnly: (show: boolean) => void
  setFavoritesSortOrder: (order: FavoritesSortOrder) => void
  isFavorite: (href: string) => boolean
  sortFavorites: (items: FavoriteItem[]) => FavoriteItem[]
  enrichItemData: (item: SearchItem) => SearchItem
}

const DEFAULT_FAVORITES: FavoriteItem[] = [
  { title: 'Home', href: '/', parent: 'Main', parentHref: '/', addedAt: Date.now(), customOrder: 0 },
]

// Build allItems from routes for icon enrichment
const getAllItems = (): SearchItem[] => {
  const items: SearchItem[] = []
  routes.forEach((route) => {
    if (route.children) {
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
}

const allItems = getAllItems()

export const useSearchStore = create<SearchState & SearchActions>()(
  persist(
    (set, get) => ({
      favorites: DEFAULT_FAVORITES,
      recentSearches: [],
      showFavoritesOnly: false,
      favoritesSortOrder: 'date',

      enrichItemData: (item: SearchItem): SearchItem => {
        const fullItem = allItems.find((ai) => ai.href === item.href)
        return fullItem ? { ...fullItem } : item
      },

      toggleFavorite: (item) => {
        set((state) => {
          const isFav = state.favorites.some((fav) => fav.href === item.href)
          if (isFav) {
            return { favorites: state.favorites.filter((fav) => fav.href !== item.href) }
          }
          const enrichedItem = get().enrichItemData(item)
          const newFavorite: FavoriteItem = {
            ...enrichedItem,
            addedAt: Date.now(),
            customOrder: state.favorites.length,
          }
          return { favorites: [...state.favorites, newFavorite] }
        })
      },

      addToRecentSearches: (item) => {
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s.href !== item.href)
          return { recentSearches: [item, ...filtered].slice(0, 5) }
        })
      },

      reorderFavorites: (items) => {
        const updatedItems = items.map((item, index) => ({
          ...item,
          customOrder: index,
        }))
        set({ favorites: updatedItems })
      },

      setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
      setFavoritesSortOrder: (order) => set({ favoritesSortOrder: order }),

      isFavorite: (href) => get().favorites.some((fav) => fav.href === href),

      sortFavorites: (items) => {
        const sorted = [...items]
        const order = get().favoritesSortOrder
        switch (order) {
          case 'date':
            return sorted.sort((a, b) => b.addedAt - a.addedAt)
          case 'alphabetical':
            return sorted.sort((a, b) => a.title.localeCompare(b.title))
          case 'custom':
            return sorted.sort((a, b) => (a.customOrder ?? 0) - (b.customOrder ?? 0))
          default:
            return sorted
        }
      },
    }),
    {
      name: 'search-storage',
      // Only persist serializable fields - icons are functions
      partialize: (state) => ({
        favorites: state.favorites.map(({ title, href, parent, parentHref, color, bgColor, addedAt, customOrder }) =>
          ({ title, href, parent, parentHref, color, bgColor, addedAt, customOrder })),
        recentSearches: state.recentSearches,
        showFavoritesOnly: state.showFavoritesOnly,
        favoritesSortOrder: state.favoritesSortOrder,
      }),
    }
  )
)

export type { SearchItem, FavoriteItem, RecentItem, FavoritesSortOrder }
