import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type SparklesState = {
  enabled: boolean
  toggle: () => void
  setEnabled: (enabled: boolean) => void
}

const cookieStorage = {
  getItem: (name: string) => {
    if (typeof document === "undefined") return null
    const match = document.cookie.match(new RegExp(`${name}=([^;]+)`))
    return match ? match[1] : null
  },
  setItem: (name: string, value: string) => {
    if (typeof document === "undefined") return
    document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}`
  },
  removeItem: (name: string) => {
    if (typeof document === "undefined") return
    document.cookie = `${name}=; path=/; max-age=0`
  },
}

export const useSparklesStore = create<SparklesState>()(
  persist(
    (set) => ({
      enabled: false,
      toggle: () => set((state) => ({ enabled: !state.enabled })),
      setEnabled: (enabled) => set({ enabled }),
    }),
    {
      name: "sparkles",
      storage: createJSONStorage(() => cookieStorage),
      skipHydration: true,
    }
  )
)
