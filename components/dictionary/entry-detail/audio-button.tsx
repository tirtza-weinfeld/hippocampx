"use client";

import { use, useState, useRef } from "react";
import { Volume2 } from "lucide-react";
import type { AudioResult } from "./types";

type AudioState = "idle" | "playing" | "error";

interface AudioButtonProps {
  audioPromise: Promise<AudioResult | null>;
}

export function AudioButton({ audioPromise }: AudioButtonProps) {
  const audioResult = use(audioPromise);
  const [state, setState] = useState<AudioState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioResult?.success) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center justify-center w-10 h-10 rounded-full bg-dict-primary/10 opacity-50 cursor-not-allowed"
        aria-label="Audio unavailable"
      >
        <Volume2 className="h-5 w-5 text-dict-primary" />
      </button>
    );
  }

  const handlePlay = () => {
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
      className="flex items-center justify-center w-10 h-10 rounded-full bg-dict-primary/10 hover:bg-dict-primary/20 transition-colors group disabled:opacity-50"
      aria-label="Listen to pronunciation"
    >
      <Volume2
        className={`h-5 w-5 text-dict-primary transition-transform ${
          state === "playing"
            ? "animate-dict-pulse-glow"
            : "group-hover:scale-110"
        }`}
      />
    </button>
  );
}

export function AudioButtonSkeleton() {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dict-primary/10">
      <Volume2 className="h-5 w-5 text-dict-primary animate-dict-spin" />
    </div>
  );
}
