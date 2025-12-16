"use client";

import { motion } from "motion/react";

interface SortIconProps {
  direction: "asc" | "desc" | null;
}

export function SortIcon({ direction }: SortIconProps) {
  if (!direction) {
    return (
      <svg
        className="size-3 text-db-text-subtle opacity-0 group-hover:opacity-100 transition-opacity"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M8 4l4 4H4l4-4zm0 8L4 8h8l-4 4z" />
      </svg>
    );
  }

  return (
    <motion.svg
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="size-3 text-db-neon"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      {direction === "asc" ? (
        <path d="M8 4l4 4H4l4-4z" />
      ) : (
        <path d="M8 12L4 8h8l-4 4z" />
      )}
    </motion.svg>
  );
}
