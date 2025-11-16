import "server-only";

import { z } from "zod";

// ============================================================================
// Configuration
// ============================================================================

const RAILWAY_API_BASE = process.env.NEXT_PUBLIC_HIPPO_API || "https://hippo.up.railway.app";

// ============================================================================
// Schemas - Match your Railway API response types
// ============================================================================

const WordSchema = z.object({
  id: z.number(),
  word_text: z.string(),
  language_code: z.string(),
  created_at: z.string().optional(),
});

const DefinitionSchema = z.object({
  id: z.number(),
  word_id: z.number(),
  definition_text: z.string(),
  part_of_speech: z.string().nullable(),
  order: z.number(),
  created_at: z.string().optional(),
});

const ExampleSchema = z.object({
  id: z.number(),
  definition_id: z.number(),
  example_text: z.string(),
  source: z.string().nullable(),
  created_at: z.string().optional(),
});

const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.string().optional(),
});

const WordRelationSchema = z.object({
  word_id_1: z.number(),
  word_id_2: z.number(),
  relation_type: z.string(),
  created_at: z.string().optional(),
});

// ============================================================================
// Types
// ============================================================================

export type Word = z.infer<typeof WordSchema>;
export type Definition = z.infer<typeof DefinitionSchema>;
export type Example = z.infer<typeof ExampleSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type WordRelation = z.infer<typeof WordRelationSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

