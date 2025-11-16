import Link from "next/link";
import { Suspense } from "react";
import { fetchWords, searchWordsByPrefix } from "@/lib/api/railway-vocabulary-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/dictionary/search-bar";

export default async function DictionaryPage(props: {
  searchParams: Promise<{ q?: string; lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q;
  const language = searchParams.lang || "en";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dictionary</h1>
            <p className="text-muted-foreground mt-2">
              Browse and search vocabulary words
            </p>
          </div>
          <Link href="/dictionary/new">
            <Button>Add New Word</Button>
          </Link>
        </div>

        <SearchBar initialQuery={query} initialLanguage={language} />

        <Suspense
          key={query || "all"}
          fallback={<WordListSkeleton />}
        >
          <WordList query={query} language={language} />
        </Suspense>
      </div>
    </div>
  );
}

async function WordList({
  query,
  language,
}: {
  query?: string;
  language: string;
}) {
  const words = query
    ? await searchWordsByPrefix(query, language, 50)
    : await fetchWords(language, 50, 0);

  if (words.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-center">
            {query
              ? `No words found matching "${query}"`
              : "No words in dictionary yet"}
          </p>
          {!query && (
            <Link href="/dictionary/new" className="mt-4">
              <Button>Add Your First Word</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {words.map((word) => (
        <Link key={word.id} href={`/dictionary/${word.id}`}>
          <Card className="transition-colors hover:bg-accent cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-xl">{word.word_text}</CardTitle>
              <CardDescription className="text-xs uppercase tracking-wide">
                {word.language_code}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {word.created_at
                  ? `Added ${new Date(word.created_at).toLocaleDateString()}`
                  : "Recently added"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function WordListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
