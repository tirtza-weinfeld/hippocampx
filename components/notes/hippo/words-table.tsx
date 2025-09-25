"use client"

import { useMemo, useState } from "react"
import { Save, Trash2, Search, ExternalLink, X } from "lucide-react"
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
  const [, setResult] = useState<ActionResult | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedWord, setSelectedWord] = useState("")

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
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((item) => (
            <TableRow key={`${item.id}-${item.word}`}>
              <TableCell colSpan={3}>
                <form action={async (fd) => setResult(await updateAction(fd))} className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr_auto_auto_auto] sm:items-center">
                  <input type="hidden" name="id" value={String(item.id)} />
                  <input type="hidden" name="originalWord" value={item.word} />
                  <Input name="word" defaultValue={item.word} aria-label={`Word ${item.word}`} />
                  <Input name="definition" defaultValue={item.definition} aria-label={`Definition for ${item.word}`} />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedWord(item.word)
                        setShowPopup(true)
                      }}
                      title={`Search Google for definition of "${item.word}"`}
                    >
                      <ExternalLink className="size-4" />
                      <span className="sr-only">Google definition</span>
                    </Button>
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
    
      {/* Google Definition Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowPopup(false)} />
          <div className="relative bg-background w-full h-full max-w-4xl max-h-[95vh] rounded-lg shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b bg-background">
              <h3 className="text-lg font-semibold truncate">Google Definition: &quot;{selectedWord}&quot;</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPopup(false)}
                className="h-8 w-8 flex-shrink-0"
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex-1 relative bg-white">
              <iframe
                src={`https://www.google.com/search?q=${encodeURIComponent(`define ${selectedWord}`)}&igu=1`}
                className="absolute inset-0 w-full h-full border-0"
                title={`Google definition search for ${selectedWord}`}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




