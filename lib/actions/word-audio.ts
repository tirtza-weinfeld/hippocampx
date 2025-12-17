"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db/connection";
import { lexicalEntries, entryAudio } from "@/lib/db/schema";
import { synthesizeSpeech } from "./tts";
import { uploadAudio, generateAudioKey } from "@/lib/storage/r2";

type GetWordAudioResult =
  | { success: true; audioUrl: string }
  | { success: false; error: string };

/**
 * Get word audio URL from database, or synthesize, upload to R2, and store URL if not found.
 * Returns public R2 URL for audio playback.
 */
async function getOrCreateWordAudio(
  entryId: number,
  wordText: string,
  languageCode: string
): Promise<GetWordAudioResult> {
  if (entryId <= 0 || !wordText || !languageCode) {
    return { success: false, error: "Invalid input" };
  }

  // Check database for existing audio URL
  const existingAudio = await db
    .select({ audio_url: entryAudio.audio_url })
    .from(entryAudio)
    .where(eq(entryAudio.entry_id, entryId))
    .limit(1);

  if (existingAudio.length > 0) {
    return { success: true, audioUrl: existingAudio[0].audio_url };
  }

  // Verify entry exists
  const entryExists = await db
    .select({ id: lexicalEntries.id })
    .from(lexicalEntries)
    .where(eq(lexicalEntries.id, entryId))
    .limit(1);

  if (entryExists.length === 0) {
    return { success: false, error: "Entry not found" };
  }

  // Synthesize via TTS
  const ttsResult = await synthesizeSpeech({ text: wordText, languageCode });

  if (!ttsResult.success) {
    return ttsResult;
  }

  // Upload to R2
  const audioBuffer = Buffer.from(ttsResult.audioContent, "base64");
  const key = generateAudioKey(languageCode, wordText);
  const uploadResult = await uploadAudio(key, audioBuffer);

  if (!uploadResult.success) {
    return { success: false, error: uploadResult.error };
  }

  // Store URL in database
  await db
    .insert(entryAudio)
    .values({
      entry_id: entryId,
      audio_url: uploadResult.url,
      accent_code: languageCode,
      content_type: "audio/mpeg",
    })
    .onConflictDoNothing();

  return { success: true, audioUrl: uploadResult.url };
}

export { getOrCreateWordAudio, getOrCreateWordAudio as getOrCreateEntryAudio };
