"use client";

import { use, useState, useRef } from "react";
import { Volume2 } from "lucide-react";

type AudioState = "idle" | "playing" | "error";
type AudioResult = { success: true; audioUrl: string } | { success: false; error: string } | null;

interface EntryAudioButtonProps {
  audioPromise: Promise<AudioResult>;
}

/**
 * Compact audio button for entry list.
 * Uses `use()` to unwrap the promise - streams independently via Suspense.
 */
export function EntryAudioButton({ audioPromise }: EntryAudioButtonProps) {
  const audioResult = use(audioPromise);
  const [state, setState] = useState<AudioState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioResult?.success) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center justify-center size-7 rounded-full bg-dict-primary/10 opacity-40 cursor-not-allowed"
        aria-label="Audio unavailable"
        onClick={(e) => e.preventDefault()}
      >
        <Volume2 className="size-3.5 text-dict-primary" />
      </button>
    );
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (state === "playing") return;

    if (!audioRef.current) {
      const audio = new Audio(audioResult.audioUrl);
      audio.addEventListener("ended", () => setState("idle"));
      audio.addEventListener("error", () => setState("error"));
      audioRef.current = audio;
    }

    setState("playing");
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => setState("error"));
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      disabled={state === "error"}
      className="flex items-center justify-center size-7 rounded-full bg-dict-primary/10 hover:bg-dict-primary/20 transition-colors disabled:opacity-50"
      aria-label="Listen to pronunciation"
    >
      <Volume2
        className={`size-3.5 text-dict-primary transition-transform ${
          state === "playing" ? "animate-dict-pulse-glow" : "hover:scale-110"
        }`}
      />
    </button>
  );
}

export function EntryAudioButtonSkeleton() {
  return (
    <div className="flex items-center justify-center size-7 rounded-full bg-dict-primary/10 animate-pulse">
      <Volume2 className="size-3.5 text-dict-primary/50" />
    </div>
  );
}
