"use client";

import { Suspense } from "react";
import * as motion from "motion/react-client";
import { AudioButton, AudioButtonSkeleton } from "./audio-button";
import type { AudioResult } from "./types";

interface EntryHeaderClientProps {
  lemma: string;
  audioPromise: Promise<AudioResult | null>;
}

export function EntryHeaderClient({ lemma, audioPromise }: EntryHeaderClientProps) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-3">
        <h1 className="text-4xl sm:text-5xl font-serif text-dict-text tracking-tight">
          {lemma}
        </h1>
        <Suspense fallback={<AudioButtonSkeleton />}>
          <AudioButton audioPromise={audioPromise} />
        </Suspense>
      </div>

      <div className="flex items-center gap-3 text-dict-text-secondary">
        <span className="text-sm italic text-dict-text-tertiary">
          /{lemma.toLowerCase()}/
        </span>
      </div>
    </motion.header>
  );
}
