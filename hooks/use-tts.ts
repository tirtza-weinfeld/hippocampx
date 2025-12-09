"use client";

import { useState } from "react";
import { synthesizeSpeech } from "@/lib/actions/tts";

type TTSState = "idle" | "loading" | "playing" | "error";

// Module-level cache - persists across component instances
const audioCache = new Map<string, string>();

// Module-level audio instance - only one can play at a time
let currentAudio: HTMLAudioElement | null = null;

export function useTTS() {
  const [state, setState] = useState<TTSState>("idle");

  const stop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    setState("idle");
  };

  const speak = async (text: string, languageCode: string) => {
    stop();

    const cacheKey = `${languageCode}:${text}`;
    let audioContent = audioCache.get(cacheKey);

    if (!audioContent) {
      setState("loading");

      const result = await synthesizeSpeech({ text, languageCode });

      if (!result.success) {
        setState("error");
        return;
      }

      audioContent = result.audioContent;
      audioCache.set(cacheKey, audioContent);
    }

    setState("playing");

    const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
    currentAudio = audio;

    audio.onended = () => {
      setState("idle");
      currentAudio = null;
    };

    audio.onerror = () => {
      setState("error");
      currentAudio = null;
    };

    await audio.play().catch(() => {
      setState("error");
      currentAudio = null;
    });
  };

  return { speak, stop, state };
}
