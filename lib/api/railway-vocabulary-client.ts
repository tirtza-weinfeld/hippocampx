import "server-only";

import { z } from "zod";

// ============================================================================
// Configuration
// ============================================================================

const RAILWAY_API_BASE = process.env.NEXT_PUBLIC_HIPPO_API || "https://hippo.up.railway.app";

// ============================================================================
// Schemas - Match Hippo API response types
// ============================================================================

const WordSchema = z.object({
  id: z.number(),
  word_text: z.string(),
  language_code: z.string(),
  created_at: z.string().optional(),
});

const WordFullSchema = z.object({
  id: z.number(),
  word_text: z.string(),
  language_code: z.string(),
  created_at: z.string().optional(),
  definitions: z.array(z.lazy(() => DefinitionSchema)).default([]),
  tags: z.array(z.lazy(() => TagSchema)).default([]),
});

const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
    total_pages: z.number(),
    has_more: z.boolean(),
  });

const DefinitionSchema = z.object({
  id: z.number(),
  word_id: z.number(),
  definition_text: z.string(),
  part_of_speech: z.string().nullable(),
  order: z.number(),
  created_at: z.string().optional(),
  examples: z.array(z.lazy(() => ExampleSchema)).default([]),
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
  const data = await railwayFetch<Word>("/v1/dictionary/words", {
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
  params.append("page_size", limit.toString());
  params.append("page", (Math.floor(offset / limit) + 1).toString());

  const response = await railwayFetch<unknown>(
    `/v1/dictionary/words?${params.toString()}`,
    {
      next: { tags: ["dictionary-words"] }
    }
  );

  const parsed = PaginatedResponseSchema(WordSchema).parse(response);
  return parsed.data;
}

export async function fetchWordById(wordId: number): Promise<Word> {
  const data = await railwayFetch<Word>(`/v1/dictionary/words/${wordId}`, {
    next: { tags: [`word-${wordId}`, "dictionary-words"] }
  });
  return WordSchema.parse(data);
}

export async function updateWord(
  wordId: number,
  wordText: string,
  languageCode: string
): Promise<Word> {
  const data = await railwayFetch<Word>(`/v1/dictionary/words/${wordId}`, {
    method: "PATCH",
    body: JSON.stringify({
      word_text: wordText,
      language_code: languageCode,
    }),
  });

  return WordSchema.parse(data);
}

export async function deleteWord(wordId: number): Promise<void> {
  await railwayFetch<void>(`/v1/dictionary/words/${wordId}`, {
    method: "DELETE",
  });
}

export async function searchWordsByPrefix(
  prefix: string,
  languageCode: string = "en",
  limit: number = 20
): Promise<Word[]> {
  const params = new URLSearchParams({
    search: prefix,
    language: languageCode,
    page: "1",
    page_size: limit.toString(),
  });

  const response = await railwayFetch<unknown>(
    `/v1/dictionary/words?${params.toString()}`,
    {
      next: { tags: ["dictionary-words"] }
    }
  );

  const parsed = PaginatedResponseSchema(WordSchema).parse(response);
  return parsed.data;
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
  const data = await railwayFetch<Definition>(`/v1/dictionary/words/${wordId}/definitions`, {
    method: "POST",
    body: JSON.stringify({
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
  const params = new URLSearchParams({
    word_id: wordId.toString(),
    page_size: "1000",
  });

  const response = await railwayFetch<unknown>(
    `/v1/dictionary/definitions?${params.toString()}`,
    {
      next: { tags: [`word-${wordId}`] }
    }
  );

  const DefinitionWithExamplesSchema = DefinitionSchema.extend({
    examples: z.array(ExampleSchema).default([]),
  });

  const parsed = PaginatedResponseSchema(DefinitionWithExamplesSchema).parse(response);
  return parsed.data;
}

export async function fetchDefinitionById(
  definitionId: number
): Promise<Definition> {
  const data = await railwayFetch<Definition>(
    `/v1/dictionary/definitions/${definitionId}`
  );

  return DefinitionSchema.parse(data);
}

export async function updateDefinition(
  definitionId: number,
  definitionText: string,
  partOfSpeech: string | null
): Promise<Definition> {
  const data = await railwayFetch<Definition>(
    `/v1/dictionary/definitions/${definitionId}`,
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
  await railwayFetch<void>(`/v1/dictionary/definitions/${definitionId}`, {
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
  const data = await railwayFetch<Example>(`/v1/dictionary/definitions/${definitionId}/examples`, {
    method: "POST",
    body: JSON.stringify({
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
    page_size: "1000",
  });

  const response = await railwayFetch<unknown>(
    `/v1/dictionary/examples?${params.toString()}`,
    {
      next: { tags: ["dictionary-examples"] }
    }
  );

  const parsed = PaginatedResponseSchema(ExampleSchema).parse(response);
  return parsed.data;
}

export async function updateExample(
  exampleId: number,
  exampleText: string,
  source?: string
): Promise<Example> {
  const data = await railwayFetch<Example>(`/v1/dictionary/examples/${exampleId}`, {
    method: "PATCH",
    body: JSON.stringify({
      example_text: exampleText,
      source: source || null,
    }),
  });

  return ExampleSchema.parse(data);
}

export async function deleteExample(exampleId: number): Promise<void> {
  await railwayFetch<void>(`/v1/dictionary/examples/${exampleId}`, {
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
  const data = await railwayFetch<Tag>("/v1/dictionary/tags", {
    method: "POST",
    body: JSON.stringify({
      name,
      description: description || null,
    }),
  });

  return TagSchema.parse(data);
}

export async function fetchAllTags(): Promise<Tag[]> {
  const params = new URLSearchParams({ page_size: "1000" });
  const response = await railwayFetch<unknown>(`/v1/dictionary/tags?${params.toString()}`);

  const parsed = PaginatedResponseSchema(TagSchema).parse(response);
  return parsed.data;
}

export async function fetchTagById(tagId: number): Promise<Tag> {
  const data = await railwayFetch<Tag>(`/v1/dictionary/tags/${tagId}`);
  return TagSchema.parse(data);
}

export async function updateTag(
  tagId: number,
  name: string,
  description?: string
): Promise<Tag> {
  const data = await railwayFetch<Tag>(`/v1/dictionary/tags/${tagId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      description: description || null,
    }),
  });

  return TagSchema.parse(data);
}

export async function deleteTag(tagId: number): Promise<void> {
  await railwayFetch<void>(`/v1/dictionary/tags/${tagId}`, {
    method: "DELETE",
  });
}

export async function fetchTagsByWordId(wordId: number): Promise<Tag[]> {
  const data = await railwayFetch<{ tags: Tag[] }>(
    `/v1/dictionary/words/${wordId}?include_tags=true&include_definitions=false&include_examples=false`,
    {
      next: { tags: [`word-${wordId}`] }
    }
  );
  // API returns WordFull which has { tags: Tag[] }
  return z.array(TagSchema).parse(data.tags);
}

export async function addTagToWord(
  wordId: number,
  tagId: number
): Promise<void> {
  // Fetch current tags
  const currentTags = await fetchTagsByWordId(wordId);
  const currentTagIds = currentTags.map(t => t.id);

  // Add new tag if not already present
  if (!currentTagIds.includes(tagId)) {
    await railwayFetch<void>(`/v1/dictionary/words/${wordId}`, {
      method: "PATCH",
      body: JSON.stringify({
        tag_ids: [...currentTagIds, tagId],
      }),
    });
  }
}

export async function removeTagFromWord(
  wordId: number,
  tagId: number
): Promise<void> {
  // Fetch current tags
  const currentTags = await fetchTagsByWordId(wordId);
  const currentTagIds = currentTags.map(t => t.id);

  // Remove tag if present
  const updatedTagIds = currentTagIds.filter(id => id !== tagId);

  await railwayFetch<void>(`/v1/dictionary/words/${wordId}`, {
    method: "PATCH",
    body: JSON.stringify({
      tag_ids: updatedTagIds,
    }),
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
  const data = await railwayFetch<WordRelation>("/v1/dictionary/relations", {
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
  const params = new URLSearchParams({
    word_id: wordId.toString(),
    page_size: "1000",
  });
  if (relationType) params.append("relation_type", relationType);

  const response = await railwayFetch<unknown>(
    `/v1/dictionary/relations?${params.toString()}`,
    {
      next: { tags: [`word-${wordId}`] }
    }
  );

  const parsed = PaginatedResponseSchema(WordRelationSchema).parse(response);
  return parsed.data;
}

export async function deleteWordRelation(
  wordId1: number,
  wordId2: number,
  relationType: string
): Promise<void> {
  await railwayFetch<void>(
    `/v1/dictionary/relations/${wordId1}/${wordId2}/${relationType}`,
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
    // Single request to get word with all nested data (definitions with examples, tags)
    const wordFullData = await railwayFetch<unknown>(
      `/v1/dictionary/words/${wordId}?include_all=true`,
      {
        next: { tags: [`word-${wordId}`, "dictionary-words"] }
      }
    );

    const wordFull = WordFullSchema.parse(wordFullData);

    // Fetch relations separately (handle 404s gracefully)
    const rawRelations = await fetchRelatedWords(wordId).catch(() => []);

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
      ...wordFull,
      definitions: wordFull.definitions,
      tags: wordFull.tags,
      relations,
    };
  } catch {
    // Return null for 404s or any other errors
    return null;
  }
}

/**
 * Fetch word by text and language with all related data
 */
export async function fetchWordCompleteByText(
  wordText: string,
  languageCode: string = "en"
): Promise<WordComplete | null> {
  try {
    // Single request to get word with all nested data (definitions with examples, tags)
    const wordFullData = await railwayFetch<unknown>(
      `/v1/dictionary/words/${languageCode}/${encodeURIComponent(wordText)}?include_all=true`,
      {
        next: { tags: [`word-${languageCode}-${wordText}`, "dictionary-words"] }
      }
    );

    const wordFull = WordFullSchema.parse(wordFullData);

    // Fetch relations separately (handle 404s gracefully)
    const rawRelations = await fetchRelatedWords(wordFull.id).catch(() => []);

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
      ...wordFull,
      definitions: wordFull.definitions,
      tags: wordFull.tags,
      relations,
    };
  } catch {
    // Return null for 404s or any other errors
    return null;
  }
}
