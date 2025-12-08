"use client";

import { useState, useActionState } from "react";
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
  initialSourcePartId?: number | null;
}

export function EditExampleDialog({
  exampleId,
  wordId,
  initialExampleText,
  initialSourcePartId,
}: EditExampleDialogProps) {
  const [open, setOpen] = useState(false);
  const [exampleText, setExampleText] = useState(initialExampleText);
  const [sourcePartId, setSourcePartId] = useState<string>(
    initialSourcePartId?.toString() ?? ""
  );

  const [state, formAction, isPending] = useActionState(
    async () => {
      const parsedSourcePartId = sourcePartId ? parseInt(sourcePartId, 10) : undefined;
      const result = await updateExample(
        exampleId,
        wordId,
        exampleText,
        Number.isNaN(parsedSourcePartId) ? undefined : parsedSourcePartId
      );

      if (result.error) {
        return { error: result.error };
      }
      setOpen(false);
      return null;
    },
    null
  );

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
        <form action={formAction} className="space-y-4">
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
            <Label htmlFor="source_part_id">Source Part ID (optional)</Label>
            <Input
              id="source_part_id"
              type="number"
              value={sourcePartId}
              onChange={function handleSourcePartIdChange(e) {
                setSourcePartId(e.target.value);
              }}
              placeholder="Enter source part ID"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
