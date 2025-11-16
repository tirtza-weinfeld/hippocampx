import Link from "next/link";
import { redirect } from "next/navigation";
import { createWord, createDefinition } from "@/lib/actions/vocabulary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewWordPage() {
  async function handleCreateWord(formData: FormData) {
    "use server";

    const result = await createWord(formData);

    if (result.error) {
      // In production, handle error with toast or error state
      console.error(result.error);
      return;
    }

    if (result.wordId) {
      // Check if definition was provided
      const definitionText = formData.get("definition_text") as string;
      if (definitionText && definitionText.trim().length > 0) {
        const defFormData = new FormData();
        defFormData.set("word_id", result.wordId.toString());
        defFormData.set("definition_text", definitionText);
        defFormData.set(
          "part_of_speech",
          formData.get("part_of_speech") as string
        );
        defFormData.set("order", "0");

        await createDefinition(defFormData);
      }

      redirect(`/dictionary/${result.wordId}`);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Add New Word
            </h1>
            <p className="text-muted-foreground mt-2">
              Create a new vocabulary entry
            </p>
          </div>
          <Link href="/dictionary">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Word Details</CardTitle>
            <CardDescription>
              Enter the word and optionally add a definition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleCreateWord} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="word_text">Word *</Label>
                <Input
                  id="word_text"
                  name="word_text"
                  placeholder="e.g., ephemeral"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language_code">Language</Label>
                <Select name="language_code" defaultValue="en">
                  <SelectTrigger id="language_code">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-4">
                  First Definition (Optional)
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="part_of_speech">Part of Speech</Label>
                    <Select name="part_of_speech" defaultValue="noun">
                      <SelectTrigger id="part_of_speech">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="noun">Noun</SelectItem>
                        <SelectItem value="verb">Verb</SelectItem>
                        <SelectItem value="adjective">Adjective</SelectItem>
                        <SelectItem value="adverb">Adverb</SelectItem>
                        <SelectItem value="pronoun">Pronoun</SelectItem>
                        <SelectItem value="preposition">Preposition</SelectItem>
                        <SelectItem value="conjunction">Conjunction</SelectItem>
                        <SelectItem value="interjection">
                          Interjection
                        </SelectItem>
                        <SelectItem value="determiner">Determiner</SelectItem>
                        <SelectItem value="auxiliary">Auxiliary</SelectItem>
                        <SelectItem value="phrase">Phrase</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="definition_text">Definition</Label>
                    <Textarea
                      id="definition_text"
                      name="definition_text"
                      placeholder="Enter the definition..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Link href="/dictionary">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit">Create Word</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
