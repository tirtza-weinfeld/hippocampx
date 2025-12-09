"use client";

import * as motion from "motion/react-client";
import { Volume2, Loader2 } from "lucide-react";
import type { WordSerialized } from "@/lib/db/neon/schema";
import { useTTS } from "@/hooks/use-tts";

interface WordHeaderProps {
  word: Pick<WordSerialized, "word_text" | "language_code" | "created_at">;
}

export function WordHeader({ word }: WordHeaderProps) {
  const { speak, state } = useTTS();

  const handleSpeak = () => {
    if (state === "loading" || state === "playing") return;
    speak(word.word_text, word.language_code);
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      {/* Word title - Google style: large, clean, with pronunciation button */}
      <div className="flex items-center gap-3">
        <h1 className="text-4xl sm:text-5xl font-serif text-dict-text tracking-tight">
          {word.word_text}
        </h1>
        <button
          type="button"
          onClick={handleSpeak}
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

      {/* Phonetic / Language indicator - subtle like Google */}
      <div className="flex items-center gap-3 text-dict-text-secondary">
        <span className="text-sm">{word.language_code.toUpperCase()}</span>
        <span className="text-dict-text-tertiary">|</span>
        <span className="text-sm italic text-dict-text-tertiary">
          /{word.word_text.toLowerCase()}/
        </span>
      </div>
    </motion.header>
  );
}
