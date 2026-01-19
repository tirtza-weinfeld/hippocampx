"use client";

import * as motion from "motion/react-client";

export function EntryListSkeleton() {
  const skeletonVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="pt-6">
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        className="flex flex-col gap-3"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            variants={skeletonVariants}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="dict-shimmer group relative rounded-xl overflow-hidden bg-dict-glass backdrop-blur-sm border border-dict-border/40"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-dict-border/60 to-transparent" />
            <div className="p-4 sm:p-5 flex items-start gap-4">
              <div className="shrink-0 flex flex-col gap-1.5">
                <div
                  className="h-5 rounded-md bg-dict-skeleton"
                  style={{ width: `${80 + (i % 3) * 20}px` }}
                />
                <div className="h-3 w-16 rounded bg-dict-surface-2/60" />
              </div>
              <div className="flex-1 space-y-2 pt-0.5">
                <div
                  className="h-4 rounded bg-dict-skeleton"
                  style={{ width: `${70 + (i % 4) * 8}%` }}
                />
                <div
                  className="h-4 rounded bg-dict-surface-3/50"
                  style={{ width: `${40 + (i % 3) * 15}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
