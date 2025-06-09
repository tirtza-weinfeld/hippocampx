"use client"

import { X } from "lucide-react"
import { characterImages, characterNames, type MascotCharacter } from "./mascot-data"

interface MainViewProps {
  character: MascotCharacter
  message: string
  onClose: () => void
}

export function MainView({ character, message, onClose }: MainViewProps) {
  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{characterImages[character]}</span>
          <span className="font-bold">{characterNames[character]}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>
      </div>
      <p className="text-sm mb-4">{message}</p>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-6xl">{characterImages[character]}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {"Use the buttons below to explore tools and get help!"}
          </p>
        </div>
      </div>
    </>
  )
}
