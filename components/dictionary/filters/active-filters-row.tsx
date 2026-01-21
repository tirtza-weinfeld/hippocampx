"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { chipVariants, getChipTransition } from "./utils";
import type { SourcePartOption } from "./types";

interface ActiveFiltersRowProps {
  localTags: string[];
  localSources: string[];
  localParts: string[];
  sourceParts: SourcePartOption[];
  handleTagToggle: (tagName: string) => void;
  handleSourceToggle: (sourceTitle: string) => void;
  handleSourcePartToggle: (partName: string, parentSourceTitle: string) => void;
  reducedMotion: boolean | null;
}

export function ActiveFiltersRow({
  localTags,
  localSources,
  localParts,
  sourceParts,
  handleTagToggle,
  handleSourceToggle,
  handleSourcePartToggle,
  reducedMotion,
}: ActiveFiltersRowProps) {
  const chipTransition = getChipTransition(reducedMotion);

  return (
    <div className="hidden @sm:flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
      <AnimatePresence mode="popLayout">
        {localTags.map((name) => (
          <motion.span
            key={`tag-${name}`}
            layout
            variants={chipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={chipTransition}
            className="inline-flex items-center gap-1 py-1 pl-2.5 pr-1.5 rounded-full text-xs font-medium bg-dict-tag-gradient text-dict-primary-vivid shrink-0"
          >
            <span>{name}</span>
            <motion.button
              type="button"
              onClick={() => handleTagToggle(name)}
              whileHover={{ scale: reducedMotion ? 1 : 1.1 }}
              whileTap={{ scale: reducedMotion ? 1 : 0.9 }}
              className="flex items-center justify-center size-4 rounded-full bg-transparent text-dict-primary-muted transition-colors duration-150 hover:bg-dict-primary hover:text-dict-text-inverse focus-visible:ring-1 focus-visible:ring-dict-primary outline-none"
            >
              <X className="size-2.5" />
            </motion.button>
          </motion.span>
        ))}
        {localSources.map((title) => (
          <motion.span
            key={`source-${title}`}
            layout
            variants={chipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={chipTransition}
            className="inline-flex items-center gap-1 py-1 pl-2.5 pr-1.5 rounded-full text-xs font-medium bg-dict-tag-gradient text-dict-primary-vivid shrink-0"
          >
            <span>{title}</span>
            <motion.button
              type="button"
              onClick={() => handleSourceToggle(title)}
              whileHover={{ scale: reducedMotion ? 1 : 1.1 }}
              whileTap={{ scale: reducedMotion ? 1 : 0.9 }}
              className="flex items-center justify-center size-4 rounded-full bg-transparent text-dict-primary-muted transition-colors duration-150 hover:bg-dict-primary hover:text-dict-text-inverse focus-visible:ring-1 focus-visible:ring-dict-primary outline-none"
            >
              <X className="size-2.5" />
            </motion.button>
          </motion.span>
        ))}
        {localParts.map((name) => {
          const part = sourceParts.find((p) => p.name === name);
          const parentSourceTitle = part?.sourceTitle ?? "";
          return (
            <motion.span
              key={`part-${part?.id ?? name}`}
              layout
              variants={chipVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={chipTransition}
              className="inline-flex items-center gap-1 py-1 pl-2.5 pr-1.5 rounded-full text-xs font-medium bg-dict-tag-gradient text-dict-primary-vivid shrink-0"
            >
              <span>{name}</span>
              <motion.button
                type="button"
                onClick={() => handleSourcePartToggle(name, parentSourceTitle)}
                whileHover={{ scale: reducedMotion ? 1 : 1.1 }}
                whileTap={{ scale: reducedMotion ? 1 : 0.9 }}
                className="flex items-center justify-center size-4 rounded-full bg-transparent text-dict-primary-muted transition-colors duration-150 hover:bg-dict-primary hover:text-dict-text-inverse focus-visible:ring-1 focus-visible:ring-dict-primary outline-none"
              >
                <X className="size-2.5" />
              </motion.button>
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
