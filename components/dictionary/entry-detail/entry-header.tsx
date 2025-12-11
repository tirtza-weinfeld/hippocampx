"use client";

import { useState, useEffect } from "react";
import * as motion from "motion/react-client";
import { Volume2, Loader2 } from "lucide-react";
import type { EntryBasic, AudioResult } from "./types";

type AudioState = "idle" | "loading" | "ready" | "playing" | "error";

interface EntryHeaderProps {
  entry: EntryBasic;
  audioResult: AudioResult | null;
}

export function EntryHeader({ entry, audioResult }: EntryHeaderProps) {
  const [state, setState] = useState<AudioState>("idle");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Preload audio as soon as we have the URL
  useEffect(() => {
    if (!audioResult?.success) return;

    const audioElement = new Audio();
    audioElement.preload = "auto";
    audioElement.src = audioResult.audioUrl;

    audioElement.oncanplaythrough = () => {
      setState("ready");
    };

    audioElement.onended = () => setState("ready");
    audioElement.onerror = () => setState("error");

    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.src = "";
    };
  }, [audioResult]);

  function handlePlay() {
    if (!audio || state === "loading" || state === "playing") return;

    if (state === "ready") {
      setState("playing");
      audio.currentTime = 0;
      audio.play().catch(() => setState("error"));
    } else if (state === "idle" && audioResult?.success) {
      // Still loading, wait for it
      setState("loading");
      audio.oncanplaythrough = () => {
        setState("playing");
        audio.play().catch(() => setState("error"));
      };
    }
  }

  const isDisabled = state === "loading" || state === "error" || !audioResult?.success;

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
          onClick={handlePlay}
          disabled={isDisabled}
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
