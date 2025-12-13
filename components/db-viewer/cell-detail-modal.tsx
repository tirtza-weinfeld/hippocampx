"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { getTypeBadge, getFullCellValue } from "./table-helpers";

export interface CellInfo {
  columnName: string;
  dataType: string;
  value: unknown;
}

interface CellDetailModalProps {
  cell: CellInfo;
  onClose: () => void;
}

export function CellDetailModal({ cell, onClose }: CellDetailModalProps) {
  const [viewMode, setViewMode] = useState<"raw" | "preview">("raw");
  const fullValue = getFullCellValue(cell.value);
  const badge = getTypeBadge(cell.dataType);

  function handleCopy() {
    const textToCopy = viewMode === "preview" ? fullValue : JSON.stringify(fullValue);
    void navigator.clipboard.writeText(textToCopy);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-2xl max-h-[80vh] bg-db-surface rounded-2xl shadow-2xl border border-db-border/50 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-db-border/30 bg-db-surface-raised/50">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-db-text">
              {cell.columnName}
            </span>
            <span
              className={`inline-flex w-fit px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider ${badge.bg} ${badge.text}`}
            >
              {cell.dataType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center bg-db-surface rounded-lg p-0.5 border border-db-border/30">
              <button
                type="button"
                onClick={() => setViewMode("raw")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === "raw"
                    ? "bg-db-surface-raised text-db-text shadow-sm"
                    : "text-db-text-muted hover:text-db-text"
                }`}
              >
                Raw
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === "preview"
                    ? "bg-db-surface-raised text-db-text shadow-sm"
                    : "text-db-text-muted hover:text-db-text"
                }`}
              >
                Preview
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-db-text-muted hover:text-db-text hover:bg-db-surface-raised/70 transition-all"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          <pre className="text-sm text-db-text font-mono whitespace-pre-wrap break-words leading-relaxed">
            {fullValue ? (
              viewMode === "preview" ? <span>{fullValue}</span> : JSON.stringify(fullValue)
            ) : (
              <span className="text-db-text-subtle italic">null</span>
            )}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-db-border/30 bg-db-surface-raised/30">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-db-text-muted hover:text-db-text rounded-lg hover:bg-db-surface-raised/70 transition-all"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy to clipboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
