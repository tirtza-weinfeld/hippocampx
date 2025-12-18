"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useDeferredValue,
  useId,
  useMemo,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { SchemaTable } from "@/lib/db-viewer/types";

const spring = { stiffness: 400, damping: 30 };
const springSoft = { stiffness: 300, damping: 25 };

const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.5, 2] as const;
const MIN_HEIGHT = 44;
const MAX_HEIGHT = 420;
const DEFAULT_HEIGHT = 200;
const DRAG_THRESHOLD = 4;

interface ERCommandSurfaceProps {
  tables: SchemaTable[];
  hiddenTables: Set<string>;
  schemaIndexMap: Map<string, number>;
  scale: number;
  onToggle: (tableName: string) => void;
  onToggleSchema: (tableNames: string[], show: boolean) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onSetScale: (scale: number) => void;
  onFitView: () => void;
  onReset: () => void;
  onFocusTable: (tableName: string) => void;
  onPreviewTable: (tableName: string | null) => void;
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

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-db-er-pk-soft text-db-er-pk font-semibold rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function ERCommandSurface({
  tables,
  hiddenTables,
  schemaIndexMap,
  scale,
  onToggle,
  onToggleSchema,
  onShowAll,
  onHideAll,
  onSetScale,
  onFitView,
  onReset,
  onFocusTable,
  onPreviewTable,
}: ERCommandSurfaceProps) {
  const panelId = useId();
  const searchId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [quickMenuExpanded, setQuickMenuExpanded] = useState<Set<string>>(() => new Set());
  const quickMenuRef = useRef<HTMLDivElement>(null);
  const [showSearchDropup, setShowSearchDropup] = useState(false);
  const searchDropupRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showZoom, setShowZoom] = useState(false);
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(
    () => new Set(Array.from(groupTablesBySchema(tables).keys()))
  );

  const visibleCount = tables.length - hiddenTables.size;
  const groupedTables = useMemo(() => groupTablesBySchema(tables), [tables]);
  const pct = Math.round(scale * 100);

  const visibleTables = useMemo(
    () => tables.filter(t => !hiddenTables.has(t.name)).toSorted((a, b) => a.name.localeCompare(b.name)),
    [tables, hiddenTables]
  );

  const searchResults = useMemo(() => {
    if (!deferredQuery) return visibleTables;
    const q = deferredQuery.toLowerCase();
    return visibleTables.filter(t => t.name.toLowerCase().includes(q) || t.schema.toLowerCase().includes(q));
  }, [visibleTables, deferredQuery]);

