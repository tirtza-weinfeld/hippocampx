"use client"

import React, { useState, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import CopyCode from './copy-code';

type CodeBlockClientProps = {
  code: string;
  highlightedCodeWithTooltips: React.ReactNode;
  totalLines: number;
};

const MAX_LINES_COLLAPSED = 20;
const LINE_HEIGHT = 24; // pixels

const EXPAND_ANIMATION = {
  duration: 0.4,
  ease: [0.4, 0.0, 0.2, 1] // Material Design standard easing
} as const;

const ICON_ANIMATION = {
  duration: 0.2,
  ease: "easeInOut"
} as const;

export function CodeBlockClient({
  code,
  highlightedCodeWithTooltips,
  totalLines
}: CodeBlockClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [heights, setHeights] = useState({ collapsed: MAX_LINES_COLLAPSED * LINE_HEIGHT, expanded: MAX_LINES_COLLAPSED * LINE_HEIGHT });
  const shouldReduceMotion = useReducedMotion();

  const shouldShowToggle = totalLines > MAX_LINES_COLLAPSED;

  // Measure heights using callback ref
  const contentRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      const fullHeight = node.scrollHeight;
      const collapsed = MAX_LINES_COLLAPSED * LINE_HEIGHT;
      setHeights({ collapsed, expanded: fullHeight });
    }
  }, []);

  function toggleExpanded(): void {
    setIsExpanded(prev => !prev);
  }

  return (
    <div className="my-4 rounded-md bg-gray-100 p-4 shadow-2xl dark:bg-gray-800">
      <div className="relative">
        <CopyCode code={code} className="absolute right-2 top-2 z-20" />

        {shouldShowToggle && (
          <div className="absolute right-14 top-2 z-20 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  onClick={toggleExpanded}
                  className="cursor-pointer rounded-lg bg-white/80 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90"
                  aria-label={isExpanded ? "Collapse code" : "Expand code"}
                  aria-expanded={isExpanded}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isExpanded ? (
                      <motion.div
                        key="minimize"
                        initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.8, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, rotate: 90 }}
                        transition={shouldReduceMotion ? { duration: 0 } : ICON_ANIMATION}
                      >
                        <Minimize2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="maximize"
                        initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.8, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, rotate: 90 }}
                        transition={shouldReduceMotion ? { duration: 0 } : ICON_ANIMATION}
                      >
                        <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isExpanded ? "Collapse code" : "Expand code"}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <motion.div
          ref={contentRef}
          initial={false}
          animate={{
            height: shouldShowToggle ? (isExpanded ? heights.expanded : heights.collapsed) : "auto"
          }}
          transition={shouldReduceMotion ? { duration: 0 } : EXPAND_ANIMATION}
          className="line-numbers relative overflow-x-auto py-8"
          style={{
            overflowX: "auto",
            overflowY: shouldShowToggle && !isExpanded ? "auto" : "visible",
            maxHeight: shouldShowToggle && !isExpanded ? `${heights.collapsed}px` : undefined
          }}
        >
          <motion.div
            initial={false}
            animate={{
              opacity: 1
            }}
            transition={shouldReduceMotion ? { duration: 0 } : {
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            {highlightedCodeWithTooltips}
          </motion.div>
        </motion.div>

        {shouldShowToggle && !isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-800"
          />
        )}
      </div>
    </div>
  );
} 