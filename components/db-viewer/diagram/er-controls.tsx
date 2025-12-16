"use client";

import { motion } from "motion/react";

interface ERControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFitView: () => void;
}

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
} as const;

interface ControlButtonProps {
  onClick: () => void;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
}

function ControlButton({
  onClick,
  title,
  ariaLabel,
  children,
  className = "",
}: ControlButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      className={`p-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-db-neon outline-none ${className}`}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}

export function ERControls({ scale, onZoomIn, onZoomOut, onReset, onFitView }: ERControlsProps) {
  const scalePercent = Math.round(scale * 100);

  return (
    <div
      className="absolute bottom-4 right-4 flex flex-col gap-2"
      role="toolbar"
      aria-label="Diagram controls"
    >
      {/* Zoom controls group */}
      <div className="er-control-panel flex flex-col overflow-hidden">
        <ControlButton
          onClick={onZoomIn}
          title="Zoom In"
          ariaLabel="Zoom in"
          className="border-b border-er-border hover:bg-er-control-hover"
        >
          <svg
            className="size-4 text-er-text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </ControlButton>

        <div
          className="px-2 py-1.5 text-center text-[10px] font-medium text-er-text-muted border-b border-er-border tabular-nums"
          aria-live="polite"
          aria-label={`Zoom level: ${scalePercent}%`}
        >
          {scalePercent}%
        </div>

        <ControlButton
          onClick={onZoomOut}
          title="Zoom Out"
          ariaLabel="Zoom out"
          className="hover:bg-er-control-hover"
        >
          <svg
            className="size-4 text-er-text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </ControlButton>
      </div>

      {/* Fit to view button */}
      <motion.button
        type="button"
        onClick={onFitView}
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        className="er-control-panel p-2.5 hover:bg-er-control-hover transition-colors focus-visible:ring-2 focus-visible:ring-db-neon focus-visible:outline-none"
        title="Fit to View"
        aria-label="Fit diagram to view"
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
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
          />
        </svg>
      </motion.button>

      {/* Reset view button */}
      <motion.button
        type="button"
        onClick={onReset}
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        className="er-control-panel p-2.5 hover:bg-er-control-hover transition-colors focus-visible:ring-2 focus-visible:ring-db-neon focus-visible:outline-none"
        title="Reset View"
        aria-label="Reset diagram to original position"
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </motion.button>
    </div>
  );
}