async function railwayFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${RAILWAY_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Railway API error:", response.status, errorText);
    throw new Error(`Railway API error: ${response.status} - ${errorText}`);
  }

  // Handle empty responses (like DELETE operations)
  const text = await response.text();
  if (!text || text.trim() === "") {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

// ============================================================================
// Word API Functions
// ============================================================================

export async function createWord(
  wordText: string,
  languageCode: string = "en"
): Promise<Word> {
  const data = await railwayFetch<Word>("/vocabulary/words", {
    method: "POST",
    body: JSON.stringify({
      word_text: wordText,
      language_code: languageCode,
    }),
  });

  return WordSchema.parse(data);
}

export async function fetchWords(
  languageCode?: string,
  limit: number = 50,
  offset: number = 0
): Promise<Word[]> {
  const params = new URLSearchParams();
  if (languageCode) params.append("language", languageCode);
  params.append("limit", limit.toString());
  params.append("skip", offset.toString()); // Railway uses 'skip' not 'offset'

  const data = await railwayFetch<Word[]>(
    `/vocabulary/words?${params.toString()}`
  );

  return z.array(WordSchema).parse(data);
}

export async function fetchWordById(wordId: number): Promise<Word> {
  const data = await railwayFetch<Word>(`/vocabulary/words/${wordId}`);
  return WordSchema.parse(data);
}

export async function updateWord(
  wordId: number,
  wordText: string,
  languageCode: string
): Promise<Word> {
  const data = await railwayFetch<Word>(`/vocabulary/words/${wordId}`, {
    method: "PATCH",
    body: JSON.stringify({
      word_text: wordText,
      language_code: languageCode,
    }),
  });

  return WordSchema.parse(data);
}

export async function deleteWord(wordId: number): Promise<void> {
  await railwayFetch<void>(`/vocabulary/words/${wordId}`, {
    method: "DELETE",
  });
}

export async function searchWordsByPrefix(
  prefix: string,
  languageCode: string = "en",
  limit: number = 20
): Promise<Word[]> {
  const params = new URLSearchParams({
    q: prefix,
    language: languageCode,
    skip: "0",
    limit: limit.toString(),
  });

  const data = await railwayFetch<Word[]>(
    `/vocabulary/words/search?${params.toString()}`
  );

  return z.array(WordSchema).parse(data);
}

// ============================================================================
// Definition API Functions
// ============================================================================

export async function createDefinition(
  wordId: number,
  definitionText: string,
  partOfSpeech: string | null,
  order: number = 0
): Promise<Definition> {
  const data = await railwayFetch<Definition>("/vocabulary/definitions", {
    method: "POST",
    body: JSON.stringify({
      word_id: wordId,
      definition_text: definitionText,
      part_of_speech: partOfSpeech,
      order,
    }),
  });

  return DefinitionSchema.parse(data);
}

export async function fetchDefinitionsByWordId(
  wordId: number
): Promise<Definition[]> {
  const params = new URLSearchParams({ word_id: wordId.toString() });

  const data = await railwayFetch<Definition[]>(
    `/vocabulary/definitions?${params.toString()}`
  );

  return z.array(DefinitionSchema).parse(data);
}

export async function fetchDefinitionById(
  definitionId: number
): Promise<Definition> {
  const data = await railwayFetch<Definition>(
    `/vocabulary/definitions/${definitionId}`
  );

  return DefinitionSchema.parse(data);
}

export async function updateDefinition(
  definitionId: number,
  definitionText: string,
  partOfSpeech: string | null
): Promise<Definition> {
  const data = await railwayFetch<Definition>(
    `/vocabulary/definitions/${definitionId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        definition_text: definitionText,
        part_of_speech: partOfSpeech,
      }),
    }
  );

  return DefinitionSchema.parse(data);
}

export async function deleteDefinition(definitionId: number): Promise<void> {
  await railwayFetch<void>(`/vocabulary/definitions/${definitionId}`, {
    method: "DELETE",
  });
}

// ============================================================================
// Example API Functions
// ============================================================================

export async function createExample(
  definitionId: number,
  exampleText: string,
  source?: string
): Promise<Example> {
  const data = await railwayFetch<Example>("/vocabulary/examples", {
    method: "POST",
    body: JSON.stringify({
      definition_id: definitionId,
      example_text: exampleText,
      source: source || null,
    }),
  });

  return ExampleSchema.parse(data);
}

export async function fetchExamplesByDefinitionId(
  definitionId: number
): Promise<Example[]> {
  const params = new URLSearchParams({
    definition_id: definitionId.toString(),
  });

  const data = await railwayFetch<Example[]>(
    `/vocabulary/examples?${params.toString()}`
  );

  return z.array(ExampleSchema).parse(data);
}

export async function updateExample(
  exampleId: number,
  exampleText: string,
  source?: string
): Promise<Example> {
  const data = await railwayFetch<Example>(`/vocabulary/examples/${exampleId}`, {
    method: "PATCH",
    body: JSON.stringify({
      example_text: exampleText,
      source: source || null,
    }),
  });

  return ExampleSchema.parse(data);
}

export async function deleteExample(exampleId: number): Promise<void> {
  await railwayFetch<void>(`/vocabulary/examples/${exampleId}`, {
    method: "DELETE",
  });
}

// ============================================================================
// Tag API Functions
// ============================================================================

export async function createTag(
  name: string,
  description?: string
): Promise<Tag> {
  const data = await railwayFetch<Tag>("/vocabulary/tags", {
    method: "POST",
    body: JSON.stringify({
      name,
      description: description || null,
    }),
  });

  return TagSchema.parse(data);
}

export async function fetchAllTags(): Promise<Tag[]> {
  const data = await railwayFetch<Tag[]>("/vocabulary/tags");
  return z.array(TagSchema).parse(data);
}

export async function fetchTagById(tagId: number): Promise<Tag> {
  const data = await railwayFetch<Tag>(`/vocabulary/tags/${tagId}`);
  return TagSchema.parse(data);
}

export async function updateTag(
  tagId: number,
  name: string,
  description?: string
): Promise<Tag> {
  const data = await railwayFetch<Tag>(`/vocabulary/tags/${tagId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      description: description || null,
    }),
  });

  return TagSchema.parse(data);
}

export async function deleteTag(tagId: number): Promise<void> {
  await railwayFetch<void>(`/vocabulary/tags/${tagId}`, {
    method: "DELETE",
  });
}

export async function fetchTagsByWordId(wordId: number): Promise<Tag[]> {
  const data = await railwayFetch<{ tags: Tag[] }>(
    `/vocabulary/words/${wordId}/tags`
  );
  // API returns WordWithTags which has { tags: Tag[] }
  return z.array(TagSchema).parse(data.tags);
}

export async function addTagToWord(
  wordId: number,
  tagId: number
): Promise<void> {
  await railwayFetch<void>(`/vocabulary/words/${wordId}/tags/${tagId}`, {
    method: "POST",
  });
}

