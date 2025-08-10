"use client"

import { useEffect, useMemo, useState } from "react"
import { Save, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFormStatus } from "react-dom"

type WordItem = {
  id: string | number
  word: string
  definition: string
}

type ActionResult = { ok: boolean; message?: string }

type WordsTableProps = {
  words: WordItem[]
  updateAction: (formData: FormData) => Promise<ActionResult>
  deleteAction: (formData: FormData) => Promise<ActionResult>
}

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="icon" className="h-8 w-8" disabled={pending}>
      <Save className="size-4" />
      <span className="sr-only">Save</span>
    </Button>
  )
}

export default function WordsTable({ words, updateAction, deleteAction }: WordsTableProps) {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<ActionResult | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return words
    return words.filter((w) =>
      w.word.toLowerCase().includes(q) || w.definition.toLowerCase().includes(q)
    )
  }, [words, query])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words..."
            className="pl-8"
            aria-label="Search words"
          />
        </div>
        <div className="text-sm text-muted-foreground ml-auto">
          {filtered.length} item{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Word</TableHead>
            <TableHead>Definition</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((item) => (
            <TableRow key={`${item.id}-${item.word}`}>
              <TableCell colSpan={3}>
                <form action={async (fd) => setResult(await updateAction(fd))} className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr_auto_auto] sm:items-center">
                  <input type="hidden" name="id" value={String(item.id)} />
                  <input type="hidden" name="originalWord" value={item.word} />
                  <Input name="word" defaultValue={item.word} aria-label={`Word ${item.word}`} />
                  <Input name="definition" defaultValue={item.definition} aria-label={`Definition for ${item.word}`} />
                  <div className="flex justify-end gap-2">
                    <SaveButton />
                    <Button
                      formAction={async (fd) => {
                        // Ensure the server receives a word even if hidden input is dropped by the browser
                        if (!fd.get('id')) fd.set('id', String(item.id))
                        if (!fd.get('originalWord')) fd.set('originalWord', item.word)
                        setResult(await deleteAction(fd))
                      }}
                      type="submit"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* toast feedback */}
      <ResultToaster result={result} onClear={() => setResult(null)} />
    </div>
  )
}

function ResultToaster({ result, onClear }: { result: ActionResult | null; onClear: () => void }) {
  useEffect(() => {
    if (!result) return
    const { toast } = require('sonner') as typeof import('sonner')
    if (result.ok) toast.success(result.message ?? 'Saved')
    else toast.error(result.message ?? 'Something went wrong')
    onClear()
  }, [result, onClear])
  return null
}


