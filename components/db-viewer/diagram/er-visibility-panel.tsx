"use client";

import { useState, useId, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { SchemaTable } from "@/lib/db-viewer/types";

interface ERVisibilityPanelProps {
  tables: SchemaTable[];
  hiddenTables: Set<string>;
  schemaIndexMap: Map<string, number>;
  onToggle: (tableName: string) => void;
  onToggleSchema: (tableNames: string[], show: boolean) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

function groupTablesBySchema(tables: SchemaTable[]): Map<string, SchemaTable[]> {
  const grouped = new Map<string, SchemaTable[]>();
  for (const table of tables) {
    const existing = grouped.get(table.schema) ?? [];
    existing.push(table);
    grouped.set(table.schema, existing);
  }
  return grouped;
}

// Spring configs for 2026 feel
const springConfig = { stiffness: 400, damping: 30 };
const springConfigSoft = { stiffness: 300, damping: 25 };

export function ERVisibilityPanel({
  tables,
  hiddenTables,
  schemaIndexMap,
  onToggle,
  onToggleSchema,
  onShowAll,
  onHideAll,
}: ERVisibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [collapsedSchemas, setCollapsedSchemas] = useState<Set<string>>(() => new Set());
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleCount = tables.length - hiddenTables.size;
  const reduced = useReducedMotion();

  const groupedTables = groupTablesBySchema(tables);

  // Track if panel has been opened (all schemas expanded by default)
  function handleOpen() {
    setIsOpen(prev => {
      if (!prev && !hasOpenedOnce) setHasOpenedOnce(true);
      return !prev;
    });
  }

  // Check if schema is expanded (all expanded by default after first open)
  function isSchemaExpanded(schema: string) {
    return hasOpenedOnce && !collapsedSchemas.has(schema);
  }

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  function toggleSchema(schema: string) {
    setCollapsedSchemas(prev => {
      const next = new Set(prev);
      if (next.has(schema)) {
        next.delete(schema);
      } else {
        next.add(schema);
      }
      return next;
    });
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-4 left-60 z-50"
      onPointerDown={e => e.stopPropagation()}
      onDoubleClick={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
    >
      {/* Trigger - Floating glass pill */}
      <motion.button
        type="button"
        onClick={handleOpen}
        className="db-er-trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={`Table visibility: ${visibleCount} of ${tables.length} visible`}
        whileHover={reduced ? {} : { scale: 1.02, y: -1 }}
        whileTap={reduced ? {} : { scale: 0.97 }}
        transition={{ type: "spring", ...springConfig }}
      >
        {/* Animated eye icon */}
        <motion.svg
          className="size-4"
          viewBox="0 0 20 20"
          fill="none"
          animate={reduced ? {} : { scale: isOpen ? 1.1 : 1 }}
          transition={{ type: "spring", ...springConfigSoft }}
        >
          <motion.path
            d="M10 12a2 2 0 100-4 2 2 0 000 4z"
            fill="currentColor"
            animate={reduced ? {} : { scale: isOpen ? 0.85 : 1 }}
            style={{ originX: "50%", originY: "50%" }}
            transition={{ type: "spring", ...springConfig }}
          />
          <path
            d="M2.458 10C3.732 6.943 6.523 5 10 5s6.268 1.943 7.542 5c-1.274 3.057-4.065 5-7.542 5S3.732 13.057 2.458 10z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </motion.svg>

        {/* Count badge with gradient */}
        <span className="db-er-count">
          {visibleCount}/{tables.length}
        </span>

        {/* Chevron with spring rotation */}
        <motion.svg
          className="size-3 opacity-60"
          viewBox="0 0 16 16"
          fill="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", ...springConfig }}
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown - Multi-layer glass */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: -8, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, scale: 0.97, filter: "blur(2px)" }}
            transition={{
              type: "spring",
              ...springConfigSoft,
              opacity: { duration: reduced ? 0 : 0.15 },
              filter: { duration: reduced ? 0 : 0.2 },
            }}
            className="db-er-dropdown"
            role="region"
            aria-label="Table visibility controls"
          >
            {/* Segmented control with animated indicator */}
            <SegmentedControl onShowAll={onShowAll} onHideAll={onHideAll} reduced={reduced} />

            {/* List with staggered entries */}
            <motion.div
              className="db-er-list db-er-scrollable"
              role="list"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: reduced ? 0 : 0.03, delayChildren: 0.05 } },
              }}
            >
              {Array.from(groupedTables.entries()).map(([schema, schemaTables]) => {
                const isExpanded = isSchemaExpanded(schema);
                const tableNames = schemaTables.map(t => t.name);
                const schemaVisibleCount = tableNames.filter(name => !hiddenTables.has(name)).length;
                const allVisible = schemaVisibleCount === schemaTables.length;
                const someVisible = schemaVisibleCount > 0 && schemaVisibleCount < schemaTables.length;
                const schemaIndex = (schemaIndexMap.get(schema) ?? 0) % 6;

                return (
                  <motion.div
                    key={schema}
                    role="group"
                    data-db-schema={schemaIndex}
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ type: "spring", ...springConfigSoft }}
                  >
                    {/* Schema header */}
                    <div className="db-er-schema-header">
                      <input
                        type="checkbox"
                        checked={allVisible}
                        ref={el => {
                          if (el) el.indeterminate = someVisible;
                        }}
                        onChange={() => onToggleSchema(tableNames, !allVisible)}
                        className="db-er-check"
                        aria-label={`Toggle all ${schema} tables`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleSchema(schema)}
                        className="flex-1 flex items-center gap-2 min-w-0 focus-visible:outline-none"
                        aria-expanded={isExpanded}
                      >
                        <motion.svg
                          className="size-3 opacity-50 shrink-0"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          animate={{ rotate: isExpanded ? 0 : -90 }}
                          transition={{ type: "spring", ...springConfig }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                        <span className="db-er-schema-dot" />
                        <span className="text-[10px] font-semibold uppercase tracking-wide truncate">
                          {schema}
                        </span>
                        <span className="ml-auto text-[9px] opacity-40 tabular-nums shrink-0">
                          {schemaVisibleCount}/{schemaTables.length}
                        </span>
                      </button>
                    </div>

                    {/* Tables with staggered animation */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { type: "spring", ...springConfigSoft },
                            opacity: { duration: reduced ? 0 : 0.12 },
                          }}
                          className="overflow-hidden"
                        >
                          {schemaTables.map((table, i) => {
                            const isVisible = !hiddenTables.has(table.name);

                            return (
                              <motion.label
                                key={table.name}
                                className="db-er-table-item"
                                role="listitem"
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: reduced ? 0 : i * 0.02,
                                  type: "spring",
                                  ...springConfigSoft,
                                }}
                                whileHover={reduced ? {} : { x: 2 }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isVisible}
                                  onChange={() => onToggle(table.name)}
                                  className="db-er-check"
                                />
                                <span className="text-[11px] font-mono truncate flex-1">
                                  {table.name}
                                </span>
                                <span className="text-[9px] opacity-35 tabular-nums">
                                  {table.columns.length}
                                </span>
                              </motion.label>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Segmented control with animated sliding indicator
function SegmentedControl({
  onShowAll,
  onHideAll,
  reduced,
}: {
  onShowAll: () => void;
  onHideAll: () => void;
  reduced: boolean | null;
}) {
  const [hovered, setHovered] = useState<"show" | "hide" | null>(null);

  return (
    <div className="db-er-segmented">
      {/* Animated background indicator */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="db-er-segment-indicator"
            layoutId="segment-indicator"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: hovered === "hide" ? "calc(100% + 2px)" : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              ...springConfig,
              opacity: { duration: reduced ? 0 : 0.1 },
            }}
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onShowAll}
        className="db-er-segment"
        onHoverStart={() => setHovered("show")}
        onHoverEnd={() => setHovered(null)}
        whileTap={reduced ? {} : { scale: 0.97 }}
      >
        Show All
      </motion.button>
      <motion.button
        type="button"
        onClick={onHideAll}
        className="db-er-segment"
        onHoverStart={() => setHovered("hide")}
        onHoverEnd={() => setHovered(null)}
        whileTap={reduced ? {} : { scale: 0.97 }}
      >
        Hide All
      </motion.button>
    </div>
  );
}
