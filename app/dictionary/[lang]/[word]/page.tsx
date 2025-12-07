import Link from "next/link";
import { notFound } from "next/navigation";
// TEMPORARY: Using direct Neon DB queries instead of Hippo API
// import { fetchWordCompleteByText } from "@/lib/api/railway-vocabulary-client";
import { fetchWordCompleteByText } from "@/lib/db/queries/dictionary";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WordDetailClient } from "./word-detail-client";

export default async function WordDetailPage(props: {
  params: Promise<{ lang: string; word: string }>;
}) {
  const params = await props.params;
  const { lang, word: wordText } = params;

  const decodedWord = decodeURIComponent(wordText);

  const word = await fetchWordCompleteByText(decodedWord, lang);

  if (!word) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/dictionary">
          <Button variant="outline">Back to Dictionary</Button>
        </Link>
      </div>

      <Separator className="mb-6" />

      <WordDetailClient word={word} />
    </div>
  );
}
