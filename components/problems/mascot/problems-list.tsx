'use client'

import { use, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { ProblemsStateContext, ProblemsActionsContext, ScrollActionsContext } from './mascot-context'

export function ProblemsList({
  children,
  isEmpty,
}: {
  children: React.ReactNode
  isEmpty: boolean
}) {
  const { hasActiveFilters } = use(ProblemsStateContext)
  const { resetFilters } = use(ProblemsActionsContext)
  const { getScrollPosition, setScrollPosition } = use(ScrollActionsContext)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef(getScrollPosition())

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    scrollPosRef.current = e.currentTarget.scrollTop
    setScrollPosition(e.currentTarget.scrollTop)
  }

  function setScrollRef(element: HTMLDivElement | null) {
    scrollContainerRef.current = element
    const savedScrollPosition = getScrollPosition()
    if (element && savedScrollPosition > 0) {
      requestAnimationFrame(() => {
        if (element) {
          element.scrollTop = savedScrollPosition
          scrollPosRef.current = savedScrollPosition
        }
      })
    }
  }

  if (isEmpty) {
    return (
      <div
        ref={setScrollRef}
        className="flex-1 px-4 mt-4 overflow-y-auto scroll-smooth scrollbar-thin
          scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground"
        style={{
          scrollBehavior: 'auto',
          overscrollBehavior: 'contain',
        }}
        onScroll={handleScroll}
        tabIndex={-1}
      >
        <div className="text-center py-16">
          <div
            className="text-8xl bg-linear-to-r from-sky-500 via-blue-300 to-sky-100
            hover:bg-linear-to-l bg-clip-text text-transparent mb-6
            transition-all duration-500"
          >
            🔍
          </div>
          <h3 className="text-xl font-semibold mb-3">No problems found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={resetFilters}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear all filters
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setScrollRef}
      className="flex-1 px-4 mt-4 overflow-y-auto scroll-smooth scrollbar-thin
        scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground"
      style={{
        scrollBehavior: 'auto',
        overscrollBehavior: 'contain',
      }}
      onScroll={handleScroll}
      tabIndex={-1}
    >
      <div className="space-y-4 group/problems">{children}</div>
    </div>
  )
}
