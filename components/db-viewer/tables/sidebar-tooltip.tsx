"use client";

import { motion, AnimatePresence } from "motion/react";
import { formatTableName } from "./sidebar-utils";
import type { HoveredTable } from "./sidebar-table-item";

interface SidebarTooltipProps {
  hoveredTable: HoveredTable | null;
}

export function SidebarTooltip({ hoveredTable }: SidebarTooltipProps) {
  return (
    <AnimatePresence>
      {hoveredTable && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: -8 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: -8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed left-[76px] z-[100] pointer-events-none"
          style={{ top: hoveredTable.top, transform: "translateY(-50%)" }}
        >
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 size-3 rotate-45 bg-db-surface-raised border-l border-b border-db-border/50" />
          <div className="relative px-3 py-2 rounded-xl bg-db-surface-raised border border-db-border/50 shadow-xl backdrop-blur-sm">
            <p className="text-sm font-semibold text-db-text">{formatTableName(hoveredTable.name)}</p>
            <p className="text-[10px] uppercase tracking-wider text-db-text-muted mt-0.5">{hoveredTable.schema}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
