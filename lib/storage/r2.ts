/**
 * Cloudflare R2 Storage Client
 * S3-compatible object storage for audio files
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const R2_ACCOUNT_ID = getRequiredEnv("R2_ACCOUNT_ID");
const R2_ACCESS_KEY_ID = getRequiredEnv("R2_ACCESS_KEY_ID");
const R2_SECRET_ACCESS_KEY = getRequiredEnv("R2_SECRET_ACCESS_KEY");
const R2_BUCKET_NAME = getRequiredEnv("R2_BUCKET_NAME");
const R2_PUBLIC_URL = getRequiredEnv("R2_PUBLIC_URL");

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

type UploadAudioResult =
  | { success: true; url: string; key: string }
  | { success: false; error: string };

/**
 * Upload audio buffer to R2 and return public URL
 */
async function uploadAudio(
  key: string,
  audioBuffer: Buffer,
  contentType = "audio/mpeg"
): Promise<UploadAudioResult> {
  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: audioBuffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const url = `${R2_PUBLIC_URL}/${key}`;
    return { success: true, url, key };
  } catch (error) {
    console.error("R2 upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Delete audio file from R2
 */
async function deleteAudio(key: string): Promise<boolean> {
  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    console.error("R2 delete error:", error);
    return false;
  }
}

/**
 * Generate a consistent key for word audio
 */
function generateAudioKey(
  languageCode: string,
  word: string,
  accentCode?: string
): string {
  const sanitizedWord = word
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF]/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  const accent = accentCode ?? languageCode;
  return `audio/${languageCode}/${accent}/${sanitizedWord}.mp3`;
}

/**
 * Get public URL for an audio key
 */
function getAudioUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

export { uploadAudio, deleteAudio, generateAudioKey, getAudioUrl };
export type { UploadAudioResult };