export async function removeTagFromWord(
  wordId: number,
  tagId: number
): Promise<void> {
  await railwayFetch<void>(`/vocabulary/words/${wordId}/tags/${tagId}`, {
    method: "DELETE",
  });
}

// ============================================================================
// Word Relations API Functions
// ============================================================================

export async function createWordRelation(
  wordId1: number,
  wordId2: number,
  relationType: string
): Promise<WordRelation> {
  const data = await railwayFetch<WordRelation>("/vocabulary/word-relations", {
    method: "POST",
    body: JSON.stringify({
      word_id_1: wordId1,
      word_id_2: wordId2,
      relation_type: relationType,
    }),
  });

  return WordRelationSchema.parse(data);
}

export async function fetchRelatedWords(
  wordId: number,
  relationType?: string
): Promise<WordRelation[]> {
  const params = new URLSearchParams({ word_id: wordId.toString() });
  if (relationType) params.append("relation_type", relationType);

  const data = await railwayFetch<WordRelation[]>(
    `/vocabulary/word-relations?${params.toString()}`
  );

  return z.array(WordRelationSchema).parse(data);
}

export async function deleteWordRelation(
  wordId1: number,
  wordId2: number
): Promise<void> {
  await railwayFetch<void>(
    `/vocabulary/word-relations/${wordId1}/${wordId2}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================================
// Composite Query Functions (Server-side composition)
// ============================================================================

export type WordWithDefinitions = Word & {
  definitions: Definition[];
};

export type DefinitionWithExamples = Definition & {
  examples: Example[];
};

export type WordComplete = Word & {
  definitions: DefinitionWithExamples[];
  tags: Tag[];
  relations: Array<{
    word_id_1: number;
    word_id_2: number;
    relation_type: string;
    related_word_text: string;
    related_word_id: number;
  }>;
};

/**
 * Fetch word with all definitions
 */
export async function fetchWordWithDefinitions(
  wordId: number
): Promise<WordWithDefinitions | null> {
  try {
    const [word, definitions] = await Promise.all([
      fetchWordById(wordId),
      fetchDefinitionsByWordId(wordId),
    ]);

    return {
      ...word,
      definitions,
    };
  } catch (error) {
    console.error("Failed to fetch word with definitions:", error);
    return null;
  }
}

/**
 * Fetch word with definitions and examples (full data)
 */
export async function fetchWordFull(
  wordId: number
): Promise<{ word: Word; definitions: DefinitionWithExamples[] } | null> {
  try {
    const [word, definitions] = await Promise.all([
      fetchWordById(wordId),
      fetchDefinitionsByWordId(wordId),
    ]);

    const definitionsWithExamples = await Promise.all(
      definitions.map(async (def) => {
        const examples = await fetchExamplesByDefinitionId(def.id);
        return {
          ...def,
          examples,
        };
      })
    );

    return {
      word,
      definitions: definitionsWithExamples,
    };
  } catch (error) {
    console.error("Failed to fetch word full:", error);
    return null;
  }
}

/**
 * Fetch word with all related data (definitions, examples, tags, relations)
 */
export async function fetchWordComplete(
  wordId: number
): Promise<WordComplete | null> {
  try {
    // Fetch word first to check if it exists
    const word = await fetchWordById(wordId);

    const [definitions, tags, rawRelations] = await Promise.all([
      fetchDefinitionsByWordId(wordId),
      fetchTagsByWordId(wordId),
      fetchRelatedWords(wordId),
    ]);

    const definitionsWithExamples = await Promise.all(
      definitions.map(async (def) => {
        const examples = await fetchExamplesByDefinitionId(def.id);
        return {
          ...def,
          examples,
        };
      })
    );

    // Transform relations to include related word data
    const relations = await Promise.all(
      rawRelations.map(async (relation) => {
        const relatedWord = await fetchWordById(relation.word_id_2);
        return {
          word_id_1: relation.word_id_1,
          word_id_2: relation.word_id_2,
          relation_type: relation.relation_type,
          related_word_text: relatedWord.word_text,
          related_word_id: relatedWord.id,
        };
      })
    );

    return {
      ...word,
      definitions: definitionsWithExamples,
      tags,
      relations,
    };
  } catch {
    // Return null for 404s or any other errors
    return null;
  }
}
