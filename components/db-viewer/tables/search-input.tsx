"use client";

import { useState, useDeferredValue } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Controlled search input with visual feedback during deferred updates.
 * Uses React 19 useDeferredValue pattern - no effects needed.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  const deferredValue = useDeferredValue(value);
  const isStale = value !== deferredValue;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg
          className={`size-4 transition-colors ${isStale ? "text-primary" : "text-muted-foreground"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-10 pr-10 h-10 bg-background transition-opacity ${isStale ? "opacity-70" : ""}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </motion.div>
  );
}

/**
 * Hook to get deferred search value for async operations.
 * Call this in parent component and pass deferredSearch to data fetching.
 */
export function useSearchState(initialValue = "") {
  const [search, setSearch] = useState(initialValue);
  const deferredSearch = useDeferredValue(search);

  return { search, setSearch, deferredSearch };
}
