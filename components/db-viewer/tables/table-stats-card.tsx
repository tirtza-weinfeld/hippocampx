"use client";

import { motion } from "motion/react";
import type { DatabaseProvider } from "@/lib/db-viewer/types";

interface TableStatsCardProps {
  name: string;
  provider: DatabaseProvider;
  rowCount: number;
  description?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

function formatTableName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatRowCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}

export function TableStatsCard({
  name,
  rowCount,
  description,
  isSelected = false,
  onClick,
}: TableStatsCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative w-full text-left rounded-xl border p-4
        transition-all duration-200 bg-db-surface
        ${isSelected
          ? "border-db-border ring-2 ring-offset-2 ring-offset-background ring-db-neon"
          : "border-db-border hover:bg-db-row-hover"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-db-neon-soft text-db-neon">
              neon
            </span>
          </div>
          <h3 className="font-semibold text-db-text truncate">
            {formatTableName(name)}
          </h3>
          {description && (
            <p className="text-xs text-db-text-muted mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-2xl font-bold tabular-nums text-db-text">
            {formatRowCount(rowCount)}
          </span>
          <p className="text-[10px] text-db-text-muted uppercase tracking-wide">
            rows
          </p>
        </div>
      </div>
    </motion.button>
  );
}
