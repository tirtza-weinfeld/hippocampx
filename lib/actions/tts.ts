"use server";

import { z } from "zod";

const TTS_API_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

const TTSInputSchema = z.object({
  text: z.string().min(1).max(500),
  languageCode: z.string().min(2).max(10),
});

const TTSResponseSchema = z.object({
  audioContent: z.string(),
});

type TTSInput = z.infer<typeof TTSInputSchema>;

type TTSResult =
  | { success: true; audioContent: string }
  | { success: false; error: string };

/**
 * Synthesizes speech from text using Google Cloud TTS API.
 * Returns base64-encoded MP3 audio.
 */
export async function synthesizeSpeech(input: TTSInput): Promise<TTSResult> {
  const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_CLOUD_TTS_API_KEY is not configured");
    return { success: false, error: "TTS not configured" };
  }

  const validated = TTSInputSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "Invalid input" };
  }

  const { text, languageCode } = validated.data;

  // Map language codes to Google TTS voice names
  const voiceMap: Record<string, { name: string; code: string }> = {
    en: { name: "en-US-Neural2-D", code: "en-US" },
    es: { name: "es-ES-Neural2-A", code: "es-ES" },
    fr: { name: "fr-FR-Neural2-A", code: "fr-FR" },
    de: { name: "de-DE-Neural2-B", code: "de-DE" },
    it: { name: "it-IT-Neural2-A", code: "it-IT" },
    pt: { name: "pt-BR-Neural2-A", code: "pt-BR" },
    ja: { name: "ja-JP-Neural2-B", code: "ja-JP" },
    ko: { name: "ko-KR-Neural2-A", code: "ko-KR" },
    zh: { name: "cmn-CN-Neural2-A", code: "cmn-CN" },
    ar: { name: "ar-XA-Neural2-A", code: "ar-XA" },
    ru: { name: "ru-RU-Neural2-A", code: "ru-RU" },
    he: { name: "he-IL-Neural2-A", code: "he-IL" },
  };

  const voice = voiceMap[languageCode.toLowerCase().slice(0, 2)] ?? {
    name: "en-US-Neural2-D",
    code: "en-US",
  };

  try {
    const response = await fetch(`${TTS_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: voice.code, name: voice.name },
        audioConfig: { audioEncoding: "MP3" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google TTS API error:", response.status, errorText);
      return { success: false, error: "TTS API request failed" };
    }

    const data = (await response.json()) as unknown;
    const parsed = TTSResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.error("Invalid TTS response:", parsed.error);
      return { success: false, error: "Invalid TTS response" };
    }

    return { success: true, audioContent: parsed.data.audioContent };
  } catch (error) {
    console.error("TTS synthesis error:", error);
    return { success: false, error: "TTS synthesis failed" };
  }
}
