export interface EntryBasic {
  id: number;
  lemma: string;
  partOfSpeech: string;
  languageCode: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export type AudioResult =
  | { success: true; audioUrl: string }
  | { success: false; error: string };
