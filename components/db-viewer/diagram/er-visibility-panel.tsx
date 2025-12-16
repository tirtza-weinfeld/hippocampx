"use client";

import { useState, useMemo, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SchemaTable, DatabaseProvider } from "@/lib/db-viewer/types";

interface ERVisibilityPanelProps {
  tables: SchemaTable[];
  hiddenTables: Set<string>;
  onToggle: (tableName: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

const panelVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
} as const;

const PROVIDERS: readonly DatabaseProvider[] = ["neon", "vercel"] as const;

export function ERVisibilityPanel({
  tables,
  hiddenTables,
  onToggle,
  onShowAll,
  onHideAll,
}: ERVisibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const visibleCount = tables.length - hiddenTables.size;

  const tablesByProvider = useMemo(() => {
    const grouped: Record<DatabaseProvider, SchemaTable[]> = { neon: [], vercel: [] };
    for (const table of tables) {
      grouped[table.provider].push(table);
    }
    return grouped;
  }, [tables]);

  return (
    <div className="absolute top-4 left-4">
      {/* Toggle Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="er-control-panel flex items-center gap-2 px-3 py-2 hover:bg-er-control-hover transition-colors focus-visible:ring-2 focus-visible:ring-db-neon focus-visible:outline-none"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={`Table visibility: ${visibleCount} of ${tables.length} visible`}
      >
        <svg
          className="size-4 text-er-text"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-xs font-medium text-er-text tabular-nums">
          {visibleCount}/{tables.length}
        </span>
        <motion.svg
          className="size-3 text-er-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="er-control-panel mt-2 p-3 w-56 max-h-72 overflow-y-auto scrollbar-thin"
            onWheel={e => e.stopPropagation()}
            role="region"
            aria-label="Table visibility controls"
          >
            {/* Quick Actions */}
            <div className="flex gap-2 mb-3 pb-3 border-b border-er-border">
              <motion.button
                type="button"
                onClick={onShowAll}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-2 py-1.5 text-[10px] font-medium text-er-text rounded-lg hover:bg-db-neon/10 hover:text-db-neon transition-colors focus-visible:ring-2 focus-visible:ring-db-neon focus-visible:outline-none"
              >
                Show All
              </motion.button>
              <motion.button
                type="button"
                onClick={onHideAll}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-2 py-1.5 text-[10px] font-medium text-er-text rounded-lg hover:bg-db-vercel/10 hover:text-db-vercel transition-colors focus-visible:ring-2 focus-visible:ring-db-vercel focus-visible:outline-none"
              >
                Hide All
              </motion.button>
            </div>

            {/* Tables by Provider */}
            {PROVIDERS.map(provider => {
              const providerTables = tablesByProvider[provider];
              if (providerTables.length === 0) return null;

              const visibleInProvider = providerTables.filter(t => !hiddenTables.has(t.name)).length;

              return (
                <div key={provider} className="mb-3 last:mb-0">
                  {/* Provider Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${provider === "neon" ? "bg-db-neon" : "bg-db-vercel"}`}
                        aria-hidden="true"
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-er-text-muted">
                        {provider}
                      </span>
                    </div>
                    <span className="text-[9px] text-er-text-muted tabular-nums">
                      {visibleInProvider}/{providerTables.length}
                    </span>
                  </div>

                  {/* Table List */}
                  <div className="space-y-1" role="list" aria-label={`${provider} tables`}>
                    {providerTables.map(table => {
                      const isVisible = !hiddenTables.has(table.name);
                      const checkboxId = `${panelId}-${table.name}`;

                      return (
                        <label
                          key={table.name}
                          htmlFor={checkboxId}
                          className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-lg transition-colors hover:bg-er-control-hover"
                          role="listitem"
                        >
                          <input
                            id={checkboxId}
                            type="checkbox"
                            checked={isVisible}
                            onChange={() => onToggle(table.name)}
                            className="er-checkbox"
                            aria-describedby={`${checkboxId}-desc`}
                          />
                          <span
                            id={`${checkboxId}-desc`}
                            className="text-xs text-er-text font-mono truncate"
                          >
                            {table.name}
                          </span>
                          <span className="ml-auto text-[9px] text-er-text-muted">
                            {table.columns.length} cols
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
