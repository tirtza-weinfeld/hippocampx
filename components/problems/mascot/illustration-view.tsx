"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { coreIllustrations } from "@/components/illustrations/core"

export function IllustrationView() {
 
  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 ">

          <div className="p-4">
            <h3 className="font-semibold text-lg">Algorithm Illustrations</h3>
            <p className="text-sm text-muted-foreground">core techniques</p>
          </div>

      </div>

      {/* Dictionary Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {Object.entries(coreIllustrations).map(([topic, Illustration]) => (
            <div
              key={topic}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-medium capitalize">{topic.replace(/[_-]/g, ' ')}</h4>
                   
                  </div>
              {/* <Illustration size={150} /> */}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

     
    </div>
  )
}
