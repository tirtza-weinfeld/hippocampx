"use client"

import { ChevronLeft, X } from "lucide-react"
import type { MascotSettings, MascotCharacter, MascotPosition } from "./mascot-data"
import { characterImages, characterNames } from "./mascot-data"

interface SettingsViewProps {
  settings: MascotSettings
  onBack: () => void
  onClose: () => void
  onUpdateSettings: (newSettings: Partial<MascotSettings>) => void
}

export function SettingsView({ settings, onBack, onClose, onUpdateSettings }: SettingsViewProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={onBack}
          className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>
        <h3 className="font-bold text-sm">⚙️ Mascot Settings</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Character</label>
          <div className="flex gap-2">
            {(Object.keys(characterNames) as Array<MascotCharacter>).map((char) => (
              <button
                key={char}
                onClick={() => onUpdateSettings({ character: char })}
                className={`p-3 rounded-xl flex flex-col items-center flex-1 ${
                  settings.character === char
                    ? "bg-primary/20 border-2 border-primary/50"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent"
                }`}
              >
                <span className="text-2xl mb-1">{characterImages[char]}</span>
                <span className="text-xs font-medium">{characterNames[char]}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Position</label>
          <select
            value={settings.position}
            onChange={(e) =>
              onUpdateSettings({
                position: e.target.value as MascotPosition,
              })
            }
            className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-800"
          >
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
          </select>
        </div>

        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            id="showTips"
            checked={settings.showTips}
            onChange={(e) => onUpdateSettings({ showTips: e.target.checked })}
            className="mr-3"
          />
          <label htmlFor="showTips" className="text-sm">
            Show random tips
          </label>
        </div>
      </div>
    </>
  )
}
