"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { getChipTransition } from "./utils";

interface ClearFiltersButtonProps {
  onClear: () => void;
  reducedMotion: boolean | null;
}

export function ClearFiltersButton({ onClear, reducedMotion }: ClearFiltersButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClear}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={getChipTransition(reducedMotion)}
      whileHover={{ scale: reducedMotion ? 1 : 1.02 }}
      whileTap={{ scale: reducedMotion ? 1 : 0.98 }}
      className="inline-flex items-center justify-center gap-2 size-9 @lg:size-auto @lg:px-3 @lg:py-1.5 rounded-full text-xs font-medium bg-dict-surface-2 text-dict-text-tertiary transition-colors duration-150 cursor-pointer hover:bg-dict-hover hover:text-red-500 outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
      aria-label="Clear all filters"
    >
      <X className="size-4 @lg:size-3" />
      <span className="hidden @lg:inline">Clear</span>
    </motion.button>
  );
}
