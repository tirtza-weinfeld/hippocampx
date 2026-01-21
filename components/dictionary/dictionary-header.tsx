"use client";

import { Suspense, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { SearchBar } from "./search-bar";
import { getDictionaryListActions, useIsExpanded } from "./store/dictionary-list-store";

interface DictionaryHeaderProps {
  initialQuery?: string;
  initialLanguage: string;
  children?: ReactNode; // Slot for streaming filter stats + count
}

/**
 * Header shell that renders instantly.
 * Search bar and expand button appear immediately.
 * Filter stats and count stream in via children (Suspense wrapped).
 */
export function DictionaryHeader({
  initialQuery,
  initialLanguage,
  children,
}: DictionaryHeaderProps) {
  const isExpanded = useIsExpanded();
  const { toggleExpanded } = getDictionaryListActions();
  const reducedMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 @container">
      {/* Subtle blur background */}
      <div className="absolute inset-0 -z-10 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]" 
      aria-hidden="true" />

      <div className="relative container mx-auto pl-16 pr-3 @3xl:pl-3 @sm:pr-4 py-2.5 @sm:py-3 space-y-2">
        {/* Row 1: Search bar - instant */}
        <div>
          <SearchBar
            initialQuery={initialQuery}
            initialLanguage={initialLanguage}
          />
        </div>

        {/* Row 2: Filters (streams) + Count (streams) + Expand (instant) */}
        <div className="flex flex-wrap items-center gap-1.5 @lg:gap-2">
          {/* Filter stats + count stream in via children */}
          <Suspense fallback={<FilterStatsSkeleton />}>
            {children}
          </Suspense>

          {/* Expand/Collapse - instant */}
          <motion.button
            type="button"
            onClick={toggleExpanded}
            whileHover={{ scale: reducedMotion ? 1 : 1.05 }}
            whileTap={{ scale: reducedMotion ? 1 : 0.95 }}
            className="inline-flex items-center justify-center size-9 rounded-full text-xs font-medium
             bg-dict-surface-2/80 backdrop-blur-sm text-dict-text-secondary transition-colors
             duration-150 hover:bg-dict-hover hover:text-dict-text focus-visible:ring-2
             focus-visible:ring-dict-primary/50 outline-none"
            aria-label={isExpanded ? "Collapse definitions" : "Expand definitions"}
          >
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.15, ease: "easeOut" }}
            >
              <ChevronDown className="size-3.5" />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}

function FilterStatsSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-7 w-20 rounded-full bg-dict-surface-2/50 animate-pulse" />
      <div className="h-7 w-16 rounded-full bg-dict-surface-2/50 animate-pulse" />
    </div>
  );
}
