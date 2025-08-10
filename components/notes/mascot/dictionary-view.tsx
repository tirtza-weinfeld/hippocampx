"use client"

import { BookOpen } from "lucide-react"

export function DictionaryView() {
  return (
    <div className="flex flex-col h-full">

      {/* Placeholder content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Dictionary Coming Soon</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Algorithmic terms and concepts will be available here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}