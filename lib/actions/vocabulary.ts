"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as railwayApi from "@/lib/api/railway-vocabulary-client";

// ============================================================================
// Types
// ============================================================================

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

// ============================================================================
// Word Actions
// ============================================================================

export async function createWord(formData: FormData) {
  const wordText = formData.get("word_text") as string;
  const languageCode = (formData.get("language_code") as string) || "en";

  if (!wordText || wordText.trim().length === 0) {
    return { error: "Word text is required" };
  }

  try {
    const word = await railwayApi.createWord(
      wordText.trim(),
      languageCode
    );

    revalidatePath("/dictionary");
    return { success: true, wordId: word.id };
  } catch (error) {
    console.error("Failed to create word:", error);
    return { error: "Failed to create word. It may already exist." };
  }
}

export async function updateWord(
  wordId: number,
  wordText: string,
  languageCode: string
) {
  try {
    await railwayApi.updateWord(wordId, wordText, languageCode);

    revalidatePath("/dictionary");
    revalidatePath(`/dictionary/${wordId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update word:", error);
    return { error: "Failed to update word" };
  }
}

export async function deleteWord(wordId: number) {
  try {
    await railwayApi.deleteWord(wordId);
  } catch (error) {
    console.error("Failed to delete word:", error);
    return { error: "Failed to delete word" };
  }

  // Don't catch redirect - it needs to throw to work
  revalidatePath("/dictionary");
  redirect("/dictionary");
}

// ============================================================================
// Definition Actions
// ============================================================================

export async function createDefinition(formData: FormData) {
  const wordId = parseInt(formData.get("word_id") as string);
  const definitionText = formData.get("definition_text") as string;
  const partOfSpeech = formData.get("part_of_speech") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  if (!definitionText || definitionText.trim().length === 0) {
    return { error: "Definition text is required" };
  }

  try {
    const definition = await railwayApi.createDefinition(
      wordId,
      definitionText.trim(),
      partOfSpeech || null,
      order
    );

    revalidatePath(`/dictionary/${wordId}`);
    return { success: true, definitionId: definition.id };
  } catch (error) {
    console.error("Failed to create definition:", error);
    return { error: "Failed to create definition" };
  }
}

export async function updateDefinition(
  definitionId: number,
  wordId: number,
  definitionText: string,
  partOfSpeech: string
) {
  try {
    await railwayApi.updateDefinition(
      definitionId,
      definitionText,
      partOfSpeech || null
    );

    revalidatePath(`/dictionary/${wordId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update definition:", error);
    return { error: "Failed to update definition" };
  }
}

export async function deleteDefinition(definitionId: number, wordId: number) {
  try {
    await railwayApi.deleteDefinition(definitionId);

    revalidatePath(`/dictionary/${wordId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete definition:", error);
    return { error: "Failed to delete definition" };
  }
}

// ============================================================================
// Example Actions
// ============================================================================

export async function createExample(formData: FormData) {
  const definitionId = parseInt(formData.get("definition_id") as string);
  const wordId = parseInt(formData.get("word_id") as string);
  const exampleText = formData.get("example_text") as string;
  const source = formData.get("source") as string;

  if (!exampleText || exampleText.trim().length === 0) {
    return { error: "Example text is required" };
  }

  try {
    const example = await railwayApi.createExample(
      definitionId,
      exampleText.trim(),
      source?.trim()
    );

    revalidatePath(`/dictionary/${wordId}`);
    return { success: true, exampleId: example.id };
  } catch (error) {
    console.error("Failed to create example:", error);
    return { error: "Failed to create example" };
  }
}

export async function deleteExample(exampleId: number, wordId: number) {
  try {
    await railwayApi.deleteExample(exampleId);

    revalidatePath(`/dictionary/${wordId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete example:", error);
    return { error: "Failed to delete example" };
  }
}

// ============================================================================
// Tag Actions
// ============================================================================

export async function createTag(name: string, description?: string) {
  try {
    const tag = await railwayApi.createTag(
      name.trim(),
      description?.trim()
    );

    revalidatePath("/dictionary");
    return { success: true, tagId: tag.id };
  } catch (error) {
    console.error("Failed to create tag:", error);
    return { error: "Failed to create tag. It may already exist." };
  }
}

export async function addTagToWord(wordId: number, tagId: number) {
  try {
    await railwayApi.addTagToWord(wordId, tagId);

    revalidatePath(`/dictionary/${wordId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to add tag to word:", error);
    return { error: "Failed to add tag to word" };
  }
}

export async function removeTagFromWord(wordId: number, tagId: number) {
  try {
    await railwayApi.removeTagFromWord(wordId, tagId);

    revalidatePath(`/dictionary/${wordId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to remove tag from word:", error);
    return { error: "Failed to remove tag from word" };
  }
}
