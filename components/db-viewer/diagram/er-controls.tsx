"use client";

import { useState, useRef, useEffect, useEffectEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TableInfo {
  name: string;
  schema: string;
}

interface ERControlsProps {
  scale: number;
  tables: TableInfo[];
  hiddenTables: Set<string>;
  onSetScale: (scale: number) => void;
  onFitView: () => void;
  onReset: () => void;
  onFocusTable: (tableName: string) => void;
  onPreviewTable: (tableName: string | null) => void;
}

const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.5, 2] as const;

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-db-er-pk-soft text-db-er-pk font-semibold rounded-sm px-0.5 -mx-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function Search({
  tables,
  hiddenTables,
  onSelect,
  onPreview,
}: {
  tables: TableInfo[];
  hiddenTables: Set<string>;
  onSelect: (name: string) => void;
  onPreview: (name: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const visible = tables
    .filter(t => !hiddenTables.has(t.name))
    .toSorted((a, b) => a.name.localeCompare(b.name));

  const results = query.length > 0
    ? visible.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.schema.toLowerCase().includes(query.toLowerCase())
      )
    : visible;

  const showDropdown = open && results.length > 0;

  function handleSelect(name: string) {
    onSelect(name);
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  }

  function close() {
    setOpen(false);
    setActiveIndex(-1);
    setQuery("");
    onPreview(null);
  }

  const focusInput = useEffectEvent(() => {
    inputRef.current?.focus();
  });

  // Preview when activeIndex changes
  useEffect(() => {
    if (activeIndex >= 0 && activeIndex < results.length) {
      onPreview(results[activeIndex].name);
    }
  }, [activeIndex, results, onPreview]);


  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          focusInput();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(i => (i < results.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(i => (i > 0 ? i - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex].name);
        } else if (results.length === 1) {
          handleSelect(results[0].name);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        inputRef.current?.blur();
        break;
    }
  }

  return (
    <div className="relative">
      <div className="db-er-glass flex items-center gap-1.5 px-2.5 py-1.5">
        <svg viewBox="0 0 16 16" fill="currentColor" className="size-3 text-db-er-text-muted shrink-0" aria-hidden>
          <path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04Z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(close, 150)}
          onKeyDown={handleKeyDown}
          placeholder="Find table"
          className="w-24 bg-transparent text-[11px] text-db-er-text placeholder:text-db-er-text-muted/50 outline-none"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
        />
        <kbd className="text-[9px] text-db-er-text-muted/60 shrink-0">/</kbd>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
            className="db-er-glass absolute bottom-full left-0 right-0 mb-1 py-1 max-h-48 overflow-y-auto z-50"
            role="listbox"
          >
            {results.map((t, i) => (
              <li
                key={t.name}
                id={`search-result-${i}`}
                role="option"
                aria-selected={i === activeIndex}
              >
                <button
                  type="button"
                  onPointerDown={e => { e.preventDefault(); handleSelect(t.name); }}
                  onPointerEnter={() => { setActiveIndex(i); onPreview(t.name); }}
                  className={`w-full px-2.5 py-1.5 text-left text-[11px] text-db-er-text transition-colors ${
                    i === activeIndex ? "bg-db-er-border/30" : "hover:bg-db-er-border/20"
                  }`}
                >
                  <span className="font-medium">{highlightMatch(t.name, query)}</span>
                  <span className="ml-1.5 text-db-er-text-muted">{highlightMatch(t.schema, query)}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function ZoomControl({
  scale,
  onSetScale,
  onFitView,
}: {
  scale: number;
  onSetScale: (s: number) => void;
  onFitView: () => void;
}) {
  const [showPresets, setShowPresets] = useState(false);
  const pct = Math.round(scale * 100);

  return (
    <div className="db-er-glass flex items-center gap-2 px-2.5 py-1.5">
      <input
        type="range"
        min={25}
        max={200}
        value={pct}
        onChange={e => onSetScale(Number(e.target.value) / 100)}
        className="db-er-slider"
      />

      <div
        className="relative"
        onMouseEnter={() => setShowPresets(true)}
        onMouseLeave={() => setShowPresets(false)}
      >
        <button
          type="button"
          className="min-w-10 px-1 py-0.5 text-[10px] font-medium tabular-nums text-db-er-text-muted hover:text-db-er-text rounded transition-colors"
        >
          {pct}%
        </button>

        <AnimatePresence>
          {showPresets && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="db-er-glass absolute bottom-full right-0 mb-1 py-1 min-w-14"
            >
              {ZOOM_PRESETS.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => { onSetScale(v); setShowPresets(false); }}
                  className={`block w-full px-2.5 py-0.5 text-[10px] text-left transition-colors ${
                    Math.abs(scale - v) < 0.02
                      ? "text-db-er-text font-medium"
                      : "text-db-er-text-muted hover:text-db-er-text"
                  }`}
                >
                  {v * 100}%
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onFitView}
        className="p-1 text-db-er-text-muted hover:text-db-er-text rounded transition-colors"
        title="Fit (F)"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5" aria-hidden>
          <path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.25.25 0 0 1 .25-.25h1.5a.75.75 0 0 0 0-1.5h-1.5Zm6.5 0a.75.75 0 0 0 0 1.5h1.5a.25.25 0 0 1 .25.25v1.5a.75.75 0 0 0 1.5 0v-1.5A1.75 1.75 0 0 0 12.25 2h-1.5ZM3.5 10.25a.75.75 0 0 0-1.5 0v1.5c0 .966.784 1.75 1.75 1.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.25.25 0 0 1-.25-.25v-1.5Zm10.5 0a.75.75 0 0 0-1.5 0v1.5a.25.25 0 0 1-.25.25h-1.5a.75.75 0 0 0 0 1.5h1.5a1.75 1.75 0 0 0 1.75-1.75v-1.5Z" />
        </svg>
      </button>
    </div>
  );
}

export function ERControls({
  scale,
  tables,
  hiddenTables,
  onSetScale,
  onFitView,
  onReset,
  onFocusTable,
  onPreviewTable,
}: ERControlsProps) {
  const visibleCount = tables.length - hiddenTables.size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute bottom-4 right-4 flex items-end gap-2"
      role="toolbar"
      aria-label="Diagram controls"
      onPointerDown={e => e.stopPropagation()}
    >
      <div className="db-er-glass px-2.5 py-1.5 text-[10px] text-db-er-text-muted tabular-nums">
        {visibleCount}/{tables.length}
      </div>

      <Search
        tables={tables}
        hiddenTables={hiddenTables}
        onSelect={onFocusTable}
        onPreview={onPreviewTable}
      />

      <ZoomControl scale={scale} onSetScale={onSetScale} onFitView={onFitView} />

      <motion.button
        type="button"
        onClick={onReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="db-er-glass p-2 text-db-er-text-muted hover:text-db-er-text transition-colors"
        title="Reset (R)"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5" aria-hidden>
          <path d="M13.836 2.164a.75.75 0 0 1 0 1.06l-1.53 1.53c.394.478.72 1.02.962 1.608a6.456 6.456 0 0 1 .009 4.749 6.5 6.5 0 0 1-11.763.048.75.75 0 0 1 1.354-.652 5 5 0 0 0 8.867-4.329 5.011 5.011 0 0 0-.728-1.19L9.75 6.243a.75.75 0 0 1-1.06-1.06l3.086-3.086a.75.75 0 0 1 1.06 0ZM2.164 13.836a.75.75 0 0 1 0-1.06l1.53-1.53a5.01 5.01 0 0 1-.962-1.608 6.457 6.457 0 0 1-.009-4.749 6.5 6.5 0 0 1 11.763-.048.75.75 0 0 1-1.354.652 5 5 0 0 0-8.867 4.329 5.013 5.013 0 0 0 .728 1.19l1.257-1.256a.75.75 0 1 1 1.06 1.06L4.024 13.9a.75.75 0 0 1-1.06 0l-.8-.063Z" />
        </svg>
      </motion.button>
    </motion.div>
  );
}
