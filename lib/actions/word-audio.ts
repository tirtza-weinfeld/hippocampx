"use server";

import { eq } from "drizzle-orm";
import { neonDb } from "@/lib/db/neon/connection";
import { words, wordAudio } from "@/lib/db/neon/schema";
import { synthesizeSpeech } from "./tts";

type GetWordAudioResult =
  | { success: true; audioContent: string }
  | { success: false; error: string };

/**
 * Get word audio from database, or synthesize and store if not found.
 * Returns base64-encoded MP3 audio.
 */
export async function getOrCreateWordAudio(
  wordId: number,
  wordText: string,
  languageCode: string
): Promise<GetWordAudioResult> {
  if (wordId <= 0 || !wordText || !languageCode) {
    return { success: false, error: "Invalid input" };
  }

  // Check database first
  const existingAudio = await neonDb
    .select({ audio_data: wordAudio.audio_data })
    .from(wordAudio)
    .where(eq(wordAudio.word_id, wordId))
    .limit(1);

  if (existingAudio.length > 0) {
    return {
      success: true,
      audioContent: existingAudio[0].audio_data.toString("base64"),
    };
  }

  // Verify word exists
  const wordExists = await neonDb
    .select({ id: words.id })
    .from(words)
    .where(eq(words.id, wordId))
    .limit(1);

  if (wordExists.length === 0) {
    return { success: false, error: "Word not found" };
  }

  // Synthesize via existing TTS action
  const ttsResult = await synthesizeSpeech({ text: wordText, languageCode });

  if (!ttsResult.success) {
    return ttsResult;
  }

  // Store in database
  const audioBuffer = Buffer.from(ttsResult.audioContent, "base64");
  await neonDb
    .insert(wordAudio)
    .values({ word_id: wordId, audio_data: audioBuffer })
    .onConflictDoUpdate({
      target: wordAudio.word_id,
      set: { audio_data: audioBuffer, created_at: new Date() },
    });

  return ttsResult;
}
