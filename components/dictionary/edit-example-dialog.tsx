"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateExample } from "@/lib/actions/vocabulary";

interface EditExampleDialogProps {
  exampleId: number;
  wordId: number;
  initialExampleText: string;
  initialSource?: string | null;
}

export function EditExampleDialog({
  exampleId,
  wordId,
  initialExampleText,
  initialSource,
}: EditExampleDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exampleText, setExampleText] = useState(initialExampleText);
  const [source, setSource] = useState(initialSource || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await updateExample(
      exampleId,
      wordId,
      exampleText,
      source || undefined
    );

    if (result?.error) {
      console.error(result.error);
    } else {
      setOpen(false);
    }

    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Example</DialogTitle>
          <DialogDescription>
            Update the example text and source
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="example_text">Example</Label>
            <Input
              id="example_text"
              value={exampleText}
              onChange={(e) => setExampleText(e.target.value)}
              placeholder="Enter example"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source (optional)</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., Shakespeare"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
