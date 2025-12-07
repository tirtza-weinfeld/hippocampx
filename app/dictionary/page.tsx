import Link from "next/link";
import { Suspense } from "react";
// TEMPORARY: Using direct Neon DB queries instead of Hippo API
// import {
//   fetchWordsPaginated,
//   searchWords,
// } from "@/lib/api/railway-vocabulary-client";
import {
  fetchWordsPaginated,
  searchWords,
  type PaginatedResponse,
  type Word,
} from "@/lib/db/queries/dictionary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DictionarySearchWrapper } from "@/components/dictionary/dictionary-search-wrapper";
import * as motion from "motion/react-client";
import { BookOpen, Plus, AlertTriangle } from "lucide-react";

export default async function DictionaryPage(props: {
  searchParams: Promise<{ q?: string; lang?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q;
  const language = searchParams.lang || "en";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  let result: PaginatedResponse<Word>;
  try {
    result = query
      ? await searchWords({ query, languageCode: language, page, pageSize: 50 })
      : await fetchWordsPaginated({ languageCode: language, page, pageSize: 50 });
  } catch {
    return (
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-md bg-red-50 dark:bg-red-950/20 p-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-foreground font-medium text-sm mb-1">
            Failed to load dictionary
          </p>
          <p className="text-muted-foreground text-xs">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const headerContent = (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 dark:bg-sky-950/30">
          <BookOpen className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <h1 className="text-lg font-medium bg-linear-to-r from-blue-600 via-sky-500 to-blue-500 dark:from-blue-400 dark:via-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
            Dictionary
          </h1>
          <p className="text-muted-foreground text-sm">
            Browse and search vocabulary
          </p>
        </div>
      </div>
      <Link href="/dictionary/new">
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Word
        </Button>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen">
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
        />
      </Suspense>
    </div>
  );
}

function WordListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-md overflow-hidden bg-gray-50/80 dark:bg-gray-950/30 border border-border/50">
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <div className="p-3">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
