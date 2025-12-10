"use client";

import { useState } from "react";
import * as motion from "motion/react-client";
import { Volume2, Loader2 } from "lucide-react";

type AudioResult =
  | { success: true; audioUrl: string }
  | { success: false; error: string };

type AudioState = "idle" | "loading" | "playing" | "error";

interface EntryBasic {
  id: number;
  lemma: string;
  partOfSpeech: string;
  languageCode: string;
}

interface EntryHeaderProps {
  entry: EntryBasic;
  audioPromise: Promise<AudioResult>;
}

export function EntryHeader({ entry, audioPromise }: EntryHeaderProps) {
  const [state, setState] = useState<AudioState>("idle");
  const [resolved, setResolved] = useState<AudioResult | null>(null);

  const handlePlay = async () => {
    if (state === "loading" || state === "playing") return;

    setState("loading");

    // Resolve promise if not already resolved
    const result = resolved ?? await audioPromise;
    if (!resolved) setResolved(result);

    if (!result.success) {
      setState("error");
      return;
    }

    const audio = new Audio(result.audioUrl);

    audio.oncanplaythrough = () => {
      setState("playing");
      audio.play().catch(() => setState("error"));
    };

    audio.onended = () => setState("idle");
    audio.onerror = () => setState("error");
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      {/* Entry lemma - Google style: large, clean, with pronunciation button */}
      <div className="flex items-center gap-3">
        <h1 className="text-4xl sm:text-5xl font-serif text-dict-text tracking-tight">
          {entry.lemma}
        </h1>
        <button
          type="button"
          onClick={() => void handlePlay()}
          disabled={state === "loading"}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-dict-primary/10 hover:bg-dict-primary/20 transition-colors group disabled:opacity-50"
          aria-label="Listen to pronunciation"
        >
          {state === "loading" ? (
            <Loader2 className="h-5 w-5 text-dict-primary animate-spin" />
          ) : (
            <Volume2
              className={`h-5 w-5 text-dict-primary group-hover:scale-110 transition-transform ${
                state === "playing" ? "animate-pulse" : ""
              }`}
            />
          )}
        </button>
      </div>

      {/* Part of speech / Language indicator - subtle like Google */}
      <div className="flex items-center gap-3 text-dict-text-secondary">
        <span className="text-sm italic">{entry.partOfSpeech}</span>
        <span className="text-dict-text-tertiary">|</span>
        <span className="text-sm">{entry.languageCode.toUpperCase()}</span>
        <span className="text-dict-text-tertiary">|</span>
        <span className="text-sm italic text-dict-text-tertiary">
          /{entry.lemma.toLowerCase()}/
        </span>
      </div>
    </motion.header>
  );
}
