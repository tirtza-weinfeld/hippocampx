import Link from "next/link";
import { Suspense } from "react";
import {
  fetchWordsPaginated,
  searchWords,
  fetchTagStats,
  fetchSourcesWithWordCount,
  fetchSourcePartsWithWordCount,
  fetchFirstDefinitionForWords,
  type PaginatedResponse,
  type Word,
} from "@/lib/db/neon/queries/dictionary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DictionarySearchWrapper } from "@/components/dictionary/dictionary-search-wrapper";
import * as motion from "motion/react-client";
import { BookOpen, Plus, AlertTriangle, Sparkles } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export default async function DictionaryPage(props: {
  searchParams: Promise<{
    q?: string;
    lang?: string;
    page?: string;
    tag?: string | string[];
    source?: string | string[];
    part?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q;
  const language = searchParams.lang || "en";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const tagSlugs = searchParams.tag
    ? Array.isArray(searchParams.tag)
      ? searchParams.tag
      : [searchParams.tag]
    : [];

  const sourceSlugs = searchParams.source
    ? Array.isArray(searchParams.source)
      ? searchParams.source
      : [searchParams.source]
    : [];

  const sourcePartSlugs = searchParams.part
    ? Array.isArray(searchParams.part)
      ? searchParams.part
      : [searchParams.part]
    : [];

  type WordWithPreview = Word & {
    definition_text: string | null;
    example_text: string | null;
  };
  let result: PaginatedResponse<WordWithPreview>;
  let tagStats: Awaited<ReturnType<typeof fetchTagStats>> = [];
  let sourceStats: Awaited<ReturnType<typeof fetchSourcesWithWordCount>> = [];
  let sourcePartStats: Awaited<ReturnType<typeof fetchSourcePartsWithWordCount>> = [];

  try {
    const [tags, sources, sourceParts] = await Promise.all([
      fetchTagStats(),
      fetchSourcesWithWordCount(),
      fetchSourcePartsWithWordCount(),
    ]);

    tagStats = tags;
    sourceStats = sources;
    sourcePartStats = sourceParts;

    // Resolve slugs to IDs by matching against actual names
    const tagIds = tagSlugs
      .map(function findTagId(slug) {
        const match = tags.find(function matchTag(ts) {
          return slugify(ts.tag.name) === slug;
        });
        return match?.tag.id;
      })
      .filter(function isValid(id): id is number {
        return id !== undefined;
      });

    const sourceIds = sourceSlugs
      .map(function findSourceId(slug) {
        const match = sources.find(function matchSource(ss) {
          return slugify(ss.source.title) === slug;
        });
        return match?.source.id;
      })
      .filter(function isValid(id): id is number {
        return id !== undefined;
      });

    const sourcePartIds = sourcePartSlugs
      .map(function findSourcePartId(slug) {
        const match = sourceParts.find(function matchSourcePart(sp) {
          return slugify(sp.sourcePart.name) === slug;
        });
        return match?.sourcePart.id;
      })
      .filter(function isValid(id): id is number {
        return id !== undefined;
      });

    const wordsResult = query
      ? await searchWords({
          query,
          languageCode: language,
          page,
          pageSize: 50,
          tagIds: tagIds.length > 0 ? tagIds : undefined,
          sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
          sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
        })
      : await fetchWordsPaginated({
          languageCode: language,
          page,
          pageSize: 50,
          tagIds: tagIds.length > 0 ? tagIds : undefined,
          sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
          sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
        });

    const wordIds = wordsResult.data.map(function getId(w) {
      return w.id;
    });
    const definitionsMap: Map<number, { definition_text: string; example_text: string | null }> =
      await fetchFirstDefinitionForWords(wordIds);

    const wordsWithPreviews = wordsResult.data.map(function addPreview(word) {
      const preview = definitionsMap.get(word.id);
      return {
        ...word,
        definition_text: preview?.definition_text ?? null,
        example_text: preview?.example_text ?? null,
      };
    });

    result = {
      ...wordsResult,
      data: wordsWithPreviews,
    };
  } catch (error) {
    console.error("Dictionary load error:", error);
    return (
      <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
              <div className="relative rounded-2xl bg-linear-to-br from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 p-5 ring-1 ring-red-200/50 dark:ring-red-800/30">
                <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-foreground">
              Failed to load dictionary
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
              We encountered an issue while loading your vocabulary. Please try again later.
            </p>
            <Link href="/dictionary" className="mt-6">
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Try Again
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const headerContent = (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-sky-500/20 blur-lg rounded-xl" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-sky-50 to-blue-100/80 dark:from-sky-950/60 dark:to-blue-900/40 ring-1 ring-sky-200/50 dark:ring-sky-700/30 shadow-sm">
            <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight bg-linear-to-r from-sky-600 via-blue-600 to-sky-500 dark:from-sky-400 dark:via-blue-400 dark:to-sky-300 bg-clip-text text-transparent">
            Dictionary
          </h1>
          <p className="text-muted-foreground text-sm">
            Browse and search your vocabulary collection
          </p>
        </div>
      </div>
      <Link href="/dictionary/new">
        <Button
          variant="default"
          className="gap-2 bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 dark:shadow-sky-500/10 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Word
        </Button>
      </Link>
    </motion.div>
  );

  const filterTags = tagStats.map(function transformTag(ts) {
    return {
      id: ts.tag.id,
      name: ts.tag.name,
      wordCount: ts.wordCount,
    };
  });

  const filterSources = sourceStats.map(function transformSource(ss) {
    return {
      id: ss.source.id,
      title: ss.source.title,
      type: ss.source.type,
      wordCount: ss.wordCount,
    };
  });

  const filterSourceParts = sourcePartStats.map(function transformSourcePart(sp) {
    return {
      id: sp.sourcePart.id,
      name: sp.sourcePart.name,
      sourceTitle: sp.sourcePart.source_title,
      sourceType: sp.sourcePart.source_type,
      wordCount: sp.wordCount,
    };
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/10">
      <Suspense fallback={<WordListSkeleton />}>
        <DictionarySearchWrapper
          words={result.data}
          initialQuery={query}
          initialLanguage={language}
          serverQuery={query}
          headerContent={headerContent}
          pagination={{
            page: result.page,
            pageSize: result.pageSize,
            total: result.total,
            totalPages: result.totalPages,
            hasMore: result.hasMore,
          }}
          filterData={{
            tags: filterTags,
            sources: filterSources,
            sourceParts: filterSourceParts,
            selectedTagNames: filterTags
              .filter(function isSelected(tag) {
                return tagSlugs.includes(slugify(tag.name));
              })
              .map(function getName(tag) {
                return tag.name;
              }),
            selectedSourceTitles: filterSources
              .filter(function isSelected(source) {
                return sourceSlugs.includes(slugify(source.title));
              })
              .map(function getTitle(source) {
                return source.title;
              }),
            selectedSourcePartNames: filterSourceParts
              .filter(function isSelected(part) {
                return sourcePartSlugs.includes(slugify(part.name));
              })
              .map(function getName(part) {
                return part.name;
              }),
          }}
        />
      </Suspense>
    </div>
  );
}

function WordListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <Skeleton className="h-10 w-full mb-6" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map(function renderSkeleton(_, i) {
          return (
            <div
              key={i}
              className="rounded-xl overflow-hidden bg-card/50 border border-border/40 backdrop-blur-xs"
            >
              <div className="h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
              <div className="p-4 flex items-start gap-4">
                <Skeleton className="h-5 w-28 shrink-0" />
                <Skeleton className="h-5 flex-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
