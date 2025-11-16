import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchWordComplete,
} from "@/lib/api/railway-vocabulary-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddDefinitionForm } from "@/components/dictionary/add-definition-form";
import { AddExampleForm } from "@/components/dictionary/add-example-form";
import { DeleteWordButton } from "@/components/dictionary/delete-word-button";

export default async function WordDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const wordId = parseInt(params.id);

  if (isNaN(wordId)) {
    notFound();
  }

  const word = await fetchWordComplete(wordId);

  if (!word) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold tracking-tight">
                {word.word_text}
              </h1>
              <Badge variant="secondary" className="uppercase">
                {word.language_code}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {word.created_at
                ? `Added ${new Date(word.created_at).toLocaleDateString()}`
                : "Recently added"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dictionary">
              <Button variant="outline">Back to Dictionary</Button>
            </Link>
            <DeleteWordButton wordId={word.id} />
          </div>
        </div>

        {/* Tags */}
        {word.tags && word.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {word.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <Separator />

        {/* Definitions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Definitions</h2>
          </div>

          {word.definitions && word.definitions.length > 0 ? (
            <div className="space-y-6">
              {word.definitions.map((def, index) => (
                <Card key={def.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}.
                          </span>
                          <Badge variant="secondary">{def.part_of_speech}</Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {def.definition_text}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Examples */}
                  {def.examples && def.examples.length > 0 && (
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Examples:</h4>
                        <ul className="space-y-2">
                          {def.examples.map((example) => (
                            <li
                              key={example.id}
                              className="border-l-2 pl-4 py-2 border-muted"
                            >
                              <p className="text-sm italic">
                                &quot;{example.example_text}&quot;
                              </p>
                              {example.source && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  — {example.source}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4">
                        <AddExampleForm
                          definitionId={def.id}
                          wordId={word.id}
                        />
                      </div>
                    </CardContent>
                  )}

                  {(!def.examples || def.examples.length === 0) && (
                    <CardContent>
                      <AddExampleForm definitionId={def.id} wordId={word.id} />
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No definitions yet
              </CardContent>
            </Card>
          )}

          <AddDefinitionForm wordId={word.id} />
        </div>

        {/* Related Words */}
        {word.relations && word.relations.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Related Words</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {word.relations.map((relation) => (
                  <Card key={`${relation.word_id_2}-${relation.relation_type}`}>
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-center">
                        <Link href={`/dictionary/${relation.related_word_id}`}>
                          <CardTitle className="text-base hover:underline cursor-pointer">
                            {relation.related_word_text}
                          </CardTitle>
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {relation.relation_type}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
