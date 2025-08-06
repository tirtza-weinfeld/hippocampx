import { createContext } from "react"

// Shared context for list type detection
export const ListTypeContext = createContext<string>('unordered')

// Context for nested list tracking (used by OrderedList and UnorderedList)
export const ListContext = createContext({ 
  level: 0, 
  type: "unordered" as "ordered" | "unordered",
  isDecimalList: false
})