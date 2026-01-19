"use client";

import type { ReactNode } from "react";
import { useIsExpanded } from "./store/dictionary-list-store";

interface ExpandableEntryListProps {
  children: ReactNode;
}

/**
 * Client wrapper that sets data-expanded attribute based on Zustand store.
 * Server-rendered children use CSS to respond to this attribute.
 */
export function ExpandableEntryList({ children }: ExpandableEntryListProps) {
  const isExpanded = useIsExpanded();

  return (
    <div data-expanded={isExpanded} style={{ viewTransitionName: "entry-list" }}>
      {children}
    </div>
  );
}