  // Handle: click = toggle, drag = resize
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);

      const startY = e.clientY;
      const startHeight = height;
      let moved = 0;

      function onMove(ev: PointerEvent) {
        const delta = startY - ev.clientY;
        moved = Math.abs(delta);
        if (moved > DRAG_THRESHOLD) {
          setIsDragging(true);
          if (isCollapsed && delta > 0) {
            setIsCollapsed(false);
            setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, delta + MIN_HEIGHT)));
          } else if (!isCollapsed) {
            setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight + delta)));
          }
        }
      }

      function onUp() {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
        target.removeEventListener("lostpointercapture", onUp);
        if (moved <= DRAG_THRESHOLD) {
          setIsCollapsed(c => !c);
        }
        setIsDragging(false);
      }

      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("lostpointercapture", onUp);
    },
    [height, isCollapsed]
  );

  // "/" to focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          requestAnimationFrame(() => inputRef.current?.focus());
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close quick menu on click outside
  useEffect(() => {
    if (!showQuickMenu) return;
    function handleClick(e: MouseEvent) {
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
        setShowQuickMenu(false);
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [showQuickMenu]);

  // Close quick menu on Escape
  useEffect(() => {
    if (!showQuickMenu) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowQuickMenu(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showQuickMenu]);

  // Close search dropup on click outside
  useEffect(() => {
    if (!showSearchDropup) return;
    function handleClick(e: MouseEvent) {
      if (searchDropupRef.current && !searchDropupRef.current.contains(e.target as Node)) {
        setShowSearchDropup(false);
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [showSearchDropup]);

  const selectTable = useCallback(
    (name: string) => {
      onFocusTable(name);
      setQuery("");
      setActiveIndex(-1);
      setShowSearchDropup(false);
      inputRef.current?.blur();
    },
    [onFocusTable]
  );

  function onSearchKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => (i < searchResults.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => (i > 0 ? i - 1 : searchResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) selectTable(searchResults[activeIndex].name);
      else if (searchResults.length === 1) selectTable(searchResults[0].name);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setQuery("");
      setActiveIndex(-1);
      inputRef.current?.blur();
      onPreviewTable(null);
    }
  }

  useEffect(() => {
    if (activeIndex >= 0 && activeIndex < searchResults.length) {
      onPreviewTable(searchResults[activeIndex].name);
    }
  }, [activeIndex, searchResults, onPreviewTable]);

  useEffect(() => {
    if (activeIndex >= 0) {
      listRef.current?.querySelector(`[data-idx="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  function toggleSchema(schema: string) {
    setExpandedSchemas(prev => {
      const next = new Set(prev);
      if (next.has(schema)) next.delete(schema);
      else next.add(schema);
      return next;
    });
  }

  return (
    <motion.div
      id={panelId}
      className="absolute bottom-0 inset-x-0 z-40"
      animate={{ height: isCollapsed ? MIN_HEIGHT : height }}
      transition={isDragging ? { duration: 0 } : { type: "spring", ...springSoft }}
      onPointerDown={e => e.stopPropagation()}
      onDoubleClick={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
    >
      {/* Glass surface */}
      <div className="absolute inset-0 bg-db-er-control/90 backdrop-blur-2xl border-t border-db-er-border/30 rounded-t-xl" />

      {/* Gradient accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-db-er-border/50 to-transparent" />

      {/* Handle */}
      <motion.button
        type="button"
        onPointerDown={handlePointerDown}
        className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 group touch-none select-none"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
        aria-expanded={!isCollapsed}
      >
        <div className="relative px-8 py-2">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Pill */}
          <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-db-er-control/95 border border-db-er-border/40 shadow-xl shadow-black/10 dark:shadow-black/40 group-hover:border-db-er-border/60 group-hover:bg-db-er-control transition-all duration-200">
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-db-er-border/30 via-db-er-border/60 to-db-er-border/30" />
            <motion.svg
              viewBox="0 0 12 12"
              className="size-3 text-db-er-text-muted group-hover:text-db-er-text transition-colors"
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ type: "spring", ...spring }}
            >
              <path fill="currentColor" d="M2.5 4.5L6 8l3.5-3.5" />
            </motion.svg>
          </div>
        </div>
      </motion.button>

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-11 border-b border-db-er-border/20 shrink-0">
          {/* Count - always opens dropup */}
          <div ref={quickMenuRef} className="relative">
            <motion.button
              type="button"
              onClick={() => setShowQuickMenu(v => !v)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-db-er-border/10 hover:bg-db-er-border/20 transition-colors"
              whileTap={reduced ? {} : { scale: 0.97 }}
              aria-expanded={showQuickMenu}
            >
              <div className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px] shadow-emerald-500/50 dark:shadow-emerald-400/50" />
              <span className="text-[11px] font-medium tabular-nums text-db-er-text">
                {visibleCount}<span className="text-db-er-text-muted">/{tables.length}</span>
              </span>
              <motion.svg
                className="size-3 text-db-er-text-muted"
                viewBox="0 0 16 16"
                fill="currentColor"
                animate={{ rotate: showQuickMenu ? 180 : 0 }}
                transition={{ type: "spring", ...spring }}
              >
                <path
                  fillRule="evenodd"
                  d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                  clipRule="evenodd"
                />
              </motion.svg>
            </motion.button>

            {/* Quick visibility dropup */}
            <AnimatePresence>
              {showQuickMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 6, scale: 0.97, filter: "blur(2px)" }}
                  transition={{
                    type: "spring",
                    ...springSoft,
                    opacity: { duration: reduced ? 0 : 0.15 },
                    filter: { duration: reduced ? 0 : 0.2 },
                  }}
                  className="absolute bottom-full left-0 mb-2 w-56 p-1.5 rounded-xl bg-db-er-control/95 backdrop-blur-2xl border border-db-er-border/40 shadow-xl shadow-black/15 dark:shadow-black/40"
                  role="menu"
                >
                  {/* Quick actions */}
                  <div className="flex gap-1 p-1">
                    <motion.button
                      onClick={() => { onShowAll(); setShowQuickMenu(false); }}
                      whileTap={reduced ? {} : { scale: 0.97 }}
                      className="flex-1 px-2.5 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all"
                    >
                      Show All
                    </motion.button>
                    <motion.button
                      onClick={() => { onHideAll(); setShowQuickMenu(false); }}
                      whileTap={reduced ? {} : { scale: 0.97 }}
                      className="flex-1 px-2.5 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/15 hover:border-rose-500/30 transition-all"
                    >
                      Hide All
                    </motion.button>
                  </div>

                  {/* Divider */}
                  <div className="my-1.5 h-px bg-db-er-border/20" />

                  {/* Schema + table toggles */}
                  <motion.div
                    className="max-h-72 overflow-y-auto db-er-scrollable"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: reduced ? 0 : 0.02, delayChildren: 0.03 } },
                    }}
                  >
                    {Array.from(groupedTables.entries()).map(([schema, schemaTables]) => {
                      const tableNames = schemaTables.map(t => t.name);
                      const schemaVisibleCount = tableNames.filter(n => !hiddenTables.has(n)).length;
                      const allVisible = schemaVisibleCount === schemaTables.length;
                      const someVisible = schemaVisibleCount > 0 && schemaVisibleCount < schemaTables.length;
                      const idx = (schemaIndexMap.get(schema) ?? 0) % 6;
                      const isExpanded = quickMenuExpanded.has(schema);

                      return (
                        <motion.div
                          key={schema}
                          data-db-schema={idx}
                          variants={{
                            hidden: { opacity: 0, x: -8 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          transition={{ type: "spring", ...springSoft }}
                        >
                          {/* Schema header */}
                          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-db-er-border/10 transition-colors">
                            <input
                              type="checkbox"
                              checked={allVisible}
                              ref={el => { if (el) el.indeterminate = someVisible; }}
                              onChange={() => onToggleSchema(tableNames, !allVisible)}
                              className="db-er-check"
                            />
                            <button
                              type="button"
                              onClick={() => setQuickMenuExpanded(prev => {
                                const next = new Set(prev);
                                if (next.has(schema)) next.delete(schema);
                                else next.add(schema);
                                return next;
                              })}
                              className="flex-1 flex items-center gap-2 min-w-0"
                            >
                              <motion.svg
                                className="size-3 text-db-er-text-muted shrink-0"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                animate={{ rotate: isExpanded ? 0 : -90 }}
                                transition={{ type: "spring", ...spring }}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                                  clipRule="evenodd"
                                />
                              </motion.svg>
                              <span className="db-er-schema-dot" />
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-db-er-text truncate">
                                {schema}
                              </span>
                              <span className="ml-auto text-[9px] tabular-nums text-db-er-text-muted/60 shrink-0">
                                {schemaVisibleCount}/{schemaTables.length}
                              </span>
                            </button>
                          </div>

                          {/* Tables */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  height: { type: "spring", ...springSoft },
                                  opacity: { duration: reduced ? 0 : 0.12 },
                                }}
                                className="overflow-hidden"
                              >
                                <div className="pl-6 space-y-0.5">
                                  {schemaTables.map((table, i) => {
                                    const isVisible = !hiddenTables.has(table.name);
                                    return (
                                      <motion.label
                                        key={table.name}
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          delay: reduced ? 0 : i * 0.015,
                                          type: "spring",
                                          ...springSoft,
                                        }}
                                        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-db-er-border/10 transition-colors cursor-pointer"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isVisible}
                                          onChange={() => onToggle(table.name)}
                                          className="db-er-check"
                                        />
                                        <span className="text-[10px] font-mono text-db-er-text truncate flex-1">
                                          {table.name}
                                        </span>
                                        <span className="text-[9px] tabular-nums text-db-er-text-muted/40">
                                          {table.columns.length}
                                        </span>
                                      </motion.label>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Expand option - only when collapsed */}
                  {isCollapsed && (
                    <div className="mt-1.5 pt-1.5 border-t border-db-er-border/20">
                      <button
                        onClick={() => { setShowQuickMenu(false); setIsCollapsed(false); }}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-[10px] text-db-er-text-muted hover:text-db-er-text hover:bg-db-er-border/10 transition-colors"
                      >
                        <svg className="size-3.5" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 12.25v-8.5A1.75 1.75 0 0 0 12.25 2h-8.5ZM3.5 3.75a.25.25 0 0 1 .25-.25h8.5a.25.25 0 0 1 .25.25v8.5a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-8.5Z" />
                        </svg>
                        Expand panel for details
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search */}
          <div ref={searchDropupRef} className="relative flex-1 max-w-56">
            <div className="db-er-panel-search">
              <svg className="size-3.5 text-db-er-text-muted shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04Z" />
              </svg>
              <input
                ref={inputRef}
                id={searchId}
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setActiveIndex(-1);
                  if (e.target.value && isCollapsed) setShowSearchDropup(true);
                }}
                onKeyDown={e => {
                  onSearchKey(e);
                  if (e.key === "Escape") {
                    setShowSearchDropup(false);
                  }
                }}
                onFocus={() => {
                  setActiveIndex(-1);
                  if (query && isCollapsed) setShowSearchDropup(true);
                }}
                onBlur={() => requestAnimationFrame(() => {
                  setActiveIndex(-1);
                  onPreviewTable(null);
                  if (isCollapsed) setShowSearchDropup(false);
                })}
                placeholder="Search..."
                className="flex-1 bg-transparent text-[11px] text-db-er-text placeholder:text-db-er-text-muted/50 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setShowSearchDropup(false); }}
                  className="text-db-er-text-muted/60 hover:text-db-er-text transition-colors"
                >
                  <svg className="size-3" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2.22 2.22a.75.75 0 0 1 1.06 0L6 4.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L7.06 6l2.72 2.72a.75.75 0 1 1-1.06 1.06L6 7.06 3.28 9.78a.75.75 0 0 1-1.06-1.06L4.94 6 2.22 3.28a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                </button>
              )}
              {!query && <kbd className="text-[9px] text-db-er-text-muted/60 font-mono">/</kbd>}
            </div>

            {/* Search results dropup */}
            <AnimatePresence>
              {showSearchDropup && isCollapsed && query && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 6, scale: 0.97, filter: "blur(2px)" }}
                  transition={{
                    type: "spring",
                    ...springSoft,
                    opacity: { duration: reduced ? 0 : 0.15 },
                    filter: { duration: reduced ? 0 : 0.2 },
                  }}
                  className="absolute bottom-full left-0 right-0 mb-2 p-1.5 rounded-xl bg-db-er-control/95 backdrop-blur-2xl border border-db-er-border/40 shadow-xl shadow-black/15 dark:shadow-black/40"
                  role="listbox"
                >
                  {searchResults.length === 0 ? (
                    <div className="px-3 py-4 text-center text-[11px] text-db-er-text-muted">
                      No tables found
                    </div>
                  ) : (
                    <motion.div
                      ref={listRef}
                      className="max-h-64 overflow-y-auto db-er-scrollable"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: reduced ? 0 : 0.02, delayChildren: 0.03 } },
                      }}
                    >
                      {searchResults.map((table, i) => {
                        const idx = (schemaIndexMap.get(table.schema) ?? 0) % 6;
                        const isActive = activeIndex === i;

                        return (
                          <motion.button
                            key={table.name}
                            type="button"
                            data-idx={i}
                            onPointerDown={e => e.preventDefault()}
                            onClick={() => {
                              selectTable(table.name);
                              setShowSearchDropup(false);
                            }}
                            onPointerEnter={() => setActiveIndex(i)}
                            className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                              isActive ? "bg-db-er-border/20" : "hover:bg-db-er-border/10"
                            }`}
                            data-db-schema={idx}
                            variants={{
                              hidden: { opacity: 0, x: -8 },
                              visible: { opacity: 1, x: 0 },
                            }}
                            transition={{ type: "spring", ...springSoft }}
                          >
                            <span className="db-er-schema-dot shrink-0" />
                            <span className="text-[11px] font-mono text-db-er-text truncate flex-1">
                              <HighlightedText text={table.name} query={deferredQuery} />
                            </span>
                            <span className="text-[9px] text-db-er-text-muted/50 uppercase tracking-wide shrink-0">
                              {table.schema}
                            </span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Zoom */}
            <div className="db-er-panel-zoom">
              <input
                type="range"
                min={25}
                max={200}
                value={pct}
                onChange={e => onSetScale(Number(e.target.value) / 100)}
                className="db-er-slider"
              />
              <div className="relative" onPointerEnter={() => setShowZoom(true)} onPointerLeave={() => setShowZoom(false)}>
                <button className="px-2 py-1 text-[10px] font-medium tabular-nums text-db-er-text-muted hover:text-db-er-text rounded transition-colors">
                  {pct}%
                </button>
                <AnimatePresence>
                  {showZoom && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="db-er-panel-presets"
                    >
                      {ZOOM_PRESETS.map(v => (
                        <button
                          key={v}
                          onClick={() => { onSetScale(v); setShowZoom(false); }}
                          className={`block w-full px-2.5 py-1 text-[10px] text-left rounded transition-colors ${
                            Math.abs(scale - v) < 0.02 ? "text-db-er-text font-medium bg-db-er-border/15" : "text-db-er-text-muted hover:text-db-er-text hover:bg-db-er-border/10"
                          }`}
                        >
                          {v * 100}%
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              onClick={onFitView}
              whileTap={reduced ? {} : { scale: 0.9 }}
              className="db-er-panel-btn"
              title="Fit view"
            >
              <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.25.25 0 0 1 .25-.25h1.5a.75.75 0 0 0 0-1.5h-1.5Zm6.5 0a.75.75 0 0 0 0 1.5h1.5a.25.25 0 0 1 .25.25v1.5a.75.75 0 0 0 1.5 0v-1.5A1.75 1.75 0 0 0 12.25 2h-1.5ZM3.5 10.25a.75.75 0 0 0-1.5 0v1.5c0 .966.784 1.75 1.75 1.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.25.25 0 0 1-.25-.25v-1.5Zm10.5 0a.75.75 0 0 0-1.5 0v1.5a.25.25 0 0 1-.25.25h-1.5a.75.75 0 0 0 0 1.5h1.5a1.75 1.75 0 0 0 1.75-1.75v-1.5Z" />
              </svg>
            </motion.button>
            <motion.button
              onClick={onReset}
              whileTap={reduced ? {} : { scale: 0.9 }}
              className="db-er-panel-btn"
              title="Reset"
            >
              <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.836 2.164a.75.75 0 0 1 0 1.06l-1.53 1.53c.394.478.72 1.02.962 1.608a6.456 6.456 0 0 1 .009 4.749 6.5 6.5 0 0 1-11.763.048.75.75 0 0 1 1.354-.652 5 5 0 0 0 8.867-4.329 5.011 5.011 0 0 0-.728-1.19L9.75 6.243a.75.75 0 0 1-1.06-1.06l3.086-3.086a.75.75 0 0 1 1.06 0ZM2.164 13.836a.75.75 0 0 1 0-1.06l1.53-1.53a5.01 5.01 0 0 1-.962-1.608 6.457 6.457 0 0 1-.009-4.749 6.5 6.5 0 0 1 11.763-.048.75.75 0 0 1-1.354.652 5 5 0 0 0-8.867 4.329 5.013 5.013 0 0 0 .728 1.19l1.257-1.256a.75.75 0 1 1 1.06 1.06L4.024 13.9a.75.75 0 0 1-1.06 0l-.8-.063Z" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Body */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="db-er-panel-body"
            >
              {/* Quick actions */}
              <div className="db-er-panel-actions">
                <motion.button
                  onClick={onShowAll}
                  whileTap={reduced ? {} : { scale: 0.97 }}
                  className="px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all"
                >
                  Show All
                </motion.button>
                <motion.button
                  onClick={onHideAll}
                  whileTap={reduced ? {} : { scale: 0.97 }}
                  className="px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/15 hover:border-rose-500/30 transition-all"
                >
                  Hide All
                </motion.button>
              </div>

              {/* Schemas */}
              <div className="db-er-panel-schemas db-er-scrollable">
                {Array.from(groupedTables.entries()).map(([schema, schemaTables]) => {
                  const tableNames = schemaTables.map(t => t.name);
                  const schemaVisibleCount = tableNames.filter(n => !hiddenTables.has(n)).length;
                  const allVisible = schemaVisibleCount === schemaTables.length;
                  const someVisible = schemaVisibleCount > 0 && schemaVisibleCount < schemaTables.length;
                  const idx = (schemaIndexMap.get(schema) ?? 0) % 6;
                  const isExpanded = expandedSchemas.has(schema);

                  return (
                    <motion.div
                      key={schema}
                      layout
                      data-db-schema={idx}
                      className="db-er-panel-schema"
                    >
                      <div className="db-er-panel-schema-header">
                        <input
                          type="checkbox"
                          checked={allVisible}
                          ref={el => { if (el) el.indeterminate = someVisible; }}
                          onChange={() => onToggleSchema(tableNames, !allVisible)}
                          className="db-er-check"
                        />
                        <button
                          onClick={() => toggleSchema(schema)}
                          className="flex-1 flex items-center gap-2 min-w-0 group"
                        >
                          <div className="db-er-schema-dot" />
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-db-er-text-muted truncate group-hover:text-db-er-text transition-colors">
                            {schema}
                          </span>
                          <span className="ml-auto text-[9px] tabular-nums text-db-er-text-muted/60">
                            {schemaVisibleCount}/{schemaTables.length}
                          </span>
                          <motion.svg
                            className="size-3 text-db-er-text-muted"
                            viewBox="0 0 12 12"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ type: "spring", ...spring }}
                          >
                            <path fill="currentColor" d="M2.5 4L6 7.5 9.5 4" />
                          </motion.svg>
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", ...springSoft }}
                            className="overflow-hidden"
                          >
                            <div className="db-er-panel-tables">
                              {schemaTables.map(table => {
                                const visible = !hiddenTables.has(table.name);
                                return (
                                  <motion.label
                                    key={table.name}
                                    whileHover={reduced ? {} : { scale: 1.02 }}
                                    whileTap={reduced ? {} : { scale: 0.98 }}
                                    className="db-er-panel-table cursor-pointer"
                                    data-db-schema={idx}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={visible}
                                      onChange={() => onToggle(table.name)}
                                      className="sr-only"
                                    />
                                    <span className={`db-er-chip-dot ${visible ? "visible" : ""}`} />
                                    <span className="truncate max-w-24">{table.name}</span>
                                  </motion.label>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
