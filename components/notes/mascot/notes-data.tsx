export type NotesMascotCharacter = "ada" | "turing" | "dijkstra" | "knuth"
export type MascotPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left"

export interface MascotSettings {
  character: NotesMascotCharacter
  position: MascotPosition
  showTips: boolean
}

export const characterImages: Record<NotesMascotCharacter, string> = {
  ada: "👩‍💻",
  turing: "🤖", 
  dijkstra: "🧮",
  knuth: "📚",
}

export const characterNames: Record<NotesMascotCharacter, string> = {
  ada: "Ada Lovelace",
  turing: "Alan Turing",
  dijkstra: "Edsger Dijkstra", 
  knuth: "Donald Knuth",
}

export const characterColors: Record<NotesMascotCharacter, string> = {
  ada: "from-purple-500 to-pink-500",
  turing: "from-blue-500 to-cyan-500",
  dijkstra: "from-orange-500 to-red-500",
  knuth: "from-green-500 to-teal-500",
}

export const positionClasses: Record<MascotPosition, string> = {
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4", 
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
}

// We'll dynamically generate category colors based on the extracted categories
export const generateCategoryColor = (category: string): string => {
  // Hash the category name to get consistent colors
  const hash = category.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const colors = [
    "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
    "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700",
    "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700",
    "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700",
    "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700",
    "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 border-pink-300 dark:border-pink-700",
  ]
  
  return colors[Math.abs(hash) % colors.length]
}