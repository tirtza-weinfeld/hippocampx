import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewWordForm } from "@/components/dictionary/new-word-form";

export default function NewWordPage() {
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
              Enter the word and optionally add a definition with examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewWordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
